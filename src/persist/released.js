/**
 * 「释放记忆」持久化。
 *
 * 用户手动释放某个悬浮球后记录其指纹，避免自动扫描又把它收回来；
 * 记忆随脚本变量（releasedFingerprints）持久化。
 */
import { fingerprintsMatch, isValidFingerprint } from '../core/fingerprint.js'
import { getOwnScriptId } from '../core/platform.js'

const releasedFingerprints = Vue.ref([])
export function isReleasedFingerprint(e) {
  for (const t of releasedFingerprints.value) if (fingerprintsMatch(e, t)) return !0
  return !1
}
export function saveReleased() {
  try {
    const e = {
      ...(getVariables({ type: "script", script_id: getOwnScriptId() }) ?? {}),
      releasedFingerprints: JSON.parse(JSON.stringify(releasedFingerprints.value)),
    }
    replaceVariables(e, { type: "script", script_id: getOwnScriptId() })
  } catch (err) {
    console.warn("[集成控件] 保存释放记忆失败:", err)
  }
}
export function addReleased(e) {
  if (!e || !isValidFingerprint(e)) return
  if (isReleasedFingerprint(e)) return
  releasedFingerprints.value = [
    ...releasedFingerprints.value,
    {
      scriptId: e.scriptId ?? null,
      elementId: e.elementId ?? null,
      classSelector: e.classSelector ?? null,
      title: e.title ?? null,
    },
  ]
  saveReleased()
}
export function removeReleased(e) {
  if (!e) return
  const n = releasedFingerprints.value.length
  releasedFingerprints.value = releasedFingerprints.value.filter((t) => !fingerprintsMatch(e, t))
  if (releasedFingerprints.value.length !== n) saveReleased()
}

/** 清空全部释放记忆 */
export function clearReleased() {
  releasedFingerprints.value = []
  saveReleased()
}

/** 已记录的释放记忆条数 */
export function getReleasedCount() {
  return releasedFingerprints.value.length
}

/** 用持久化的数据覆盖当前记忆 */
export function setReleased(list) {
  releasedFingerprints.value = list
}
