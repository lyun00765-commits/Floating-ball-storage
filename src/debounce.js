/**
 * 去抖工具。
 *
 * 原实现直接使用宿主注入的 lodash（`_`），全项目只用了一次 `.debounce`。
 * 宿主接口是运行时契约，不是我们可控的依赖，为一次调用挂载整个 lodash 不划算，
 * 因此这里自带一份等价实现，去掉对 `_` 的依赖。
 *
 * 语义与 lodash debounce 对齐（用到的那部分）：
 * - 连续调用只在停止 wait 毫秒后触发一次
 * - 若在 wait 窗口内重复调用，计时重来
 * - 支持 cancel() 取消未触发的调用
 */

/**
 * @param {Function} fn 目标函数
 * @param {number} wait 等待毫秒数
 * @returns {Function & { cancel: () => void }}
 */
function debounce(fn, wait) {
  let timer = null
  const debounced = function (...args) {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, wait)
  }
  debounced.cancel = () => {
    if (timer !== null) clearTimeout(timer)
    timer = null
  }
  return debounced
}

/** 兼容原调用点：原代码写作 debounceSource.debounce(fn, wait) */
export const debounceSource = { debounce }

export { debounce }