/**
 * 视觉重叠判定的单元测试（core/overlap.js，纯函数）。
 *
 * 覆盖的规则（要随实现一起演进）：
 * - 重叠度 = 相交面积 ÷ 较小矩形面积：同心嵌套（环形外框套球）→ 1
 * - 「谁更像球本体」：有内容的赢 → 面积小的赢 → 平局按 DOM 序必分胜负
 *
 * 背景：球本体与环形外框是兄弟节点、各自 fixed 叠在一起，
 * 基于 contains 的去重拦不住，会被当成两个球都收进面板。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  OVERLAP_THRESHOLD,
  preferredBallElement,
  rectOverlapRatio,
} from '../src/core/overlap.js'

/** 构造矩形字面量（与 getBoundingClientRect 的字段对齐） */
function rect(left, top, size) {
  return { left, top, right: left + size, bottom: top + size, width: size, height: size }
}

/** 构造假元素：内容有无、矩形、DOM 序均可控 */
function fakeEl({ content = false, r = rect(0, 0, 48), after = false } = {}) {
  return {
    querySelector: () => (content ? {} : null),
    textContent: content ? '球' : '',
    getBoundingClientRect: () => r,
    compareDocumentPosition: () => (after ? 4 : 2), // 4 = 对方在后，2 = 对方在前
  }
}

test('同心嵌套（环形外框套球）重叠度为 1', () => {
  const ball = rect(6, 6, 48) // 球本体 48px
  const ring = rect(0, 0, 60) // 外框 60px，同心套在外面
  assert.equal(rectOverlapRatio(ball, ring), 1)
  assert.equal(rectOverlapRatio(ring, ball), 1) // 分母是较小面积，方向无关
})

test('完全相离重叠度为 0，紧邻相切也为 0', () => {
  assert.equal(rectOverlapRatio(rect(0, 0, 48), rect(100, 100, 48)), 0)
  assert.equal(rectOverlapRatio(rect(0, 0, 48), rect(48, 0, 48)), 0)
})

test('部分重叠按较小面积为分母，超过阈值才算「同一坨」', () => {
  // 48px 球横向错位 24px：相交 24×48，较小面积 48×48 → 0.5，不超阈值
  assert.equal(rectOverlapRatio(rect(0, 0, 48), rect(24, 0, 48)), 0.5)
  assert.ok(!(rectOverlapRatio(rect(0, 0, 48), rect(24, 0, 48)) > OVERLAP_THRESHOLD))
  // 错位 4px（外框轻微偏移的常见情形）：比值约 0.917 → 判定重叠
  assert.ok(rectOverlapRatio(rect(0, 0, 48), rect(4, 0, 48)) > OVERLAP_THRESHOLD)
})

test('零面积矩形不产生重叠，也不抛错', () => {
  const zero = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }
  assert.equal(rectOverlapRatio(zero, rect(0, 0, 48)), 0)
})

test('重叠双方：有内容（图标/文字）的更像球本体', () => {
  const ball = fakeEl({ content: true, r: rect(6, 6, 48) })
  const ring = fakeEl({ content: false, r: rect(0, 0, 60) })
  assert.equal(preferredBallElement(ball, ring), ball)
  assert.equal(preferredBallElement(ring, ball), ball)
})

test('都无内容时面积小的赢（外框比球大一圈）', () => {
  const inner = fakeEl({ r: rect(6, 6, 48) })
  const outer = fakeEl({ r: rect(0, 0, 60) })
  assert.equal(preferredBallElement(inner, outer), inner)
  assert.equal(preferredBallElement(outer, inner), inner)
})

test('完全平局按 DOM 序决胜，两两比较必分胜负', () => {
  const a = fakeEl({ after: true }) // a 的视角里对方在后 → a 是 DOM 序靠前者
  const b = fakeEl({ after: false })
  // 靠前的恒赢，与参数顺序无关（保证反对称：两个方向比较落败的都是同一个）
  assert.equal(preferredBallElement(a, b), a)
  assert.equal(preferredBallElement(b, a), a)
})
