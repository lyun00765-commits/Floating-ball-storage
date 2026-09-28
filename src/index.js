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
import { store } from "./store.js"
import { installInputEntry, cleanupInputEntry } from "./ui/input-entry.js"
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

setCapturedBallClickHandler((id, mode) => store.clickCapturedBall(id, mode))


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
    togglePanel: () => store.togglePanel(),
    getPanelPositionTarget: () => store.setPanelLeftPosition,
  })
  setScanDeps({ store: store })
  setViewDeps({
    store: store,
    triggerScan: (force) => scanOnce(force),
  })


  ;(store.initPersistence(),
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
        store.cleanupInvalidBalls()
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
    })(getScanScriptId(), { has: hasCapturedElement }, store.findCapturedBallByFingerprint, store.updateCapturedBallElement, findPendingRestoreBall, tryCaptureBall),
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
    })({ has: hasCapturedElement }, store.isValidFingerprint, findPendingRestoreBall, tryCaptureBall)
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
    })(store.setPanelLeftPosition),
    setupVisualViewportGuards(store.setPanelLeftPosition),
    setupKeyboardGuards(),
    Vue.watch(settingsApi.effectivePosition, () => {
      updatePanelPosition(store.setPanelLeftPosition, !0)
      try {
        window.setTimeout(() => {
          try {
            reorient()
          } catch (err) {}
        }, 40)
      } catch (err) {}
    }),
    restorePendingBalls(),
    store.onBallReleased((e, t, n) => {
      n && forgetCapturedElement(n)
    }),
    Vue.watch(store.isCaptureModeActive, (e, t) => {
      e && !t ? beginCapturePick(getScanScriptId(), tryCaptureBall, () => store.exitCaptureMode()) : !e && t && endCapturePick()
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
        store.releaseAllBallsWithoutSaving(),
        clearCapturedElements(),
        rt && (rt.unmount(), (rt = null)),
        removeOwnedArtifacts(),
        clearRuntimeRegistration(),
        cleanupInputEntry())
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
      updatePanelPosition(store.setPanelLeftPosition, !0)
    }),
    schedulePositionRefresh(store.setPanelLeftPosition),
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


// 与原实现一致：模块加载时即安装（原为顶层 IIFE）
installInputEntry()

export {
  tryCaptureBall as captureElement,
  store as pluginStore,
  registerPlugin,
  scanOnce as scanFloatingBalls,
  startAutoScan as startBallScanning,
  stopAutoScan as stopBallScanning,
  unregisterPlugin,
}
