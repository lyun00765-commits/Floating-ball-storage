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
