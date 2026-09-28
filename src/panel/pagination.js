/**
 * 悬浮球容器分页
 *
 * 面板空间有限，收纳的球按布局方向分页：
 *   垂直布局（左/右贴边）：每页 {PER_PAGE.vertical{'}'} 个，纵向排列
 *   水平布局（上/下贴边）：每页 {PER_PAGE.horizontal{'}'} 个，横向排列
 *
 * 两个方向当前取相同值，让翻页行为在切换贴边方向时保持一致、可预期。
 * 若将来垂直方向能容纳更多，只调这里即可——但必须同时保证 reorient() 会重新分页。
 *
 * 宿主结构：容器 > .fb-pages-layer > .fb-page × N > 悬浮球
 */

let ballContainer = null
let pageLayer = null
let pageIndex = 0
let pageCount = 1
const PER_PAGE = { horizontal: 3, vertical: 3 }
function perPage() {
  return isHorizontal() ? PER_PAGE.horizontal : PER_PAGE.vertical
}
function isHorizontal() {
  if (!ballContainer) return !1
  // horizontal flag 在根容器 .edge-panel-root 上, 向上查找
  let n = ballContainer
  while (n && !(n.classList && n.classList.contains("edge-panel-root"))) n = n.parentNode
  return !!(n && n.classList && n.classList.contains("edge-panel-root--horizontal"))
}
function createPage() {
  const p = window.parent.document.createElement("div")
  p.className = "fb-page"
  p.style.display = "flex"
  p.style.flexDirection = isHorizontal() ? "row" : "column"
  p.style.alignItems = "center"
  p.style.justifyContent = "center"
  p.style.flexShrink = "0"
  p.setAttribute("data-fb-page", String(pageLayer ? pageLayer.children.length : 0))
  if (pageLayer) pageLayer.appendChild(p)
  return p
}
export function appendBall(el, before) {
  if (!pageLayer) return
  if (before && before.parentNode && pageLayer.contains(before)) {
    // 插到某个已有球之前（恢复已收纳球时按 order 维持顺序走这条路径）。
    // 这会打破分页：目标页可能变成 4 个，而它后面的球也没能往前补位。
    // 因此超容时必须重新打包；只在超容时做，避免恢复大量球时反复重排。
    const targetPage = before.parentNode
    targetPage.insertBefore(el, before)
    if (targetPage.children.length > perPage()) compact()
    else rebuild()
    return
  }
  let page = pageLayer.children.length ? pageLayer.children[pageLayer.children.length - 1] : null
  if (!page || page.children.length >= perPage()) page = createPage()
  page.appendChild(el)
  rebuild()
}
function rebuild() {
  if (!pageLayer) return
  pageCount = Math.max(1, pageLayer.children.length)
  if (pageIndex >= pageCount) pageIndex = pageCount - 1
  if (pageIndex < 0) pageIndex = 0
  applyPage()
  updateArrows()
}
export function reorient() {
  if (!pageLayer) return
  const horiz = isHorizontal()
  pageLayer.style.flexDirection = horiz ? "row" : "column"
  for (let k = 0; k < pageLayer.children.length; k++) {
    pageLayer.children[k].style.flexDirection = horiz ? "row" : "column"
  }
  // 每页容量取决于当前布局，切换贴边方向后必须按新容量**重新分页**：
  // 否则会沿用切换前的页划分（例如水平布局切成垂直后，仍是一页塞 4 个）。
  compact()
}
function applyPage() {
  if (!pageLayer) return
  const horiz = isHorizontal()
  for (let k = 0; k < pageLayer.children.length; k++) {
    const p = pageLayer.children[k]
    p.style.flexDirection = horiz ? "row" : "column"
    p.style.display = k === pageIndex ? "flex" : "none"
  }
}
export function goPage(d) {
  pageIndex = Math.max(0, Math.min(pageCount - 1, pageIndex + d))
  applyPage()
  updateArrows()
}
function updateArrows() {
  const doc = window.parent && window.parent.document ? window.parent.document : document
  const prev = doc.querySelector("[data-fb-page-prev]")
  const next = doc.querySelector("[data-fb-page-next]")
  if (prev) prev.classList.toggle("fb-arrow--disabled", pageIndex <= 0)
  if (next) next.classList.toggle("fb-arrow--disabled", pageIndex >= pageCount - 1)
}
function compact() {
  if (!pageLayer) return
  // 按视觉顺序收集所有页里的球
  const balls = []
  for (let i = 0; i < pageLayer.children.length; i++) {
    const p = pageLayer.children[i]
    for (let j = 0; j < p.children.length; j++) balls.push(p.children[j])
  }
  // 清空所有页
  while (pageLayer.firstChild) pageLayer.removeChild(pageLayer.firstChild)
  // 重新顺位打包：每页填满 fbPerPage() 个，后面球自动补位
  const per = perPage(),
    doc = window.parent && window.parent.document ? window.parent.document : document,
    horiz = isHorizontal()
  let page = null
  balls.forEach((b) => {
    if (!page || page.children.length >= per) {
      page = doc.createElement("div")
      page.className = "fb-page"
      page.style.display = "flex"
      page.style.flexDirection = horiz ? "row" : "column"
      page.style.alignItems = "center"
      page.style.justifyContent = "center"
      page.style.flexShrink = "0"
      pageLayer.appendChild(page)
    }
    page.appendChild(b)
  })
  rebuild()
  applyPage()
  updateArrows()
}
export function compactAfterRemove(el) {
  if (!el || !el.parentNode) return
  el.parentNode.removeChild(el)
  compact()
}
export function getContainer() {
  return ballContainer
}

export function setBallContainer(e) {
    ballContainer = e
    pageLayer = null
    if (e) {
      const horiz = (function () {
        let n = e
        while (n && !(n.classList && n.classList.contains("edge-panel-root"))) n = n.parentNode
        return !!(n && n.classList && n.classList.contains("edge-panel-root--horizontal"))
      })()
      pageLayer = window.parent.document.createElement("div")
      pageLayer.className = "fb-pages-layer"
      pageLayer.style.display = "flex"
      pageLayer.style.flexDirection = horiz ? "row" : "column"
      createPage()
      e.appendChild(pageLayer)
    }
    pageIndex = 0
    rebuild()
  }

export function getPageState() {
  return { index: pageIndex, count: pageCount, per: perPage() }
}

/** 按视觉顺序返回当前收纳的所有悬浮球（跨分页） */
export function getBallsInOrder() {
  const balls = []
  if (!pageLayer) return balls
  for (const page of Array.from(pageLayer.children))
    for (const ball of Array.from(page.children)) balls.push(ball)
  return balls
}

/** 元素是否已被收纳进分页层 */
export function containsBall(el) {
  return !!(pageLayer && el && pageLayer.contains(el))
}
