/**
 * 悬浮球指纹：用于跨「脚本重载 / DOM 重建」识别同一个悬浮球。
 *
 * 匹配优先级（见 fingerprintsMatch）：
 *   script_id（其它脚本声明的挂件） > 元素 id > class 选择器(+title) > title
 */

/**
 * 取元素的稳定 class 选择器。
 * 过滤掉：工具类 `ui-*`、Vue scoped 属性 `data-v-*`、构建产物类名 `_xxx`、
 * 以及会随交互变化的状名类（active/open/hidden…）。
 */
export function getClassSelector(el) {
  const raw = el.className
  if (!raw || typeof raw !== 'string') return null
  const classes = raw
    .split(' ')
    .filter(
      (name) =>
        !!name &&
        !name.startsWith('ui-') &&
        !name.startsWith('data-v-') &&
        !/^_[a-zA-Z0-9]+$/.test(name) &&
        !['active', 'hover', 'focus', 'disabled', 'open', 'closed', 'visible', 'hidden'].includes(name),
    )
    .sort()
  return classes.length > 0 ? '.' + classes.join('.') : null
}

/** 提取元素指纹 */
export function extractFingerprint(el) {
  return {
    scriptId: el.getAttribute('script_id') || el.closest('[script_id]')?.getAttribute('script_id') || null,
    elementId: el.id || null,
    classSelector: getClassSelector(el),
    title: el.getAttribute('title') || null,
  }
}

/** 两个指纹是否指向同一个悬浮球 */
export function fingerprintsMatch(a, b) {
  if (a.scriptId || b.scriptId) return !!(a.scriptId && b.scriptId && a.scriptId === b.scriptId)
  if (a.elementId || b.elementId) return !!(a.elementId && b.elementId && a.elementId === b.elementId)
  if (!((a.classSelector && b.classSelector) || (a.title && b.title))) return false
  if (a.classSelector && b.classSelector && a.title && b.title) {
    return a.classSelector === b.classSelector && a.title === b.title
  }
  if (a.classSelector && b.classSelector) return a.classSelector === b.classSelector
  if (a.title && b.title) return a.title === b.title
  return false
}

/** 指纹是否有效（至少有一个可用字段） */
export function isValidFingerprint(fp) {
  return !!(fp.scriptId || fp.elementId || fp.classSelector || fp.title)
}
