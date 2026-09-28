/**
 * 设置与移动端判定。
 *
 * 设置持久化在脚本变量 integration_settings；面板位置、捕获模式等都在这里。
 * 注意：捕获模式的切换需要联动自动扫描的启停，那属于装配层的职责，
 * 因此通过 setCaptureModeChangeHandler 回调通知，本模块不反向依赖扫描逻辑。
 */

import { klona } from 'https://testingcf.jsdelivr.net/npm/klona/+esm'
import { reorient } from './panel/pagination.js'
import { clearReleased, getReleasedCount } from './persist/released.js'

/** 捕获模式变化时的回调（装配层注入） */
let notifyCaptureModeChange = () => {}

export function setCaptureModeChangeHandler(fn) {
  notifyCaptureModeChange = typeof fn === 'function' ? fn : () => {}
}

export const isMobile = Vue.ref(false)
const settingsSchema = z.z
    .object({
      panelPosition: z.z.enum(["left", "right", "top", "bottom"]).nullable().default(null),
      captureMode: z.z.enum(["manual", "auto"]).nullable().default("manual"),
    })
    .prefault({}),
  settings = Vue.ref({ panelPosition: null, captureMode: "manual" }),
  effectivePosition = Vue.computed(() => settings.value.panelPosition ?? "top"),
  isHorizontalLayout = Vue.computed(() => "top" === effectivePosition.value || "bottom" === effectivePosition.value),
  isVerticalLayout = Vue.computed(() => "left" === effectivePosition.value || "right" === effectivePosition.value)
function saveSettings() {
  try {
    const t = {
      ...(getVariables({ type: "script", script_id: getScriptId() }) ?? {}),
      integration_settings: klona(settings.value),
    }
    replaceVariables(t, { type: "script", script_id: getScriptId() })
  } catch (e) {
    console.warn("[集成控件] 保存设置失败:", e)
  }
}
export const settingsApi = {
    settings: settings,
    isMobile: isMobile,
    effectivePosition: effectivePosition,
    isHorizontalLayout: isHorizontalLayout,
    isVerticalLayout: isVerticalLayout,
    initSettings: function () {
      isMobile.value = (function () {
        const e = window.parent,
          t = e.innerWidth,
          n = "ontouchstart" in e || navigator.maxTouchPoints > 0
        return t < 768 || (n && t < 1024)
      })()
      try {
        const e = getVariables({ type: "script", script_id: getScriptId() }),
          t = e?.integration_settings
        if (t && "object" == typeof t) {
          const e = settingsSchema.parse(t)
          settings.value = e
        } else settings.value = { panelPosition: null, captureMode: "manual" }
      } catch (e) {
        ;(console.warn("[集成控件] 读取设置失败，使用默认值:", e), (settings.value = { panelPosition: null, captureMode: "manual" }))
      }
    },
    saveSettings: saveSettings,
    setPanelPosition: function (e) {
      ;((settings.value.panelPosition = e), saveSettings())
      // 切换贴边方向后要等布局落定再重排分页
      try {
        window.setTimeout(() => {
          try {
            reorient()
          } catch (err) {
            console.warn("[集成控件] 重排分页失败:", err)
          }
        }, 40)
      } catch (err) {
        console.warn("[集成控件] 无法调度分页重排:", err)
      }
    },
    setCaptureMode: function (e) {
      const t = "auto" === e ? "auto" : "manual"
      ;(settings.value.captureMode = t, saveSettings())
      try {
        notifyCaptureModeChange()
      } catch (e) {
        /* 联动自动扫描失败不该阻断设置保存，但要留痕 */
        console.warn("[集成控件] 联动自动扫描失败:", e)
      }
    },
    getCaptureMode: function () {
      return "auto" === settings.value.captureMode ? "auto" : "manual"
    },
    clearReleasedFps: function () {
      ;clearReleased()
    },
    getReleasedFpCount: function () {
      return getReleasedCount()
    },
    cleanup: function () {},
  }
