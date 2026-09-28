import { injectStyles } from "./styles/inject.js";
import { extractFingerprint } from "./core/fingerprint.js";
import { isFloatingBoxElement } from "./core/dom.js";
import { beginCapturePick, endCapturePick } from "./capture/manual.js";
import { findPendingRestoreBall } from "./persist/saved-balls.js";
import { settingsApi } from "./settings.js";
import { parentDoc, runtimeId } from "./runtime-identity.js";
import {
  markOwnedNode,
  removeOwnedArtifacts,
  removeStaleArtifacts,
  registerRuntime,
  clearRuntimeRegistration,
  watchFrameDetachment,
  startArtifactMonitor,
  attachHostActionWatchers,
  setOwnershipDeps,
  isRuntimeCleaned,
  markRuntimeCleaned,
  teardownOwnershipRuntime,
} from "./runtime-ownership.js";
import { store } from "./store.js";
import {
  installAnchorObservers,
  disposeAnchorObservers,
} from "./panel/anchor-observers.js";
import {
  installHostCaptureWatcher,
  disposeHostCaptureWatcher,
} from "./capture/host-watcher.js";
import { ensureViewportFixStyle } from "./styles/viewport-fix.js";
import { installInputEntry, cleanupInputEntry } from "./ui/input-entry.js";
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
  getScanScriptId,
} from "./capture/scanner.js";
import { panelComponent, setViewDeps } from "./panel/view.js";
injectStyles();
import {
  setupVisualViewportGuards,
  setupKeyboardGuards,
  teardownViewportGuards,
  setViewportGuardDeps,
} from "./panel/viewport-guards.js";
import {
  updatePanelPosition,
  resetPositionMemory,
  schedulePositionRefresh,
} from "./panel/geometry.js";
import { setCapturedBallClickHandler } from "./panel/takeover.js";
import { reorient } from "./panel/pagination.js";

setCapturedBallClickHandler((id, mode) => store.clickCapturedBall(id, mode));

let edgePanelStyleHost = null;
let rt = null,
  it = null,
  st = null;
function ht() {
  setOwnershipDeps({
    styleHost: edgePanelStyleHost,
    mountHost: it,
    requestCleanup: () => edgePanelRuntimeCleanup(),
  });
  setViewportGuardDeps({
    togglePanel: () => store.togglePanel(),
    getPanelPositionTarget: () => store.setPanelLeftPosition,
  });
  setScanDeps({ store: store });
  setViewDeps({
    store: store,
    triggerScan: (force) => scanOnce(force),
  });

  (store.initPersistence(),
    settingsApi.initSettings(),
    removeStaleArtifacts(),
    ensureViewportFixStyle(parentDoc),
    (it = markOwnedNode(parentDoc.createElement("div"))),
    it.setAttribute("script_id", runtimeId),
    parentDoc.body.appendChild(it),
    (rt = Vue.createApp(panelComponent)),
    rt.mount(it),
    (function () {
      if (parentDoc.head.querySelector(`div[script_id="${runtimeId}"]`)) return;
      ((edgePanelStyleHost = markOwnedNode(parentDoc.createElement("div"))),
        edgePanelStyleHost.setAttribute("script_id", runtimeId),
        document.querySelectorAll("head > style").forEach((t) => {
          edgePanelStyleHost.appendChild(t.cloneNode(!0));
        }),
        parentDoc.head.appendChild(edgePanelStyleHost));
    })(),
    startAutoScan(),
    syncAutoScan(),
    st ||
      (st = setInterval(() => {
        store.cleanupInvalidBalls();
      }, 3e4)));
  const e = (function (e, t, n, a, o, i) {
      return (l) => {
        if (t.has(l) || l.hasAttribute("data-edge-panel-ignore")) return;
        const s = extractFingerprint(l);
        if (s.scriptId === e) return;
        if (!s.scriptId && !s.elementId) return;
        const A = n(s);
        if (A) return void (isFloatingBoxElement(l) && (a(A.id, l), t.add(l)));
        const c = o(s);
        if (c && isFloatingBoxElement(l)) {
          const e = {
            originalPosition: c.originalPosition,
            originalStyle: c.originalStyle,
            order: c.order,
          };
          i(l, e);
        }
      };
    })(
      getScanScriptId(),
      { has: hasCapturedElement },
      store.findCapturedBallByFingerprint,
      store.updateCapturedBallElement,
      findPendingRestoreBall,
      tryCaptureBall,
    ),
    t = (function (e, t, n, a) {
      return (o) => {
        if (e.has(o) || o.hasAttribute("data-edge-panel-ignore")) return;
        const i = (function (e) {
          return (
            e.getAttribute("script_id") ||
            e.closest("[script_id]")?.getAttribute("script_id") ||
            null
          );
        })(o);
        if (i) return;
        if (o.id) return;
        const l = extractFingerprint(o);
        if (!t(l)) return;
        const s = n(l);
        if (s && isFloatingBoxElement(o)) {
          const e = {
            originalPosition: s.originalPosition,
            originalStyle: s.originalStyle,
            order: s.order,
          };
          a(o, e);
        }
      };
    })(
      { has: hasCapturedElement },
      store.isValidFingerprint,
      findPendingRestoreBall,
      tryCaptureBall,
    );
  (installHostCaptureWatcher({
    checkAndCaptureNewFloatingBall: e,
    checkAndCaptureFloatingBallByClass: t,
  }),
    installAnchorObservers(store.setPanelLeftPosition),
    setupVisualViewportGuards(store.setPanelLeftPosition),
    setupKeyboardGuards(),
    Vue.watch(settingsApi.effectivePosition, () => {
      updatePanelPosition(store.setPanelLeftPosition, !0);
      try {
        window.setTimeout(() => {
          try {
            reorient();
          } catch (err) {
            console.warn("[集成控件] 重排分页失败:", err);
          }
        }, 40);
      } catch (err) {
        console.warn("[集成控件] 无法调度分页重排:", err);
      }
    }),
    restorePendingBalls(),
    store.onBallReleased((e, t, n) => {
      n && forgetCapturedElement(n);
    }),
    Vue.watch(store.isCaptureModeActive, (e, t) => {
      e && !t
        ? beginCapturePick(getScanScriptId(), tryCaptureBall, () =>
            store.exitCaptureMode(),
          )
        : !e && t && endCapturePick();
    }));
  /** 解绑宿主事件。jQuery 缺失或抛错都不能中断清理链的后续步骤 */
  const detachLifecycleListeners = () => {
      try {
        const jq = window.jQuery || window.$,
          parentJq = window.parent.jQuery || window.parent.$;
        jq && jq(window).off(".edgePanelLifecycle");
        parentJq && parentJq(window.parent).off(".edgePanelLifecycle");
        parentJq && parentJq(window.parent).off("resize.edgePanel");
      } catch (e) {
        console.warn("[集成控件] 解绑宿主事件失败:", e);
      }
    },
    n = () => {
      if (isRuntimeCleaned()) return;
      (markRuntimeCleaned(),
        stopAutoScan(),
        endCapturePick(),
        disposeHostCaptureWatcher(),
        disposeAnchorObservers(),
        teardownOwnershipRuntime(),
        detachLifecycleListeners(),
        teardownViewportGuards(),
        resetPositionMemory(),
        st && (clearInterval(st), (st = null)),
        store.releaseAllBallsWithoutSaving(),
        clearCapturedElements(),
        rt && (rt.unmount(), (rt = null)),
        removeOwnedArtifacts(),
        clearRuntimeRegistration(),
        cleanupInputEntry());
    },
    edgePanelCleanupSettings = () => {
      settingsApi.cleanup();
    },
    edgePanelRuntimeCleanup = () => {
      (n(), edgePanelCleanupSettings());
    },
    /** 页面卸载时也要清理（jQuery 由宿主注入，缺失时跳过，不中断装配） */
    attachLifecycleListeners = () => {
      try {
        const jq = window.jQuery || window.$,
          parentJq = window.parent.jQuery || window.parent.$;
        jq &&
          jq(window).on("unload.edgePanelLifecycle", edgePanelRuntimeCleanup);
        parentJq &&
          parentJq(window.parent).on(
            "pagehide.edgePanelLifecycle",
            edgePanelRuntimeCleanup,
          );
        parentJq &&
          parentJq(window.parent).on(
            "beforeunload.edgePanelLifecycle",
            edgePanelRuntimeCleanup,
          );
      } catch (e) {
        console.warn("[集成控件] 注册宿主事件失败:", e);
      }
    };
  (registerRuntime(edgePanelRuntimeCleanup),
    watchFrameDetachment(edgePanelRuntimeCleanup),
    attachHostActionWatchers(),
    startArtifactMonitor(() => {
      updatePanelPosition(store.setPanelLeftPosition, !0);
    }),
    schedulePositionRefresh(store.setPanelLeftPosition),
    attachLifecycleListeners());
}
/** 入口：jQuery 就绪后装配（同样不能裸调用 $） */
function bootstrap() {
  try {
    ht();
  } catch (e) {
    console.error("[集成控件] 启动失败:", e);
  }
}
(window.jQuery || window.$ || ((fn) => fn())).call(window, bootstrap);

// 与原实现一致：模块加载时即安装（原为顶层 IIFE）
installInputEntry();

export {
  tryCaptureBall as captureElement,
  store as pluginStore,
  registerPlugin,
  scanOnce as scanFloatingBalls,
  startAutoScan as startBallScanning,
  stopAutoScan as stopBallScanning,
  unregisterPlugin,
};
