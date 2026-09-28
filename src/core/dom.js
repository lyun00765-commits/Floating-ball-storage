/**
 * DOM 与跨 iframe 工具
 *
 * 悬浮球可能位于宿主页面，也可能位于任意子 iframe 内，且不一定能从当前 frame 直接访问，
 * 因此命中检测需要同时遍历父文档与所有可访问的 iframe 文档。
 */

export function isFloatingBoxElement(e, t = !1) {
  const n = window.parent.getComputedStyle(e)
  if (t) {
    if ("fixed" !== n.position && "absolute" !== n.position) return !1
  } else if ("fixed" !== n.position) return !1
  if ("none" === n.display || "hidden" === n.visibility) return !1
  let a = e.offsetWidth,
    o = e.offsetHeight
  if (0 === a || 0 === o) {
    const t = e.getBoundingClientRect()
    ;((a = t.width), (o = t.height))
  }
  if (a < 18 || a > 150 || o < 18 || o > 150) return !1
  const r = a / o
  return !(r < 0.5 || r > 2)
}

export function collectIframeFrames() {
  const e = []
  try {
    window.parent.document.querySelectorAll("iframe").forEach((t) => {
      try {
        t.contentDocument && e.push(t)
      } catch {
        /* 跨域 iframe 拒绝访问 contentDocument，跳过 */
      }
    })
  } catch {
    /* 父文档不可用（脚本未运行在 iframe 内） */
  }
  return e
}
export function collectIframeDocs() {
  return collectIframeFrames().map((e) => e.contentDocument)
}
export function elementsFromPointAcrossFrames(e, t) {
  const n = []
  try {
    n.push(...window.parent.document.elementsFromPoint(e, t))
  } catch {
    /* 父文档不可用时退化为只测当前文档 */
  }
  for (const a of collectIframeFrames()) {
    try {
      const o = a.getBoundingClientRect(),
        r = e - o.left,
        i = t - o.top
      if (r < 0 || i < 0 || r > o.width || i > o.height) continue
      n.push(...a.contentDocument.elementsFromPoint(r, i))
    } catch {
      /* 同上：跨域 iframe 跳过 */
    }
  }
  return n
}
export function composeTransform(e, t) {
  const s = `scale(${t})`
  if (!e || "none" === e) return s
  if (!/(rotate|skew|scale|matrix|matrix3d)/.test(e)) return s
  const n = e.match(/^matrix\(([^)]+)\)$/)
  if (n) {
    const a = n[1].split(",").map((e) => parseFloat(e))
    // b、c 均为 0 说明没有旋转/倾斜，此时缩放由本函数接管：直接**替换**而不是拼接。
    // 浏览器把 transform 一律算成 matrix 形式，若原值里已含上一次的缩放（例如
    // matrix(0.68, 0, 0, 0.68, 0, 0)），拼接就变成两次缩放相乘——反复收纳或拖拽
    // 同一个球时它会越缩越小（技术债 A3）。
    // 注意：含旋转的情况仍走拼接，这类元素极少见，暂不处理。
    if (a.length >= 6 && 0 === a[1] && 0 === a[2]) return s
  }
  return `${e} ${s}`
}
