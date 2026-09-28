/**
 * 酒馆助手宿主接口封装。
 *
 * 这里用到的标识符都不是标准浏览器 API，而是宿主 iframe 注入的
 * （见 README「平台契约」）。集中在此处兜底，避免裸调用散落各处。
 */

export function getOwnScriptId() {
  try {
    return getScriptId()
  } catch {
    return "集成控件"
  }
}

/**
 * 提示消息（toastr 的安全封装）。
 *
 * toastr 同样是宿主注入的。裸调用有两个风险：宿主没提供时 `toastr is not defined`，
 * 或宿主实现内部抛错。危害最大的场景在手动点选捕获里——提示语排在「移除遮罩」
 * 之前，一旦抛出，遮罩会永久留在页面上，整个页面的点击都被它拦截。
 *
 * 所以这里一律吞掉异常：提示失败是小事，卡住交互是大事。
 */
function toast(level, msg) {
  try {
    // 宿主可能压根没注入 toastr，用 typeof 判断可以避免 ReferenceError
    if (typeof toastr === "undefined" || !toastr) return
    if (typeof toastr[level] === "function") toastr[level](msg)
  } catch {}
}

export const notify = {
  info: (msg) => toast("info", msg),
  success: (msg) => toast("success", msg),
  warning: (msg) => toast("warning", msg),
  error: (msg) => toast("error", msg),
}
