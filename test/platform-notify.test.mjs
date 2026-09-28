/**
 * notify 的容错测试（技术债 A4）。
 *
 * toastr 是宿主注入的全局。裸调用它有两个风险：宿主未注入时 `toastr is not defined`，
 * 或宿主实现内部抛错。最严重的后果出现在手动点选捕获里——提示语排在
 * 「移除遮罩」之前，一旦抛出，遮罩会永久留在页面上，页面点击全被拦截。
 *
 * 这里把「无论 toastr 是什么状态，notify 都不能抛」固定下来。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

const loadPlatform = async () => {
  // 每次重新 import，避免模块级缓存影响注入的全局
  const url = new URL('../src/core/platform.js', import.meta.url).href + `?t=${Date.now()}${Math.random()}`
  return import(url)
}

test('宿主未注入 toastr 时，notify 各方法都不抛错', async () => {
  const prev = globalThis.toastr
  delete globalThis.toastr
  try {
    const { notify } = await loadPlatform()
    assert.doesNotThrow(() => notify.info('hi'))
    assert.doesNotThrow(() => notify.success('hi'))
    assert.doesNotThrow(() => notify.warning('hi'))
    assert.doesNotThrow(() => notify.error('hi'))
  } finally {
    if (prev !== undefined) globalThis.toastr = prev
  }
})

test('toastr 存在时正常转发到对应级别', async () => {
  const calls = []
  globalThis.toastr = {
    info: (m) => calls.push(['info', m]),
    success: (m) => calls.push(['success', m]),
    warning: (m) => calls.push(['warning', m]),
    error: (m) => calls.push(['error', m]),
  }
  try {
    const { notify } = await loadPlatform()
    notify.success('已捕获: 球')
    notify.warning('请点击一个悬浮元素')
    assert.deepEqual(calls, [['success', '已捕获: 球'], ['warning', '请点击一个悬浮元素']])
  } finally {
    delete globalThis.toastr
  }
})

test('toastr 实现内部抛错时，异常被吞掉（不能影响调用方后续逻辑）', async () => {
  globalThis.toastr = {
    info: () => {
      throw new Error('宿主实现炸了')
    },
  }
  try {
    const { notify } = await loadPlatform()
    let reached = false
    assert.doesNotThrow(() => {
      notify.info('hi')
      reached = true // 模拟「移除遮罩」这类必须执行的后续步骤
    })
    assert.equal(reached, true, '提示失败后，调用方的后续步骤必须继续执行')
  } finally {
    delete globalThis.toastr
  }
})

test('toastr 缺失某个级别的方法时不影响其它级别', async () => {
  globalThis.toastr = { info: () => {} } // 只有 info
  try {
    const { notify } = await loadPlatform()
    assert.doesNotThrow(() => notify.success('hi'))
    assert.doesNotThrow(() => notify.info('hi'))
  } finally {
    delete globalThis.toastr
  }
})
