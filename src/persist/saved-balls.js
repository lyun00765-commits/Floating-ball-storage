/**
 * 已收纳悬浮球的持久化。
 *
 * 两层数据：
 *   pendingRestoreBalls —— 上次会话收纳过的球，脚本重载后据此重新找回
 *   releasedFingerprints —— 见 released.js
 * 批量找回期间用 restoreDepth 抑制逐条写盘，归零时才落一次。
 */

import { klona } from 'https://testingcf.jsdelivr.net/npm/klona/+esm'
import { fingerprintsMatch, isValidFingerprint } from '../core/fingerprint.js'
import { getOwnScriptId } from '../core/platform.js'
import { getBallsInOrder } from '../panel/pagination.js'
import { setReleased } from './released.js'
import { persistSchema } from './schema.js'

export const pendingRestoreBalls = Vue.ref([])
let persistenceInitialized = false,
  isRestoring = false,
  restoreDepth = 0
export function finishRestore(e) {
  ;(restoreDepth--, restoreDepth <= 0 && ((restoreDepth = 0), isRestoring && ((isRestoring = !1), persistCapturedBalls(e))))
}
export function persistCapturedBalls(e) {
  try {
    const t = [],
      a = new Map()
    getBallsInOrder().forEach((ball, idx) => a.set(ball, idx))
    for (const n of Object.values(e))
      if (isValidFingerprint(n.fingerprint)) {
        const e = {
            scriptId: n.fingerprint.scriptId,
            elementId: n.fingerprint.elementId,
            classSelector: n.fingerprint.classSelector,
            title: n.fingerprint.title,
          },
          o = a.get(n.element) ?? t.length
        t.push({
          fingerprint: e,
          icon: n.icon,
          name: n.name,
          originalPosition: n.originalPosition
            ? {
                top: n.originalPosition.top,
                left: n.originalPosition.left,
                right: n.originalPosition.right,
                bottom: n.originalPosition.bottom,
              }
            : void 0,
          originalStyle: n.originalStyle,
          order: o,
        })
      }
    t.sort((e, t) => (e.order ?? 0) - (t.order ?? 0))
    const o = { ...(getVariables({ type: "script", script_id: getOwnScriptId() }) ?? {}), savedBalls: t },
      r = JSON.parse(JSON.stringify(o))
    ;(replaceVariables(r, { type: "script", script_id: getOwnScriptId() }), (pendingRestoreBalls.value = r.savedBalls))
  } catch {}
}
export function findPendingRestoreBall(e) {
  for (const t of pendingRestoreBalls.value) if (fingerprintsMatch(e, t.fingerprint)) return t
  return null
}
export function markBallRestored(e) {
  pendingRestoreBalls.value = pendingRestoreBalls.value.filter((t) => !fingerprintsMatch(e, t.fingerprint))
}

export function initPersistence() {
    if (!persistenceInitialized) {
      persistenceInitialized = !0
      try {
        const t = getOwnScriptId(),
          n = getVariables({ type: "script", script_id: t }),
          a = persistSchema.parse(n)
        ;(a.savedBalls.length > 0 && (pendingRestoreBalls.value = klona(a.savedBalls)),
          a.releasedFingerprints && a.releasedFingerprints.length > 0 && setReleased(a.releasedFingerprints))
      } catch {}
    }
  }

/** 开始一批「找回」：期间抑制逐条写盘 */
export function beginRestoreBatch() {
  restoreDepth++
  if (!isRestoring) isRestoring = true
}

/** 当前是否正处于「找回」批次中 */
export function isRestoreInProgress() {
  return isRestoring
}
