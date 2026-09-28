/**
 * 面板几何与定位。
 *
 * 面板贴在父窗口的四个方向之一，但「贴在哪」并不总是视口边：
 * - left/right：直接取可视视口边界
 * - top/bottom：优先贴输入框（textarea 等）或侧栏，其次才是视口边；
 *   锚点未就绪时返回 null —— 宁可不定位，也不让面板跳到边缘（外面靠定时刷新重试）
 *
 * 另处理键盘弹出（移动端 visualViewport 缩小时，top/bottom 改贴视口）。
 */

import { parentWin, parentDoc } from "../runtime-identity.js"
import { settingsApi } from "../settings.js"
export function resolveAnchorBottom() {
  const e = window.parent.document,
    t = e.querySelector("#sheld")
  if (t) return t
  const n = e.querySelector("#chat")
  if (n) return n
  const a = e.querySelector(".simplebar-content-wrapper")
  return a || null
}
export function resolveInputAnchor() {
  const e = window.parent.document,
    t = e.querySelector("#top-settings-holder")
  if (t) return t
  const n = e.querySelector(".top-settings-holder")
  return n || null
}
export function resolveSidebarAnchor() {
  const e = window.parent.document,
    t = e.querySelector("#form_sheld")
  if (t) return t
  const n = e.querySelector("#send_form")
  return n || null
}
export function edgePanelViewportBounds() {
  const e = parentWin,
    t = e.visualViewport
  if (t && t.width && t.height) {
    const e = t.offsetLeft || 0,
      n = t.offsetTop || 0
    return { left: e, top: n, right: e + t.width, bottom: n + t.height, width: t.width, height: t.height }
  }
  return { left: 0, top: 0, right: e.innerWidth, bottom: e.innerHeight, width: e.innerWidth, height: e.innerHeight }
}
export function edgePanelFocusedInputRect() {
  try {
    const e = parentDoc.activeElement
    if (!e) return null
    const t = String(e.tagName || "").toLowerCase(),
      n = "textarea" === t || "input" === t || !!e.isContentEditable || !!e.closest?.('[contenteditable="true"]')
    if (!n || "function" != typeof e.getBoundingClientRect) return null
    const a = e.getBoundingClientRect()
    return a && a.height && a.width ? a : null
  } catch (e) {
    return null
  }
}
export function edgePanelIsTextInputFocused() {
  return !!edgePanelFocusedInputRect()
}
export function edgePanelKeyboardOpen() {
  try {
    return !!(settingsApi.isMobile.value && edgePanelIsTextInputFocused())
  } catch (e) {
    return !1
  }
}
export function edgePanelClampPanelAnchor(e, t) {
  const n = edgePanelViewportBounds(),
    a = 8
  if ("top" === e) return Math.max(t, n.top + a)
  if ("bottom" === e) {
    const o = resolveSidebarAnchor()
    if (o) {
      const t = o.getBoundingClientRect()
      let i = t.top
      if (edgePanelKeyboardOpen()) {
        const l = edgePanelFocusedInputRect()
        if (l && l.top > n.top + 120 && l.top < n.bottom - a) {
          i = Math.min(i, l.top - a)
        }
      }
      return Math.max(n.top + 28, i)
    }
    if (edgePanelKeyboardOpen()) {
      let i = n.bottom - 96 - a,
        l = edgePanelFocusedInputRect()
      return (l && l.top > n.top + 120 && l.top < n.bottom - a && (i = Math.min(i, l.top - a)), Math.max(n.top + 28, i))
    }
    const e = n.bottom - a
    return Math.max(n.top + 28, Math.min(t, e))
  }
  return t
}
export function edgePanelPx(e) {
  return `${Math.round(e)}px`
}
export function edgePanelSchedulePositionRefresh(e) {
  ;[0, 80, 220, 480, 820, 1500, 2600, 4000].forEach((t) => parentWin.setTimeout(() => updatePanelPosition(e, !0), t))
}
/** 上一次已提交的位置；避免重复提交相同值触发无谓的布局写入 */
let committedPosition = null

/** 忘掉上次已提交的位置，使下一次 updatePanelPosition 必定提交（初始化与清理时用） */
export function resetPositionMemory() {
  committedPosition = null
}

export function updatePanelPosition(e, t = !1) {
  const n = (function (e) {
    const t = resolveAnchorBottom(),
      n = resolveInputAnchor(),
      a = resolveSidebarAnchor(),
      o = edgePanelViewportBounds()
    switch (e) {
      case "left":
        return edgePanelPx(o.left)
      case "right":
        return edgePanelPx(o.right)
      case "top":
        if (n) {
          const t = n.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, t.bottom))
        }
        if (t) {
          const n = t.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, n.top))
        }
        // 锚点未就绪：不提交视口兜底值（避免面板跳到顶部/底部边缘），等锚点出现后由定时刷新校正
        return null
      case "bottom":
        if (edgePanelKeyboardOpen()) return edgePanelPx(edgePanelClampPanelAnchor(e, o.bottom))
        if (a) {
          const t = a.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, t.top))
        }
        if (t) {
          const n = t.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, n.bottom))
        }
        // 锚点未就绪：不提交视口兜底值（避免面板跳到顶部/底部边缘），等锚点出现后由定时刷新校正
        return null
      default:
        if (t) {
          const e = t.getBoundingClientRect()
          return edgePanelPx(e.right)
        }
        return edgePanelPx(o.right)
    }
  })(settingsApi.effectivePosition.value)
  if (null !== n) {
    ;(t || committedPosition !== n) && ((committedPosition = n), e(n))
  }
}
