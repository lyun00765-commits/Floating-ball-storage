/**
 * 状态中心（store）。
 *
 * 这是所有能力的汇聚点：面板 UI、扫描器、装配层都通过它读写状态。
 * 它自身不含业务规则，只做三件事：
 * 1. 持有全局状态（插件表、已收纳球表、面板开关与位置）
 * 2. 把各模块的能力聚合成统一的 API（供 UI 与外部调用）
 * 3. 维护「球被释放」的订阅（onBallReleased）
 *
 * 依赖方向：store 单向依赖各功能模块（scanner / pagination / persist / takeover），
 * 反过来 scanner 通过注入拿到 store，因此这里 import 它们是安全的。
 */

import { settingsApi } from "./settings.js";
import { notify } from "./core/platform.js";
import {
  extractFingerprint,
  fingerprintsMatch,
  isValidFingerprint,
  getClassSelector,
} from "./core/fingerprint.js";
import {
  goPage,
  getPageState,
  getContainer,
  containsBall,
  setBallContainer,
} from "./panel/pagination.js";
import {
  hideBall,
  insertBallBefore,
  moveBallToContainer,
  releaseElementResources,
  restoreBall,
} from "./panel/takeover.js";
import {
  pendingRestoreBalls,
  persistCapturedBalls,
  findPendingRestoreBall,
  markBallRestored,
  initPersistence,
  isRestoreInProgress,
} from "./persist/saved-balls.js";
import {
  tryCaptureBall,
  syncAutoScan,
  forgetCapturedElement,
  capturedElementEntries,
} from "./capture/scanner.js";

const plugins = (0, Vue.ref)({}),
  capturedBalls = (0, Vue.ref)({}),
  autoCaptureEnabled = (0, Vue.ref)(!0),
  isCaptureModeActive = (0, Vue.ref)(!1),
  isPanelOpen = (0, Vue.ref)(!1),
  panelPositionStyle = (0, Vue.ref)("auto"),
  panelLeftPosition = (0, Vue.ref)("auto"),
  releaseListeners = [],
  sortedPlugins = (0, Vue.computed)(() =>
    Object.values(plugins.value).sort(
      (e, t) => (e.order ?? 100) - (t.order ?? 100),
    ),
  ),
  capturedBallsList = (0, Vue.computed)(() =>
    Object.values(capturedBalls.value),
  ),
  hasAnyBalls = (0, Vue.computed)(
    () =>
      Object.keys(plugins.value).length > 0 ||
      Object.keys(capturedBalls.value).length > 0,
  );
function isFingerprintCaptured(e) {
  for (const t of Object.values(capturedBalls.value))
    if (fingerprintsMatch(e, t.fingerprint)) return !0;
  return !1;
}
function findCapturedBallByFingerprint(e) {
  for (const t of Object.values(capturedBalls.value))
    if (fingerprintsMatch(e, t.fingerprint)) return t;
  return null;
}
function releaseAllBalls() {
  const e = Object.values(capturedBalls.value);
  ((capturedBalls.value = {}),
    persistCapturedBalls(capturedBalls.value),
    e.forEach((e) => {
      (e.element.isConnected && restoreBall(e),
        releaseListeners.forEach((t) => t(e.id, e.fingerprint, e.element)));
    }));
}
function updateBallElement(e, t) {
  const n = capturedBalls.value[e];
  if (n) {
    const e = n.element,
      o = containsBall(e) ? e.nextSibling : null,
      r = window.parent.getComputedStyle(t);
    ((n.originalParent = t.parentElement),
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
      // 旧元素被替换：先释放它身上的接管资源（弹层托管观察、交互守卫），
      // 否则 popupRegistries 的强引用条目与 MutationObserver 会随每次替换泄漏
      e && e !== t && releaseElementResources(e),
      e && e.isConnected && e !== t && e.remove());
  }
}
export const store = {
  plugins: plugins,
  capturedBalls: capturedBalls,
  autoCaptureEnabled: autoCaptureEnabled,
  isCaptureModeActive: isCaptureModeActive,
  isPanelOpen: isPanelOpen,
  panelLeftPosition: panelLeftPosition,
  panelPositionStyle: panelPositionStyle,
  pendingRestoreBalls: pendingRestoreBalls,
  effectivePosition: settingsApi.effectivePosition,
  isHorizontalLayout: settingsApi.isHorizontalLayout,
  isVerticalLayout: settingsApi.isVerticalLayout,
  isMobile: settingsApi.isMobile,
  settings: settingsApi.settings,
  sortedPlugins: sortedPlugins,
  capturedBallsList: capturedBallsList,
  hasPlugins: hasAnyBalls,
  registerPlugin: function (e) {
    plugins.value[e.id] = e;
  },
  unregisterPlugin: function (e) {
    delete plugins.value[e];
  },
  addCapturedBall: function (e) {
    const t = findCapturedBallByFingerprint(e.fingerprint);
    if (t) updateBallElement(t.id, e.element);
    else if (capturedBalls.value[e.id]) updateBallElement(e.id, e.element);
    else {
      if (
        ((capturedBalls.value = { ...capturedBalls.value, [e.id]: e }),
        void 0 !== e.order)
      ) {
        const t = getContainer();
        if (t) {
          const n = Object.values(capturedBalls.value)
            .filter((t) => t.id !== e.id && void 0 !== t.order)
            .sort((e, t) => (e.order ?? 0) - (t.order ?? 0));
          let a = null;
          for (const o of n)
            if ((o.order ?? 0) > e.order && t && t.contains(o.element)) {
              a = o.element;
              break;
            }
          insertBallBefore(e, a);
        } else moveBallToContainer(e);
      } else moveBallToContainer(e);
      (markBallRestored(e.fingerprint),
        isRestoreInProgress() || persistCapturedBalls(capturedBalls.value));
    }
  },
  removeCapturedBall: function (e) {
    const t = capturedBalls.value[e];
    if (t) {
      const n = t.element,
        a = t.fingerprint,
        { [e]: _, ...o } = capturedBalls.value;
      ((capturedBalls.value = o),
        markBallRestored(a),
        persistCapturedBalls(capturedBalls.value),
        n && restoreBall(t),
        releaseListeners.forEach((t) => t(e, a, n)));
    }
  },
  clickCapturedBall: function (e, t = "default") {
    const n = capturedBalls.value[e];
    if (!n) return;
    const a = n.element,
      r = n.order,
      i = window.parent || window,
      ballName = n.name;
    if ("root-open" === t) {
      const t = () => {
        if (!a.isConnected || capturedBalls.value[e]) return;
        (a.removeAttribute("data-edge-panel-ignore"),
          tryCaptureBall(a, { order: r }));
      };
      (a.setAttribute("data-edge-panel-ignore", "1"),
        this.removeCapturedBall(e));
      const n =
        a.closest("#auto_illustrator_conso_floating_panel_root") ||
        i.document.getElementById("auto_illustrator_conso_floating_panel_root");
      const o =
        a.id === "ai-floating-panel-launcher"
          ? a
          : n?.querySelector(
              "#ai-floating-panel-launcher,.ai-floating-panel-launcher",
            );
      if (n && o) {
        (n.setAttribute("data-edge-panel-ignore", "1"),
          o.setAttribute("data-edge-panel-ignore", "1"));
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
          });
        try {
          (o.dispatchEvent(u),
            i.document.dispatchEvent(c),
            i.document.dispatchEvent(d));
        } catch (err) {
          console.warn("[集成控件] 派发指针事件失败:", err);
        }
        try {
          i.localStorage?.setItem(
            "auto_illustrator_conso_floating_panel_position",
            JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top) }),
          );
        } catch (err) {
          /* 写入面板位置失败不影响主流程（下次打开会重新计算） */
        }
        setTimeout(() => {
          try {
            // 在球的真实节点上派发一次 click，让它的「打开」逻辑生效。
            // 注意这里必须是元素（o），不能是 Vue 模块对象——后者没有 click/dispatchEvent。
            const e = (i && i.MouseEvent) || MouseEvent;
            o.dispatchEvent(
              new e("click", { bubbles: !0, cancelable: !0, view: i }),
            );
          } catch (err) {
            console.warn("[集成控件] 触发悬浮球点击失败:", err);
          }
        }, 80);
        const h = setInterval(() => {
          if (!n.isConnected || capturedBalls.value[e])
            return void clearInterval(h);
          n.classList.contains("open") ||
            (clearInterval(h),
            setTimeout(() => {
              (n.removeAttribute("data-edge-panel-ignore"),
                o.removeAttribute("data-edge-panel-ignore"),
                t());
            }, 120));
        }, 250);
        (setTimeout(() => clearInterval(h), 15000),
          notify.info(`已在原位置打开: ${ballName}`));
        return;
      }
      if (n) {
        n.classList.add("open");
        const o = setInterval(() => {
          if (!n.isConnected || capturedBalls.value[e])
            return void clearInterval(o);
          n.classList.contains("open") ||
            (clearInterval(o), setTimeout(t, 120));
        }, 250);
        setTimeout(() => clearInterval(o), 15000);
      }
      notify.info(`已在原位置打开: ${ballName}`);
      return;
    }
  },
  releaseAllBalls: releaseAllBalls,
  releaseAllBallsWithoutSaving: function () {
    const e = Object.values(capturedBalls.value);
    ((capturedBalls.value = {}),
      e.forEach((e) => {
        (e.element.isConnected && restoreBall(e),
          releaseListeners.forEach((t) => t(e.id, e.fingerprint, e.element)));
      }));
  },
  updateCapturedBallElement: updateBallElement,
  cleanupInvalidBalls: function () {
    const e = [];
    for (const [t, n] of Object.entries(capturedBalls.value))
      n.element.isConnected || e.push(t);
    if (e.length > 0) {
      for (const t of e) {
        const e = capturedBalls.value[t];
        (e && releaseListeners.forEach((n) => n(t, e.fingerprint, e.element)),
          delete capturedBalls.value[t]);
      }
      ((capturedBalls.value = { ...capturedBalls.value }),
        persistCapturedBalls(capturedBalls.value));
    }
    for (const [t, n] of capturedElementEntries()) {
      (t.isConnected && capturedBalls.value[n]) || forgetCapturedElement(t);
    }
  },
  onBallReleased: function (e) {
    return (
      releaseListeners.push(e),
      () => {
        const t = releaseListeners.indexOf(e);
        t > -1 && releaseListeners.splice(t, 1);
      }
    );
  },
  togglePanel: function () {
    isPanelOpen.value = !isPanelOpen.value;
  },
  closePanel: function () {
    isPanelOpen.value = !1;
  },
  openPanel: function () {
    isPanelOpen.value = !0;
  },
  setPanelLeftPosition: function (e) {
    ((panelLeftPosition.value = e), (panelPositionStyle.value = e));
  },
  updatePanelPositionStyle: function (e) {
    const t = settingsApi.effectivePosition.value;
    if (e)
      switch (t) {
        case "left":
          panelPositionStyle.value = `${Math.round(e.left)}px`;
          break;
        case "right":
          panelPositionStyle.value = `${Math.round(e.right)}px`;
          break;
        case "top":
          panelPositionStyle.value = `${Math.round(e.top)}px`;
          break;
        case "bottom":
          panelPositionStyle.value = `${Math.round(e.bottom)}px`;
      }
    else
      switch (t) {
        case "left":
        case "top":
          panelPositionStyle.value = "0px";
          break;
        case "right":
          panelPositionStyle.value = `${window.parent.innerWidth}px`;
          break;
        case "bottom":
          panelPositionStyle.value = `${window.parent.innerHeight}px`;
      }
  },
  initSettings: settingsApi.initSettings,
  setPanelPosition: settingsApi.setPanelPosition,
  toggleAutoCapture: function () {
    ((autoCaptureEnabled.value = !autoCaptureEnabled.value),
      autoCaptureEnabled.value || releaseAllBalls());
    syncAutoScan();
  },
  enterCaptureMode: function () {
    isCaptureModeActive.value = !0;
  },
  exitCaptureMode: function () {
    isCaptureModeActive.value = !1;
  },
  toggleCaptureMode: function () {
    isCaptureModeActive.value = !isCaptureModeActive.value;
  },
  setBallContainer,
  goPage,
  fbGetPageState: getPageState,
  getBallContainer: getContainer,
  moveBallToContainer: moveBallToContainer,
  moveBallBackToOriginal: restoreBall,
  hideFloatingBall: hideBall,
  showFloatingBall: function (e, t) {
    e.style.cssText = t;
  },
  initPersistence,
  saveCapturedBalls: () => persistCapturedBalls(capturedBalls.value),
  findPendingRestoreBall: findPendingRestoreBall,
  shouldRestoreBall: function (e, t, n) {
    return (
      null !==
      findPendingRestoreBall({
        scriptId: e,
        elementId: n || null,
        classSelector: t,
        title: null,
      })
    );
  },
  markBallRestored: markBallRestored,
  removeFromPendingRestore: markBallRestored,
  getPendingRestoreBalls: function () {
    return pendingRestoreBalls.value;
  },
  extractFingerprint,
  generateBallIdFromFingerprint: function (e) {
    if (e.scriptId) return `ball_script_${e.scriptId}`;
    if (e.elementId) return `ball_id_${e.elementId}`;
    if (e.classSelector || e.title) {
      return `ball_combined_${(function (e) {
        let t = 0;
        for (let n = 0; n < e.length; n++)
          ((t = (t << 5) - t + e.charCodeAt(n)), (t &= t));
        return Math.abs(t);
      })(`${e.classSelector || ""}_${e.title || ""}`)}`;
    }
    return `ball_random_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  },
  fingerprintsMatch,
  isValidFingerprint,
  isFingerprintCaptured: isFingerprintCaptured,
  findCapturedBallByFingerprint: findCapturedBallByFingerprint,
  getClassSelector,
  isElementIdCaptured: function (e) {
    return (
      !!e &&
      isFingerprintCaptured({
        scriptId: null,
        elementId: e,
        classSelector: null,
        title: null,
      })
    );
  },
};
