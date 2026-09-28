/**
 * 运行时归属。
 *
 * 脚本在父窗口（酒馆本体）里创建了元素、注册了全局清理钩子。这一层负责：
 * - 标记「哪些节点是我建的」（data-edge-panel-owner），避免误伤宿主节点
 * - 清理遗留物：上次运行残留的节点、自己建的节点
 * - 注册/注销全局运行时钩子，让脚本重复执行时能接管上一个实例
 * - 存活性监视：本 iframe 被移除、或宿主删掉了本脚本的节点时，主动退出清理
 *
 * 之所以要这么小心：酒馆助手会在同一个页面里反复执行脚本、也会热重载，
 * 不清理就会留下孤儿节点和失效监听器。
 */

import {
  parentWin,
  parentDoc,
  runtimeId,
  runtimeOwner,
  runtimeKeys,
  resolveCurrentFrame,
} from './runtime-identity.js'

/** 依赖注入：styleHost 由接管层提供，requestCleanup 由装配层提供 */
let deps = {
  /** 挂在父窗口 head 的样式宿主元素（由接管层创建） */
  styleHost: null,
  /** 挂在父窗口 body 的容器元素 */
  mountHost: null,
  /** 请求执行整体清理（由装配层提供，避免本模块依赖 cleanup 实现） */
  requestCleanup: () => {},
}

/** 是否已清理（装配层在清理链中会读） */
export function isRuntimeCleaned() {
  return runtimeCleaned
}

/** 标记为已清理并返回「本次是否是首个清理者」（避免重复清理） */
export function markRuntimeCleaned() {
  if (runtimeCleaned) return false
  runtimeCleaned = true
  return true
}

export function setOwnershipDeps(next) {
  deps = { ...deps, ...next }
}

let runtimeCleaned = false
let frameObserver = null
let artifactMonitor = null
let hostActionObserver = null
let hostClickHandler = null

export function markOwnedNode(e) {
  return (e && e.setAttribute("data-edge-panel-owner", runtimeOwner), e)
}
export function removeOwnedArtifacts() {
  try {
    parentDoc.querySelectorAll(`[data-edge-panel-owner="${runtimeOwner}"]`).forEach((e) => {
      e.remove()
    })
  } catch (e) {}
}
export function removeStaleArtifacts() {
  if (!runtimeId) return
  try {
    parentDoc
      .querySelectorAll(`body > div[script_id="${runtimeId}"], head > div[script_id="${runtimeId}"]`)
      .forEach((e) => {
        e.remove()
      })
  } catch (e) {}
}
export function registerRuntime(e) {
  try {
    runtimeKeys.forEach((t) => {
      parentWin[t] = { id: runtimeId, owner: runtimeOwner, cleanup: e }
    })
  } catch (e) {
    console.warn("[集成控件] 注册运行时失败:", e)
  }
}
export function clearRuntimeRegistration() {
  try {
    runtimeKeys.forEach((e) => {
      const t = parentWin[e]
      t && t.owner === runtimeOwner && delete parentWin[e]
    })
  } catch (e) {}
}
export function watchFrameDetachment(e) {
  if (
    frameObserver ||
    runtimeCleaned ||
    parentWin === window ||
    "undefined" == typeof MutationObserver
  )
    return
  const t = parentDoc.body || parentDoc.documentElement
  if (!t) return
  ;((frameObserver = new MutationObserver(() => {
    if (runtimeCleaned) return
    const t = resolveCurrentFrame()
    ;(t && t.isConnected) || e()
  })),
    frameObserver.observe(t, { childList: !0, subtree: !0 }))
}
export function ensureArtifacts(e) {
  if (runtimeCleaned) return
  let t = !1
  ;(deps.mountHost &&
      !deps.mountHost.isConnected &&
      parentDoc.body &&
      (parentDoc.body.appendChild(deps.mountHost), (t = !0)),
    deps.styleHost &&
      !deps.styleHost.isConnected &&
      parentDoc.head &&
      (parentDoc.head.appendChild(deps.styleHost), (t = !0)),
    e && e(t))
}
export function startArtifactMonitor(e) {
  ;(artifactMonitor &&
    (parentWin.clearInterval(artifactMonitor), (artifactMonitor = null)),
    (artifactMonitor = parentWin.setInterval(() => {
      ensureArtifacts(e)
    }, 1200)))
}
export function isElement(e) {
  return !!(e && 1 === e.nodeType)
}
export function isOwnedNode(e) {
  return !!(
    isElement(e) &&
    "function" == typeof e.closest &&
    e.closest(`[data-edge-panel-owner="${runtimeOwner}"]`)
  )
}
export function nodeMentionsScriptByText(e) {
  if (!e || !runtimeId) return !1
  try {
    const t = (e.textContent || "").toLowerCase(),
      n = runtimeId.toLowerCase()
    if (t.includes(n)) return !0
    const a = e.getAttribute?.("script_id") || ""
    if (a === runtimeId) return !0
  } catch (e) {}
  return !1
}
export function scheduleAggressivePresenceCheck() {
  ;[120, 360, 900, 1800, 3200].forEach((e) => {
    parentWin.setTimeout(() => {
      if (runtimeCleaned) return
      const t = resolveCurrentFrame()
      ;(t && t.isConnected) || deps.requestCleanup()
    }, e)
  })
}
export function attachHostActionWatchers() {
  if (hostActionObserver || !parentDoc.body) return
  ;((hostClickHandler = (e) => {
    const t = e.target
    if (!isElement(t) || isOwnedNode(t)) return
    const n = t.closest("button,input,label,.menu_button,.fa-trash,.fa-trash-can,.fa-xmark,.fa-ban")
    if (!n) return
    let a = n
    for (let e = 0; a && e < 5; e += 1, a = a.parentElement)
      if (nodeMentionsScriptByText(a)) return void scheduleAggressivePresenceCheck()
  }),
    parentDoc.addEventListener("click", hostClickHandler, !0),
    (hostActionObserver = new MutationObserver((e) => {
      for (const t of e)
        if ("childList" === t.type)
          for (const e of t.removedNodes)
            if (isElement(e)) {
              if (nodeMentionsScriptByText(e)) return void deps.requestCleanup()
              if ("function" == typeof e.querySelector) {
                const t = [...e.querySelectorAll("*")].some((e) => nodeMentionsScriptByText(e))
                if (t) return void deps.requestCleanup()
              }
            }
    })),
    hostActionObserver.observe(parentDoc.body, { childList: !0, subtree: !0 }))
}

/**
 * 拆除本模块建立的一切：观察器、轮询器、宿主点击监听。
 * 由装配层的整体 cleanup 调用（顺序上应早于 removeOwnedArtifacts）。
 */
export function teardownOwnershipRuntime() {
  ;(frameObserver && (frameObserver.disconnect(), (frameObserver = null)),
    artifactMonitor && (parentWin.clearInterval(artifactMonitor), (artifactMonitor = null)),
    hostActionObserver && (hostActionObserver.disconnect(), (hostActionObserver = null)),
    hostClickHandler &&
      (parentDoc.removeEventListener('click', hostClickHandler, !0), (hostClickHandler = null)))
}
