/**
 * 面板样式注入。
 *
 * 原实现由 vue-style-loader 在模块加载时把编译后的 CSS 插入 iframe 的 <style>，
 * 并带 data-vue-ssr-id 标记；EdgePanel 挂载后由宿主把 iframe 内 head 下的 <style>
 * 克隆到父窗口（见 runtime 的 edgePanelStyleHost 逻辑）。
 * 这里保持相同的插入位置与标记，确保样式生效路径不变。
 */
import css from './edge-panel.css'

/** 原 vue-style-loader 生成的条目 id（"模块id:parts索引"） */
const STYLE_MARK = 'ffda7b94:0'

export function injectStyles() {
  const doc = document
  if (doc.head && doc.head.querySelector(`style[data-vue-ssr-id="${STYLE_MARK}"]`)) return
  const style = doc.createElement('style')
  style.type = 'text/css'
  style.setAttribute('data-vue-ssr-id', STYLE_MARK)
  style.textContent = css
  ;(doc.head || doc.documentElement).appendChild(style)
}
