/**
 * 视觉重叠判定（纯函数，不触碰宿主环境，可直接单元测试）。
 *
 * 用途：识别「球本体 + 环形外框」这类**兄弟关系**的装饰结构。
 * scanner 的去重原本只看 DOM 包含关系（contains），环形外框与球本体
 * 互不含包、各自 position:fixed 叠在一起，会被当成两个球都收进面板。
 * 这里提供矩形重叠度与「谁更可能是球本体」的判定，供扫描去重与
 * 释放连带（view.js）使用。
 */

/** 重叠判定阈值：相交面积 ÷ 较小矩形面积 超过该值视为「同一坨」（同心嵌套 → 1） */
export const OVERLAP_THRESHOLD = 0.5;

/**
 * 两个矩形的重叠度：相交面积 ÷ 较小矩形的面积。
 * - 完全同心嵌套（环形外框套球）→ 1
 * - 毫不相交 → 0
 * 用「较小面积」做分母：外框比球大一圈时，相交部分 = 球面积，比值仍为 1。
 *
 * @param {{left:number, top:number, right:number, bottom:number, width:number, height:number}} a
 * @param {{left:number, top:number, right:number, bottom:number, width:number, height:number}} b
 */
export function rectOverlapRatio(a, b) {
  const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const minArea = Math.min(a.width * a.height, b.width * b.height);
  return minArea > 0 ? (x * y) / minArea : 0;
}

/**
 * 两个高度重叠的候选里，谁更可能是「球本体」而不是装饰：
 * 1. 有内容（图标 / 文字）的优先 —— 环形外框通常是空圈
 * 2. 否则面积小的优先 —— 外框比球大一圈
 * 3. 完全平局按 DOM 顺序决胜，保证两两比较必分胜负（否则去重会两个都留）
 *
 * 误并的代价：两个真正叠放在一起、面积与内容都相同的球只会收一个。
 * 这种摆放本身就病态，可接受。
 */
export function preferredBallElement(a, b) {
  const hasContent = (el) =>
    (typeof el.querySelector === "function" && el.querySelector("i, svg, img")) ||
    (el.textContent || "").trim()
      ? 1
      : 0;
  const ca = hasContent(a),
    cb = hasContent(b);
  if (ca !== cb) return ca > cb ? a : b;
  const ra = a.getBoundingClientRect(),
    rb = b.getBoundingClientRect();
  const aa = ra.width * ra.height,
    ab = rb.width * rb.height;
  if (aa !== ab) return aa < ab ? a : b;
  try {
    // DOCUMENT_POSITION_FOLLOWING = 4：b 在 a 之后 → a 赢（确定性即可，方向无所谓）
    return a.compareDocumentPosition(b) & 4 ? a : b;
  } catch {
    /* 跨文档等极端情况，随便确定一个 */
    return a;
  }
}
