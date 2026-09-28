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
import { installAnchorObservers, disposeAnchorObservers } from "./panel/anchor-observers.js"
import { installHostCaptureWatcher, disposeHostCaptureWatcher } from "./capture/host-watcher.js"
import { ensureViewportFixStyle } from "./styles/viewport-fix.js"
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
    ensureViewportFixStyle(parentDoc),
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
  ;(installHostCaptureWatcher({ checkAndCaptureNewFloatingBall: e, checkAndCaptureFloatingBallByClass: t }),
    installAnchorObservers(store.setPanelLeftPosition),
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
        disposeHostCaptureWatcher(),
        disposeAnchorObservers(),
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
