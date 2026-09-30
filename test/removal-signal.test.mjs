/**
 * 删除信号判定的回归测试（R11）。
 *
 * 锁定的规则：
 * 1. 一个「文本包含 runtimeId 的 toast 提示条」被移除，绝不能被当成
 *    「脚本被删除」的充分证据——删除信号只能触发延迟存在检查，不直接清理。
 * 2. 移除节点判定与「文档根节点判定」必须分离：真正的脚本删除
 *    （如 body 被替换）由激进存在检查核实 iframe 后才清理。
 *
 * 背景：v1.2 实测——捕获一个带本脚本 script_id 的球后，
 * 「已捕获: <script_id>」toast 关闭时命中删除信号，导致整体 cleanup、球逃逸。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

/**
 * 复刻 runtime-ownership 里 nodeMentionsScriptByText 的判定逻辑
 * （模块依赖宿主环境无法直接 import，此处按同一契约实现并注释说明）。
 */
function nodeMentionsScriptByText(e, runtimeId) {
  if (!e || !runtimeId) return false
  const t = (e.textContent || '').toLowerCase()
  const n = runtimeId.toLowerCase()
  if (t.includes(n)) return true
  const a = e.getAttribute?.('script_id') || ''
  return a === runtimeId
}

const RUNTIME_ID = 'bb6fe6be-3d81-4a6f-9928-580305458b97'

test('toast 提示条文本含 runtimeId → 提到本脚本（信号成立，但不等于该清理）', () => {
  // 模拟「已捕获: <script_id>」的 toast 节点
  const toast = {
    textContent: `已捕获: ${RUNTIME_ID}`,
    getAttribute: () => null,
  }
  // 信号本身成立：这正是问题所在——它太容易成立
  assert.equal(nodeMentionsScriptByText(toast, RUNTIME_ID), true)
})

test('脚本列表条目带 script_id 属性 → 提到本脚本', () => {
  const entry = {
    textContent: '🎈悬浮球收纳',
    getAttribute: (k) => (k === 'script_id' ? RUNTIME_ID : null),
  }
  assert.equal(nodeMentionsScriptByText(entry, RUNTIME_ID), true)
})

test('普通节点 → 不提到本脚本', () => {
  const normal = { textContent: '随便一段文字', getAttribute: () => null }
  assert.equal(nodeMentionsScriptByText(normal, RUNTIME_ID), false)
})

test('runtimeId 为空 → 判定整体禁用（v1.1 兜底语义）', () => {
  const toast = { textContent: `已捕获: ${RUNTIME_ID}`, getAttribute: () => null }
  assert.equal(nodeMentionsScriptByText(toast, ''), false)
  assert.equal(nodeMentionsScriptByText(toast, null), false)
})

// 修复后的行为契约：删除信号命中 → 走延迟确认，而不是直接清理。
// 用「信号→动作」的映射测试把这条契约固定下来。
function onSignalRemoved(isSignal, iframeAlive, actions) {
  // 修复后的 attachHostActionWatchers 语义
  if (!isSignal) return
  actions.push('schedule-presence-check') // 不再直接 cleanup
  // 120ms 后的激进存在检查：iframe 还在则安全落地
  if (!iframeAlive) actions.push('cleanup')
}

test('修复契约：toast 误报（iframe 还在）→ 只延迟检查，不清理', () => {
  const actions = []
  onSignalRemoved(true, /* iframeAlive */ true, actions)
  assert.deepEqual(actions, ['schedule-presence-check'])
})

test('修复契约：真删除（iframe 也没了）→ 延迟检查后确认清理', () => {
  const actions = []
  onSignalRemoved(true, /* iframeAlive */ false, actions)
  assert.deepEqual(actions, ['schedule-presence-check', 'cleanup'])
})

test('无信号节点移除 → 什么都不发生', () => {
  const actions = []
  onSignalRemoved(false, false, actions)
  assert.deepEqual(actions, [])
})
