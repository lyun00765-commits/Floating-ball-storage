/**
 * 悬浮球展示信息提取
 *
 * 从页面元素上推断用于面板展示的图标与名称。
 */

export function getElementIcon(e) {
  const t = e.querySelector('i[class*="fa-"]')
  if (t) {
    const e = t.className
      .split(" ")
      .filter(
        (e) =>
          e.startsWith("fa-") ||
          "fa" === e ||
          e.startsWith("fas") ||
          e.startsWith("far") ||
          e.startsWith("fab") ||
          "fa-solid" === e ||
          "fa-regular" === e ||
          "fa-brands" === e,
      )
    return e.length > 0 ? e.join(" ") : t.className
  }
  const n = e.querySelector('.ball-inner i, [class*="inner"] i, [class*="content"] i')
  if (n) {
    const e = n.className
      .split(" ")
      .filter(
        (e) =>
          e.startsWith("fa-") ||
          "fa" === e ||
          e.startsWith("fas") ||
          e.startsWith("far") ||
          e.startsWith("fab") ||
          "fa-solid" === e ||
          "fa-regular" === e ||
          "fa-brands" === e,
      )
    return e.length > 0 ? e.join(" ") : n.className
  }
  const a = e.querySelector("i")
  if (a && a.className) return a.className
  if (e.querySelector("svg")) return "fa-solid fa-circle"
  return e.querySelector("img") ? "fa-solid fa-image" : "fa-solid fa-puzzle-piece"
}
export function getElementName(e) {
  const t = e.getAttribute("title")
  if (t) return t
  const n = e.getAttribute("aria-label")
  if (n) return n
  const a = e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")
  return a || "悬浮球"
}
