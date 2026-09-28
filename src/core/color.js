/**
 * 颜色工具：对宿主主题里读到的 rgb/rgba 字符串做透明度与亮度调整。
 */

/** 转成指定透明度的 rgba；无法解析时原样返回 */
export function withAlpha(color, alpha) {
  if (!color || color === 'transparent') return `rgba(0, 0, 0, ${alpha})`
  try {
    if (color.startsWith('rgb')) {
      const channels = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',')
      if (channels.length >= 3) {
        return `rgba(${channels[0].trim()}, ${channels[1].trim()}, ${channels[2].trim()}, ${alpha})`
      }
    }
  } catch {}
  return color
}

/** 按比例降低亮度（rgb 各分量减去自身的 ratio），保留原 alpha */
export function darken(color, ratio) {
  try {
    if (color.startsWith('rgba')) {
      const channels = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',')
      if (channels.length >= 3) {
        const r = parseInt(channels[0].trim(), 10)
        const g = parseInt(channels[1].trim(), 10)
        const b = parseInt(channels[2].trim(), 10)
        const a = channels.length > 3 ? parseFloat(channels[3].trim()) : 1
        const scale = (v) => Math.max(0, v - v * ratio)
        return `rgba(${Math.round(scale(r))}, ${Math.round(scale(g))}, ${Math.round(scale(b))}, ${a})`
      }
    }
  } catch {}
  return color
}
