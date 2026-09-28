/**
 * 捕获扫描。
 *
 * 两个来源：
 * - 手动：用户点选元素后由捕获层调用 tryCaptureBall
 * - 自动：定时轮询（每 2 秒）扫描页面上的候选元素，识别交由 capture/candidate 决定
 *
 * 扫描是「先宽后严」：先用一批选择器快速捞候选（含跨 iframe），再定期做一次
 * 全量兜底（只收 computed position:fixed 的元素，节流到约 12 秒一次）。
 * 捕获时保留的元素原始信息（位置/父节点/兄弟节点/行内样式）用于日后「还原」。
 *
 * 与 store 的关系：本模块读写 store 的状态与能力（指纹、已收纳列表），
 * 但 store 也要调用本模块（切换自动捕获时联动启停），所以 store 侧直接 import，
 * 本模块侧用注入，保持单向依赖。
 */

import { settingsApi, setCaptureModeChangeHandler } from '../settings.js'
import { getOwnScriptId } from '../core/platform.js'
import { isFloatingBallCandidate } from './candidate.js'
import { collectIframeDocs, isFloatingBoxElement } from '../core/dom.js'
import { getElementIcon, getElementName } from '../core/element-info.js'
import { isReleasedFingerprint, removeReleased } from '../persist/released.js'
import {
  pendingRestoreBalls,
  beginRestoreBatch,
  finishRestore,
  findPendingRestoreBall,
  markBallRestored,
  isRestoreInProgress,
} from '../persist/saved-balls.js'
import { containsBall } from '../panel/pagination.js'
import { insertBallBefore, moveBallToContainer, restoreBall } from '../panel/takeover.js'

/** 扫描循环定时器 */
let scanTimer = null
/** 启动后立即跑一次全量的定时器 */
let immediateScanTimer = null
/** 全量兜底扫描的节流计数器：>0 时跳过全量，每次定时 tick 减一 */
let scanThrottle = 0

/** 本脚本的 script_id（用于把「自己创建的球」排除在候选之外） */
const scriptId = (function () {
  try {
    return getOwnScriptId()
  } catch {
    return "集成控件"
  }
})()

/** store 能力注入（指纹读写、已收纳球操作、自动捕获开关） */
let deps = {
  store: {
    autoCaptureEnabled: Vue.ref(!1),
    extractFingerprint: () => ({}),
    isValidFingerprint: () => !1,
    isFingerprintCaptured: () => !1,
    generateBallIdFromFingerprint: () => '',
    updateCapturedBallElement: () => {},
    addCapturedBall: () => {},
  },
}

export function setScanDeps(next) {
  deps = { ...deps, ...next }
}

const capturedElements = new Set()
const elementToBallId = new Map()
export function registerPlugin(e) {
  deps.store.registerPlugin(e)
}
export function unregisterPlugin(e) {
  deps.store.unregisterPlugin(e)
}
export function tryCaptureBall(e, t) {
  if (e.hasAttribute("data-edge-panel-ignore")) return !1
  if (capturedElements.has(e)) return !1
  const n = deps.store.extractFingerprint(e)
  if (n.scriptId === scriptId) return !1
  if (!deps.store.isValidFingerprint(n)) return !1
  if (deps.store.isFingerprintCaptured(n)) {
    const t = deps.store.generateBallIdFromFingerprint(n)
    return (deps.store.updateCapturedBallElement(t, e), capturedElements.add(e), !1)
  }
  capturedElements.add(e)
  const a = window.parent.getComputedStyle(e),
    o = a.display || "flex",
    r = deps.store.generateBallIdFromFingerprint(n),
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
  return (elementToBallId.set(e, r), deps.store.addCapturedBall(c), removeReleased(n), !0)
}
/** 设置变化 → 联动自动扫描的启停（原先挂在 settingsApi 上，现由装配层持有） */
export function syncAutoScan() {
  if ("auto" === settingsApi.getCaptureMode() && deps.store.autoCaptureEnabled.value) {
    if (!scanTimer) startAutoScan()
  } else if (scanTimer) stopAutoScan()
}
setCaptureModeChangeHandler(syncAutoScan)

export function scanOnce(forceFullScan) {
  if (!deps.store.autoCaptureEnabled.value) return
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
  if (forceFullScan || scanThrottle <= 0) {
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
    scanThrottle = 6
  } else scanThrottle--

  const passed = []
  candidates.forEach((el) => {
    if (!capturedElements.has(el) && isFloatingBallCandidate(el, scriptId)) passed.push(el)
  })
  // 同一条 DOM 包含链上可能同时命中多个候选（例如外层球容器 + 内部又是 absolute
  // 定位的图标包装层都各自达到了打分阈值）。这种情况下只保留"最外层"的一个再去
  // 捕获，避免同一个悬浮球被拆成两条记录（球容器一条、内部图标又单独一条）。
  const toCapture = passed.filter((el) => !passed.some((other) => other !== el && other.contains(el)))
  toCapture.forEach((el) => tryCaptureBall(el))
}
export function startAutoScan() {
  deps.store.autoCaptureEnabled.value &&
    "auto" === settingsApi.getCaptureMode() &&
    (scanThrottle = 0,
      (scanTimer = setInterval(() => {
        ;(window.parent.document.hidden || document.hidden) || scanOnce()
      }, 2e3)),
      (immediateScanTimer = setTimeout(() => scanOnce(!0), 300)))
}
export function stopAutoScan() {
  immediateScanTimer && clearTimeout(immediateScanTimer)
  ;(scanTimer && (clearInterval(scanTimer), (scanTimer = null)), (immediateScanTimer = null))
  scanThrottle = 0
}
export function restorePendingBalls() {
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
        if (n.fingerprint.scriptId === scriptId) return (e.add(o), !0)
        const t = a.querySelectorAll(`[script_id="${n.fingerprint.scriptId}"]`)
        for (const n of t) {
          const t = n
          if (isFloatingBoxElement(t, !0) && tryCaptureBall(t, i)) return (e.add(o), !0)
        }
        return !1
      }
      if (n.fingerprint.elementId) {
        try {
          const t = a.getElementById(n.fingerprint.elementId)
          if (t) {
            if (isFloatingBoxElement(t, !0) && tryCaptureBall(t, i)) return (e.add(o), !0)
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
              const a = deps.store.extractFingerprint(t)
              if (deps.store.fingerprintsMatch(a, n.fingerprint) && tryCaptureBall(t, i)) return (e.add(o), !0)
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
        } else finishRestore(deps.store.capturedBalls.value)
      else finishRestore(deps.store.capturedBalls.value)
    }
  setTimeout(() => a(1), 500)
}

/** 忘掉某个元素的捕获记录（元素被移除或释放时用） */
export function forgetCapturedElement(el) {
  capturedElements.delete(el)
  elementToBallId.delete(el)
}

/** 清空全部捕获记录 */
export function clearCapturedElements() {
  capturedElements.clear()
  elementToBallId.clear()
}

/** 是否已记录该元素 */
export function hasCapturedElement(el) {
  return capturedElements.has(el)
}

/** 遍历「元素 → 球 id」映射（元素被移除时用于清理） */
export function capturedElementEntries() {
  return elementToBallId.entries()
}

/** 本脚本的 script_id（候选元素排除用） */
export function getScanScriptId() {
  return scriptId
}

