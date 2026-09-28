/**
 * 面板锚点观察者。
 *
 * 面板的垂直位置取决于输入框、侧栏、底部锚点三者，而它们会被酒馆的界面
 * 重排、侧栏折叠、消息插入等操作移动。这里用 ResizeObserver（锚点尺寸变化）
 * 与 MutationObserver（DOM 增删）双管齐下，锚点一变就重算面板位置。
 *
 * 注意（技术债 B1）：resolveAnchor* 每次回调都会重新查询，MutationObserver
 * 又在回调里重新观察新锚点，因此触发频繁时开销不小。
 */

import {
  updatePanelPosition,
  resetPositionMemory,
  resolveAnchorBottom,
  resolveInputAnchor,
  resolveSidebarAnchor,
} from "./geometry.js";

/** 观察锚点尺寸变化 */
let resizeObserver = null;
/** 观察锚点被替换/移除 */
let anchorObserver = null;

export function installAnchorObservers(setPanelLeftPosition) {
  resetPositionMemory();
  const t = resolveAnchorBottom(),
    n = resolveInputAnchor(),
    a = resolveSidebarAnchor();
  (updatePanelPosition(setPanelLeftPosition, !0),
    (resizeObserver = new ResizeObserver(() => {
      updatePanelPosition(setPanelLeftPosition);
    })),
    t && resizeObserver.observe(t),
    n && resizeObserver.observe(n),
    a && resizeObserver.observe(a));
  // jQuery 由宿主注入（takeover 中也有同样的判空）；缺失时只是少一个重算触发点，
  // 不能让整个面板初始化中断，因此这里不裸调用 $()。
  const jq = window.parent.jQuery || window.parent.$;
  jq &&
    jq(window.parent).on("resize.edgePanel", () =>
      updatePanelPosition(setPanelLeftPosition),
    );
  const o = window.parent.document;
  let r = t,
    i = n,
    l = a;
  ((anchorObserver = new MutationObserver(() => {
    const t = resolveAnchorBottom(),
      n = resolveInputAnchor(),
      a = resolveSidebarAnchor();
    let o = !1;
    (t !== r &&
      ((r = t), t && resizeObserver && resizeObserver.observe(t), (o = !0)),
      n !== i &&
        ((i = n), n && resizeObserver && resizeObserver.observe(n), (o = !0)),
      a !== l &&
        ((l = a), a && resizeObserver && resizeObserver.observe(a), (o = !0)),
      o && updatePanelPosition(setPanelLeftPosition, !0));
  })),
    anchorObserver.observe(o.body, { childList: !0, subtree: !0 }));
}

/** 断开两个观察者（主运行时销毁时调用） */
export function disposeAnchorObservers() {
  if (resizeObserver) {
    try {
      resizeObserver.disconnect();
    } catch (e) {
      /* 已断开或环境不支持 */
    }
    resizeObserver = null;
  }
  if (anchorObserver) {
    try {
      anchorObserver.disconnect();
    } catch (e) {
      /* 同上 */
    }
    anchorObserver = null;
  }
}
