/**
 * composeTransform 的行为测试。
 *
 * 背景（技术债 A3）：收纳时会把球缩到 34px 以内，写法是
 * `transform: <原值> scale(倍率)` 其中「原值」取自 getComputedStyle。
 * 而浏览器把 transform 一律算成 matrix 形式，于是第二次收纳时原值里
 * 已经含了上一次的缩放，直接拼接就变成两次缩放相乘——反复收纳/拖拽同一个球，
 * 球会持续变小。
 *
 * 这里把「应当是幂等的」这条性质固定下来。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { composeTransform } from '../src/core/dom.js'

test('无原变换时直接给出缩放', () => {
  assert.equal(composeTransform('none', 0.68), 'scale(0.68)')
  assert.equal(composeTransform('', 0.5), 'scale(0.5)')
})

test('纯平移矩阵：平移不保留（收纳后位置由容器布局决定），只留缩放', () => {
  assert.equal(composeTransform('matrix(1, 0, 0, 1, 100, 200)', 0.68), 'scale(0.68)')
})

test('纯缩放矩阵：替换而非叠加（幂等，反复收纳不会越来越小）', () => {
  const once = composeTransform('none', 0.68)
  // 浏览器会把 scale(0.68) 读回成 matrix(0.68, 0, 0, 0.68, 0, 0)
  const again = composeTransform('matrix(0.68, 0, 0, 0.68, 0, 0)', 0.68)
  assert.equal(once, 'scale(0.68)')
  assert.equal(again, 'scale(0.68)')
  assert.equal(again, once, '第二次收纳的结果应与第一次相同')
})

test('缩放 + 平移的矩阵（matrix 里的 a/d 不为 1）：同样只留缩放', () => {
  assert.equal(composeTransform('matrix(0.5, 0, 0, 0.5, 12, -8)', 0.68), 'scale(0.68)')
})

test('含旋转的矩阵：保留旋转，附加缩放（矩阵的 b/c 非 0）', () => {
  assert.equal(
    composeTransform('matrix(0.68, 0.68, -0.68, 0.68, 0, 0)', 0.68),
    'matrix(0.68, 0.68, -0.68, 0.68, 0, 0) scale(0.68)',
  )
})

test('非矩阵形式的其它变换：当作没有可保留的变换', () => {
  assert.equal(composeTransform('translateX(5px)', 0.5), 'scale(0.5)')
})

test('matrix3d 不解析（保持拼接，避免误拆）', () => {
  const m3d = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'
  assert.equal(composeTransform(m3d, 0.5), `${m3d} scale(0.5)`)
})
