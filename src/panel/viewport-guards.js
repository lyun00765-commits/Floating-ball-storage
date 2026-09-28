/**
 * 视口守卫。
 *
 * 三段监听，目的都是让面板「不该动时别动、该动时跟上」：
 * 1. visualViewport 的 resize/scroll —— 移动端键盘弹出、地址栏收起时重算位置
 * 2. 输入框 focusin/focusout —— 焦点进入输入框后按时间表刷新若干次
 *    （布局是渐变的，一次算不准，所以 schedulePositionRefresh 排了 8 个时间点）
 * 3. 指针/点击守卫 —— 「点边缘页签切面板」与「键盘弹起」冲突时吃掉这次点击，
 *    避免一次操作既切了面板又触发了键盘避让
 *
 * 与 store 的关系：守卫需要切面板、需要位置刷新目标，但 store 是上层装配件，
 * 本模块不反向依赖它，改由 setup 时注入。
 */

import { parentWin, parentDoc } from '../runtime-identity.js'
import { settingsApi } from '../settings.js'
import { isElement, isOwnedNode } from '../runtime-ownership.js'
import {
  updatePanelPosition,
  schedulePositionRefresh,
  isTextInputFocused,
} from './geometry.js'

let viewportResizeHandler = null
let viewportScrollHandler = null
let focusHandler = null
let keyboardPointerHandler = null
let keyboardClickHandler = null
/** 键盘避让期间抑制点击的时间戳（毫秒） */
let keyboardToggleGuardUntil = 0

/** store 能力注入：切面板 + 拿位置刷新目标 */
let deps = {
  togglePanel: () => {},
  getPanelPositionTarget: () => () => {},
}

export function setViewportGuardDeps(next) {
  deps = { ...deps, ...next }
}

/** 事件是否来自「我们自己创建的边缘页签/面板头」 */
function isEdgeTabEvent(e) {
  const t = e?.target
  return !!(isElement(t) && isOwnedNode(t) && t.closest?.('.edge-tab,.panel-header'))
}

function preserveKeyboardToggle(e) {
  if (!settingsApi.isMobile.value || !isTextInputFocused() || !isEdgeTabEvent(e)) return
  const t = Date.now()
  ;(e.preventDefault?.(), e.stopPropagation?.())
  if (t < keyboardToggleGuardUntil) return
  ;((keyboardToggleGuardUntil = t + 450),
    deps.togglePanel(),
    schedulePositionRefresh(deps.getPanelPositionTarget()))
}

function suppressGuardedClick(e) {
  Date.now() < keyboardToggleGuardUntil && isEdgeTabEvent(e) && (e.preventDefault?.(), e.stopPropagation?.())
}

/** 第 1、2 段：视口与焦点监听 */
export function setupVisualViewportGuards(e) {
  const t = parentWin.visualViewport
  if (t) {
    ;((viewportResizeHandler = () => updatePanelPosition(e, !0)),
      (viewportScrollHandler = () => updatePanelPosition(e, !0)),
      t.addEventListener('resize', viewportResizeHandler, { passive: !0 }),
      t.addEventListener('scroll', viewportScrollHandler, { passive: !0 }))
  }
  ;((focusHandler = () => schedulePositionRefresh(e)),
    parentDoc.addEventListener('focusin', focusHandler, !0),
    parentDoc.addEventListener('focusout', focusHandler, !0))
}

/** 第 3 段：键盘与点击守卫 */
export function setupKeyboardGuards() {
  ;((keyboardPointerHandler = (e) => preserveKeyboardToggle(e)),
    (keyboardClickHandler = (e) => suppressGuardedClick(e)),
    parentDoc.addEventListener('pointerdown', keyboardPointerHandler, { capture: !0, passive: !1 }),
    parentDoc.addEventListener('touchstart', keyboardPointerHandler, { capture: !0, passive: !1 }),
    parentDoc.addEventListener('mousedown', keyboardPointerHandler, { capture: !0, passive: !1 }),
    parentDoc.addEventListener('click', keyboardClickHandler, !0))
}

/** 拆除全部监听 */
export function teardownViewportGuards() {
  const e = parentWin.visualViewport
  ;(e && viewportResizeHandler && e.removeEventListener('resize', viewportResizeHandler),
    e && viewportScrollHandler && e.removeEventListener('scroll', viewportScrollHandler),
    focusHandler &&
      (parentDoc.removeEventListener('focusin', focusHandler, !0),
      parentDoc.removeEventListener('focusout', focusHandler, !0)),
    keyboardPointerHandler &&
      (parentDoc.removeEventListener('pointerdown', keyboardPointerHandler, !0),
      parentDoc.removeEventListener('touchstart', keyboardPointerHandler, !0),
      parentDoc.removeEventListener('mousedown', keyboardPointerHandler, !0)),
    keyboardClickHandler && parentDoc.removeEventListener('click', keyboardClickHandler, !0),
    (viewportResizeHandler = null),
    (viewportScrollHandler = null),
    (focusHandler = null),
    (keyboardPointerHandler = null),
    (keyboardClickHandler = null),
    (keyboardToggleGuardUntil = 0))
}