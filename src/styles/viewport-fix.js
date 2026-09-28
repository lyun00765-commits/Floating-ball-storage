/**
 * 视口修复样式。
 *
 * 必须注入到**父窗口**文档：面板挂在父窗口里，而移动端/桌面端对贴边与居中的
 * 需求相反（桌面居中、移动贴边），这些规则得压过面板自身样式，所以全部 `!important`。
 *
 * 原先内联在装配函数里（20 行字符串拼接），抽出来便于单独查看与调整。
 */

export const VIEWPORT_FIX_CSS =
  "@media (min-width:769px){" +
  ".edge-panel-root--left{transform:translateY(-50%)!important;}" +
  ".edge-panel-root--right{transform:translateY(-50%)!important;}" +
  "}" +
  "@media (max-width:768px){" +
  ".edge-panel-root--left{left:0!important;transform:none!important;}" +
  ".edge-panel-root--right{left:auto!important;right:0!important;transform:none!important;}" +
  ".edge-tab--left{border-radius:0 12px 12px 0!important;}" +
  ".edge-tab--right{border-radius:12px 0 0 12px!important;}" +
  ".icon-panel--left{left:0!important;right:auto!important;border-radius:0 14px 14px 0!important;}" +
  ".icon-panel--right{right:0!important;left:auto!important;border-radius:14px 0 0 14px!important;}" +
  ".edge-tab{backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;}" +
  ".icon-panel{backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important;}" +
  ".plugin-icon{border-radius:10px!important;}" +
  ".action-icon{border-radius:8px!important;}" +
  ".panel-header:hover{background:transparent!important;}" +
  ".edge-tab-fade-leave-active{transition:none}" +
  ".edge-tab-fade-enter-active{transition:opacity .3s ease}" +
  ".edge-tab-fade-enter-from,.edge-tab-fade-leave-to{opacity:0}" +
  "}";

/** 幂等注入：已存在同 id 的 style 时直接返回 */
export function ensureViewportFixStyle(doc) {
  if (doc.getElementById("edge-panel-viewport-fix")) return;
  var s = doc.createElement("style");
  s.id = "edge-panel-viewport-fix";
  s.textContent = VIEWPORT_FIX_CSS;
  (doc.head || doc.documentElement).appendChild(s);
}
