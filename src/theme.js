/**
 * 主题同步。
 *
 * 从父窗口（酒馆本体）读取 CSS 变量，映射成面板配色；
 * 并用 MutationObserver 盯住父窗口 head/body/documentElement/#chat 的 class/style 变化。
 *
 * 脚本本身跑在 iframe 里，跨域时访问 window.parent 会抛错，
 * 因此整体包了 try/catch，失败时保持默认配色。
 */

import { debounceSource } from './debounce.js'
import { withAlpha, darken } from './core/color.js'

export const themeColors = Vue.ref({
  barBg: "rgba(30, 30, 40, 0.9)",
  controlBg: "rgba(45, 55, 72, 0.8)",
  controlHoverBg: "rgba(35, 45, 62, 0.8)",
  buttonBg: "rgba(74, 85, 104, 0.8)",
  textColor: "#e2e8f0",
  borderColor: "#718096",
  hoverBg: "rgba(20, 20, 30, 0.9)",
  panelBg: "rgba(26, 32, 44, 1)",
  quoteColor: "#9ca3af",
  glassBg: "rgba(30, 30, 40, 0.8)",
  glassHoverBg: "rgba(20, 20, 30, 0.7)",
})

let themeObserver = null
const updateThemeColors = () => {
  try {
    const e = window.parent.document
    let t = "rgba(30, 30, 40, 0.9)",
      n = "rgba(20, 20, 30, 0.9)",
      a = "rgba(45, 55, 72, 0.8)",
      o = "rgba(35, 45, 62, 0.8)",
      r = "rgba(74, 85, 104, 0.8)",
      i = "#e2e8f0",
      l = "#718096",
      s = "rgba(26, 32, 44, 1)",
      A = "#9ca3af",
      c = "rgba(30, 30, 40, 0.6)",
      p = "rgba(20, 20, 30, 0.7)"
    const d = (() => {
      if ("function" != typeof $) {
        const e = window.parent.document.querySelector(".simplebar-content-wrapper") || window.parent.document.querySelector("#chat")
        return e || null
      }
      const e = $(window.parent.document),
        t = [".simplebar-content-wrapper", "#chat"]
      for (const n of t) {
        const t = e.find(n)
        if (t.length > 0) return t.first()
      }
      return null
    })()
    if (d) {
      let a = window.parent.getComputedStyle(d[0]).backgroundColor
      ;(("rgba(0, 0, 0, 0)" !== a && "transparent" !== a) ||
        (a = window.parent.getComputedStyle(e.body).backgroundColor),
        (s = withAlpha(a, 1)))
      const o = e.querySelector("#top-bar")
      if (o) {
        const e = window.parent.getComputedStyle(o).backgroundColor
        t = withAlpha("rgba(0, 0, 0, 0)" !== e && "transparent" !== e ? e : a, 1)
      } else t = withAlpha(a, 1)
      ;((n = darken(t, 0.15)), (c = withAlpha(t, 0.6)), (p = withAlpha(n, 0.7)))
    }
    const u = e.querySelector(".mes:not(.user-mes)")
    if (u) {
      const e = window.parent.getComputedStyle(u).backgroundColor
      ;((a = withAlpha(e, 1)), (o = darken(a, 0.15)))
    }
    const g = e.querySelector(".mes_text")
    g && (i = window.parent.getComputedStyle(g).color)
    const C = e.querySelector(".mes_text blockquote")
    if (C) A = window.parent.getComputedStyle(C).color
    else {
      const t = e.querySelector("blockquote")
      if (t) A = window.parent.getComputedStyle(t).color
      else {
        const t = window.parent.getComputedStyle(e.documentElement).getPropertyValue("--SmartThemeQuoteColor").trim()
        t && (A = t)
      }
    }
    const f = e.querySelector(".fa-solid")
    if (f) {
      const e = window.parent.getComputedStyle(f).color
      r = withAlpha(e, 1)
    }
    const b = e.querySelector("#send_textarea")
    ;(b && (l = window.parent.getComputedStyle(b).borderColor),
      (themeColors.value = {
        barBg: t,
        hoverBg: n,
        controlBg: a,
        controlHoverBg: o,
        buttonBg: r,
        textColor: i,
        borderColor: l,
        panelBg: s,
        quoteColor: A,
        glassBg: c,
        glassHoverBg: p,
      }))
  } catch (e) {
    console.warn("[集成控件] 获取父窗口样式失败:", e)
  }
}

export const themeApi = {
  themeColors: themeColors,
  initializeThemeObserver: () => {
    updateThemeColors()
    try {
      const e = (0, debounceSource.debounce)(updateThemeColors, 250)
      ;((themeObserver = new MutationObserver(e)),
        themeObserver.observe(window.parent.document.head, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }),
        themeObserver.observe(window.parent.document.body, { attributes: !0, attributeFilter: ["class", "style"] }),
        themeObserver.observe(window.parent.document.documentElement, { attributes: !0, attributeFilter: ["style", "class"] }))
      const t = window.parent.document.querySelector("#chat")
      ;(t && themeObserver.observe(t, { attributes: !0, attributeFilter: ["style", "class"], childList: !0 }),
        console.log("[集成控件] 主题监听器已初始化"))
    } catch (e) {
      console.error("[集成控件] 无法监听主题变化:", e)
    }
  },
  disconnectThemeObserver: () => {
    themeObserver?.disconnect()
  },
  updateThemeColors: updateThemeColors,
}
