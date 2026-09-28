/**
 * 运行时身份。
 *
 * 脚本跑在 iframe 里，需要知道「自己是谁」（脚本 id、frame 名）以及「父窗口是谁」，
 * 用于注册/清理运行时、标记自己创建的节点、在父窗口里定位本 iframe。
 *
 * 副作用：模块加载时会把父窗口上遗留的旧运行时清理掉（脚本重复执行时，
 * 上一个实例可能还没退场）。这一步必须保留在模块顶层。
 */

export const parentWin = window.parent,
  parentDoc = parentWin.document,
  runtimeId = (function () {
    try {
      return getScriptId()
    } catch (e) {
      return ""
    }
  })(),
  runtimeOwner = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
  runtimeKeys = ["__floating_ball_storage_runtime__", "__edge_panel_runtime__"],
  currentFrameName = (function () {
    try {
      return String(window?.name || "").trim()
    } catch (e) {
      return ""
    }
  })()
try {
  runtimeKeys.forEach((e) => {
    const t = parentWin[e]
    t && "function" == typeof t.cleanup && t.cleanup()
  })
} catch (e) {
  console.warn("[集成控件] 清理旧运行时失败:", e)
}

/** 在父窗口里定位「本脚本所在的 iframe」节点（用于判断自己是否还存活） */
export function resolveCurrentFrame() {
  try {
    const e = window.frameElement
    if (e && e.ownerDocument === parentDoc) return e
  } catch (e) {}
  if (!currentFrameName || "function" != typeof parentDoc.getElementById) return null
  const e = parentDoc.getElementById(currentFrameName)
  return e && "iframe" === String(e.tagName || "").toLowerCase() ? e : null
}
