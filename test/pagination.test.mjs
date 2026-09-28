/**
 * 容器分页的行为测试。
 *
 * 覆盖的规则（要随实现一起演进）：
 * - 每页容量：两个贴边方向统一 3 个（曾经是水平 3 / 垂直 5）
 * - 超出容量自动开新页
 * - 翻页不越界
 * - **切换贴边方向后按新容量重新分页**
 * - 删除球后后面的球前移补位
 *
 * 最后一条曾是真 bug：reorient() 只改排列方向不重新分页，
 * 导致「顶部 4 个球 = 2 页，切到右侧再切回顶部后变成 1 页 4 个」。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { setupPanelEnv, makeBall } from './helpers/mini-dom.mjs'

/** 每次重新加载模块，避免 ballContainer/pageLayer 等模块级状态在用例间串味 */
async function loadPagination() {
  const url = new URL('../src/panel/pagination.js', import.meta.url).href
  return import(`${url}?t=${Date.now()}-${Math.random()}`)
}

/** 建立「面板 + 球容器」并装入 n 个球，返回句柄 */
async function envWithBalls(n, { horizontal = false } = {}) {
  const env = setupPanelEnv({ horizontal })
  const p = await loadPagination()
  p.setBallContainer(env.container)
  const balls = []
  for (let i = 0; i < n; i++) {
    const b = makeBall(env.doc, `ball-${i + 1}`)
    balls.push(b)
    p.appendBall(b)
  }
  return { ...env, p, balls }
}

test('每页容量：两个贴边方向都是 3', async () => {
  const a = await envWithBalls(0)
  assert.equal(a.p.getPageState().per, 3, '垂直布局')
  a.restore()

  const b = await envWithBalls(0, { horizontal: true })
  assert.equal(b.p.getPageState().per, 3, '水平布局')
  b.restore()
})

test('4 个球分成两页：3 + 1', async () => {
  const e = await envWithBalls(4)
  const st = e.p.getPageState()
  assert.equal(st.count, 2, '页数')
  assert.equal(st.index, 0, '初始停在第 1 页')
  // 第 1 页 3 个、第 2 页 1 个
  const layer = e.container.children[0]
  assert.equal(layer.children.length, 2)
  assert.equal(layer.children[0].children.length, 3)
  assert.equal(layer.children[1].children.length, 1)
  e.restore()
})

test('刚好填满一页时不产生空页', async () => {
  const e = await envWithBalls(3)
  assert.equal(e.p.getPageState().count, 1)
  e.restore()
})

test('翻页不越界', async () => {
  const e = await envWithBalls(4)
  e.p.goPage(-1)
  assert.equal(e.p.getPageState().index, 0, '第 1 页再往前仍停在第 1 页')
  e.p.goPage(1)
  assert.equal(e.p.getPageState().index, 1, '可翻到第 2 页')
  e.p.goPage(1)
  assert.equal(e.p.getPageState().index, 1, '最后一页再往后仍停在最后一页')
  e.restore()
})

test('reorient 会重新分页（回归）', async () => {
  const e = await envWithBalls(4, { horizontal: true })
  assert.equal(e.p.getPageState().count, 2)

  // 直接制造「一页塞了 4 个」的不合规状态——这正是旧行为的结果：
  // 切换布局后不重新分页，页划分沿用切换前那一套。
  // 注意：不能只比较「切换前后的页数」——两个方向容量相同时，
  // 即使完全不重新分页，页数也依然正确，那样的断言区分不出修复与否。
  const layer = e.container.children[0]
  const [page1, page2] = layer.children
  while (page2.firstChild) page1.appendChild(page2.firstChild)
  assert.equal(page1.children.length, 4, '前提：已制造出越界状态')

  e.root.className = 'edge-panel-root'
  e.p.reorient()

  const after = e.container.children[0]
  assert.equal(e.p.getPageState().count, 2, 'reorient 后应重新分页')
  assert.equal(after.children[0].children.length, 3, '第 1 页回到 3 个')
  assert.equal(after.children[1].children.length, 1, '第 2 页 1 个')
  e.restore()
})

test('删除球后后面的球前移补位，页数随之减少', async () => {
  const e = await envWithBalls(4)
  assert.equal(e.p.getPageState().count, 2)

  e.p.compactAfterRemove(e.balls[0]) // 删掉第 1 页的一个
  const st = e.p.getPageState()
  assert.equal(st.count, 1, '4 个减 1 个后只剩一页')
  const layer = e.container.children[0]
  assert.equal(layer.children.length, 1, '只剩 1 个页元素')
  assert.equal(layer.children[0].children.length, 3, '3 个球全部收进这一页')
  e.restore()
})

test('页数变少时当前页码被拉回有效范围', async () => {
  const e = await envWithBalls(6) // 2 页
  e.p.goPage(1)
  assert.equal(e.p.getPageState().index, 1)
  e.p.compactAfterRemove(e.balls[5])
  e.p.compactAfterRemove(e.balls[4])
  e.p.compactAfterRemove(e.balls[3]) // 剩 3 个 → 1 页
  assert.equal(e.p.getPageState().count, 1)
  assert.equal(e.p.getPageState().index, 0, '页码应被拉回 0')
  e.restore()
})

test('带 before 的插入（恢复路径）仍遵守每页容量（回归）', async () => {
  const e = await envWithBalls(3) // 先正常放满一页：3 个
  assert.equal(e.p.getPageState().count, 1)

  // 模拟刷新后的恢复：球带 order，会走 appendBall(el, before) 这条路径，
  // 即「插到某个已有球前面」而不是「追加到末尾」。
  const b4 = makeBall(e.doc, 'ball-4')
  e.p.appendBall(b4, e.balls[0])

  const layer = e.container.children[0]
  assert.equal(e.p.getPageState().count, 2, '插入后应分成两页')
  assert.equal(layer.children.length, 2, '页元素数量')
  assert.equal(layer.children[0].children.length, 3, '第 1 页仍是 3 个（不超容）')
  assert.equal(layer.children[1].children.length, 1, '第 2 页 1 个')
  e.restore()
})

test('插入到中间时保持顺序且不超容', async () => {
  const e = await envWithBalls(3)
  // 插到第 2 个球之前
  const b4 = makeBall(e.doc, 'ball-4')
  e.p.appendBall(b4, e.balls[1])

  const ids = []
  const layer = e.container.children[0]
  for (const page of layer.children) for (const b of page.children) ids.push(b.getAttribute('data-edge-ball-id'))
  assert.deepEqual(ids, ['ball-1', 'ball-4', 'ball-2', 'ball-3'], '顺序应保持')
  assert.equal(e.p.getPageState().count, 2, '4 个球应分两页')
  e.restore()
})
