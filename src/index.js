import { injectStyles } from "./styles/inject.js"
import { extractFingerprint, fingerprintsMatch, isValidFingerprint, getClassSelector } from "./core/fingerprint.js"
import { withAlpha, darken } from "./core/color.js"
import {
  isFloatingBoxElement,
  collectIframeDocs,
} from "./core/dom.js"
import { getElementIcon, getElementName } from "./core/element-info.js"
import { getOwnScriptId } from "./core/platform.js"
import { beginCapturePick, endCapturePick } from "./capture/manual.js"
import {
  pendingRestoreBalls,
  finishRestore,
  persistCapturedBalls,
  findPendingRestoreBall,
  markBallRestored,
  initPersistence,
  beginRestoreBatch,
  isRestoreInProgress,
} from "./persist/saved-balls.js"
import { settingsApi, setCaptureModeChangeHandler } from "./settings.js"
import {
  setCapturedBallClickHandler,
  moveBallToContainer,
  restoreBall,
  insertBallBefore,
  hideBall,
} from "./panel/takeover.js"
import {
  isReleasedFingerprint,
  addReleased,
  removeReleased,
} from "./persist/released.js"
import {
  setBallContainer,
  reorient,
  goPage,
  getPageState,
  getContainer,
  containsBall,
} from "./panel/pagination.js"

/** Vue SFC 编译产物的 scopeId 附加（原 webpack 模块 502 的内联版） */
function withScopeId(component, attrs) {
  const target = component.__vccOpts || component
  for (const [key, value] of attrs) target[key] = value
  return target
}

const o = Vue
const   de = (0, o.ref)({}),
  ue = (0, o.ref)({}),
  ge = (0, o.ref)(!0),
  Ce = (0, o.ref)(!1),
  fe = (0, o.ref)(!1),
  be = (0, o.ref)("auto"),
  ve = (0, o.ref)("auto"),
  he = [],
  me = (0, o.computed)(() => Object.values(de.value).sort((e, t) => (e.order ?? 100) - (t.order ?? 100))),
  xe = (0, o.computed)(() => Object.values(ue.value)),
  ye = (0, o.computed)(() => Object.keys(de.value).length > 0 || Object.keys(ue.value).length > 0)
function Se(e) {
  for (const t of Object.values(ue.value)) if (fingerprintsMatch(e, t.fingerprint)) return !0
  return !1
}
function ke(e) {
  for (const t of Object.values(ue.value)) if (fingerprintsMatch(e, t.fingerprint)) return t
  return null
}
function Pe() {
  const e = Object.values(ue.value)
  ;((ue.value = {}),
    persistCapturedBalls(ue.value),
    e.forEach((e) => {
      ;(e.element.isConnected && restoreBall(e), he.forEach((t) => t(e.id, e.fingerprint, e.element)))
    }))
}
function Fe(e, t) {
  const n = ue.value[e]
  if (n) {
    const e = n.element,
      o = containsBall(e) ? e.nextSibling : null,
      r = window.parent.getComputedStyle(t)
    ;((n.originalParent = t.parentElement),
      (n.originalNextSibling = t.nextSibling),
      (n.originalStyle = t.style.cssText),
      (n.originalPosition = {
        top: r.top,
        left: r.left,
        right: r.right,
        bottom: r.bottom,
        positionValue: r.position,
        opacityValue: r.opacity,
        visibilityValue: r.visibility,
        pointerEventsValue: r.pointerEvents,
      }),
      (n.originalDisplay = r.display || "flex"),
      (n.fingerprint = extractFingerprint(t)),
      (n.element = t),
      insertBallBefore(n, o),
      e && e.isConnected && e !== t && e.remove())
  }
}
const Ne = {
  plugins: de,
  capturedBalls: ue,
  autoCaptureEnabled: ge,
  isCaptureModeActive: Ce,
  isPanelOpen: fe,
  panelLeftPosition: ve,
  panelPositionStyle: be,
  pendingRestoreBalls: pendingRestoreBalls,
  effectivePosition: settingsApi.effectivePosition,
  isHorizontalLayout: settingsApi.isHorizontalLayout,
  isVerticalLayout: settingsApi.isVerticalLayout,
  isMobile: settingsApi.isMobile,
  settings: settingsApi.settings,
  sortedPlugins: me,
  capturedBallsList: xe,
  hasPlugins: ye,
  registerPlugin: function (e) {
    de.value[e.id] = e
  },
  unregisterPlugin: function (e) {
    delete de.value[e]
  },
  addCapturedBall: function (e) {
    const t = ke(e.fingerprint)
    if (t) Fe(t.id, e.element)
    else if (ue.value[e.id]) Fe(e.id, e.element)
    else {
      if (((ue.value = { ...ue.value, [e.id]: e }), void 0 !== e.order)) {
        const t = getContainer()
        if (t) {
          const n = Object.values(ue.value)
            .filter((t) => t.id !== e.id && void 0 !== t.order)
            .sort((e, t) => (e.order ?? 0) - (t.order ?? 0))
          let a = null
          for (const o of n)
            if ((o.order ?? 0) > e.order && t && t.contains(o.element)) {
              a = o.element
              break
            }
          insertBallBefore(e, a)
        } else moveBallToContainer(e)
      } else moveBallToContainer(e)
      ;(markBallRestored(e.fingerprint), isRestoreInProgress() || persistCapturedBalls(ue.value))
    }
  },
  removeCapturedBall: function (e) {
    const t = ue.value[e]
    if (t) {
      const n = t.element,
        a = t.fingerprint,
        { [e]: _, ...o } = ue.value
      ;((ue.value = o), markBallRestored(a), persistCapturedBalls(ue.value), n && restoreBall(t), he.forEach((t) => t(e, a, n)))
    }
  },
  clickCapturedBall: function (e, t = "default") {
    const n = ue.value[e]
    if (!n) return
    const a = n.element,
      o = n.element,
      r = n.order,
      i = window.parent || window,
      ballName = n.name
    if ("root-open" === t) {
      const t = () => {
        if (!a.isConnected || ue.value[e]) return
        ;(a.removeAttribute("data-edge-panel-ignore"), gt(a, { order: r }))
      }
      ;(a.setAttribute("data-edge-panel-ignore", "1"), this.removeCapturedBall(e))
      const n =
        a.closest("#auto_illustrator_conso_floating_panel_root") ||
        i.document.getElementById("auto_illustrator_conso_floating_panel_root")
      const o =
        a.id === "ai-floating-panel-launcher"
          ? a
          : n?.querySelector("#ai-floating-panel-launcher,.ai-floating-panel-launcher")
      if (n && o) {
        ;(n.setAttribute("data-edge-panel-ignore", "1"), o.setAttribute("data-edge-panel-ignore", "1"))
        const r = o.getBoundingClientRect(),
          s = r.left + r.width / 2,
          l = r.top + r.height / 2,
          u = new (i.PointerEvent || PointerEvent)("pointerdown", {
            bubbles: !0,
            cancelable: !0,
            clientX: s,
            clientY: l,
            button: 0,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: !0,
          }),
          c = new (i.PointerEvent || PointerEvent)("pointermove", {
            bubbles: !0,
            cancelable: !0,
            clientX: s + 4,
            clientY: l + 4,
            button: 0,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: !0,
          }),
          d = new (i.PointerEvent || PointerEvent)("pointerup", {
            bubbles: !0,
            cancelable: !0,
            clientX: s + 4,
            clientY: l + 4,
            button: 0,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: !0,
          })
        try {
          ;(o.dispatchEvent(u), i.document.dispatchEvent(c), i.document.dispatchEvent(d))
        } catch {}
        try {
          i.localStorage?.setItem(
            "auto_illustrator_conso_floating_panel_position",
            JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top) }),
          )
        } catch {}
        setTimeout(() => {
          try {
            o.click()
          } catch {
            try {
              const e = (i && i.MouseEvent) || MouseEvent
              o.dispatchEvent(new e("click", { bubbles: !0, cancelable: !0, view: i }))
            } catch {}
          }
        }, 80)
        const h = setInterval(() => {
          if (!n.isConnected || ue.value[e]) return void clearInterval(h)
          n.classList.contains("open") ||
            (clearInterval(h),
            setTimeout(() => {
              ;(n.removeAttribute("data-edge-panel-ignore"), o.removeAttribute("data-edge-panel-ignore"), t())
            }, 120))
        }, 250)
        ;(setTimeout(() => clearInterval(h), 15000), toastr.info(`已在原位置打开: ${ballName}`))
        return
      }
      if (n) {
        n.classList.add("open")
        const o = setInterval(() => {
          if (!n.isConnected || ue.value[e]) return void clearInterval(o)
          n.classList.contains("open") || (clearInterval(o), setTimeout(t, 120))
        }, 250)
        setTimeout(() => clearInterval(o), 15000)
      }
      toastr.info(`已在原位置打开: ${ballName}`)
      return
    }
    const l = (e, t, n = {}) => {
      try {
        const a = i[t] || window[t]
        a && e.dispatchEvent(new a(n.type, { bubbles: !0, cancelable: !0, view: i, ...n }))
      } catch {}
    }
    const s = () => {
      let wasExpanded = !1
      const ballId = e
      const t = () => {
        const e = String(a.getAttribute("aria-expanded") || "").toLowerCase(),
          t = `${a.className || ""} ${o.className || ""}`.toLowerCase()
        return "true" === e || /(^|\s)(active|open|opened|expanded|selected)(\s|$)/.test(t)
      }
      const n = setInterval(() => {
        if (!a.isConnected || ue.value[ballId]) return void clearInterval(n)
        const o = t()
        o
          ? (wasExpanded = !0)
          : wasExpanded &&
            (clearInterval(n),
            setTimeout(() => {
              if (!a.isConnected || ue.value[ballId]) return
              ;(a.removeAttribute("data-edge-panel-ignore"), gt(a, { order: r }))
            }, 120))
      }, 250)
      setTimeout(() => clearInterval(n), 15000)
      setTimeout(() => {
        const cleanup = () => {
          ;(a.removeEventListener("click", cleanup, !0),
            a.removeEventListener("touchend", cleanup, !0),
            setTimeout(() => {
              if (!a.isConnected || ue.value[ballId]) return
              ;(a.removeAttribute("data-edge-panel-ignore"), gt(a, { order: r }))
            }, 120))
        }
        ;(a.addEventListener("click", cleanup, !0), a.addEventListener("touchend", cleanup, !0))
      }, 400)
    }
    ;(a.setAttribute("data-edge-panel-ignore", "1"),
      this.removeCapturedBall(e),
      setTimeout(() => {
        ;(l(o, "PointerEvent", { type: "pointerdown", button: 0, buttons: 1, pointerType: "mouse", isPrimary: !0 }),
          l(o, "MouseEvent", { type: "mousedown", button: 0, buttons: 1 }),
          l(o, "PointerEvent", { type: "pointerup", button: 0, buttons: 0, pointerType: "mouse", isPrimary: !0 }),
          l(o, "MouseEvent", { type: "mouseup", button: 0, buttons: 0 }))
        try {
          o.click()
        } catch {
          l(o, "MouseEvent", { type: "click", button: 0, buttons: 0 })
        }
      }, 48),
      s(),
      toastr.info(`已在原位置打开: ${ballName}`))
  },
  releaseAllBalls: Pe,
  releaseAllBallsWithoutSaving: function () {
    const e = Object.values(ue.value)
    ;((ue.value = {}),
      e.forEach((e) => {
        ;(e.element.isConnected && restoreBall(e), he.forEach((t) => t(e.id, e.fingerprint, e.element)))
      }))
  },
  updateCapturedBallElement: Fe,
  cleanupInvalidBalls: function () {
    const e = []
    for (const [t, n] of Object.entries(ue.value)) n.element.isConnected || e.push(t)
    if (e.length > 0) {
      for (const t of e) {
        const e = ue.value[t]
        ;(e && he.forEach((n) => n(t, e.fingerprint, e.element)), delete ue.value[t])
      }
      ;((ue.value = { ...ue.value }), persistCapturedBalls(ue.value))
    }
    for (const [t, n] of ct) {
      ;(t.isConnected && ue.value[n]) || ct.delete(t)
    }
  },
  onBallReleased: function (e) {
    return (
      he.push(e),
      () => {
        const t = he.indexOf(e)
        t > -1 && he.splice(t, 1)
      }
    )
  },
  togglePanel: function () {
    fe.value = !fe.value
  },
  closePanel: function () {
    fe.value = !1
  },
  openPanel: function () {
    fe.value = !0
  },
  setPanelLeftPosition: function (e) {
    ;((ve.value = e), (be.value = e))
  },
  updatePanelPositionStyle: function (e) {
    const t = settingsApi.effectivePosition.value
    if (e)
      switch (t) {
        case "left":
          be.value = `${Math.round(e.left)}px`
          break
        case "right":
          be.value = `${Math.round(e.right)}px`
          break
        case "top":
          be.value = `${Math.round(e.top)}px`
          break
        case "bottom":
          be.value = `${Math.round(e.bottom)}px`
      }
    else
      switch (t) {
        case "left":
        case "top":
          be.value = "0px"
          break
        case "right":
          be.value = `${window.parent.innerWidth}px`
          break
        case "bottom":
          be.value = `${window.parent.innerHeight}px`
      }
  },
  initSettings: settingsApi.initSettings,
  setPanelPosition: settingsApi.setPanelPosition,
  toggleAutoCapture: function () {
    ;((ge.value = !ge.value), ge.value || Pe())
    syncAutoScan()
  },
  enterCaptureMode: function () {
    Ce.value = !0
  },
  exitCaptureMode: function () {
    Ce.value = !1
  },
  toggleCaptureMode: function () {
    Ce.value = !Ce.value
  },
  setBallContainer,
  goPage,
  fbGetPageState: getPageState,
  getBallContainer: getContainer,
  moveBallToContainer: moveBallToContainer,
  moveBallBackToOriginal: restoreBall,
  hideFloatingBall: hideBall,
  showFloatingBall: function (e, t) {
    e.style.cssText = t
  },
  initPersistence,
  saveCapturedBalls: () => persistCapturedBalls(ue.value),
  findPendingRestoreBall: findPendingRestoreBall,
  shouldRestoreBall: function (e, t, n) {
    return null !== findPendingRestoreBall({ scriptId: e, elementId: n || null, classSelector: t, title: null })
  },
  markBallRestored: markBallRestored,
  removeFromPendingRestore: markBallRestored,
  getPendingRestoreBalls: function () {
    return pendingRestoreBalls.value
  },
  extractFingerprint,
  generateBallIdFromFingerprint: function (e) {
    if (e.scriptId) return `ball_script_${e.scriptId}`
    if (e.elementId) return `ball_id_${e.elementId}`
    if (e.classSelector || e.title) {
      return `ball_combined_${(function (e) {
        let t = 0
        for (let n = 0; n < e.length; n++) ((t = (t << 5) - t + e.charCodeAt(n)), (t &= t))
        return Math.abs(t)
      })(`${e.classSelector || ""}_${e.title || ""}`)}`
    }
    return `ball_random_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  },
  fingerprintsMatch,
  isValidFingerprint,
  isFingerprintCaptured: Se,
  findCapturedBallByFingerprint: ke,
  getClassSelector,
  isElementIdCaptured: function (e) {
    return !!e && Se({ scriptId: null, elementId: e, classSelector: null, title: null })
  },
}
setCapturedBallClickHandler((id, mode) => Ne.clickCapturedBall(id, mode))

const Ie = _,
  Me = (0, o.ref)({
    barBg: "rgba(30, 30, 40, 0.9)",
    controlBg: "rgba(45, 55, 72, 0.8)",
    controlHoverBg: "rgba(35, 45, 62, 0.8)",
    buttonBg: "rgba(74, 85, 104, 0.8)",
    textColor: "#e2e8f0",
    borderColor: "#718096",
    hoverBg: "rgba(20, 20, 30, 0.9)",
    panelBg: "rgba(26, 32, 44, 1)",
    quoteColor: "#9ca3af",
    glassBg: "rgba(30, 30, 40, 0.8)",
    glassHoverBg: "rgba(20, 20, 30, 0.7)",
  })
let qe = null
const _e = () => {
    try {
      const e = window.parent.document
      let t = "rgba(30, 30, 40, 0.9)",
        n = "rgba(20, 20, 30, 0.9)",
        a = "rgba(45, 55, 72, 0.8)",
        o = "rgba(35, 45, 62, 0.8)",
        r = "rgba(74, 85, 104, 0.8)",
        i = "#e2e8f0",
        l = "#718096",
        s = "rgba(26, 32, 44, 1)",
        A = "#9ca3af",
        c = "rgba(30, 30, 40, 0.6)",
        p = "rgba(20, 20, 30, 0.7)"
      const d = (() => {
        if ("function" != typeof $) {
          const e = window.parent.document.querySelector(".simplebar-content-wrapper") || window.parent.document.querySelector("#chat")
          return e || null
        }
        const e = $(window.parent.document),
          t = [".simplebar-content-wrapper", "#chat"]
        for (const n of t) {
          const t = e.find(n)
          if (t.length > 0) return t.first()
        }
        return null
      })()
      if (d) {
        let a = window.parent.getComputedStyle(d[0]).backgroundColor
        ;(("rgba(0, 0, 0, 0)" !== a && "transparent" !== a) ||
          (a = window.parent.getComputedStyle(e.body).backgroundColor),
          (s = withAlpha(a, 1)))
        const o = e.querySelector("#top-bar")
        if (o) {
          const e = window.parent.getComputedStyle(o).backgroundColor
          t = withAlpha("rgba(0, 0, 0, 0)" !== e && "transparent" !== e ? e : a, 1)
        } else t = withAlpha(a, 1)
        ;((n = darken(t, 0.15)), (c = withAlpha(t, 0.6)), (p = withAlpha(n, 0.7)))
      }
      const u = e.querySelector(".mes:not(.user-mes)")
      if (u) {
        const e = window.parent.getComputedStyle(u).backgroundColor
        ;((a = withAlpha(e, 1)), (o = darken(a, 0.15)))
      }
      const g = e.querySelector(".mes_text")
      g && (i = window.parent.getComputedStyle(g).color)
      const C = e.querySelector(".mes_text blockquote")
      if (C) A = window.parent.getComputedStyle(C).color
      else {
        const t = e.querySelector("blockquote")
        if (t) A = window.parent.getComputedStyle(t).color
        else {
          const t = window.parent.getComputedStyle(e.documentElement).getPropertyValue("--SmartThemeQuoteColor").trim()
          t && (A = t)
        }
      }
      const f = e.querySelector(".fa-solid")
      if (f) {
        const e = window.parent.getComputedStyle(f).color
        r = withAlpha(e, 1)
      }
      const b = e.querySelector("#send_textarea")
      ;(b && (l = window.parent.getComputedStyle(b).borderColor),
        (Me.value = {
          barBg: t,
          hoverBg: n,
          controlBg: a,
          controlHoverBg: o,
          buttonBg: r,
          textColor: i,
          borderColor: l,
          panelBg: s,
          quoteColor: A,
          glassBg: c,
          glassHoverBg: p,
        }))
    } catch (e) {
      console.warn("[集成控件] 获取父窗口样式失败:", e)
    }
  },
  Ve = {
    themeColors: Me,
    initializeThemeObserver: () => {
      _e()
      try {
        const e = (0, Ie.debounce)(_e, 250)
        ;((qe = new MutationObserver(e)),
          qe.observe(window.parent.document.head, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }),
          qe.observe(window.parent.document.body, { attributes: !0, attributeFilter: ["class", "style"] }),
          qe.observe(window.parent.document.documentElement, { attributes: !0, attributeFilter: ["style", "class"] }))
        const t = window.parent.document.querySelector("#chat")
        ;(t && qe.observe(t, { attributes: !0, attributeFilter: ["style", "class"], childList: !0 }),
          console.log("[集成控件] 主题监听器已初始化"))
      } catch (e) {
        console.error("[集成控件] 无法监听主题变化:", e)
      }
    },
    disconnectThemeObserver: () => {
      qe?.disconnect()
    },
    updateThemeColors: _e,
  }
const Ge = { class: "panel-icons" },
  Le = ["title", "onClick"],
  Ye = { key: 0, class: "panel-divider" },
  We = { key: 0, class: "panel-divider" },
  je = { class: "panel-actions" },
  Ue = { key: 0, class: "settings-panel" },
  Xe = { class: "settings-options" },
  Te = ["title", "onClick"],
  De = { key: 1, class: "panel-empty" },
  Re = (0, o.defineComponent)({
    __name: "EdgePanel",
    setup(e) {
      ;(0, o.useCssVars)((e) => ({
        v9d17ecc4: (0, o.unref)(c),
        v447886dc: (0, o.unref)(x).glassBg,
        v70503c70: (0, o.unref)(x).borderColor,
        v2826bcb2: (0, o.unref)(x).textColor,
        v5e0fea74: (0, o.unref)(x).glassHoverBg,
        ec7cae14: (0, o.unref)(x).quoteColor,
      }))
      const t = (0, o.ref)(null),
        n = (0, o.ref)(!1),
        releaseMode = (0, o.ref)(!1),
        gestureState = {
          startX: 0,
          startY: 0,
          moved: !1,
          lastScrollAt: 0,
          lastReleaseTouchAt: 0,
          pendingRelease: null,
        },
        {
          isPanelOpen: a,
          sortedPlugins: r,
          capturedBallsList: i,
          hasPlugins: l,
          isCaptureModeActive: s,
          panelLeftPosition: A,
          panelPositionStyle: c,
          effectivePosition: p,
          isHorizontalLayout: d,
          isVerticalLayout: u,
          settings: g,
          togglePanel: C,
          closePanel: f,
          removeCapturedBall: b,
          enterCaptureMode: v,
          setBallContainer: h,
          setPanelPosition: m,
        } = Ne,
        { themeColors: x } = Ve,
        y = [
          { value: "left", label: "左侧", icon: "fa-solid fa-arrow-left" },
          { value: "right", label: "右侧", icon: "fa-solid fa-arrow-right" },
          { value: "top", label: "顶部", icon: "fa-solid fa-arrow-up" },
          { value: "bottom", label: "底部", icon: "fa-solid fa-arrow-down" },
        ],
        w = (0, o.computed)(() => {
          switch (p.value) {
            case "left":
              return "fa-solid fa-chevron-right"
            case "right":
            default:
              return "fa-solid fa-chevron-left"
            case "top":
              return "fa-solid fa-chevron-down"
            case "bottom":
              return "fa-solid fa-chevron-up"
          }
        }),
        B = (0, o.computed)(() => {
          switch (p.value) {
            case "left":
              return "fa-solid fa-chevron-left"
            case "right":
            default:
              return "fa-solid fa-chevron-right"
            case "top":
              return "fa-solid fa-chevron-up"
            case "bottom":
              return "fa-solid fa-chevron-down"
          }
        }),
        E = (0, o.computed)(() => {
          switch (p.value) {
            case "left":
            default:
              return "panel-slide-left"
            case "right":
              return "panel-slide-right"
            case "top":
              return "panel-slide-top"
            case "bottom":
              return "panel-slide-bottom"
          }
        })
      function findBallElementFromTarget(e) {
        const n = t.value
        if (!n || !e) return null
        // 球在分页(slot)嵌套里, 用 data-edge-ball-id 直接定位
        if (e.closest) {
          const b = e.closest("[data-edge-ball-id]")
          if (b && n.contains(b)) return b
        }
        let a = null
        const o = e.closest("[script_id]")
        if (o && n.contains(o)) for (a = o; a && a.parentElement !== n;) a = a.parentElement
        if (!a) {
          let t = e
          for (; t && t !== n;) {
            if (t.parentElement === n) {
              a = t
              break
            }
            t = t.parentElement
          }
        }
        return a
      }
      function releaseBallElement(e) {
        if (!e) return !1
        const t = i.value
        for (const n of t)
          if (n.element === e)
            return (
              e.setAttribute("data-edge-panel-ignore", "1"),
              addReleased(n.fingerprint || extractFingerprint(e)),
              b(n.id),
              e.removeAttribute("data-edge-panel-ignore"),
              (filterPendingBall(n.fingerprint, e)),
              void toastr.info(`已释放悬浮球: ${n.name}`),
              !0
            )
        const n = e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")
        return (
          !!n &&
          (e.setAttribute("data-edge-panel-ignore", "1"),
          addReleased(extractFingerprint(e)),
          b(`ball_${n}`),
          e.removeAttribute("data-edge-panel-ignore"),
          (filterPendingBall(null, e)),
          toastr.info("已释放悬浮球"),
          !0)
        )
      }
      function filterPendingBall(fp, e) {
  const a = fp || extractFingerprint(e)
  pendingRestoreBalls.value = pendingRestoreBalls.value.filter((t) => !fingerprintsMatch(t.fingerprint, a))
  try {
    const o = { ...(getVariables({ type: "script", script_id: getOwnScriptId() }) ?? {}), savedBalls: JSON.parse(JSON.stringify(pendingRestoreBalls.value)) }
    replaceVariables(o, { type: "script", script_id: getOwnScriptId() })
  } catch {}
}
      function S(e) {
        const t = findBallElementFromTarget(e.target)
        t && releaseBallElement(t)
      }
      function k() {
        ;((releaseMode.value = !1), v())
      }
      function P() {
        ;((releaseMode.value = !1), (n.value = !n.value))
      }
      function T() {
        ;((n.value = !1), (releaseMode.value = !releaseMode.value))
      }
      let pressTimer = null
      let pressFired = !1
      let lastLongPressAt = 0
      function longPressStart(kind, e) {
        if (e && "mouse" === e.pointerType && 0 !== e.button) return
        clearTimeout(pressTimer)
        pressFired = !1
        lastLongPressAt = 0
        pressTimer = setTimeout(() => {
          pressFired = !0
          lastLongPressAt = Date.now()
          try {
            if ("capture" === kind) {
              const t = Object.keys(Ne.capturedBalls.value).length
              const r = Ne.autoCaptureEnabled.value
              Ne.autoCaptureEnabled.value = !0
              try {
                Ct(!0)
              } finally {
                Ne.autoCaptureEnabled.value = r
              }
              const a = Object.keys(Ne.capturedBalls.value).length
              toastr.success(
                a > 0 ? (a > t ? `已全部捕捉 ${a - t} 个悬浮球（共 ${a} 个）` : `当前已收纳 ${a} 个悬浮球`) : "未发现可捕捉的悬浮球",
              )
            } else {
              const t = Object.values(Ne.capturedBalls.value)
              if (0 === t.length) return void toastr.info("当前没有已收纳的悬浮球")
              for (const e of t) {
                try {
                  addReleased(e.fingerprint)
                  Ne.removeCapturedBall(e.id)
                  filterPendingBall(e.fingerprint, e.element)
                  e.element && e.element.removeAttribute("data-edge-panel-ignore")
                } catch {}
              }
              toastr.info(`已全部释放 ${t.length} 个悬浮球`)
            }
          } catch (e) {
            console.warn("[集成控件] 长按操作失败:", e)
          }
        }, 600)
      }
      function longPressEnd() {
        clearTimeout(pressTimer)
      }
      function captureButtonClick() {
        if (pressFired || (lastLongPressAt && Date.now() - lastLongPressAt < 800)) {
          pressFired = !1
          return
        }
        k()
      }
      function releaseButtonClick() {
        if (pressFired || (lastLongPressAt && Date.now() - lastLongPressAt < 800)) {
          pressFired = !1
          return
        }
        T()
      }
      const captureModeActive = (0, o.ref)(settingsApi.getCaptureMode())
      function setCaptureModeUI(aMode) {
        if (aMode === captureModeActive.value) return
        captureModeActive.value = aMode
        settingsApi.setCaptureMode(aMode)
        toastr.info(aMode === "auto" ? "已切换到自动模式：悬浮球将自动收纳" : "已切换到手动模式：长按捕捉=全部收纳")
      }
      function clearMemoryUI() {
        const t = settingsApi.getReleasedFpCount()
        if (0 === t) return void toastr.info("当前无记忆")
        ;(settingsApi.clearReleasedFps(), toastr.success(`已清空 ${t} 条释放记忆`))
      }
      function handleContainerTouchStart(e) {
        const n = e.touches && e.touches[0]
        if (!n) return
        ;((gestureState.startX = n.clientX),
          (gestureState.startY = n.clientY),
          (gestureState.moved = !1),
          (gestureState.pendingRelease = releaseMode.value ? findBallElementFromTarget(e.target) : null),
          releaseMode.value &&
            gestureState.pendingRelease &&
            (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation()))
      }
      function handleContainerTouchMove(e) {
        const t = e.touches && e.touches[0]
        if (!t) return
        const n = Math.abs(t.clientX - gestureState.startX),
          a = Math.abs(t.clientY - gestureState.startY),
          r = (0, o.unref)(d) ? n : a
        ;(r > 6 && ((gestureState.moved = !0), (gestureState.pendingRelease = null)),
          releaseMode.value &&
            gestureState.moved &&
            (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation()))
      }
      function handleContainerTouchEnd(e) {
        if (releaseMode.value) {
          const t = gestureState.pendingRelease || findBallElementFromTarget(e.target),
            n = gestureState.moved
          ;((gestureState.pendingRelease = null), (gestureState.moved = !1))
          return !n && t
            ? ((gestureState.lastReleaseTouchAt = Date.now()),
              e.preventDefault(),
              e.stopPropagation(),
              e.stopImmediatePropagation(),
              void releaseBallElement(t))
            : void 0
        }
        gestureState.moved &&
          ((gestureState.lastScrollAt = Date.now()),
          setTimeout(() => {
            gestureState.moved = !1
          }, 80))
      }
      function handleContainerClickCapture(e) {
        if (Date.now() - gestureState.lastScrollAt < 220 || Date.now() - gestureState.lastReleaseTouchAt < 220)
          return (e.preventDefault(), e.stopPropagation(), void e.stopImmediatePropagation())
        if (!releaseMode.value) return
        const t = findBallElementFromTarget(e.target)
        t && (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), releaseBallElement(t))
      }
      return (
        (0, o.watch)(
          i,
          (e) => {
            console.info("[EdgePanel] capturedBallsList 更新:", e.length, "个", e)
          },
          { immediate: !0, deep: !0 },
        ),
        (0, o.watch)(a, (e) => {
          e || ((n.value = !1), (releaseMode.value = !1))
        }),
        (0, o.onMounted)(() => {
          ;(Ve.initializeThemeObserver(), t.value && h(t.value))
        }),
        (0, o.onUnmounted)(() => {
          ;(Ve.disconnectThemeObserver(), h(null), (releaseMode.value = !1))
        }),
        (e, A) => (
          (0, o.openBlock)(),
          (0, o.createElementBlock)(
            "div",
            {
              class: (0, o.normalizeClass)([
                "edge-panel-root",
                [`edge-panel-root--${(0, o.unref)(p)}`, { "edge-panel-root--horizontal": (0, o.unref)(d) }],
              ]),
            },
            [
              (0, o.createCommentVNode)(" 边缘箭头标签 "),
              (0, o.createVNode)(
                o.Transition,
                { name: "edge-tab-fade", persisted: "" },
                {
                  default: (0, o.withCtx)(() => [
                    (0, o.withDirectives)(
                      (0, o.createElementVNode)(
                        "div",
                        {
                          class: (0, o.normalizeClass)([
                            "edge-tab",
                            { "edge-tab--has-plugins": (0, o.unref)(l), [`edge-tab--${(0, o.unref)(p)}`]: !0 },
                          ]),
                          title: "快速导航",
                          onClick: A[0] || (A[0] = (...e) => (0, o.unref)(C) && (0, o.unref)(C)(...e)),
                        },
                        [(0, o.createElementVNode)("i", { class: (0, o.normalizeClass)(w.value) }, null, 2)],
                        2,
                      ),
                      [[o.vShow, !(0, o.unref)(a)]],
                    ),
                  ]),
                },
              ),
              (0, o.createCommentVNode)(" 展开的图标面板 "),
              (0, o.createVNode)(
                o.Transition,
                { name: E.value, persisted: "" },
                {
                  default: (0, o.withCtx)(() => [
                    (0, o.withDirectives)(
                      (0, o.createElementVNode)(
                        "div",
                        { class: (0, o.normalizeClass)(["icon-panel", [`icon-panel--${(0, o.unref)(p)}`]]) },
                        [
                          (0, o.createCommentVNode)(" 面板头部 - 收起按钮 "),
                          (0, o.createElementVNode)(
                            "div",
                            {
                              class: "panel-header",
                              onClick: A[1] || (A[1] = (...e) => (0, o.unref)(f) && (0, o.unref)(f)(...e)),
                            },
                            [(0, o.createElementVNode)("i", { class: (0, o.normalizeClass)(B.value) }, null, 2)],
                          ),
                          (0, o.createCommentVNode)(" 插件图标列表 "),
                          (0, o.createElementVNode)("div", Ge, [
                            (0, o.createCommentVNode)(" 手动注册的插件 "),
                            ((0, o.openBlock)(!0),
                            (0, o.createElementBlock)(
                              o.Fragment,
                              null,
                              (0, o.renderList)(
                                (0, o.unref)(r),
                                (e) => (
                                  (0, o.openBlock)(),
                                  (0, o.createElementBlock)(
                                    "div",
                                    {
                                      key: e.id,
                                      class: (0, o.normalizeClass)([
                                        "plugin-icon",
                                        { "plugin-icon--active": e.isActive?.() },
                                      ]),
                                      title: e.name,
                                      style: (0, o.normalizeStyle)(
                                        e.iconColor ? { "--plugin-color": e.iconColor } : {},
                                      ),
                                      onClick: (t) =>
                                        (function (e) {
                                          e.onClick()
                                        })(e),
                                    },
                                    [(0, o.createElementVNode)("i", { class: (0, o.normalizeClass)(e.icon) }, null, 2)],
                                    14,
                                    Le,
                                  )
                                ),
                              ),
                              128,
                            )),
                            (0, o.createCommentVNode)(" 分隔线（当同时存在注册插件和捕获悬浮球时显示） "),
                            (0, o.unref)(r).length > 0 && (0, o.unref)(i).length > 0
                              ? ((0, o.openBlock)(), (0, o.createElementBlock)("div", Ye))
                              : (0, o.createCommentVNode)("v-if", !0),
                            (0, o.createCommentVNode)(" 捕获的悬浮球容器 - 支持滑动，防误触 "),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: "fb-arrow fb-arrow--prev",
                                "data-fb-page-prev": "",
                                "aria-hidden": "true",
                                onClick: () => goPage(-1),
                              },
                              [(0, o.createTextVNode)("\u2039")],
                            ),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                ref_key: "ballContainerRef",
                                ref: t,
                                class: "captured-balls-container",
                                onTouchstartCapture: handleContainerTouchStart,
                                onTouchmoveCapture: handleContainerTouchMove,
                                onTouchendCapture: handleContainerTouchEnd,
                                onTouchcancelCapture: handleContainerTouchEnd,
                                onClickCapture: handleContainerClickCapture,
                              },
                              [(0, o.createCommentVNode)(" 悬浮球元素会被动态移动到这里，左右滑动浏览，点击激活 ")],
                              544,
                            ),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: "fb-arrow fb-arrow--next",
                                "data-fb-page-next": "",
                                "aria-hidden": "true",
                                onClick: () => goPage(1),
                              },
                              [(0, o.createTextVNode)("\u203a")],
                            ),
                          ]),
                          (0, o.createCommentVNode)(" 分隔线（当有内容时显示） "),
                          (0, o.unref)(r).length > 0 || (0, o.unref)(i).length > 0
                            ? ((0, o.openBlock)(), (0, o.createElementBlock)("div", We))
                            : (0, o.createCommentVNode)("v-if", !0),
                          (0, o.createCommentVNode)(" 操作按钮区域 - 紧凑布局，集中放置 "),
                          (0, o.createElementVNode)("div", je, [
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: (0, o.normalizeClass)([
                                  "action-icon",
                                  { "action-icon--active": (0, o.unref)(s) },
                                ]),
                                title: "捕获悬浮球（长按全部捕捉）",
                                onClick: captureButtonClick,
                                onPointerdown: (e) => longPressStart("capture", e),
                                onPointerup: longPressEnd,
                                onPointerleave: longPressEnd,
                                onPointercancel: longPressEnd,
                              },
                              [
                                ...(A[2] ||
                                  (A[2] = [
                                    (0, o.createElementVNode)("i", { class: "fa-solid fa-crosshairs" }, null, -1),
                                  ])),
                              ],
                              2,
                            ),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: (0, o.normalizeClass)([
                                  "action-icon",
                                  { "action-icon--active": releaseMode.value },
                                ]),
                                title: "手动释放悬浮球（长按全部释放）",
                                onClick: releaseButtonClick,
                                onPointerdown: (e) => longPressStart("release", e),
                                onPointerup: longPressEnd,
                                onPointerleave: longPressEnd,
                                onPointercancel: longPressEnd,
                              },
                              [
                                ...(A[6] ||
                                  (A[6] = [
                                    (0, o.createElementVNode)("i", { class: "fa-solid fa-box-open" }, null, -1),
                                  ])),
                              ],
                              2,
                            ),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: (0, o.normalizeClass)(["action-icon", { "action-icon--active": n.value }]),
                                title: "设置面板位置",
                                onClick: P,
                              },
                              [
                                ...(A[3] ||
                                  (A[3] = [(0, o.createElementVNode)("i", { class: "fa-solid fa-gear" }, null, -1)])),
                              ],
                              2,
                            ),
                          ]),
                          (0, o.createCommentVNode)(" 设置面板 "),
                          (0, o.createVNode)(
                            o.Transition,
                            { name: "settings-fade" },
                            {
                              default: (0, o.withCtx)(() => [
                                n.value
                                  ? ((0, o.openBlock)(),
                                    (0, o.createElementBlock)("div", Ue, [
                                      A[4] ||
                                        (A[4] = (0, o.createElementVNode)(
                                          "div",
                                          { class: "settings-title" },
                                          "位置",
                                          -1,
                                        )),
                                      (0, o.createElementVNode)("div", Xe, [
                                        (0, o.createElementVNode)(
                                          "div",
                                          {
                                            class: "settings-option",
                                            title: "位置",
                                            onClick: (t) => {
                                              const el = t.currentTarget || t.target
                                              window.openPosMenu && window.openPosMenu(el, (0, o.unref)(p))
                                            },
                                          },
                                          [(0, o.createElementVNode)("i", { class: "fa-solid fa-flag" }, null, -1)],
                                          10,
                                          Te,
                                        ),
                                      ]),
                                    ,
                              (0, o.createCommentVNode)(" 入口显示模式 "),
                              (0, o.createElementVNode)("div", { class: "settings-title" }, "入口", -1),
                              (0, o.createElementVNode)("div", { class: "settings-options" }, [
                                (0, o.createElementVNode)(
                                  "div",
                                  {
                                    class: "settings-option",
                                    title: "入口",
                                    onClick: (t) => {
                                      const el = t.currentTarget || t.target
                                      window.openEntryMenu && window.openEntryMenu(el)
                                    },
                                  },
                                  [(0, o.createElementVNode)("i", { class: "fa-solid fa-list-check" }, null, -1)],
                                  10,
                                  Te,
                                ),
                              ]),
                              (0, o.createCommentVNode)(" 捕捉模式 - 手动/自动 "),
                              (0, o.createElementVNode)("div", { class: "settings-title" }, "模式", -1),
                              (0, o.createElementVNode)("div", { class: "settings-options" }, [
                                (0, o.createElementVNode)(
                                  "div",
                                  {
                                    class: (0, o.normalizeClass)([
                                      "settings-option",
                                      { "settings-option--active": "manual" === (0, o.unref)(captureModeActive) },
                                    ]),
                                    title: "手动",
                                    onClick: () => setCaptureModeUI("manual"),
                                  },
                                  [(0, o.createElementVNode)("i", { class: "fa-solid fa-hand-pointer" }, null, -1)],
                                  10,
                                  Te,
                                ),
                                (0, o.createElementVNode)(
                                  "div",
                                  {
                                    class: (0, o.normalizeClass)([
                                      "settings-option",
                                      { "settings-option--active": "auto" === (0, o.unref)(captureModeActive) },
                                    ]),
                                    title: "自动",
                                    onClick: () => setCaptureModeUI("auto"),
                                  },
                                  [(0, o.createElementVNode)("i", { class: "fa-solid fa-bolt" }, null, -1)],
                                  10,
                                  Te,
                                ),
                              ]),
                              (0, o.createElementVNode)("div", { class: "settings-divider" }, null, -1),
                              (0, o.createElementVNode)(
                                "div",
                                { class: "settings-option clear-memory-row", title: "清空释放记忆", onClick: clearMemoryUI },
                                [(0, o.createElementVNode)("i", { class: "fa-solid fa-broom" }, null, -1)],
                                10,
                                Le,
                              )
                              ]))
                                  : (0, o.createCommentVNode)("v-if", !0),
                              ]),
                              _: 1,
                            },
                          ),
                          (0, o.createCommentVNode)(" 空状态提示（没有插件和悬浮球时显示） "),
                          0 !== (0, o.unref)(r).length || 0 !== (0, o.unref)(i).length
                            ? (0, o.createCommentVNode)("v-if", !0)
                            : ((0, o.openBlock)(),
                              (0, o.createElementBlock)("div", De, [
                                ...(A[5] ||
                                  (A[5] = [
                                    (0, o.createElementVNode)(
                                      "span",
                                      { class: "panel-empty-text" },
                                      [
                                        (0, o.createTextVNode)("暂无内容"),
                                        (0, o.createElementVNode)("br"),
                                        (0, o.createTextVNode)("点击上方按钮捕获悬浮球"),
                                      ],
                                      -1,
                                    ),
                                  ])),
                              ])),
                        ],
                        2,
                      ),
                      [[o.vShow, (0, o.unref)(a)]],
                    ),
                  ]),
                  _: 1,
                },
                8,
                ["name"],
              ),
            ],
            2,
          )
        )
      )
    },
  })
injectStyles()
const Je = withScopeId(Re, [["__scopeId", "data-v-da7fb8b4"]])
let Qe = null,
  He = null,
  Ze = null,
  et = null,
  edgePanelViewportResizeHandler = null,
  edgePanelViewportScrollHandler = null,
  edgePanelFocusHandler = null,
  edgePanelKeyboardPointerHandler = null,
  edgePanelKeyboardClickHandler = null,
  edgePanelKeyboardToggleGuardUntil = 0,
  edgePanelFrameObserver = null,
  edgePanelRuntimeCleaned = !1,
  edgePanelHostActionObserver = null,
  edgePanelHostClickHandler = null,
  edgePanelArtifactMonitor = null,
  edgePanelStyleHost = null
const edgePanelParentWin = window.parent,
  edgePanelParentDoc = edgePanelParentWin.document,
  edgePanelRuntimeId = (function () {
    try {
      return getScriptId()
    } catch (e) {
      return ""
    }
  })(),
  edgePanelRuntimeOwner = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
  edgePanelRuntimeKeys = ["__floating_ball_storage_runtime__", "__edge_panel_runtime__"],
  edgePanelCurrentFrameName = (function () {
    try {
      return String(window?.name || "").trim()
    } catch (e) {
      return ""
    }
  })()
try {
  edgePanelRuntimeKeys.forEach((e) => {
    const t = edgePanelParentWin[e]
    t && "function" == typeof t.cleanup && t.cleanup()
  })
} catch (e) {
  console.warn("[集成控件] 清理旧运行时失败:", e)
}
function edgePanelResolveCurrentFrame() {
  try {
    const e = window.frameElement
    if (e && e.ownerDocument === edgePanelParentDoc) return e
  } catch (e) {}
  if (!edgePanelCurrentFrameName || "function" != typeof edgePanelParentDoc.getElementById) return null
  const e = edgePanelParentDoc.getElementById(edgePanelCurrentFrameName)
  return e && "iframe" === String(e.tagName || "").toLowerCase() ? e : null
}
function edgePanelMarkOwned(e) {
  return (e && e.setAttribute("data-edge-panel-owner", edgePanelRuntimeOwner), e)
}
function edgePanelRemoveOwnedArtifacts() {
  try {
    edgePanelParentDoc.querySelectorAll(`[data-edge-panel-owner="${edgePanelRuntimeOwner}"]`).forEach((e) => {
      e.remove()
    })
  } catch (e) {}
}
function edgePanelRemoveStaleArtifacts() {
  if (!edgePanelRuntimeId) return
  try {
    edgePanelParentDoc
      .querySelectorAll(`body > div[script_id="${edgePanelRuntimeId}"], head > div[script_id="${edgePanelRuntimeId}"]`)
      .forEach((e) => {
        e.remove()
      })
  } catch (e) {}
}
function edgePanelRegisterRuntime(e) {
  try {
    edgePanelRuntimeKeys.forEach((t) => {
      edgePanelParentWin[t] = { id: edgePanelRuntimeId, owner: edgePanelRuntimeOwner, cleanup: e }
    })
  } catch (e) {
    console.warn("[集成控件] 注册运行时失败:", e)
  }
}
function edgePanelClearRuntimeRegistration() {
  try {
    edgePanelRuntimeKeys.forEach((e) => {
      const t = edgePanelParentWin[e]
      t && t.owner === edgePanelRuntimeOwner && delete edgePanelParentWin[e]
    })
  } catch (e) {}
}
function edgePanelAttachFrameDetachWatcher(e) {
  if (
    edgePanelFrameObserver ||
    edgePanelRuntimeCleaned ||
    edgePanelParentWin === window ||
    "undefined" == typeof MutationObserver
  )
    return
  const t = edgePanelParentDoc.body || edgePanelParentDoc.documentElement
  if (!t) return
  ;((edgePanelFrameObserver = new MutationObserver(() => {
    if (edgePanelRuntimeCleaned) return
    const t = edgePanelResolveCurrentFrame()
    ;(t && t.isConnected) || e()
  })),
    edgePanelFrameObserver.observe(t, { childList: !0, subtree: !0 }))
}
function edgePanelEnsureArtifacts(e) {
  if (edgePanelRuntimeCleaned) return
  let t = !1
  ;(it && !it.isConnected && edgePanelParentDoc.body && (edgePanelParentDoc.body.appendChild(it), (t = !0)),
    edgePanelStyleHost &&
      !edgePanelStyleHost.isConnected &&
      edgePanelParentDoc.head &&
      (edgePanelParentDoc.head.appendChild(edgePanelStyleHost), (t = !0)),
    e && e(t))
}
function edgePanelStartArtifactMonitor(e) {
  ;(edgePanelArtifactMonitor &&
    (edgePanelParentWin.clearInterval(edgePanelArtifactMonitor), (edgePanelArtifactMonitor = null)),
    (edgePanelArtifactMonitor = edgePanelParentWin.setInterval(() => {
      edgePanelEnsureArtifacts(e)
    }, 1200)))
}
function edgePanelIsElement(e) {
  return !!(e && 1 === e.nodeType)
}
function edgePanelIsOwnedNode(e) {
  return !!(
    edgePanelIsElement(e) &&
    "function" == typeof e.closest &&
    e.closest(`[data-edge-panel-owner="${edgePanelRuntimeOwner}"]`)
  )
}
function edgePanelNodeMentionsScriptByText(e) {
  if (!e || !edgePanelRuntimeId) return !1
  try {
    const t = (e.textContent || "").toLowerCase(),
      n = edgePanelRuntimeId.toLowerCase()
    if (t.includes(n)) return !0
    const a = e.getAttribute?.("script_id") || ""
    if (a === edgePanelRuntimeId) return !0
  } catch (e) {}
  return !1
}
function edgePanelScheduleAggressivePresenceCheck() {
  ;[120, 360, 900, 1800, 3200].forEach((e) => {
    edgePanelParentWin.setTimeout(() => {
      if (edgePanelRuntimeCleaned) return
      const t = edgePanelResolveCurrentFrame()
      ;(t && t.isConnected) || edgePanelRuntimeCleanup()
    }, e)
  })
}
function edgePanelAttachHostActionWatchers() {
  if (edgePanelHostActionObserver || !edgePanelParentDoc.body) return
  ;((edgePanelHostClickHandler = (e) => {
    const t = e.target
    if (!edgePanelIsElement(t) || edgePanelIsOwnedNode(t)) return
    const n = t.closest("button,input,label,.menu_button,.fa-trash,.fa-trash-can,.fa-xmark,.fa-ban")
    if (!n) return
    let a = n
    for (let e = 0; a && e < 5; e += 1, a = a.parentElement)
      if (edgePanelNodeMentionsScriptByText(a)) return void edgePanelScheduleAggressivePresenceCheck()
  }),
    edgePanelParentDoc.addEventListener("click", edgePanelHostClickHandler, !0),
    (edgePanelHostActionObserver = new MutationObserver((e) => {
      for (const t of e)
        if ("childList" === t.type)
          for (const e of t.removedNodes)
            if (edgePanelIsElement(e)) {
              if (edgePanelNodeMentionsScriptByText(e)) return void edgePanelRuntimeCleanup()
              if ("function" == typeof e.querySelector) {
                const t = [...e.querySelectorAll("*")].some((e) => edgePanelNodeMentionsScriptByText(e))
                if (t) return void edgePanelRuntimeCleanup()
              }
            }
    })),
    edgePanelHostActionObserver.observe(edgePanelParentDoc.body, { childList: !0, subtree: !0 }))
}
function tt() {
  const e = window.parent.document,
    t = e.querySelector("#sheld")
  if (t) return t
  const n = e.querySelector("#chat")
  if (n) return n
  const a = e.querySelector(".simplebar-content-wrapper")
  return a || null
}
function nt() {
  const e = window.parent.document,
    t = e.querySelector("#top-settings-holder")
  if (t) return t
  const n = e.querySelector(".top-settings-holder")
  return n || null
}
function at() {
  const e = window.parent.document,
    t = e.querySelector("#form_sheld")
  if (t) return t
  const n = e.querySelector("#send_form")
  return n || null
}
function edgePanelViewportBounds() {
  const e = edgePanelParentWin,
    t = e.visualViewport
  if (t && t.width && t.height) {
    const e = t.offsetLeft || 0,
      n = t.offsetTop || 0
    return { left: e, top: n, right: e + t.width, bottom: n + t.height, width: t.width, height: t.height }
  }
  return { left: 0, top: 0, right: e.innerWidth, bottom: e.innerHeight, width: e.innerWidth, height: e.innerHeight }
}
function edgePanelFocusedInputRect() {
  try {
    const e = edgePanelParentDoc.activeElement
    if (!e) return null
    const t = String(e.tagName || "").toLowerCase(),
      n = "textarea" === t || "input" === t || !!e.isContentEditable || !!e.closest?.('[contenteditable="true"]')
    if (!n || "function" != typeof e.getBoundingClientRect) return null
    const a = e.getBoundingClientRect()
    return a && a.height && a.width ? a : null
  } catch (e) {
    return null
  }
}
function edgePanelIsTextInputFocused() {
  return !!edgePanelFocusedInputRect()
}
function edgePanelKeyboardOpen() {
  try {
    return !!(settingsApi.isMobile.value && edgePanelIsTextInputFocused())
  } catch (e) {
    return !1
  }
}
function edgePanelClampPanelAnchor(e, t) {
  const n = edgePanelViewportBounds(),
    a = 8
  if ("top" === e) return Math.max(t, n.top + a)
  if ("bottom" === e) {
    const o = at()
    if (o) {
      const t = o.getBoundingClientRect()
      let i = t.top
      if (edgePanelKeyboardOpen()) {
        const l = edgePanelFocusedInputRect()
        if (l && l.top > n.top + 120 && l.top < n.bottom - a) {
          i = Math.min(i, l.top - a)
        }
      }
      return Math.max(n.top + 28, i)
    }
    if (edgePanelKeyboardOpen()) {
      let i = n.bottom - 96 - a,
        l = edgePanelFocusedInputRect()
      return (l && l.top > n.top + 120 && l.top < n.bottom - a && (i = Math.min(i, l.top - a)), Math.max(n.top + 28, i))
    }
    const e = n.bottom - a
    return Math.max(n.top + 28, Math.min(t, e))
  }
  return t
}
function edgePanelPx(e) {
  return `${Math.round(e)}px`
}
function edgePanelIsEdgeTabEvent(e) {
  const t = e?.target
  return !!(edgePanelIsElement(t) && edgePanelIsOwnedNode(t) && t.closest?.(".edge-tab,.panel-header"))
}
function edgePanelSchedulePositionRefresh(e) {
  ;[0, 80, 220, 480, 820, 1500, 2600, 4000].forEach((t) => edgePanelParentWin.setTimeout(() => ot(e, !0), t))
}
function edgePanelPreserveKeyboardToggle(e) {
  if (!settingsApi.isMobile.value || !edgePanelIsTextInputFocused() || !edgePanelIsEdgeTabEvent(e)) return
  const t = Date.now()
  ;(e.preventDefault?.(), e.stopPropagation?.())
  if (t < edgePanelKeyboardToggleGuardUntil) return
  ;((edgePanelKeyboardToggleGuardUntil = t + 450),
    Ne.togglePanel(),
    edgePanelSchedulePositionRefresh(Ne.setPanelLeftPosition))
}
function edgePanelSuppressGuardedClick(e) {
  Date.now() < edgePanelKeyboardToggleGuardUntil &&
    edgePanelIsEdgeTabEvent(e) &&
    (e.preventDefault?.(), e.stopPropagation?.())
}
function ot(e, t = !1) {
  const n = (function (e) {
    const t = tt(),
      n = nt(),
      a = at(),
      o = edgePanelViewportBounds()
    switch (e) {
      case "left":
        return edgePanelPx(o.left)
      case "right":
        return edgePanelPx(o.right)
      case "top":
        if (n) {
          const t = n.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, t.bottom))
        }
        if (t) {
          const n = t.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, n.top))
        }
        // 锚点未就绪：不提交视口兜底值（避免面板跳到顶部/底部边缘），等锚点出现后由定时刷新校正
        return null
      case "bottom":
        if (edgePanelKeyboardOpen()) return edgePanelPx(edgePanelClampPanelAnchor(e, o.bottom))
        if (a) {
          const t = a.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, t.top))
        }
        if (t) {
          const n = t.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, n.bottom))
        }
        // 锚点未就绪：不提交视口兜底值（避免面板跳到顶部/底部边缘），等锚点出现后由定时刷新校正
        return null
      default:
        if (t) {
          const e = t.getBoundingClientRect()
          return edgePanelPx(e.right)
        }
        return edgePanelPx(o.right)
    }
  })(settingsApi.effectivePosition.value)
  if (null !== n) {
    ;(t || et !== n) && ((et = n), e(n))
  }
}
let rt = null,
  it = null,
  lt = null,
  glt = null,
  st = null,
  mt = 0 // 全量兜底扫描的节流计数器（见 Ct() 中的用法）
const At = new Set(),
  ct = new Map(),
  pt = (function () {
    try {
      return getScriptId()
    } catch {
      return "集成控件"
    }
  })()
function dt(e) {
  Ne.registerPlugin(e)
}
function ut(e) {
  Ne.unregisterPlugin(e)
}
function gt(e, t) {
  if (e.hasAttribute("data-edge-panel-ignore")) return !1
  if (At.has(e)) return !1
  const n = Ne.extractFingerprint(e)
  if (n.scriptId === pt) return !1
  if (!Ne.isValidFingerprint(n)) return !1
  if (Ne.isFingerprintCaptured(n)) {
    const t = Ne.generateBallIdFromFingerprint(n)
    return (Ne.updateCapturedBallElement(t, e), At.add(e), !1)
  }
  At.add(e)
  const a = window.parent.getComputedStyle(e),
    o = a.display || "flex",
    r = Ne.generateBallIdFromFingerprint(n),
    s = {
      top: a.top,
      left: a.left,
      right: a.right,
      bottom: a.bottom,
      positionValue: a.position,
      opacityValue: a.opacity,
      visibilityValue: a.visibility,
      pointerEventsValue: a.pointerEvents,
    },
    A = e.style.cssText,
    c = {
      id: r,
      fingerprint: n,
      element: e,
      icon: getElementIcon(e),
      name: getElementName(e),
      originalPosition: s,
      originalDisplay: o,
      originalParent: e.parentElement,
      originalNextSibling: e.nextSibling,
      originalStyle: A,
      order: t?.order,
    }
  return (ct.set(e, r), Ne.addCapturedBall(c), removeReleased(n), !0)
}
// ==== 悬浮球识别参数（可按需微调，数值越严格越保守）====
const BALL_SIZE_MIN = 20,        // 悬浮球最小边长(px)
  BALL_SIZE_MAX = 120,           // 悬浮球最大边长(px)
  BALL_RATIO_MIN = 0.6,          // 最小宽高比（越接近1越接近正圆/正方）
  BALL_RATIO_MAX = 1.7,          // 最大宽高比
  BALL_SCORE_THRESHOLD = 4,      // 打分制通过阈值，命中信号总分需 >= 该值才自动捕获
  BALL_ZINDEX_MIN = 999          // 视为"高层级"的 z-index 下限

// 判断一个元素是否"很像"悬浮球：先用硬性条件排除明显不是的元素，
// 再用加权打分综合判断，避免任何单一弱信号（比如仅仅 cursor:pointer）就误判。
function isFloatingBallCandidate(e, ownScriptId) {
  const style = window.parent.getComputedStyle(e)

  // ---------- 第一层：硬性排除（命中任意一条直接淘汰） ----------
  if ("fixed" !== style.position && "absolute" !== style.position) return !1

  // 排除常见的弹层/菜单/下拉/提示/翻页控件（避免误补点开后弹出的子元素）
  const tokens =
    (e.id || "") + " " + String(e.className || "") + " " + (e.getAttribute("title") || "") + " " + (e.getAttribute("aria-label") || "")
  if (
    /(?:^|\s|_|-)(?:popover|popup|dropdown|dropdown-menu|drop-down|menu|tooltip|popper|listbox|context-menu|contextmenu|select-options|abs-panel|floating-panel-options|submenu|sub-menu|option-list|picker|preview-nav|prev|next|previous|carousel|slide|gallery-nav|img-nav|image-nav)(?:\s|_|-|$)/.test(
      tokens.toLowerCase(),
    ) ||
    /(上一张|下一张|上一页|下一页|上一首|下一首|previous|next)/.test(tokens.toLowerCase())
  )
    return !1

  if (e.hasAttribute("data-edge-panel-ignore")) return !1
  if ("none" === style.display || "hidden" === style.visibility || "0" === style.opacity) return !1
  if ((e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")) === ownScriptId) return !1
  if ("auto" === settingsApi.getCaptureMode() && isReleasedFingerprint(extractFingerprint(e))) return !1
  if (getContainer() && getContainer().contains(e)) return !1
  if (e.closest(".edge-panel-root,[data-edge-panel-owner]")) return !1

  const rect = e.getBoundingClientRect(),
    w = rect.width,
    h = rect.height
  if (w < BALL_SIZE_MIN || w > BALL_SIZE_MAX || h < BALL_SIZE_MIN || h > BALL_SIZE_MAX) return !1
  const ratio = w / h
  if (ratio < BALL_RATIO_MIN || ratio > BALL_RATIO_MAX) return !1

  // ---------- 第二层：加权打分（信号越多、越强，分数越高） ----------
  let score = 0

  // 其他脚本显式声明的挂件：来源明确，最强信号
  const hasScriptId =
    !!e.closest("[script_id]") &&
    (e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")) !== ownScriptId
  if (hasScriptId) score += 3

  // 定位方式：fixed 才是"悬浮"的典型特征，absolute 常见于普通布局，权重更低
  score += "fixed" === style.position ? 2 : 1

  // 圆形外观
  let isCircular = !1
  const radius = style.borderRadius || ""
  if (radius.includes("50%")) isCircular = !0
  else if (radius) {
    const nums = radius.split(" ").map((v) => parseFloat(v)).filter((v) => !isNaN(v))
    if (nums.length && Math.min(...nums) >= 0.3 * w) isCircular = !0
  }
  if (!isCircular) {
    const inner = e.querySelector('.ball-inner, [class*="ball"], [class*="circle"]')
    if (inner && window.parent.getComputedStyle(inner).borderRadius.includes("50%")) isCircular = !0
  }
  if (isCircular) score += 2

  // 高层级：悬浮球通常需要盖在其他内容之上
  const zIndex = parseInt(style.zIndex, 10)
  if (!isNaN(zIndex) && zIndex >= BALL_ZINDEX_MIN) score += 1

  // 交互样式提示
  if ("pointer" === style.cursor || "move" === style.cursor || "grab" === style.cursor) score += 1

  // 命名信号（class 中包含悬浮/拖拽相关关键词）
  const cls = String(e.className || "").toLowerCase()
  if (cls.includes("ball") || cls.includes("floating") || cls.includes("fab") || cls.includes("float")) score += 1
  if (e.classList.contains("ui-draggable")) score += 1

  // 图标而非大段文字
  const hasIcon = null !== e.querySelector("i, svg, img")
  const text = (e.textContent || "").trim()
  if (hasIcon && text.length <= 2) score += 1

  // ---------- 第三层：文本内容惩罚（正文较长基本不是悬浮球） ----------
  if (text.length > 4 && !hasScriptId) score -= 3
  if (hasIcon && text.length > 8) score -= 2

  // 与多个"同名兄弟"并列：常见于工具栏/导航条/固定菜单（一排图标按钮共用同一个 class），
  // 悬浮球一般是独立存在的单个元素，命中这种模式时降权，避免把整排按钮逐个当成球捕获
  if (!hasScriptId) {
    const parentEl = e.parentElement
    if (parentEl && cls) {
      let sameClassSiblingCount = 0
      for (const sib of parentEl.children)
        if (sib !== e && String(sib.className || "").toLowerCase() === cls) sameClassSiblingCount++
      if (sameClassSiblingCount >= 2) score -= 3
    }
  }

  // script_id 明确来源的挂件直接放行；其余按总分是否达到阈值判定
  return hasScriptId || score >= BALL_SCORE_THRESHOLD
}

/** 设置变化 → 联动自动扫描的启停（原 settingsApi.syncAutoScan） */
function syncAutoScan() {
  if ("auto" === settingsApi.getCaptureMode() && Ne.autoCaptureEnabled.value) {
    if (!lt) ft()
  } else if (lt) bt()
}
setCaptureModeChangeHandler(syncAutoScan)

function Ct(forceFullScan) {
  if (!Ne.autoCaptureEnabled.value) return
  const selectors = [
      "[script_id]",
      '[class*="ball"]',
      '[class*="floating"]',
      '[class*="float"]',
      '[class*="fab"]',
      '[class*="draggable"]',
      ".ui-draggable",
      '[style*="position: fixed"]',
      '[style*="position:fixed"]',
      '[style*="position: absolute"]',
      '[style*="position:absolute"]',
    ],
    candidates = new Set(),
    docs = [window.parent.document, ...collectIframeDocs()]
  for (const doc of docs)
    for (const sel of selectors)
      try {
        doc.querySelectorAll(sel).forEach((el) => candidates.add(el))
      } catch {}

  // 兜底全量扫描：只收集"计算样式为 fixed"的元素（覆盖靠 CSS class 而非行内样式实现悬浮
  // 定位的情况）。不收集 absolute 元素，因为 absolute 在普通布局中极其常见，纳入兜底扫描
  // 会显著增加误捕概率；已知的 absolute 悬浮球仍可被上面的选择器命中。
  // 这一步比较费性能，不必每次定时器触发（每 2 秒）都跑一次；但也不能只跑一次，否则页面
  // 加载完成之后才动态出现、且没有匹配到上面任何选择器的悬浮球会永远扫不到。
  // 这里用计数器把它节流到大约每 6 个 tick（配合 2 秒的定时器约等于 12 秒）跑一次。
  if (forceFullScan || mt <= 0) {
    docs.forEach((doc) => {
      try {
        let scanRoot
        try {
          scanRoot = doc.querySelectorAll("button:not(#chat, #chat *), div:not(#chat, #chat *), span:not(#chat, #chat *), a:not(#chat, #chat *)")
        } catch {
          scanRoot = doc.querySelectorAll("button, div, span, a")
        }
        scanRoot.forEach((el) => {
          try {
            if ("fixed" === window.parent.getComputedStyle(el).position) candidates.add(el)
          } catch {}
        })
      } catch {}
    })
    mt = 6
  } else mt--

  const passed = []
  candidates.forEach((el) => {
    if (!At.has(el) && isFloatingBallCandidate(el, pt)) passed.push(el)
  })
  // 同一条 DOM 包含链上可能同时命中多个候选（例如外层球容器 + 内部又是 absolute
  // 定位的图标包装层都各自达到了打分阈值）。这种情况下只保留"最外层"的一个再去
  // 捕获，避免同一个悬浮球被拆成两条记录（球容器一条、内部图标又单独一条）。
  const toCapture = passed.filter((el) => !passed.some((other) => other !== el && other.contains(el)))
  toCapture.forEach((el) => gt(el))
}
function ft() {
  Ne.autoCaptureEnabled.value &&
    "auto" === settingsApi.getCaptureMode() &&
    (mt = 0,
      (lt = setInterval(() => {
        ;(window.parent.document.hidden || document.hidden) || Ct()
      }, 2e3)),
      (glt = setTimeout(() => Ct(!0), 300)))
}
function bt() {
  glt && clearTimeout(glt)
  ;(lt && (clearInterval(lt), (lt = null)), (glt = null))
  mt = 0
}
function vt() {
  if (0 === pendingRestoreBalls.value.length) return
  beginRestoreBatch()
  const e = new Set(),
    t = (e) =>
      JSON.stringify({ scriptId: e.scriptId, elementId: e.elementId, classSelector: e.classSelector, title: e.title }),
    n = (n, a) => {
      const o = t(n.fingerprint)
      if (e.has(o)) return !0
      const i = { originalPosition: n.originalPosition, originalStyle: n.originalStyle, order: n.order }
      if (n.fingerprint.scriptId) {
        if (n.fingerprint.scriptId === pt) return (e.add(o), !0)
        const t = a.querySelectorAll(`[script_id="${n.fingerprint.scriptId}"]`)
        for (const n of t) {
          const t = n
          if (isFloatingBoxElement(t, !0) && gt(t, i)) return (e.add(o), !0)
        }
        return !1
      }
      if (n.fingerprint.elementId) {
        try {
          const t = a.getElementById(n.fingerprint.elementId)
          if (t) {
            if (isFloatingBoxElement(t, !0) && gt(t, i)) return (e.add(o), !0)
          }
        } catch {}
        return !1
      }
      let l = ""
      if (
        (n.fingerprint.classSelector && n.fingerprint.title
          ? (l = `${n.fingerprint.classSelector}[title="${n.fingerprint.title}"]`)
          : n.fingerprint.classSelector
            ? (l = n.fingerprint.classSelector)
            : n.fingerprint.title && (l = `[title="${n.fingerprint.title}"]`),
        l)
      )
        try {
          const t = a.querySelectorAll(l)
          for (const a of t) {
            const t = a
            if (isFloatingBoxElement(t, !0)) {
              const a = Ne.extractFingerprint(t)
              if (Ne.fingerprintsMatch(a, n.fingerprint) && gt(t, i)) return (e.add(o), !0)
            }
          }
        } catch {}
      return !1
    },
    a = (o) => {
      const docs = [window.parent.document, ...collectIframeDocs()],
        i = pendingRestoreBalls.value.filter((n) => !e.has(t(n.fingerprint)) && !isReleasedFingerprint(n.fingerprint))
      for (const e of i) for (const r of docs) if (n(e, r)) break
      if (pendingRestoreBalls.value.filter((n) => !e.has(t(n.fingerprint)) && !isReleasedFingerprint(n.fingerprint)).length > 0)
        if (o < 120) {
          const d = o <= 8 ? 400 : 1500
          setTimeout(() => a(o + 1), d)
        } else finishRestore(Ne.capturedBalls.value)
      else finishRestore(Ne.capturedBalls.value)
    }
  setTimeout(() => a(1), 500)
}
function ht() {
  ;(Ne.initPersistence(),
    settingsApi.initSettings(),
    edgePanelRemoveStaleArtifacts(),
    !edgePanelParentDoc.getElementById("edge-panel-viewport-fix") && (function () {
      var s = edgePanelParentDoc.createElement("style");
      s.id = "edge-panel-viewport-fix";
      s.textContent =
        "@media (min-width:769px){" +
        ".edge-panel-root--left{transform:translateY(-50%)!important;}" +
        ".edge-panel-root--right{transform:translateY(-50%)!important;}" +
        "}" +
        "@media (max-width:768px){" +
        ".edge-panel-root--left{left:0!important;transform:none!important;}" +
        ".edge-panel-root--right{left:auto!important;right:0!important;transform:none!important;}" +
        ".edge-tab--left{border-radius:0 12px 12px 0!important;}" +
        ".edge-tab--right{border-radius:12px 0 0 12px!important;}" +
        ".icon-panel--left{left:0!important;right:auto!important;border-radius:0 14px 14px 0!important;}" +
        ".icon-panel--right{right:0!important;left:auto!important;border-radius:14px 0 0 14px!important;}" +
        ".edge-tab{backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;}" +
        ".icon-panel{backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important;}" +
        ".plugin-icon{border-radius:10px!important;}" +
        ".action-icon{border-radius:8px!important;}" +
        ".panel-header:hover{background:transparent!important;}" +
        ".edge-tab-fade-leave-active{transition:none}" +
        ".edge-tab-fade-enter-active{transition:opacity .3s ease}" +
        ".edge-tab-fade-enter-from,.edge-tab-fade-leave-to{opacity:0}" +
        "}";
      (edgePanelParentDoc.head || edgePanelParentDoc.documentElement).appendChild(s);
    })(),
    (it = edgePanelMarkOwned(edgePanelParentDoc.createElement("div"))),
    it.setAttribute("script_id", edgePanelRuntimeId),
    edgePanelParentDoc.body.appendChild(it),
    (rt = (0, o.createApp)(Je)),
    rt.mount(it),
    (function () {
      if (edgePanelParentDoc.head.querySelector(`div[script_id="${edgePanelRuntimeId}"]`)) return
      ;((edgePanelStyleHost = edgePanelMarkOwned(edgePanelParentDoc.createElement("div"))),
        edgePanelStyleHost.setAttribute("script_id", edgePanelRuntimeId),
        document.querySelectorAll("head > style").forEach((t) => {
          edgePanelStyleHost.appendChild(t.cloneNode(!0))
        }),
        edgePanelParentDoc.head.appendChild(edgePanelStyleHost))
    })(),
    ft(),
    settingsApi.syncAutoScan(),
    st ||
      (st = setInterval(() => {
        Ne.cleanupInvalidBalls()
      }, 3e4)))
  const e = (function (e, t, n, a, o, i) {
      return (l) => {
        if (t.has(l) || l.hasAttribute("data-edge-panel-ignore")) return
        const s = extractFingerprint(l)
        if (s.scriptId === e) return
        if (!s.scriptId && !s.elementId) return
        const A = n(s)
        if (A) return void (isFloatingBoxElement(l) && (a(A.id, l), t.add(l)))
        const c = o(s)
        if (c && isFloatingBoxElement(l)) {
          const e = { originalPosition: c.originalPosition, originalStyle: c.originalStyle, order: c.order }
          i(l, e)
        }
      }
    })(pt, At, Ne.findCapturedBallByFingerprint, Ne.updateCapturedBallElement, findPendingRestoreBall, gt),
    t = (function (e, t, n, a) {
      return (o) => {
        if (e.has(o) || o.hasAttribute("data-edge-panel-ignore")) return
        const i = (function (e) {
          return e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id") || null
        })(o)
        if (i) return
        if (o.id) return
        const l = extractFingerprint(o)
        if (!t(l)) return
        const s = n(l)
        if (s && isFloatingBoxElement(o)) {
          const e = { originalPosition: s.originalPosition, originalStyle: s.originalStyle, order: s.order }
          a(o, e)
        }
      }
    })(At, Ne.isValidFingerprint, findPendingRestoreBall, gt)
  ;(!(function (e) {
    if (Qe) return
    const t = window.parent.document
    ;((Qe = new MutationObserver((t) => {
      for (const n of t)
        if ("childList" === n.type)
          for (const t of n.addedNodes)
            if (t.nodeType === Node.ELEMENT_NODE) {
              const n = t
              // 跳过聊天正文区域：AI 流式输出时这里的 DOM 变更极其频繁，而悬浮球从不会渲染
              // 在聊天消息内容里，提前排除可以避免每次打字机刷新都触发一整轮选择器扫描
              if (n.closest && n.closest("#chat, .mes_text, .swipe_block, blockquote, pre, code")) continue
              ;(e.checkAndCaptureNewFloatingBall(n),
                e.checkAndCaptureFloatingBallByClass(n),
                n.querySelectorAll("[script_id]").forEach((t) => {
                  e.checkAndCaptureNewFloatingBall(t)
                }),
                n.querySelectorAll("[id]").forEach((t) => {
                  e.checkAndCaptureNewFloatingBall(t)
                }))
              const a = [
                ".note-save-selection-ball",
                '[class*="floating"]',
                '[class*="float"]',
                '[class*="ball"]',
                '[class*="fab"]',
                '[class*="draggable"]',
                ".ui-draggable",
                '[style*="position: absolute"]',
                '[style*="position:absolute"]',
              ]
              for (const t of a)
                try {
                  n.querySelectorAll(t).forEach((t) => {
                    e.checkAndCaptureFloatingBallByClass(t)
                  })
                } catch {}
            }
    })),
      Qe.observe(t.body, { childList: !0, subtree: !0 }))
  })({ checkAndCaptureNewFloatingBall: e, checkAndCaptureFloatingBallByClass: t }),
    (function (e) {
      et = null
      const t = tt(),
        n = nt(),
        a = at()
      ;(ot(e, !0),
        (He = new ResizeObserver(() => {
          ot(e)
        })),
        t && He.observe(t),
        n && He.observe(n),
        a && He.observe(a),
        $(window.parent).on("resize.edgePanel", () => ot(e)))
      const o = window.parent.document
      let r = t,
        i = n,
        l = a
      ;((Ze = new MutationObserver(() => {
        const t = tt(),
          n = nt(),
          a = at()
        let o = !1
        ;(t !== r && ((r = t), t && He && He.observe(t), (o = !0)),
          n !== i && ((i = n), n && He && He.observe(n), (o = !0)),
          a !== l && ((l = a), a && He && He.observe(a), (o = !0)),
          o && ot(e, !0))
      })),
        Ze.observe(o.body, { childList: !0, subtree: !0 }))
    })(Ne.setPanelLeftPosition),
    (function (e) {
      const t = edgePanelParentWin.visualViewport
      if (t) {
        ;((edgePanelViewportResizeHandler = () => ot(e, !0)),
          (edgePanelViewportScrollHandler = () => ot(e, !0)),
          t.addEventListener("resize", edgePanelViewportResizeHandler, { passive: !0 }),
          t.addEventListener("scroll", edgePanelViewportScrollHandler, { passive: !0 }))
      }
      ;((edgePanelFocusHandler = () => edgePanelSchedulePositionRefresh(e)),
        edgePanelParentDoc.addEventListener("focusin", edgePanelFocusHandler, !0),
        edgePanelParentDoc.addEventListener("focusout", edgePanelFocusHandler, !0))
    })(Ne.setPanelLeftPosition),
    (function () {
      ;((edgePanelKeyboardPointerHandler = (e) => edgePanelPreserveKeyboardToggle(e)),
        (edgePanelKeyboardClickHandler = (e) => edgePanelSuppressGuardedClick(e)),
        edgePanelParentDoc.addEventListener("pointerdown", edgePanelKeyboardPointerHandler, {
          capture: !0,
          passive: !1,
        }),
        edgePanelParentDoc.addEventListener("touchstart", edgePanelKeyboardPointerHandler, {
          capture: !0,
          passive: !1,
        }),
        edgePanelParentDoc.addEventListener("mousedown", edgePanelKeyboardPointerHandler, { capture: !0, passive: !1 }),
        edgePanelParentDoc.addEventListener("click", edgePanelKeyboardClickHandler, !0))
    })(),
    (0, o.watch)(settingsApi.effectivePosition, () => {
      ot(Ne.setPanelLeftPosition, !0)
      try {
        window.setTimeout(() => {
          try {
            reorient()
          } catch (err) {}
        }, 40)
      } catch (err) {}
    }),
    vt(),
    Ne.onBallReleased((e, t, n) => {
      n && (At.delete(n), ct.delete(n))
    }),
    (0, o.watch)(Ne.isCaptureModeActive, (e, t) => {
      e && !t ? beginCapturePick(pt, gt, () => Ne.exitCaptureMode()) : !e && t && endCapturePick()
    }))
  const n = () => {
      if (edgePanelRuntimeCleaned) return
      ;((edgePanelRuntimeCleaned = !0),
        bt(),
        endCapturePick(),
        Qe && (Qe.disconnect(), (Qe = null)),
        He && (He.disconnect(), (He = null)),
        Ze && (Ze.disconnect(), (Ze = null)),
        edgePanelFrameObserver && (edgePanelFrameObserver.disconnect(), (edgePanelFrameObserver = null)),
        edgePanelArtifactMonitor &&
          (edgePanelParentWin.clearInterval(edgePanelArtifactMonitor), (edgePanelArtifactMonitor = null)),
        edgePanelHostActionObserver && (edgePanelHostActionObserver.disconnect(), (edgePanelHostActionObserver = null)),
        edgePanelHostClickHandler &&
          (edgePanelParentDoc.removeEventListener("click", edgePanelHostClickHandler, !0),
          (edgePanelHostClickHandler = null)),
        $(window).off(".edgePanelLifecycle"),
        $(window.parent).off(".edgePanelLifecycle"),
        $(window.parent).off("resize.edgePanel"))
      const e = edgePanelParentWin.visualViewport
      ;(e && edgePanelViewportResizeHandler && e.removeEventListener("resize", edgePanelViewportResizeHandler),
        e && edgePanelViewportScrollHandler && e.removeEventListener("scroll", edgePanelViewportScrollHandler),
        edgePanelFocusHandler &&
          (edgePanelParentDoc.removeEventListener("focusin", edgePanelFocusHandler, !0),
          edgePanelParentDoc.removeEventListener("focusout", edgePanelFocusHandler, !0)),
        edgePanelKeyboardPointerHandler &&
          (edgePanelParentDoc.removeEventListener("pointerdown", edgePanelKeyboardPointerHandler, !0),
          edgePanelParentDoc.removeEventListener("touchstart", edgePanelKeyboardPointerHandler, !0),
          edgePanelParentDoc.removeEventListener("mousedown", edgePanelKeyboardPointerHandler, !0)),
        edgePanelKeyboardClickHandler &&
          edgePanelParentDoc.removeEventListener("click", edgePanelKeyboardClickHandler, !0),
        (edgePanelViewportResizeHandler = null),
        (edgePanelViewportScrollHandler = null),
        (edgePanelFocusHandler = null),
        (edgePanelKeyboardPointerHandler = null),
        (edgePanelKeyboardClickHandler = null),
        (edgePanelKeyboardToggleGuardUntil = 0),
        (et = null),
        st && (clearInterval(st), (st = null)),
        Ne.releaseAllBallsWithoutSaving(),
        At.clear(),
        ct.clear(),
        rt && (rt.unmount(), (rt = null)),
        edgePanelRemoveOwnedArtifacts(),
        edgePanelClearRuntimeRegistration())
    },
    edgePanelCleanupSettings = () => {
      settingsApi.cleanup()
    },
    edgePanelRuntimeCleanup = () => {
      ;(n(), edgePanelCleanupSettings())
    }
  ;(edgePanelRegisterRuntime(edgePanelRuntimeCleanup),
    edgePanelAttachFrameDetachWatcher(edgePanelRuntimeCleanup),
    edgePanelAttachHostActionWatchers(),
    edgePanelStartArtifactMonitor(() => {
      ot(Ne.setPanelLeftPosition, !0)
    }),
    edgePanelSchedulePositionRefresh(Ne.setPanelLeftPosition),
    $(window).on("unload.edgePanelLifecycle", edgePanelRuntimeCleanup),
    $(window.parent).on("pagehide.edgePanelLifecycle", edgePanelRuntimeCleanup),
    $(window.parent).on("beforeunload.edgePanelLifecycle", edgePanelRuntimeCleanup))
}
$(() => {
  try {
    ht()
  } catch (e) {
    console.error("[集成控件] 启动失败:", e)
  }
})
;(function () {
  try {
    const PW = window.parent,
      PD = PW && PW.document
    if (!PD) return
    const BTN_ID = "fb-storage-input-entry"
    if (PW.__fbInputEntryInstalled && PD.getElementById(BTN_ID)) return
    PW.__fbInputEntryInstalled = true
    PW.__fbInputEntryCleaned = false

    const STATIC_ID = "fb-storage-input-entry-static"
    const DYN_ID = "fb-storage-input-entry-dyn"
    const POP_ID = "fb-storage-mode-popover"
    const LS_KEY = "fbStorageEntryMode"

    function getMode() {
      try {
        let m = PW.localStorage.getItem(LS_KEY)
        if (m === "both") m = "edge"
        return m === "edge" || m === "input" || m === "longpress" ? m : "edge"
      } catch (e) {
        return "edge"
      }
    }
    function setMode(m) {
      try {
        PW.localStorage.setItem(LS_KEY, m)
      } catch (e) {}
      applyMode()
    }

    function ensureStaticStyle() {
      if (PD.getElementById(STATIC_ID)) return
      let s = PD.createElement("style")
      s.id = STATIC_ID
      s.textContent =
        "#" +
        BTN_ID +
        "{display:flex;align-items:center;justify-content:center;" +
        "align-self:center;cursor:pointer;opacity:.65;padding:0 6px;min-width:22px;" +
        "box-sizing:border-box;transition:opacity .2s ease;" +
        "-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;" +
        "-webkit-user-select:none;-moz-user-select:none;user-select:none;" +
        "touch-action:manipulation;}" +
        "#" +
        BTN_ID +
        ":hover{opacity:1;}" +
        "#" +
        BTN_ID +
        " i{font-size:1.05em;line-height:1;pointer-events:none;}" +
        "#form_sheld:has(#send_textarea:focus) #" +
        BTN_ID +
        "{display:none !important}"
      ;(PD.head || PD.documentElement).appendChild(s)
    }
    function ensureDynStyle() {
      let s = PD.getElementById(DYN_ID)
      if (!s) {
        s = PD.createElement("style")
        s.id = DYN_ID
        ;(PD.head || PD.documentElement).appendChild(s)
      }
      return s
    }

    function applyMode() {
      let m = getMode()
      ensureDynStyle().textContent =
        m === "input" || m === "longpress" ? ".edge-panel-root .edge-tab{display:none!important;}" : ""
      let btn = PD.getElementById(BTN_ID)
      if (btn) btn.style.display = m === "edge" || m === "longpress" ? "none" : "flex"
    }

    const NOSEL_ID = "fb-storage-nosel"
    let noselTimer = null
    function suppressSelection() {
      try {
        let sel = PW.getSelection && PW.getSelection()
        if (sel && sel.removeAllRanges) sel.removeAllRanges()
      } catch (e) {}
      try {
        let s = PD.getElementById(NOSEL_ID)
        if (!s) {
          s = PD.createElement("style")
          s.id = NOSEL_ID
          s.textContent =
            "html.fb-nosel,html.fb-nosel *{-webkit-user-select:none!important;" +
            "user-select:none!important;-webkit-touch-callout:none!important;}"
          ;(PD.head || PD.documentElement).appendChild(s)
        }
        let de = PD.documentElement
        de.classList.add("fb-nosel")
        if (noselTimer) PW.clearTimeout(noselTimer)
        noselTimer = PW.setTimeout(function () {
          de.classList.remove("fb-nosel")
        }, 700)
      } catch (e) {}
    }

    function clickEl(el) {
      if (!el) return
      try {
        el.dispatchEvent(new PW.MouseEvent("click", { bubbles: true, cancelable: true, view: PW }))
      } catch (e) {
        try {
          el.click()
        } catch (_) {}
      }
    }
    function togglePanel() {
      let root = PD.querySelector(".edge-panel-root")
      if (!root) return
      let icon = root.querySelector(".icon-panel")
      let hidden = !icon || PW.getComputedStyle(icon).display === "none"
      if (hidden) clickEl(root.querySelector(".edge-tab"))
      else clickEl(root.querySelector(".panel-header"))
    }

    function closePopover() {
      let pop = PD.getElementById(POP_ID)
      if (pop && pop.parentNode) pop.parentNode.removeChild(pop)
      PD.removeEventListener("click", onDocClick, true)
    }
    function onDocClick(e) {
      let pop = PD.getElementById(POP_ID),
        btn = PD.getElementById(BTN_ID)
      if (!pop) return
      if (pop.contains(e.target)) return
      if (btn && btn.contains(e.target)) return
      closePopover()
    }
    function openPopover(anchorEl) {
      closePopover()
      let cur = getMode()
      let items = [
        ["input", "输入框按钮"],
        ["edge", "边缘拉手"],
        ["longpress", "长按空白处"],
      ]
      let pop = PD.createElement("div")
      pop.id = POP_ID
      pop.style.cssText =
        "position:fixed;z-index:100000;min-width:172px;padding:6px;" +
        "background:rgba(28,28,32,.96);color:#eee;border:1px solid rgba(255,255,255,.12);" +
        "border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.45);" +
        "font-size:13px;line-height:1.4;backdrop-filter:blur(12px);" +
        "-webkit-backdrop-filter:blur(12px);-webkit-user-select:none;user-select:none;"
      let title = PD.createElement("div")
      title.textContent = "入口显示模式"
      title.style.cssText = "padding:4px 8px 6px;opacity:.6;font-size:12px;"
      pop.appendChild(title)
      items.forEach(function (it) {
        let opt = PD.createElement("div")
        opt.textContent = (it[0] === cur ? "● " : "○ ") + it[1]
        opt.style.cssText =
          "padding:7px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;" +
          (it[0] === cur ? "background:rgba(255,255,255,.10);" : "")
        opt.addEventListener("mouseenter", function () {
          opt.style.background = "rgba(255,255,255,.14)"
        })
        opt.addEventListener("mouseleave", function () {
          opt.style.background = it[0] === getMode() ? "rgba(255,255,255,.10)" : "transparent"
        })

        opt.addEventListener(
          "touchstart",
          function (ev) {
            ev.preventDefault()
            ev.stopPropagation()
          },
          { passive: false },
        )
        opt.addEventListener(
          "touchend",
          function (ev) {
            ev.preventDefault()
            ev.stopPropagation()
            setMode(it[0])
            closePopover()
          },
          { passive: false },
        )
        opt.addEventListener("click", function (ev) {
          ev.preventDefault()
          ev.stopPropagation()
          setMode(it[0])
          closePopover()
        })
        pop.appendChild(opt)
      })
      PD.body.appendChild(pop)

      let r = anchorEl.getBoundingClientRect()
      let ph = pop.offsetHeight,
        pwd = pop.offsetWidth
      let vw = PW.innerWidth,
        vh = PW.innerHeight
      let top = r.top - ph - 8
      if (top < 8) top = Math.min(r.bottom + 8, vh - ph - 8)
      let left = r.left + r.width / 2 - pwd / 2
      if (left + pwd > vw - 8) left = vw - pwd - 8
      if (left < 8) left = 8
      pop.style.top = top + "px"
      pop.style.left = left + "px"
      setTimeout(function () {
        PD.addEventListener("click", onDocClick, true)
      }, 0)
    }

    function bindButton(btn) {
      let longTimer = null,
        longFired = false,
        touchHandled = false
      let sx = 0,
        sy = 0,
        moved = false

      function startLong() {
        clearLong()
        longFired = false
        longTimer = PW.setTimeout(function () {
          longFired = true
          suppressSelection()
          openPopover(btn)
        }, 450)
      }
      function clearLong() {
        if (longTimer) {
          PW.clearTimeout(longTimer)
          longTimer = null
        }
      }

      btn.addEventListener(
        "touchstart",
        function (e) {
          e.preventDefault()
          if (e.touches && e.touches[0]) {
            sx = e.touches[0].clientX
            sy = e.touches[0].clientY
          }
          moved = false
          startLong()
        },
        { passive: false },
      )
      btn.addEventListener(
        "touchmove",
        function (e) {
          if (e.touches && e.touches[0]) {
            if (Math.abs(e.touches[0].clientX - sx) > 10 || Math.abs(e.touches[0].clientY - sy) > 10) {
              moved = true
              clearLong()
            }
          }
        },
        { passive: true },
      )
      btn.addEventListener(
        "touchend",
        function (e) {
          e.preventDefault()
          clearLong()
          touchHandled = true
          PW.setTimeout(function () {
            touchHandled = false
          }, 400)
          if (longFired) {
            longFired = false
            return
          }
          if (!moved) togglePanel()
        },
        { passive: false },
      )
      btn.addEventListener("touchcancel", function () {
        clearLong()
        moved = true
      })

      btn.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return
        e.preventDefault()
        startLong()
      })
      btn.addEventListener("mouseup", clearLong)
      btn.addEventListener("mouseleave", clearLong)
      btn.addEventListener("click", function (e) {
        if (touchHandled) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        if (longFired) {
          e.preventDefault()
          e.stopPropagation()
          longFired = false
          return
        }
        togglePanel()
      })
      btn.addEventListener("contextmenu", function (e) {
        e.preventDefault()
        openPopover(btn)
      })
    }
      window.openPosMenu = function(anchorEl, curPos) {
      closePosMenu()
      const items = [
        ["left", "左侧"],
        ["right", "右侧"],
        ["top", "顶部"],
        ["bottom", "底部"],
      ]
      let pop = PD.createElement("div")
      pop.id = "fb-storage-pos-popover"
      pop.style.cssText = "position:fixed;z-index:100001;padding:8px 10px;border-radius:10px;font-size:13px;line-height:1.4;-webkit-user-select:none;user-select:none;"
      let ref = (PD.querySelector(".edge-panel-root .icon-panel") || PD.querySelector(".edge-panel-root .settings-panel"))
      if (ref) {
        let cs = PW.getComputedStyle(ref)
        let a = ["background", "backdrop-filter", "-webkit-backdrop-filter", "border", "box-shadow", "color"]
        for (let k = 0; k < a.length; k++) {
          try { let v = cs.getPropertyValue(a[k]); if (v && v !== "none") pop.style[a[k]] = v } catch (e) {}
        }
      }
      if (!pop.style.background) pop.style.background = "rgba(28,28,32,.9)"

      items.forEach(function (it) {
        let opt = PD.createElement("div")
        opt.textContent = (it[0] === curPos ? "● " : "○ ") + it[1]
        opt.style.cssText = "padding:7px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;" + (it[0] === curPos ? "background:rgba(255,255,255,.10);" : "")
        opt.addEventListener("touchstart", function (ev) { ev.preventDefault(); ev.stopPropagation() }, { passive: false })
        opt.addEventListener("touchend", function (ev) { ev.preventDefault(); ev.stopPropagation(); try { settingsApi.setPanelPosition(it[0]) } catch (e) {}; closePosMenu() }, { passive: false })
        opt.addEventListener("mousedown", function (ev) { ev.preventDefault(); ev.stopPropagation() })
        opt.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); try { settingsApi.setPanelPosition(it[0]) } catch (e) {}; closePosMenu() })
        opt.addEventListener("mouseenter", function () { opt.style.background = "rgba(255,255,255,.14)" })
        opt.addEventListener("mouseleave", function () { opt.style.background = it[0] === curPos ? "rgba(255,255,255,.10)" : "transparent" })
        pop.appendChild(opt)
      })
      PD.body.appendChild(pop)
      let r = anchorEl.getBoundingClientRect()
      let pw = pop.offsetWidth, ph = pop.offsetHeight
      let vw = PW.innerWidth, vh = PW.innerHeight
      // 参考 二级容器(设置面板) 与主面板的间距大小
      let base = PD.querySelector(".edge-panel-root .settings-panel") || PD.querySelector(".edge-panel-root .icon-panel")
      let br = base ? base.getBoundingClientRect() : r
      let GAP = 6
      let top, left
      if (curPos === "top") { top = br.bottom + GAP; left = r.left + r.width / 2 - pw / 2 }
      else if (curPos === "bottom") { top = br.top - ph - GAP; left = r.left + r.width / 2 - pw / 2 }
      else if (curPos === "left") { left = br.right + GAP; top = r.top + r.height / 2 - ph / 2 }
      else { left = br.left - pw - GAP; top = r.top + r.height / 2 - ph / 2 }
      if (top < 8) top = Math.min(br.bottom + 8, vh - ph - 8)
      if (left < 8) left = 8
      if (left + pw > vw - 8) left = vw - pw - 8
      pop.style.top = top + "px"
      pop.style.left = left + "px"
      setTimeout(function () { PD.addEventListener("click", posMenuDocClick, true) }, 0)
    }
    function closePosMenu() {
      let pop = PD.getElementById("fb-storage-pos-popover")
      if (pop && pop.parentNode) pop.parentNode.removeChild(pop)
      PD.removeEventListener("click", posMenuDocClick, true)
    }
    function posMenuDocClick(e) {
      let pop = PD.getElementById("fb-storage-pos-popover")
      if (!pop) return
      if (pop.contains(e.target)) return
      let btn = e.target.closest && (e.target.closest('.settings-option[title="位置"]') || e.target.closest(".fa-flag"))
      if (btn) return
      closePosMenu()
    }

    window.openEntryMenu = function(anchorEl) {
      closeEntryMenu()
      const cur = getMode()
      const items = [
        ["edge", "边缘拉手"],
        ["input", "输入框按钮"],
        ["longpress", "长按空白处"],
      ]
      let pop = PD.createElement("div")
      pop.id = "fb-storage-entry-popover"
      pop.style.cssText = "position:fixed;z-index:100001;padding:8px 10px;border-radius:10px;font-size:13px;line-height:1.4;-webkit-user-select:none;user-select:none;"
      let ref = PD.querySelector(".edge-panel-root .icon-panel") || PD.querySelector(".edge-panel-root .settings-panel")
      if (ref) {
        let cs = PW.getComputedStyle(ref)
        let a = ["background", "backdrop-filter", "-webkit-backdrop-filter", "border", "box-shadow", "color"]
        for (let k = 0; k < a.length; k++) {
          try { let v = cs.getPropertyValue(a[k]); if (v && v !== "none") pop.style[a[k]] = v } catch (e) {}
        }
      }
      if (!pop.style.background) pop.style.background = "rgba(28,28,32,.9)"
      items.forEach(function (it) {
        let opt = PD.createElement("div")
        opt.textContent = (it[0] === cur ? "● " : "○ ") + it[1]
        opt.style.cssText = "padding:7px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;" + (it[0] === cur ? "background:rgba(255,255,255,.10);" : "")
        opt.addEventListener("touchstart", function (ev) { ev.preventDefault(); ev.stopPropagation() }, { passive: false })
        opt.addEventListener("touchend", function (ev) { ev.preventDefault(); ev.stopPropagation(); setMode(it[0]); closeEntryMenu() }, { passive: false })
        opt.addEventListener("mousedown", function (ev) { ev.preventDefault(); ev.stopPropagation() })
        opt.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); setMode(it[0]); closeEntryMenu() })
        opt.addEventListener("mouseenter", function () { opt.style.background = "rgba(255,255,255,.14)" })
        opt.addEventListener("mouseleave", function () { opt.style.background = getMode() === it[0] ? "rgba(255,255,255,.10)" : "transparent" })
        pop.appendChild(opt)
      })
      PD.body.appendChild(pop)
      let r = anchorEl.getBoundingClientRect()
      let pw = pop.offsetWidth, ph = pop.offsetHeight
      let vw = PW.innerWidth, vh = PW.innerHeight
      let base = PD.querySelector(".edge-panel-root .settings-panel") || PD.querySelector(".edge-panel-root .icon-panel")
      let br = base ? base.getBoundingClientRect() : r
      let rootEl = PD.querySelector(".edge-panel-root")
      let curPos = "top"
      if (rootEl) {
        if (rootEl.classList.contains("edge-panel-root--bottom")) curPos = "bottom"
        else if (rootEl.classList.contains("edge-panel-root--left")) curPos = "left"
        else if (rootEl.classList.contains("edge-panel-root--right")) curPos = "right"
        else curPos = "top"
      }
      let top, left
      if (curPos === "top") { top = br.bottom + 6; left = r.left + r.width / 2 - pw / 2 }
      else if (curPos === "bottom") { top = br.top - ph - 6; left = r.left + r.width / 2 - pw / 2 }
      else if (curPos === "left") { left = br.right + 6; top = r.top + r.height / 2 - ph / 2 }
      else { left = br.left - pw - 6; top = r.top + r.height / 2 - ph / 2 }
      if (top < 8) top = Math.min(br.bottom + 8, vh - ph - 8)
      if (left < 8) left = 8
      if (left + pw > vw - 8) left = vw - pw - 8
      pop.style.top = top + "px"
      pop.style.left = left + "px"
      setTimeout(function () { PD.addEventListener("click", entryMenuDocClick, true) }, 0)
    }
    function closeEntryMenu() {
      let pop = PD.getElementById("fb-storage-entry-popover")
      if (pop && pop.parentNode) pop.parentNode.removeChild(pop)
      PD.removeEventListener("click", entryMenuDocClick, true)
    }
    function entryMenuDocClick(e) {
      let pop = PD.getElementById("fb-storage-entry-popover")
      if (!pop) return
      if (pop.contains(e.target)) return
      let btn = e.target.closest && (e.target.closest('.settings-option[title="入口"]') || e.target.closest(".fa-list-check"))
      if (btn) return
      closeEntryMenu()
    }


    // ===== 长按空白处 开/关 (longpress 模式) =====
    let lpTimer = null, lpStartX = 0, lpStartY = 0, lpActive = false
    function isBlankLongPressArea(el) {
      if (!el) return false
      try {
        if (el.closest("input,textarea,select,[contenteditable='true'],[contenteditable]")) return false
        if (el.closest(".edge-panel-root,[data-edge-ball-id]")) return false
        if (el.closest(".mes_text,blockquote,pre,code,textarea,.swipe_block")) return false
      } catch (e) {}
      // 有活动文本选区 -> 视为复制手势，放行
      try { let sel = PW.getSelection && PW.getSelection(); if (sel && !sel.isCollapsed) return false } catch (e) {}
      return true
    }
    function lpStart(e) {
      // 桌面鼠标左键长按才走 timer；触屏靠 contextmenu 触发（避免双触发）；右键仅走 contextmenu
      if (getMode() !== "longpress") return
      if (e.type === "touchstart") return
      if (e.button !== 0) return
      if (!isBlankLongPressArea(e.target)) return
      lpActive = true; lpStartX = e.clientX; lpStartY = e.clientY
      if (lpTimer) PW.clearTimeout(lpTimer)
      lpTimer = PW.setTimeout(function () {
        if (lpActive && getMode() === "longpress") togglePanel()
        lpActive = false
      }, 600)
    }
    function lpMove(e) {
      if (!lpActive) return
      let t = e.touches && e.touches[0] ? e.touches[0] : e
      if (Math.abs(t.clientX - lpStartX) > 10 || Math.abs(t.clientY - lpStartY) > 10) {
        lpActive = false
        if (lpTimer) { PW.clearTimeout(lpTimer); lpTimer = null }
      }
    }
    function lpCancel() { lpActive = false; if (lpTimer) { PW.clearTimeout(lpTimer); lpTimer = null } }
    function lpHandler(e) {
      if (getMode() !== "longpress") return
      let target = e.target
      if (!isBlankLongPressArea(target)) return
      e.preventDefault()
      e.stopPropagation()
      togglePanel()
    }
    // 绑定
    PD.addEventListener("touchstart", lpStart, { passive: true })
    PD.addEventListener("touchmove", lpMove, { passive: true })
    PD.addEventListener("touchend", lpCancel)
    PD.addEventListener("touchcancel", lpCancel)
    PD.addEventListener("mousedown", lpStart, true)
    PD.addEventListener("mouseup", lpCancel, true)
    PD.addEventListener("mousemove", lpMove, true)
    PD.addEventListener("contextmenu", lpHandler, true)

function bindEdgeTabMenu() {
      let root = PD.querySelector(".edge-panel-root")
      if (!root || root.__fbMenuBound) return
      root.__fbMenuBound = true
      let lt = null,
        lf = false
      let mlt = null,
        mlf = false
      function isTab(t) {
        return t && t.closest && t.closest(".edge-tab")
      }

      root.addEventListener(
        "contextmenu",
        function (e) {
          let tab = isTab(e.target)
          if (!tab) return
          e.preventDefault()
          e.stopPropagation()
          openPopover(tab)
        },
        true,
      )

      root.addEventListener(
        "mousedown",
        function (e) {
          if (e.button !== 0) return
          let tab = isTab(e.target)
          if (!tab) return
          mlf = false
          mlt = PW.setTimeout(function () {
            mlf = true
            suppressSelection()
            openPopover(tab)
          }, 500)
        },
        true,
      )
      root.addEventListener(
        "mouseup",
        function () {
          if (mlt) {
            PW.clearTimeout(mlt)
            mlt = null
          }
        },
        true,
      )
      root.addEventListener(
        "mouseleave",
        function () {
          if (mlt) {
            PW.clearTimeout(mlt)
            mlt = null
          }
        },
        true,
      )

      root.addEventListener(
        "click",
        function (e) {
          if (mlf && isTab(e.target)) {
            e.preventDefault()
            e.stopPropagation()
            mlf = false
          }
        },
        true,
      )

      root.addEventListener(
        "touchstart",
        function (e) {
          let tab = isTab(e.target)
          if (!tab) return
          lf = false
          lt = PW.setTimeout(function () {
            lf = true
            suppressSelection()
            openPopover(tab)
          }, 500)
        },
        { passive: true, capture: true },
      )
      root.addEventListener(
        "touchend",
        function (e) {
          if (lt) {
            PW.clearTimeout(lt)
            lt = null
          }
          if (lf) {
            e.preventDefault()
            e.stopPropagation()
            lf = false
          }
        },
        { passive: false, capture: true },
      )
      root.addEventListener("touchcancel", function () {
        if (lt) {
          PW.clearTimeout(lt)
          lt = null
        }
        lf = false
      })
    }

    function findAnchor() {
      return (
        PD.querySelector("#rightSendForm") ||
        PD.querySelector("#leftSendForm") ||
        PD.querySelector("#send_form") ||
        PD.querySelector("#form_sheld")
      )
    }
    function mount() {
      bindEdgeTabMenu()
      let anchor = findAnchor()
      if (!anchor) return false
      ensureStaticStyle()
      if (PD.getElementById(BTN_ID)) {
        applyMode()
        return true
      }
      let btn = PD.createElement("div")
      btn.id = BTN_ID
      btn.title = "悬浮球收纳：点击开/关面板，长按或右键切换入口"
      let ic = PD.createElement("i")
      ic.className = "fa-solid fa-circle-notch"
      btn.appendChild(ic)
      bindButton(btn)
      anchor.appendChild(btn)
      applyMode()
      return true
    }

    let mountAttempts = 0
    const MAX_ATTEMPTS = 20

    function tryMountUntilSuccess() {
      if (PW.__fbInputEntryCleaned || mountAttempts >= MAX_ATTEMPTS) return
      mountAttempts++
      bindEdgeTabMenu()
      if (!PD.getElementById(BTN_ID)) {
        try {
          if (mount()) return
        } catch (e) {}
        PW.setTimeout(tryMountUntilSuccess, 300 * Math.min(mountAttempts, 5))
      }
    }

    const mountObserver = new MutationObserver(() => {
      if (PW.__fbInputEntryCleaned) {
        mountObserver.disconnect()
        return
      }
      if (!PD.getElementById(BTN_ID)) {
        mountAttempts = 0
        tryMountUntilSuccess()
      } else {
        applyMode()
      }
    })
    mountObserver.observe(PD.body, { childList: true, subtree: true })

    function cleanup() {
      PW.__fbInputEntryCleaned = true
      PW.__fbInputEntryInstalled = false
      try {
        mountObserver.disconnect()
      } catch (e) {}
      try {
        PD.removeEventListener("touchstart", lpStart, { passive: true })
        PD.removeEventListener("touchmove", lpMove, { passive: true })
        PD.removeEventListener("touchend", lpCancel)
        PD.removeEventListener("touchcancel", lpCancel)
        PD.removeEventListener("mousedown", lpStart, true)
        PD.removeEventListener("mouseup", lpCancel, true)
        PD.removeEventListener("mousemove", lpMove, true)
        PD.removeEventListener("contextmenu", lpHandler, true)
      } catch (e) {}
      closePopover()
      const b = PD.getElementById(BTN_ID)
      if (b && b.parentNode) b.parentNode.removeChild(b)
    }

    try {
      mount()
    } catch (e) {}
    if (typeof $ === "function") {
      $(function () {
        try {
          mount()
        } catch (e) {}
      })
      $(PW).on("pagehide.fbInputEntry", cleanup)
      $(PW).on("beforeunload.fbInputEntry", cleanup)
    }
  } catch (e) {
    try {
      console.error("[输入框入口] 启动失败:", e)
    } catch (_) {}
  }
})()

export {
  gt as captureElement,
  Ne as pluginStore,
  dt as registerPlugin,
  Ct as scanFloatingBalls,
  ft as startBallScanning,
  bt as stopBallScanning,
  ut as unregisterPlugin,
}
