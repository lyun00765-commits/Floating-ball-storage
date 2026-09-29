/**
 * 接管层：把第三方悬浮球迁入面板容器，并保持其原有行为
 *
 * 迁入一个元素要做四件事：
 *   1. 样式保护（protectStyle）——劫持该元素的 style 写入，防止原脚本改回 fixed 定位
 *   2. 事件守卫（bindInteractionGuards）——阻断拖动/长按等交互，代之以点击唤醒
 *   3. 弹层托管（watchPopups）——原脚本弹出的浮层移出容器，避免被裁切
 *   4. 定位与缩放（moveBallToContainer / insertBallBefore）
 * 归还时（restoreBall）逐项还原到迁入前的状态。
 *
 * 对 store 的依赖通过 setCapturedBallClickHandler 注入，避免反向依赖。
 */

import { composeTransform } from '../core/dom.js'
import { appendBall, compactAfterRemove, getContainer } from '../panel/pagination.js'

/** 点击已收纳的球时的回调（装配层注入） */
let onClickCapturedBall = () => {}

export function setCapturedBallClickHandler(fn) {
  onClickCapturedBall = typeof fn === 'function' ? fn : () => {}
}

const PROTECTED_STYLE_PROPS = new Set([
    "position",
    "top",
    "left",
    "right",
    "bottom",
    "zIndex",
    "z-index",
    "transform",
    "margin",
    "marginTop",
    "marginLeft",
    "marginRight",
    "marginBottom",
    "margin-top",
    "margin-left",
    "margin-right",
    "margin-bottom",
  ]),
  pendingDraggableRestore = new Map(),
  ballClickHandlers = new WeakMap(),
  dragStartHandlers = new WeakMap(),
  mouseMoveGuards = new WeakMap(),
  touchMoveGuards = new WeakMap(),
  styleProtections = new WeakMap(),
  popupRegistries = new Map()
function disableDraggable(e, t) {
  try {
    const n = window.parent.$
    if (!n) return void console.warn("[集成控件] 父窗口没有 jQuery")
    const a = n(e)
    if (a.hasClass("ui-draggable")) {
      t && pendingDraggableRestore.set(t, !0)
      try {
        a.draggable("disable")
      } catch {
        /* 宿主 jQuery UI 缺失或该元素未初始化拖拽 */
      }
    }
    a.find(".ui-draggable").each(function () {
      try {
        n(this).draggable("disable")
      } catch {
        /* 同上：逐个跳过 */
      }
    })
  } catch {
    /* 拖拽禁用整体失败（宿主未加载 jQuery UI），不影响收纳本身 */
  }
}
function protectStyle(e) {
  const t = styleProtections.get(e)
  if (t?.isProtected) return
  const n = new Map(),
    a = e.style
  PROTECTED_STYLE_PROPS.forEach((e) => {
    const t = a.getPropertyValue(e) || a[e]
    t && n.set(e, t)
  })
  const o = a.setProperty.bind(a),
    r = a.removeProperty.bind(a)
  let i = !1
  ;((a.setProperty = function (e, t, n) {
    const a = e.replace(/([A-Z])/g, "-$1").toLowerCase()
    if ((!PROTECTED_STYLE_PROPS.has(e) && !PROTECTED_STYLE_PROPS.has(a)) || i) return o(e, t, n || "")
  }),
    (a.removeProperty = function (e) {
      const t = e.replace(/([A-Z])/g, "-$1").toLowerCase()
      return (!PROTECTED_STYLE_PROPS.has(e) && !PROTECTED_STYLE_PROPS.has(t)) || i ? r(e) : ""
    }),
    PROTECTED_STYLE_PROPS.forEach((e) => {
      const t = a[e]
      try {
        Object.defineProperty(a, e, {
          get: () => n.get(e) || t || "",
          set(t) {
            i && (n.set(e, t), o(e, t, "important"))
          },
          configurable: !0,
          enumerable: !0,
        })
      } catch {
        /* 个别属性不可重定义，跳过该属性 */
      }
    }))
  const l = {
    originalStyleDescriptor: Object.getOwnPropertyDescriptor(HTMLElement.prototype, "style"),
    isProtected: !0,
    protectedProperties: PROTECTED_STYLE_PROPS,
    cachedValues: n,
    allowModification: () => {
      i = !0
    },
    disallowModification: () => {
      i = !1
    },
  }
  ;((l.originalSetProperty = o), styleProtections.set(e, l))
}
function forceSetStyle(e, t, n, a) {
  const o = styleProtections.get(e)
  if (o?.isProtected) {
    const r = o
    ;(r.allowModification && r.allowModification(),
      r.originalSetProperty ? r.originalSetProperty(t, n, a || "") : e.style.setProperty(t, n, a || ""),
      o.cachedValues.set(t, n),
      r.disallowModification && r.disallowModification())
  } else e.style.setProperty(t, n, a || "")
}
function applyForcedStyles(e, t) {
  for (const [n, a] of Object.entries(t)) Array.isArray(a) ? forceSetStyle(e, n, a[0], a[1]) : forceSetStyle(e, n, a)
}
function watchPopups(e) {
  if (popupRegistries.has(e)) return
  const t = []
  popupRegistries.set(e, t)
  const restoreEntry = (entry) => {
    const idx = t.indexOf(entry)
    if (idx > -1) t.splice(idx, 1)
    entry._popupObserver && (entry._popupObserver.disconnect(), (entry._popupObserver = null))
    const r = entry.popup
    entry._stop &&
      (r.removeEventListener("click", entry._stop), r.removeEventListener("touchend", entry._stop))
    r.style.cssText = entry.style
    entry.parent &&
      entry.parent.isConnected &&
      (entry.nextSibling && entry.nextSibling.isConnected && entry.nextSibling.parentElement === entry.parent
        ? entry.parent.insertBefore(r, entry.nextSibling)
        : entry.parent.appendChild(r))
  }
  const n = new MutationObserver((a) => {
    for (const o of a) {
      if (o.type === "attributes" && (o.attributeName === "style" || o.attributeName === "class")) {
        const r = o.target
        if (r === e) continue
        const i = window.parent.getComputedStyle(r)
        const l = i.display !== "none" && i.visibility !== "hidden"
        const s = i.position === "absolute" || i.position === "fixed"
        if (l && s && !t.some((p) => p.popup === r)) {
          const c = r.parentElement,
            p = r.nextSibling,
            d = r.style.cssText,
            u = (ev) => { ev.stopPropagation() }
          r.addEventListener("click", u)
          r.addEventListener("touchend", u)
          const entry = { popup: r, parent: c, nextSibling: p, style: d, _stop: u, _popupObserver: null }
          t.push(entry)
          window.parent.document.body.appendChild(r)
          const C = r.getBoundingClientRect(),
            g = e.getBoundingClientRect()
          let f = g.top - C.height - 6,
            b = g.left
          const v = window.parent.innerWidth,
            h = window.parent.innerHeight
          if (b + C.width > v - 8) b = v - C.width - 8
          if (b < 8) b = 8
          if (f < 8) f = Math.min(g.bottom + 6, h - C.height - 8)
          ;(r.style.position = "fixed"),
            (r.style.top = f + "px"),
            (r.style.left = b + "px"),
            (r.style.zIndex = "10001"),
            (r.style.margin = "0")
          // r 移出 e 的子树后，上面这个观察 e 的 MutationObserver 再也收不到 r 自身的属性变化通知，
          // 单独给它挂一个自身观察者，保证它自己变 display:none/visibility:hidden 时也能正确归位，
          // 不然会一直卡在 body 下（隐藏但脱离原位置）直到球被释放。
          const po = new MutationObserver(() => {
            const ii = window.parent.getComputedStyle(r)
            const ll = ii.display !== "none" && ii.visibility !== "hidden"
            if (!ll) restoreEntry(entry)
          })
          po.observe(r, { attributes: !0, attributeFilter: ["style", "class"] })
          entry._popupObserver = po
        } else if (!l && s) {
          const entry = t.find((p) => p.popup === r)
          entry && restoreEntry(entry)
        }
      }
    }
  })
  n.observe(e, { attributes: !0, subtree: !0, attributeFilter: ["style", "class"] }),
    (t._observer = n)
}
function unwatchPopups(e) {
  const t = popupRegistries.get(e)
  if (!t) return
  t._observer && (t._observer.disconnect(), (t._observer = null))
  for (const n of t)
    n.popup &&
      n.style !== void 0 &&
      (n._popupObserver && (n._popupObserver.disconnect(), (n._popupObserver = null)),
      n._stop &&
        (n.popup.removeEventListener("click", n._stop),
        n.popup.removeEventListener("touchend", n._stop)),
      (n.popup.style.cssText = n.style),
      n.parent &&
        n.parent.isConnected &&
        (n.nextSibling && n.nextSibling.isConnected && n.nextSibling.parentElement === n.parent
          ? n.parent.insertBefore(n.popup, n.nextSibling)
          : n.parent.appendChild(n.popup)))
  popupRegistries.delete(e)
}
function bindInteractionGuards(e, t) {
  unbindInteractionGuards(e)
  watchPopups(e)
  const n = (e) => {
      e.stopPropagation()
    },
    a = (e) => {
      e.stopPropagation()
    },
    o = (e) => {
      e.preventDefault()
    },
    r =
      "qrv21-trigger-v21" === e.id
        ? "inline-native"
        : "ai-floating-panel-launcher" === e.id ||
            "auto_illustrator_conso_floating_panel_root" === e.id ||
            e.classList.contains("ai-floating-panel-root")
          ? "root-open"
          : "default"
  ;(e.addEventListener("mousemove", n, !0),
    e.addEventListener("touchmove", a, !0),
    e.addEventListener("dragstart", o, !0),
    mouseMoveGuards.set(e, n),
    touchMoveGuards.set(e, a),
    dragStartHandlers.set(e, o))
  if (t && "root-open" === r) {
    const n = (a) => {
      if (a.defaultPrevented || 0 !== a.button) return
      ;(a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation(), onClickCapturedBall(t, r))
    }
    ;(e.addEventListener("click", n, !0), ballClickHandlers.set(e, n))
  }
}
function unbindInteractionGuards(e) {
  unwatchPopups(e)
  const n = mouseMoveGuards.get(e)
  n && (e.removeEventListener("mousemove", n, !0), mouseMoveGuards.delete(e))
  const a = touchMoveGuards.get(e)
  a && (e.removeEventListener("touchmove", a, !0), touchMoveGuards.delete(e))
  const o = dragStartHandlers.get(e)
  o && (e.removeEventListener("dragstart", o, !0), dragStartHandlers.delete(e))
  const r = ballClickHandlers.get(e)
  r && (e.removeEventListener("click", r, !0), ballClickHandlers.delete(e))
}
/**
 * 释放元素上的全部接管资源（交互守卫 + 弹层托管观察）。
 *
 * 用于「球元素被同指纹新元素替换」的路径（store.updateCapturedBallElement）：
 * 旧元素不走 restoreBall 的还原流程，但它在 popupRegistries（强引用 Map）里的
 * 条目、以及挂在其子树上的 MutationObserver 不会自己消失——不释放就会随每次
 * 元素替换永久泄漏一份。样式保护记录在 WeakMap 里，随元素被 GC 自动消亡，无需解除。
 */
export function releaseElementResources(e) {
  unbindInteractionGuards(e);
}
export function moveBallToContainer(e) {
  if (!getContainer()) return (console.warn("[集成控件] 悬浮球容器未设置，无法移动悬浮球"), void hideBall(e.element))
  const t = e.element
  let n = t.offsetWidth,
    a = t.offsetHeight
  if (0 === n || 0 === a) {
    const e = t.getBoundingClientRect()
    ;((n = e.width), (a = e.height))
  }
  ;(0 === n && (n = 50), 0 === a && (a = 50))
  const o = Math.min(34 / n, 34 / a),
    r = (n * (1 - o)) / 2,
    tr = composeTransform(window.parent.getComputedStyle(t).transform, o)
  ;(disableDraggable(t, e.id),
    t.setAttribute("data-edge-ball-id", e.id),
    appendBall(t),
    protectStyle(t),
    applyForcedStyles(t, {
      position: ["relative", "important"],
      top: ["auto", "important"],
      left: ["auto", "important"],
      right: ["auto", "important"],
      bottom: ["auto", "important"],
      "z-index": ["auto", "important"],
      opacity: ["1", "important"],
      visibility: ["visible", "important"],
      "pointer-events": ["auto", "important"],
      transform: [tr, "important"],
      "transform-origin": ["center center", "important"],
      margin: [`-${Math.max(0, r - 2)}px`, "important"],
      "flex-shrink": ["0", "important"],
    }),
    bindInteractionGuards(t, e.id))
}
export function restoreBall(e) {
  const t = e.element
  ;(!(function (e) {
    const t = styleProtections.get(e)
    if (t && t.isProtected)
      try {
        const n = t,
          a = e.style
        n.allowModification && n.allowModification()
        const o = CSSStyleDeclaration.prototype.setProperty,
          r = CSSStyleDeclaration.prototype.removeProperty
        ;((a.setProperty = o),
          (a.removeProperty = r),
          PROTECTED_STYLE_PROPS.forEach((e) => {
            try {
              delete a[e]
            } catch {
              /* 属性不可删（如只读成员），跳过 */
            }
          }),
          (t.isProtected = !1),
          styleProtections.delete(e))
      } catch {
        /* 复原样式失败：元素可能已移除，忽略 */
      }
  })(t),
    unbindInteractionGuards(t),
    t.removeAttribute("data-edge-ball-id"),
    compactAfterRemove(t),
    (t.style.cssText = e.originalStyle),
    (t.style.position = e.originalPosition?.positionValue || "fixed"),
    !e.originalStyle &&
      (e.originalPosition.top && "auto" !== e.originalPosition.top && (t.style.top = e.originalPosition.top),
      e.originalPosition.left && "auto" !== e.originalPosition.left && (t.style.left = e.originalPosition.left),
      e.originalPosition.right && "auto" !== e.originalPosition.right && (t.style.right = e.originalPosition.right),
      e.originalPosition.bottom && "auto" !== e.originalPosition.bottom && (t.style.bottom = e.originalPosition.bottom)),
    (t.style.opacity = e.originalPosition?.opacityValue || "1"),
    (t.style.visibility = e.originalPosition?.visibilityValue || "visible"),
    (t.style.pointerEvents = e.originalPosition?.pointerEventsValue || "auto"))
  const n = e.originalParent && e.originalParent.isConnected,
    a = e.originalNextSibling && e.originalNextSibling.isConnected
  ;(n
    ? a && e.originalNextSibling.parentNode === e.originalParent
      ? e.originalParent.insertBefore(t, e.originalNextSibling)
      : e.originalParent.appendChild(t)
    : window.parent.document.body.appendChild(t),
    (function (e, t) {
      try {
        const n = window.parent.$
        if (!n) return void console.warn("[集成控件] 父窗口没有 jQuery")
        const a = n(e),
          o = !!t && pendingDraggableRestore.get(t),
          r = a.hasClass("ui-draggable")
        if (o || r) {
          try {
            a.draggable("enable")
          } catch {
            /* 宿主 jQuery UI 缺失 */
          }
          t && pendingDraggableRestore.delete(t)
        }
        a.find(".ui-draggable").each(function () {
          try {
            n(this).draggable("enable")
          } catch {
            /* 同上：逐个跳过 */
          }
        })
      } catch {
        /* 恢复拖拽整体失败，不影响球已回到页面 */
      }
    })(t, e.id))
}
export function insertBallBefore(e, t) {
  if (!getContainer()) return (console.warn("[集成控件] 悬浮球容器未设置，无法移动悬浮球"), void hideBall(e.element))
  const n = e.element
  let a = n.offsetWidth,
    o = n.offsetHeight
  if (0 === a || 0 === o) {
    const e = n.getBoundingClientRect()
    ;((a = e.width), (o = e.height))
  }
  ;(0 === a && (a = 50), 0 === o && (o = 50))
  const r = Math.min(34 / a, 34 / o),
    i = (a * (1 - r)) / 2,
    tr = composeTransform(window.parent.getComputedStyle(n).transform, r)
  ;(appendBall(n, t),
    n.setAttribute("data-edge-ball-id", e.id),
    protectStyle(n),
    applyForcedStyles(n, {
      position: ["relative", "important"],
      top: ["auto", "important"],
      left: ["auto", "important"],
      right: ["auto", "important"],
      bottom: ["auto", "important"],
      "z-index": ["auto", "important"],
      opacity: ["1", "important"],
      visibility: ["visible", "important"],
      "pointer-events": ["auto", "important"],
      transform: [tr, "important"],
      "transform-origin": ["center center", "important"],
      margin: [`-${Math.max(0, i - 2)}px`, "important"],
      "flex-shrink": ["0", "important"],
    }),
    disableDraggable(n, e.id),
    bindInteractionGuards(n, e.id))
}
export function hideBall(e) {
  ;(e.style.setProperty("opacity", "0", "important"),
    e.style.setProperty("pointer-events", "none", "important"),
    e.style.setProperty("transform", "translateX(-9999px)", "important"))
}
