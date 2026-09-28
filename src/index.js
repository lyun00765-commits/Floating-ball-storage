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
import { themeApi } from "./theme.js"
import { parentWin, parentDoc, runtimeId, runtimeOwner, runtimeKeys, currentFrameName } from "./runtime-identity.js"
import {
  markOwnedNode,
  removeOwnedArtifacts,
  removeStaleArtifacts,
  registerRuntime,
  clearRuntimeRegistration,
  watchFrameDetachment,
  startArtifactMonitor,
  isElement,
  isOwnedNode,
  attachHostActionWatchers,
  setOwnershipDeps,
  isRuntimeCleaned,
  markRuntimeCleaned,
  teardownOwnershipRuntime,
} from "./runtime-ownership.js"
import {
  tryCaptureBall,
  scanOnce,
  startAutoScan,
  stopAutoScan,
  restorePendingBalls,
  syncAutoScan,
  setScanDeps,
  forgetCapturedElement,
  clearCapturedElements,
  registerPlugin,
  unregisterPlugin,
  hasCapturedElement,
  capturedElementEntries,
  getScanScriptId,
} from "./capture/scanner.js"
import { panelComponent, setViewDeps } from "./panel/view.js"
injectStyles()
import {
  setupVisualViewportGuards,
  setupKeyboardGuards,
  teardownViewportGuards,
  setViewportGuardDeps,
} from "./panel/viewport-guards.js"
import {
  updatePanelPosition,
  resetPositionMemory,
  resolveAnchorBottom,
  resolveInputAnchor,
  resolveSidebarAnchor,
  schedulePositionRefresh,
  isTextInputFocused,
} from "./panel/geometry.js"
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
        ;(a.removeAttribute("data-edge-panel-ignore"), tryCaptureBall(a, { order: r }))
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
              ;(a.removeAttribute("data-edge-panel-ignore"), tryCaptureBall(a, { order: r }))
            }, 120))
      }, 250)
      setTimeout(() => clearInterval(n), 15000)
      setTimeout(() => {
        const cleanup = () => {
          ;(a.removeEventListener("click", cleanup, !0),
            a.removeEventListener("touchend", cleanup, !0),
            setTimeout(() => {
              if (!a.isConnected || ue.value[ballId]) return
              ;(a.removeAttribute("data-edge-panel-ignore"), tryCaptureBall(a, { order: r }))
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
    for (const [t, n] of capturedElementEntries()) {
      ;(t.isConnected && ue.value[n]) || forgetCapturedElement(t)
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


let Qe = null
let He = null
let Ze = null
let edgePanelStyleHost = null
let rt = null,
  it = null,
  st = null
function ht() {
  setOwnershipDeps({
    styleHost: edgePanelStyleHost,
    mountHost: it,
    requestCleanup: () => edgePanelRuntimeCleanup(),
  })
  setViewportGuardDeps({
    togglePanel: () => Ne.togglePanel(),
    getPanelPositionTarget: () => Ne.setPanelLeftPosition,
  })
  setScanDeps({ store: Ne })
  setViewDeps({
    store: Ne,
    triggerScan: (force) => scanOnce(force),
  })


  ;(Ne.initPersistence(),
    settingsApi.initSettings(),
    removeStaleArtifacts(),
    !parentDoc.getElementById("edge-panel-viewport-fix") && (function () {
      var s = parentDoc.createElement("style");
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
      (parentDoc.head || parentDoc.documentElement).appendChild(s);
    })(),
    (it = markOwnedNode(parentDoc.createElement("div"))),
    it.setAttribute("script_id", runtimeId),
    parentDoc.body.appendChild(it),
    (rt = Vue.createApp(panelComponent)),
    rt.mount(it),
    (function () {
      if (parentDoc.head.querySelector(`div[script_id="${runtimeId}"]`)) return
      ;((edgePanelStyleHost = markOwnedNode(parentDoc.createElement("div"))),
        edgePanelStyleHost.setAttribute("script_id", runtimeId),
        document.querySelectorAll("head > style").forEach((t) => {
          edgePanelStyleHost.appendChild(t.cloneNode(!0))
        }),
        parentDoc.head.appendChild(edgePanelStyleHost))
    })(),
    startAutoScan(),
    syncAutoScan(),
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
    })(getScanScriptId(), { has: hasCapturedElement }, Ne.findCapturedBallByFingerprint, Ne.updateCapturedBallElement, findPendingRestoreBall, tryCaptureBall),
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
    })({ has: hasCapturedElement }, Ne.isValidFingerprint, findPendingRestoreBall, tryCaptureBall)
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
      resetPositionMemory()
      const t = resolveAnchorBottom(),
        n = resolveInputAnchor(),
        a = resolveSidebarAnchor()
      ;(updatePanelPosition(e, !0),
        (He = new ResizeObserver(() => {
          updatePanelPosition(e)
        })),
        t && He.observe(t),
        n && He.observe(n),
        a && He.observe(a),
        $(window.parent).on("resize.edgePanel", () => updatePanelPosition(e)))
      const o = window.parent.document
      let r = t,
        i = n,
        l = a
      ;((Ze = new MutationObserver(() => {
        const t = resolveAnchorBottom(),
          n = resolveInputAnchor(),
          a = resolveSidebarAnchor()
        let o = !1
        ;(t !== r && ((r = t), t && He && He.observe(t), (o = !0)),
          n !== i && ((i = n), n && He && He.observe(n), (o = !0)),
          a !== l && ((l = a), a && He && He.observe(a), (o = !0)),
          o && updatePanelPosition(e, !0))
      })),
        Ze.observe(o.body, { childList: !0, subtree: !0 }))
    })(Ne.setPanelLeftPosition),
    setupVisualViewportGuards(Ne.setPanelLeftPosition),
    setupKeyboardGuards(),
    (0, o.watch)(settingsApi.effectivePosition, () => {
      updatePanelPosition(Ne.setPanelLeftPosition, !0)
      try {
        window.setTimeout(() => {
          try {
            reorient()
          } catch (err) {}
        }, 40)
      } catch (err) {}
    }),
    restorePendingBalls(),
    Ne.onBallReleased((e, t, n) => {
      n && forgetCapturedElement(n)
    }),
    (0, o.watch)(Ne.isCaptureModeActive, (e, t) => {
      e && !t ? beginCapturePick(getScanScriptId(), tryCaptureBall, () => Ne.exitCaptureMode()) : !e && t && endCapturePick()
    }))
  const n = () => {
      if (isRuntimeCleaned()) return
      ;(markRuntimeCleaned(),
        stopAutoScan(),
        endCapturePick(),
        Qe && (Qe.disconnect(), (Qe = null)),
        He && (He.disconnect(), (He = null)),
        Ze && (Ze.disconnect(), (Ze = null)),
        teardownOwnershipRuntime(),
        $(window).off(".edgePanelLifecycle"),
        $(window.parent).off(".edgePanelLifecycle"),
        $(window.parent).off("resize.edgePanel"),
        teardownViewportGuards(),
        resetPositionMemory(),
        st && (clearInterval(st), (st = null)),
        Ne.releaseAllBallsWithoutSaving(),
        clearCapturedElements(),
        rt && (rt.unmount(), (rt = null)),
        removeOwnedArtifacts(),
        clearRuntimeRegistration())
    },
    edgePanelCleanupSettings = () => {
      settingsApi.cleanup()
    },
    edgePanelRuntimeCleanup = () => {
      ;(n(), edgePanelCleanupSettings())
    }
  ;(registerRuntime(edgePanelRuntimeCleanup),
    watchFrameDetachment(edgePanelRuntimeCleanup),
    attachHostActionWatchers(),
    startArtifactMonitor(() => {
      updatePanelPosition(Ne.setPanelLeftPosition, !0)
    }),
    schedulePositionRefresh(Ne.setPanelLeftPosition),
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
  tryCaptureBall as captureElement,
  Ne as pluginStore,
  registerPlugin,
  scanOnce as scanFloatingBalls,
  startAutoScan as startBallScanning,
  stopAutoScan as stopBallScanning,
  unregisterPlugin,
}
