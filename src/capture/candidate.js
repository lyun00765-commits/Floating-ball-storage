/**
 * 悬浮球识别规则。
 *
 * 自动扫描时用来判断「一个元素像不像悬浮球」。分两层：
 * 1. 硬性排除：定位方式、命名 token（弹层/菜单/翻页控件）、尺寸、宽高比等，命中即淘汰
 * 2. 加权打分：来源声明、定位方式、层级、光标样式等信号累加，达到阈值才算候选
 *
 * 之所以用打分而不是单条件：任何单一弱信号（比如 cursor:pointer）都太容易误判，
 * 必须多个信号同时成立。数值越严格，误捕越少、漏捕越多，可按需微调。
 */

import { settingsApi } from '../settings.js'
import { extractFingerprint } from '../core/fingerprint.js'
import { isReleasedFingerprint } from '../persist/released.js'
import { getContainer } from '../panel/pagination.js'
import { getNameTokens, isPopupLikeName, CLOSE_BUTTON_PATTERN } from './name-exclusions.js'

// ==== 悬浮球识别参数（可按需微调，数值越严格越保守）====
export const BALL_SIZE_MIN = 20 // 悬浮球最小边长(px)
export const BALL_SIZE_MAX = 120 // 悬浮球最大边长(px)
export const BALL_RATIO_MIN = 0.6 // 最小宽高比（越接近1越接近正圆/正方）
export const BALL_RATIO_MAX = 1.7 // 最大宽高比
export const BALL_SCORE_THRESHOLD = 4 // 打分制通过阈值，命中信号总分需 >= 该值才自动捕获
export const BALL_ZINDEX_MIN = 999 // 视为"高层级"的 z-index 下限

// 判断一个元素是否"很像"悬浮球：先用硬性条件排除明显不是的元素，
// 再用加权打分综合判断，避免任何单一弱信号（比如仅仅 cursor:pointer）就误判。
export function isFloatingBallCandidate(e, ownScriptId) {
  const style = window.parent.getComputedStyle(e)

  // ---------- 第一层：硬性排除（命中任意一条直接淘汰） ----------
  if ("fixed" !== style.position && "absolute" !== style.position) return !1

  // 排除常见的弹层/菜单/下拉/提示/翻页控件（避免误补点开后弹出的子元素）
  const tokens = getNameTokens(e)
  if (isPopupLikeName(tokens)) return !1
  // 关闭类按钮（.close-btn / fa-times / dismiss …）：尺寸小、常为 fixed 或 absolute、
  // 光标常是 pointer，很容易凑够打分阈值被误收。手动点选一直有这条排除，
  // 自动扫描此前漏了（技术债 A1），这里补上。
  if (CLOSE_BUTTON_PATTERN.test(tokens)) return !1

  if (e.hasAttribute("data-edge-panel-ignore")) return !1
  if ("none" === style.display || "hidden" === style.visibility || "0" === style.opacity) return !1
  if ((e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")) === ownScriptId) return !1
  if ("auto" === settingsApi.getCaptureMode() && isReleasedFingerprint(extractFingerprint(e))) return !1
  if (getContainer() && getContainer().contains(e)) return !1
  if (e.closest(".edge-panel-root,[data-edge-panel-owner]")) return !1

  const rect = e.getBoundingClientRect(),
    w = rect.width,
    h = rect.height
  if (w < BALL_SIZE_MIN || w > BALL_SIZE_MAX || h < BALL_SIZE_MIN || h > BALL_SIZE_MAX) return !1
  const ratio = w / h
  if (ratio < BALL_RATIO_MIN || ratio > BALL_RATIO_MAX) return !1

  // ---------- 第二层：加权打分（信号越多、越强，分数越高） ----------
  let score = 0

  // 其他脚本显式声明的挂件：来源明确，最强信号
  const hasScriptId =
    !!e.closest("[script_id]") &&
    (e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")) !== ownScriptId
  if (hasScriptId) score += 3

  // 定位方式：fixed 才是"悬浮"的典型特征，absolute 常见于普通布局，权重更低
  score += "fixed" === style.position ? 2 : 1

  // 圆形外观
  let isCircular = !1
  const radius = style.borderRadius || ""
  if (radius.includes("50%")) isCircular = !0
  else if (radius) {
    const nums = radius.split(" ").map((v) => parseFloat(v)).filter((v) => !isNaN(v))
    if (nums.length && Math.min(...nums) >= 0.3 * w) isCircular = !0
  }
  if (!isCircular) {
    const inner = e.querySelector('.ball-inner, [class*="ball"], [class*="circle"]')
    if (inner && window.parent.getComputedStyle(inner).borderRadius.includes("50%")) isCircular = !0
  }
  if (isCircular) score += 2

  // 高层级：悬浮球通常需要盖在其他内容之上
  const zIndex = parseInt(style.zIndex, 10)
  if (!isNaN(zIndex) && zIndex >= BALL_ZINDEX_MIN) score += 1

  // 交互样式提示
  if ("pointer" === style.cursor || "move" === style.cursor || "grab" === style.cursor) score += 1

  // 命名信号（class 中包含悬浮/拖拽相关关键词）
  const cls = String(e.className || "").toLowerCase()
  if (cls.includes("ball") || cls.includes("floating") || cls.includes("fab") || cls.includes("float")) score += 1
  if (e.classList.contains("ui-draggable")) score += 1

  // 图标而非大段文字
  const hasIcon = null !== e.querySelector("i, svg, img")
  const text = (e.textContent || "").trim()
  if (hasIcon && text.length <= 2) score += 1

  // ---------- 第三层：文本内容惩罚（正文较长基本不是悬浮球） ----------
  if (text.length > 4 && !hasScriptId) score -= 3
  if (hasIcon && text.length > 8) score -= 2

  // 与多个"同名兄弟"并列：常见于工具栏/导航条/固定菜单（一排图标按钮共用同一个 class），
  // 悬浮球一般是独立存在的单个元素，命中这种模式时降权，避免把整排按钮逐个当成球捕获
  if (!hasScriptId) {
    const parentEl = e.parentElement
    if (parentEl && cls) {
      let sameClassSiblingCount = 0
      for (const sib of parentEl.children)
        if (sib !== e && String(sib.className || "").toLowerCase() === cls) sameClassSiblingCount++
      if (sameClassSiblingCount >= 2) score -= 3
    }
  }

  // script_id 明确来源的挂件直接放行；其余按总分是否达到阈值判定
  return hasScriptId || score >= BALL_SCORE_THRESHOLD
}

