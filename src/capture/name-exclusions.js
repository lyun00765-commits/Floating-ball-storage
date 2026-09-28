/**
 * 元素命名的排除规则（手动捕获与自动扫描共用）。
 *
 * 判断一个元素像不像悬浮球时，「名字」是很强的信号：
 * 弹层/下拉/菜单、翻页控件、关闭按钮这类命名基本可以断定不是用户想收纳的东西。
 *
 * 这些正则原先在 manual.js 与 candidate.js 里各写了一份（逐字相同），
 * 改一处忘另一处就会让两条路径的判定口径漂移——这正是技术债 A1 的根源。
 * 现在集中在这里维护。
 *
 * 注意：**两条路径的组合条件不同**（手动点选是用户明确指认，故宽松；
 * 自动扫描误捕代价高，故严格），所以这里只提供「正则 + 取名」这些原料，
 * 具体怎么组合留给各自的调用方，避免把有意为之的差异也一起抹平。
 */

/** 弹层 / 下拉 / 菜单 / 提示 / 选择器 / 翻页导航 等控件名 */
export const POPUP_NAME_PATTERN =
  /(?:^|\s|_|-)(?:popover|popup|dropdown|dropdown-menu|drop-down|menu|tooltip|popper|listbox|context-menu|contextmenu|select-options|abs-panel|floating-panel-options|submenu|sub-menu|option-list|picker|preview-nav|prev|next|previous|carousel|slide|gallery-nav|img-nav|image-nav)(?:\s|_|-|$)/;

/** 中英文的「上一张 / 下一张」类翻页文字 */
export const PREV_NEXT_PATTERN =
  /(上一张|下一张|上一页|下一页|上一首|下一首|previous|next)/;

/**
 * 关闭类按钮：英文类名/图标名，以及中文的「关闭 / 收起 / 取消」。
 * 注意前者（图标类名）与后者（中文文字）在调用方是**分开判定**的，
 * 中文那条约附加了尺寸条件，所以这里保持为两个常量。
 */
export const CLOSE_BUTTON_PATTERN =
  /close-btn|header-close|modal-close|overlay-close|dismiss|collapse|fa-xmark|fa-times|fa-close|btn-close/;

/** 「关闭 / 收起 / 取消」字样的中文按钮 */
export const CLOSE_TEXT_PATTERN = /关闭|收起|取消/;

/**
 * 取用于判定的「名字」：id + class + title + aria-label，统一小写。
 * 四个来源拼成一行，正则只需扫一遍。
 */
export function getNameTokens(el) {
  return `${el.id || ""} ${String(el.className || "")} ${el.getAttribute("title") || ""} ${
    el.getAttribute("aria-label") || ""
  }`.toLowerCase();
}

/** 名字是否像弹层/菜单/翻页类控件 */
export function isPopupLikeName(tokens) {
  return POPUP_NAME_PATTERN.test(tokens) || PREV_NEXT_PATTERN.test(tokens);
}
