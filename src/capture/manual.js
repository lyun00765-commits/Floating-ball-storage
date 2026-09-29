/**
 * 手动捕获（点选悬浮球）
 *
 * 点「捕获」按钮后进入点选模式：铺一层透明遮罩并接管点击/触摸/键盘事件，
 * 用户点到的元素经 isManualCaptureCandidate 判定后交给 captureFn 收纳。
 * ESC 或右键取消。
 *
 * 注意：这里的判定规则与自动扫描的 isFloatingBallCandidate 是两套独立实现，
 * 阈值与打分口径并不一致（待合并，见 docs/01 基线评估 A1）。
 */

import { collectIframeDocs, elementsFromPointAcrossFrames } from '../core/dom.js'
import { extractFingerprint } from '../core/fingerprint.js'
import { getElementName } from '../core/element-info.js'
import { removeReleased } from '../persist/released.js'
import { notify } from '../core/platform.js'
import { runtimeOwner } from '../runtime-identity.js'
import {
  getNameTokens,
  isPopupLikeName,
  CLOSE_BUTTON_PATTERN,
  CLOSE_TEXT_PATTERN,
} from './name-exclusions.js'

function isManualCaptureCandidate(e, t) {
  if ("BODY" === e.tagName || "HTML" === e.tagName) return !1
  const n = e.getBoundingClientRect(),
    a = n.width,
    o = n.height
  if (a < 16 || a > 160 || o < 16 || o > 160) return !1
  const r = a / o
  if (r < 0.35 || r > 2.8) return !1
  const i = getNameTokens(e)
  if (CLOSE_BUTTON_PATTERN.test(i)) return !1
  if (isPopupLikeName(i) && a <= 160 && o <= 160) return !1
  if (CLOSE_TEXT_PATTERN.test(i) && a <= 40 && o <= 40) return !1
  for (let n = e.parentElement; n && n !== window.parent.document.body; n = n.parentElement) {
    let r = null
    try {
      r = window.parent.getComputedStyle(n)
    } catch {
      /* 祖先节点可能已脱离文档，跳过它继续向上 */
    }
    if (!r) continue
    if ("fixed" !== r.position && "absolute" !== r.position) continue
    const i = n.getBoundingClientRect()
    if (i.width > a * 1.8 && i.height > o * 1.8 && (i.width > 120 || i.height > 80)) return !1
  }
  const l = "pointer" === t.cursor || "move" === t.cursor || "grab" === t.cursor,
    s = null !== e.querySelector("i, svg, img"),
    A =
      String(e.className || "").includes("ball") ||
      String(e.className || "").includes("floating") ||
      String(e.className || "").includes("button") ||
      String(e.className || "").includes("fab") ||
      String(e.className || "").includes("float"),
    c = e.classList.contains("ui-draggable"),
    txt = (e.textContent || "").trim().length
  if (txt > 4 && !s && !A && !c) return !1
  return !!(l || s || A || c)
}
let overlayEl = null,
  isPicking = !1,
  boundDocs = [],
  onClickHandler = null,
  onTouchStartHandler = null,
  onTouchEndHandler = null,
  onKeyDownHandler = null,
  onContextMenuHandler = null
function captureAtPoint(e, t, n, a, o) {
  const r = elementsFromPointAcrossFrames(e, t).filter((e) => "capture-mode-overlay" !== e.id)
  if (r.length > 0) {
    const e = (function (hitStack, ownScriptId) {
      const candidates = [],
        visited = new Set()
      for (const startEl of hitStack) {
        let node = startEl
        for (; node; ) {
          if (visited.has(node)) {
            node = node.parentElement
            continue
          }
          visited.add(node)
          if (
            (node.getAttribute("script_id") || node.closest("[script_id]")?.getAttribute("script_id")) === ownScriptId ||
            "capture-mode-overlay" === node.id
          ) {
            node = node.parentElement
            continue
          }
          const style = (node.ownerDocument?.defaultView || window.parent).getComputedStyle(node),
            pos = style.position
          if (isManualCaptureCandidate(node, style)) {
            const rect = node.getBoundingClientRect(),
              area = rect.width * rect.height,
              cls = String(node.className || "").toLowerCase(),
              txtLen = (node.textContent || "").trim().length,
              cur = style.cursor,
              br = style.borderRadius
            let sc = 0
            ;(("fixed" === pos || "absolute" === pos ? (sc += 20) : "relative" === pos && (sc += 10)),
              (cls.includes("ball") || cls.includes("circle")) && (sc += 45),
              cls.includes("floating") && (sc += 30),
              cls.includes("fab") && (sc += 30),
              cls.includes("float") && (sc += 15),
              node.classList.contains("ui-draggable") && (sc += 35),
              ("pointer" === cur || "move" === cur || "grab" === cur) && (sc += 15),
              (null !== node.querySelector("i, svg, img") || (node.childElementCount <= 2 && txtLen <= 2)) && (sc += 15),
              (br.includes("50%") || /50%/.test(br)) && (sc += 12),
              area >= 400 && area <= 6400 && (sc += 8),
              txtLen > 6 && (sc -= 30))
            // 与多个"同名兄弟"并列的元素，通常是菜单/列表里的功能项而不是独立的悬浮球
            // （悬浮球一般是独立存在的），这里降权而非直接淘汰，避免误伤真正的多球场景
            const parentEl = node.parentElement
            if (parentEl && cls) {
              let sameClassSiblingCount = 0
              for (const sib of parentEl.children)
                if (sib !== node && String(sib.className || "").toLowerCase() === cls) sameClassSiblingCount++
              if (sameClassSiblingCount >= 2) sc -= 25
            }
            candidates.push({ element: node, area, score: sc })
          }
          node = node.parentElement
        }
      }
      if (0 === candidates.length) return null
      // 点击位置命中的元素往往是"外层容器(悬浮球) > 内层图标/文字"这种包含关系的一条链。
      // 之前的做法是对"包含了其他候选"的容器做重罚，导致内层小图标反而抢走外层球本体。
      // 这里改为：若某候选被其它候选包含，则不作为最终结果的备选——只在"未被任何候选包含"
      // 的最外层元素里挑分数最高的，这样点击图标时拿到的是图标所在的整个悬浮球容器。
      const outermost = candidates.filter(
        (cand) => !candidates.some((other) => other !== cand && other.element.contains(cand.element)),
      )
      const pool = outermost.length > 0 ? outermost : candidates
      pool.sort((a, b) => (b.score !== a.score ? b.score - a.score : b.area - a.area))
      return pool[0].element
    })(r, n)
    e && a(e)
      ? (removeReleased(extractFingerprint(e)), notify.success(`已捕获: ${getElementName(e)}`))
      : notify.warning(e ? "该元素无法捕获（未识别为悬浮球）" : "请点击一个悬浮元素")
  }
  o()
}
export function beginCapturePick(e, t, n) {
  if (isPicking) return
  ;((isPicking = !0),
    (function (e) {
      if (overlayEl) return
      const t = window.parent.document
      ;((overlayEl = t.createElement("div")),
        (overlayEl.id = "capture-mode-overlay"),
        overlayEl.setAttribute("script_id", e),
        // 标记为「本运行时创建的节点」：这是所有权信号，运行时清理时会一并移除，
        // 同时让宿主动作观察者知道「它消失」不等于「脚本被删除」。
        overlayEl.setAttribute("data-edge-panel-owner", runtimeOwner),
        (overlayEl.style.cssText =
          "\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background: rgba(0, 0, 0, 0.3);\n    z-index: 2147483646;\n    cursor: crosshair;\n    pointer-events: none;\n  "))
      const n = t.createElement("div")
      ;((n.style.cssText =
        "\n    position: fixed;\n    top: 20px;\n    left: 50%;\n    transform: translateX(-50%);\n    background: rgba(0, 0, 0, 0.8);\n    color: white;\n    padding: 12px 24px;\n    border-radius: 8px;\n    font-size: 14px;\n    z-index: 2147483647;\n    pointer-events: none;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  "),
        (n.textContent = "点击要捕获的悬浮球，按 ESC 或右键取消"),
        overlayEl.appendChild(n),
        t.body.appendChild(overlayEl))
    })(e))
  const a = window.parent.document
  ;((onClickHandler = (a) => {
    if (!isPicking) return
    ;(a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation())
    captureAtPoint(a.clientX, a.clientY, e, t, n)
  }),
    (onTouchStartHandler = (e) => {
      isPicking && (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation())
    }),
    (onTouchEndHandler = (a) => {
      if (!isPicking) return
      ;(a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation())
      const o = a.changedTouches[0]
      if (!o) return
      captureAtPoint(o.clientX, o.clientY, e, t, n)
    }),
    (onKeyDownHandler = (e) => {
      isPicking && "Escape" === e.key && (e.preventDefault(), e.stopPropagation(), n())
    }),
    (onContextMenuHandler = (e) => {
      isPicking && (e.preventDefault(), e.stopPropagation(), n())
    }),
    (boundDocs = [a, ...collectIframeDocs()]),
    boundDocs.forEach((e) => {
      e.addEventListener("click", onClickHandler, !0)
      e.addEventListener("touchstart", onTouchStartHandler, { capture: !0, passive: !1 })
      e.addEventListener("touchend", onTouchEndHandler, { capture: !0, passive: !1 })
      e.addEventListener("keydown", onKeyDownHandler, !0)
      e.addEventListener("contextmenu", onContextMenuHandler, !0)
    }))
}
export function endCapturePick() {
  if (!isPicking) return
  isPicking = !1
  const e = window.parent.document,
    _p = onClickHandler,
    _d = onTouchStartHandler,
    _u = onTouchEndHandler,
    _g = onKeyDownHandler,
    _C = onContextMenuHandler
  ;(e.removeEventListener("click", _p, !0),
    e.removeEventListener("touchstart", _d, !0),
    e.removeEventListener("touchend", _u, !0),
    e.removeEventListener("keydown", _g, !0),
    e.removeEventListener("contextmenu", _C, !0),
    (onClickHandler = null),
    (onTouchStartHandler = null),
    (onTouchEndHandler = null),
    (onKeyDownHandler = null),
    (onContextMenuHandler = null),
    boundDocs.forEach((e) => {
      e.removeEventListener("click", _p, !0)
      e.removeEventListener("touchstart", _d, !0)
      e.removeEventListener("touchend", _u, !0)
      e.removeEventListener("keydown", _g, !0)
      e.removeEventListener("contextmenu", _C, !0)
    }),
    (boundDocs = []),
    overlayEl && (overlayEl.remove(), (overlayEl = null)))
}
