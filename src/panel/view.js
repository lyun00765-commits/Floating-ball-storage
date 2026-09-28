/**
 * 面板 UI（Vue 组件）。
 *
 * 由 SFC 编译产物还原而来，VNode 数据对象（panel-icons / panel-divider 等）保持原样，
 * 只把对装配层的直接引用改为注入，避免 UI 层反向依赖 store。
 *
 * 注入依赖：
 * - store.capturedBalls / autoCaptureEnabled / removeCapturedBall：面板列表与自动捕获开关
 * - triggerScan：立即触发一次扫描（用于「重新扫描」按钮）
 */

import { settingsApi } from '../settings.js'
import { themeApi } from '../theme.js'
import { addReleased } from '../persist/released.js'
import { extractFingerprint, fingerprintsMatch } from '../core/fingerprint.js'
import { getOwnScriptId } from '../core/platform.js'
import { goPage } from './pagination.js'
import { pendingRestoreBalls } from '../persist/saved-balls.js'

/** 安全默认值：装配层未注入前也不会抛错 */
let deps = {
  store: {
    capturedBalls: Vue.ref({}),
    autoCaptureEnabled: Vue.ref(!1),
    removeCapturedBall: () => {},
  },
  triggerScan: () => {},
}

/** 注入装配层能力（启动时调用一次） */
export function setViewDeps(next) {
  deps = { ...deps, ...next }
}

/** Vue SFC 编译产物的 scopeId 附加（原 webpack 模块 502 的内联版） */
function withScopeId(component, attrs) {
  const target = component.__vccOpts || component
  for (const [key, value] of attrs) target[key] = value
  return target
}

const Ge = { class: "panel-icons" },
  Le = ["title", "onClick"],
  Ye = { key: 0, class: "panel-divider" },
  We = { key: 0, class: "panel-divider" },
  je = { class: "panel-actions" },
  Ue = { key: 0, class: "settings-panel" },
  Xe = { class: "settings-options" },
  Te = ["title", "onClick"],
  De = { key: 1, class: "panel-empty" },
  Re = (0, Vue.defineComponent)({
    __name: "EdgePanel",
    setup(e) {
      ;(0, Vue.useCssVars)((e) => ({
        v9d17ecc4: (0, Vue.unref)(c),
        v447886dc: (0, Vue.unref)(x).glassBg,
        v70503c70: (0, Vue.unref)(x).borderColor,
        v2826bcb2: (0, Vue.unref)(x).textColor,
        v5e0fea74: (0, Vue.unref)(x).glassHoverBg,
        ec7cae14: (0, Vue.unref)(x).quoteColor,
      }))
      const t = (0, Vue.ref)(null),
        n = (0, Vue.ref)(!1),
        releaseMode = (0, Vue.ref)(!1),
        gestureState = {
          startX: 0,
          startY: 0,
          moved: !1,
          lastScrollAt: 0,
          lastReleaseTouchAt: 0,
          pendingRelease: null,
        },
        {
          isPanelOpen: a,
          sortedPlugins: r,
          capturedBallsList: i,
          hasPlugins: l,
          isCaptureModeActive: s,
          panelLeftPosition: A,
          panelPositionStyle: c,
          effectivePosition: p,
          isHorizontalLayout: d,
          isVerticalLayout: u,
          settings: g,
          togglePanel: C,
          closePanel: f,
          removeCapturedBall: b,
          enterCaptureMode: v,
          setBallContainer: h,
          setPanelPosition: m,
        } = deps.store,
        { themeColors: x } = themeApi,
        y = [
          { value: "left", label: "左侧", icon: "fa-solid fa-arrow-left" },
          { value: "right", label: "右侧", icon: "fa-solid fa-arrow-right" },
          { value: "top", label: "顶部", icon: "fa-solid fa-arrow-up" },
          { value: "bottom", label: "底部", icon: "fa-solid fa-arrow-down" },
        ],
        w = (0, Vue.computed)(() => {
          switch (p.value) {
            case "left":
              return "fa-solid fa-chevron-right"
            case "right":
            default:
              return "fa-solid fa-chevron-left"
            case "top":
              return "fa-solid fa-chevron-down"
            case "bottom":
              return "fa-solid fa-chevron-up"
          }
        }),
        B = (0, Vue.computed)(() => {
          switch (p.value) {
            case "left":
              return "fa-solid fa-chevron-left"
            case "right":
            default:
              return "fa-solid fa-chevron-right"
            case "top":
              return "fa-solid fa-chevron-up"
            case "bottom":
              return "fa-solid fa-chevron-down"
          }
        }),
        E = (0, Vue.computed)(() => {
          switch (p.value) {
            case "left":
            default:
              return "panel-slide-left"
            case "right":
              return "panel-slide-right"
            case "top":
              return "panel-slide-top"
            case "bottom":
              return "panel-slide-bottom"
          }
        })
      function findBallElementFromTarget(e) {
        const n = t.value
        if (!n || !e) return null
        // 球在分页(slot)嵌套里, 用 data-edge-ball-id 直接定位
        if (e.closest) {
          const b = e.closest("[data-edge-ball-id]")
          if (b && n.contains(b)) return b
        }
        let a = null
        const o = e.closest("[script_id]")
        if (o && n.contains(o)) for (a = o; a && a.parentElement !== n;) a = a.parentElement
        if (!a) {
          let t = e
          for (; t && t !== n;) {
            if (t.parentElement === n) {
              a = t
              break
            }
            t = t.parentElement
          }
        }
        return a
      }
      function releaseBallElement(e) {
        if (!e) return !1
        const t = i.value
        for (const n of t)
          if (n.element === e)
            return (
              e.setAttribute("data-edge-panel-ignore", "1"),
              addReleased(n.fingerprint || extractFingerprint(e)),
              b(n.id),
              e.removeAttribute("data-edge-panel-ignore"),
              (filterPendingBall(n.fingerprint, e)),
              void toastr.info(`已释放悬浮球: ${n.name}`),
              !0
            )
        const n = e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")
        return (
          !!n &&
          (e.setAttribute("data-edge-panel-ignore", "1"),
          addReleased(extractFingerprint(e)),
          b(`ball_${n}`),
          e.removeAttribute("data-edge-panel-ignore"),
          (filterPendingBall(null, e)),
          toastr.info("已释放悬浮球"),
          !0)
        )
      }
      function filterPendingBall(fp, e) {
  const a = fp || extractFingerprint(e)
  pendingRestoreBalls.value = pendingRestoreBalls.value.filter((t) => !fingerprintsMatch(t.fingerprint, a))
  try {
    const o = { ...(getVariables({ type: "script", script_id: getOwnScriptId() }) ?? {}), savedBalls: JSON.parse(JSON.stringify(pendingRestoreBalls.value)) }
    replaceVariables(o, { type: "script", script_id: getOwnScriptId() })
  } catch {}
}
      function S(e) {
        const t = findBallElementFromTarget(e.target)
        t && releaseBallElement(t)
      }
      function k() {
        ;((releaseMode.value = !1), v())
      }
      function P() {
        ;((releaseMode.value = !1), (n.value = !n.value))
      }
      function T() {
        ;((n.value = !1), (releaseMode.value = !releaseMode.value))
      }
      let pressTimer = null
      let pressFired = !1
      let lastLongPressAt = 0
      function longPressStart(kind, e) {
        if (e && "mouse" === e.pointerType && 0 !== e.button) return
        clearTimeout(pressTimer)
        pressFired = !1
        lastLongPressAt = 0
        pressTimer = setTimeout(() => {
          pressFired = !0
          lastLongPressAt = Date.now()
          try {
            if ("capture" === kind) {
              const t = Object.keys(deps.store.capturedBalls.value).length
              const r = deps.store.autoCaptureEnabled.value
              deps.store.autoCaptureEnabled.value = !0
              try {
                deps.triggerScan(!0)
              } finally {
                deps.store.autoCaptureEnabled.value = r
              }
              const a = Object.keys(deps.store.capturedBalls.value).length
              toastr.success(
                a > 0 ? (a > t ? `已全部捕捉 ${a - t} 个悬浮球（共 ${a} 个）` : `当前已收纳 ${a} 个悬浮球`) : "未发现可捕捉的悬浮球",
              )
            } else {
              const t = Object.values(deps.store.capturedBalls.value)
              if (0 === t.length) return void toastr.info("当前没有已收纳的悬浮球")
              for (const e of t) {
                try {
                  addReleased(e.fingerprint)
                  deps.store.removeCapturedBall(e.id)
                  filterPendingBall(e.fingerprint, e.element)
                  e.element && e.element.removeAttribute("data-edge-panel-ignore")
                } catch {}
              }
              toastr.info(`已全部释放 ${t.length} 个悬浮球`)
            }
          } catch (e) {
            console.warn("[集成控件] 长按操作失败:", e)
          }
        }, 600)
      }
      function longPressEnd() {
        clearTimeout(pressTimer)
      }
      function captureButtonClick() {
        if (pressFired || (lastLongPressAt && Date.now() - lastLongPressAt < 800)) {
          pressFired = !1
          return
        }
        k()
      }
      function releaseButtonClick() {
        if (pressFired || (lastLongPressAt && Date.now() - lastLongPressAt < 800)) {
          pressFired = !1
          return
        }
        T()
      }
      const captureModeActive = (0, Vue.ref)(settingsApi.getCaptureMode())
      function setCaptureModeUI(aMode) {
        if (aMode === captureModeActive.value) return
        captureModeActive.value = aMode
        settingsApi.setCaptureMode(aMode)
        toastr.info(aMode === "auto" ? "已切换到自动模式：悬浮球将自动收纳" : "已切换到手动模式：长按捕捉=全部收纳")
      }
      function clearMemoryUI() {
        const t = settingsApi.getReleasedFpCount()
        if (0 === t) return void toastr.info("当前无记忆")
        ;(settingsApi.clearReleasedFps(), toastr.success(`已清空 ${t} 条释放记忆`))
      }
      function handleContainerTouchStart(e) {
        const n = e.touches && e.touches[0]
        if (!n) return
        ;((gestureState.startX = n.clientX),
          (gestureState.startY = n.clientY),
          (gestureState.moved = !1),
          (gestureState.pendingRelease = releaseMode.value ? findBallElementFromTarget(e.target) : null),
          releaseMode.value &&
            gestureState.pendingRelease &&
            (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation()))
      }
      function handleContainerTouchMove(e) {
        const t = e.touches && e.touches[0]
        if (!t) return
        const n = Math.abs(t.clientX - gestureState.startX),
          a = Math.abs(t.clientY - gestureState.startY),
          r = (0, Vue.unref)(d) ? n : a
        ;(r > 6 && ((gestureState.moved = !0), (gestureState.pendingRelease = null)),
          releaseMode.value &&
            gestureState.moved &&
            (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation()))
      }
      function handleContainerTouchEnd(e) {
        if (releaseMode.value) {
          const t = gestureState.pendingRelease || findBallElementFromTarget(e.target),
            n = gestureState.moved
          ;((gestureState.pendingRelease = null), (gestureState.moved = !1))
          return !n && t
            ? ((gestureState.lastReleaseTouchAt = Date.now()),
              e.preventDefault(),
              e.stopPropagation(),
              e.stopImmediatePropagation(),
              void releaseBallElement(t))
            : void 0
        }
        gestureState.moved &&
          ((gestureState.lastScrollAt = Date.now()),
          setTimeout(() => {
            gestureState.moved = !1
          }, 80))
      }
      function handleContainerClickCapture(e) {
        if (Date.now() - gestureState.lastScrollAt < 220 || Date.now() - gestureState.lastReleaseTouchAt < 220)
          return (e.preventDefault(), e.stopPropagation(), void e.stopImmediatePropagation())
        if (!releaseMode.value) return
        const t = findBallElementFromTarget(e.target)
        t && (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), releaseBallElement(t))
      }
      return (
        (0, Vue.watch)(
          i,
          (e) => {
            console.info("[EdgePanel] capturedBallsList 更新:", e.length, "个", e)
          },
          { immediate: !0, deep: !0 },
        ),
        (0, Vue.watch)(a, (e) => {
          e || ((n.value = !1), (releaseMode.value = !1))
        }),
        (0, Vue.onMounted)(() => {
          ;(themeApi.initializeThemeObserver(), t.value && h(t.value))
        }),
        (0, Vue.onUnmounted)(() => {
          ;(themeApi.disconnectThemeObserver(), h(null), (releaseMode.value = !1))
        }),
        (e, A) => (
          (0, Vue.openBlock)(),
          (0, Vue.createElementBlock)(
            "div",
            {
              class: (0, Vue.normalizeClass)([
                "edge-panel-root",
                [`edge-panel-root--${(0, Vue.unref)(p)}`, { "edge-panel-root--horizontal": (0, Vue.unref)(d) }],
              ]),
            },
            [
              (0, Vue.createCommentVNode)(" 边缘箭头标签 "),
              (0, Vue.createVNode)(
                Vue.Transition,
                { name: "edge-tab-fade", persisted: "" },
                {
                  default: (0, Vue.withCtx)(() => [
                    (0, Vue.withDirectives)(
                      (0, Vue.createElementVNode)(
                        "div",
                        {
                          class: (0, Vue.normalizeClass)([
                            "edge-tab",
                            { "edge-tab--has-plugins": (0, Vue.unref)(l), [`edge-tab--${(0, Vue.unref)(p)}`]: !0 },
                          ]),
                          title: "快速导航",
                          onClick: A[0] || (A[0] = (...e) => (0, Vue.unref)(C) && (0, Vue.unref)(C)(...e)),
                        },
                        [(0, Vue.createElementVNode)("i", { class: (0, Vue.normalizeClass)(w.value) }, null, 2)],
                        2,
                      ),
                      [[Vue.vShow, !(0, Vue.unref)(a)]],
                    ),
                  ]),
                },
              ),
              (0, Vue.createCommentVNode)(" 展开的图标面板 "),
              (0, Vue.createVNode)(
                Vue.Transition,
                { name: E.value, persisted: "" },
                {
                  default: (0, Vue.withCtx)(() => [
                    (0, Vue.withDirectives)(
                      (0, Vue.createElementVNode)(
                        "div",
                        { class: (0, Vue.normalizeClass)(["icon-panel", [`icon-panel--${(0, Vue.unref)(p)}`]]) },
                        [
                          (0, Vue.createCommentVNode)(" 面板头部 - 收起按钮 "),
                          (0, Vue.createElementVNode)(
                            "div",
                            {
                              class: "panel-header",
                              onClick: A[1] || (A[1] = (...e) => (0, Vue.unref)(f) && (0, Vue.unref)(f)(...e)),
                            },
                            [(0, Vue.createElementVNode)("i", { class: (0, Vue.normalizeClass)(B.value) }, null, 2)],
                          ),
                          (0, Vue.createCommentVNode)(" 插件图标列表 "),
                          (0, Vue.createElementVNode)("div", Ge, [
                            (0, Vue.createCommentVNode)(" 手动注册的插件 "),
                            ((0, Vue.openBlock)(!0),
                            (0, Vue.createElementBlock)(
                              Vue.Fragment,
                              null,
                              (0, Vue.renderList)(
                                (0, Vue.unref)(r),
                                (e) => (
                                  (0, Vue.openBlock)(),
                                  (0, Vue.createElementBlock)(
                                    "div",
                                    {
                                      key: e.id,
                                      class: (0, Vue.normalizeClass)([
                                        "plugin-icon",
                                        { "plugin-icon--active": e.isActive?.() },
                                      ]),
                                      title: e.name,
                                      style: (0, Vue.normalizeStyle)(
                                        e.iconColor ? { "--plugin-color": e.iconColor } : {},
                                      ),
                                      onClick: (t) =>
                                        (function (e) {
                                          e.onClick()
                                        })(e),
                                    },
                                    [(0, Vue.createElementVNode)("i", { class: (0, Vue.normalizeClass)(e.icon) }, null, 2)],
                                    14,
                                    Le,
                                  )
                                ),
                              ),
                              128,
                            )),
                            (0, Vue.createCommentVNode)(" 分隔线（当同时存在注册插件和捕获悬浮球时显示） "),
                            (0, Vue.unref)(r).length > 0 && (0, Vue.unref)(i).length > 0
                              ? ((0, Vue.openBlock)(), (0, Vue.createElementBlock)("div", Ye))
                              : (0, Vue.createCommentVNode)("v-if", !0),
                            (0, Vue.createCommentVNode)(" 捕获的悬浮球容器 - 支持滑动，防误触 "),
                            (0, Vue.createElementVNode)(
                              "div",
                              {
                                class: "fb-arrow fb-arrow--prev",
                                "data-fb-page-prev": "",
                                "aria-hidden": "true",
                                onClick: () => goPage(-1),
                              },
                              [(0, Vue.createTextVNode)("\u2039")],
                            ),
                            (0, Vue.createElementVNode)(
                              "div",
                              {
                                ref_key: "ballContainerRef",
                                ref: t,
                                class: "captured-balls-container",
                                onTouchstartCapture: handleContainerTouchStart,
                                onTouchmoveCapture: handleContainerTouchMove,
                                onTouchendCapture: handleContainerTouchEnd,
                                onTouchcancelCapture: handleContainerTouchEnd,
                                onClickCapture: handleContainerClickCapture,
                              },
                              [(0, Vue.createCommentVNode)(" 悬浮球元素会被动态移动到这里，左右滑动浏览，点击激活 ")],
                              544,
                            ),
                            (0, Vue.createElementVNode)(
                              "div",
                              {
                                class: "fb-arrow fb-arrow--next",
                                "data-fb-page-next": "",
                                "aria-hidden": "true",
                                onClick: () => goPage(1),
                              },
                              [(0, Vue.createTextVNode)("\u203a")],
                            ),
                          ]),
                          (0, Vue.createCommentVNode)(" 分隔线（当有内容时显示） "),
                          (0, Vue.unref)(r).length > 0 || (0, Vue.unref)(i).length > 0
                            ? ((0, Vue.openBlock)(), (0, Vue.createElementBlock)("div", We))
                            : (0, Vue.createCommentVNode)("v-if", !0),
                          (0, Vue.createCommentVNode)(" 操作按钮区域 - 紧凑布局，集中放置 "),
                          (0, Vue.createElementVNode)("div", je, [
                            (0, Vue.createElementVNode)(
                              "div",
                              {
                                class: (0, Vue.normalizeClass)([
                                  "action-icon",
                                  { "action-icon--active": (0, Vue.unref)(s) },
                                ]),
                                title: "捕获悬浮球（长按全部捕捉）",
                                onClick: captureButtonClick,
                                onPointerdown: (e) => longPressStart("capture", e),
                                onPointerup: longPressEnd,
                                onPointerleave: longPressEnd,
                                onPointercancel: longPressEnd,
                              },
                              [
                                ...(A[2] ||
                                  (A[2] = [
                                    (0, Vue.createElementVNode)("i", { class: "fa-solid fa-crosshairs" }, null, -1),
                                  ])),
                              ],
                              2,
                            ),
                            (0, Vue.createElementVNode)(
                              "div",
                              {
                                class: (0, Vue.normalizeClass)([
                                  "action-icon",
                                  { "action-icon--active": releaseMode.value },
                                ]),
                                title: "手动释放悬浮球（长按全部释放）",
                                onClick: releaseButtonClick,
                                onPointerdown: (e) => longPressStart("release", e),
                                onPointerup: longPressEnd,
                                onPointerleave: longPressEnd,
                                onPointercancel: longPressEnd,
                              },
                              [
                                ...(A[6] ||
                                  (A[6] = [
                                    (0, Vue.createElementVNode)("i", { class: "fa-solid fa-box-open" }, null, -1),
                                  ])),
                              ],
                              2,
                            ),
                            (0, Vue.createElementVNode)(
                              "div",
                              {
                                class: (0, Vue.normalizeClass)(["action-icon", { "action-icon--active": n.value }]),
                                title: "设置面板位置",
                                onClick: P,
                              },
                              [
                                ...(A[3] ||
                                  (A[3] = [(0, Vue.createElementVNode)("i", { class: "fa-solid fa-gear" }, null, -1)])),
                              ],
                              2,
                            ),
                          ]),
                          (0, Vue.createCommentVNode)(" 设置面板 "),
                          (0, Vue.createVNode)(
                            Vue.Transition,
                            { name: "settings-fade" },
                            {
                              default: (0, Vue.withCtx)(() => [
                                n.value
                                  ? ((0, Vue.openBlock)(),
                                    (0, Vue.createElementBlock)("div", Ue, [
                                      A[4] ||
                                        (A[4] = (0, Vue.createElementVNode)(
                                          "div",
                                          { class: "settings-title" },
                                          "位置",
                                          -1,
                                        )),
                                      (0, Vue.createElementVNode)("div", Xe, [
                                        (0, Vue.createElementVNode)(
                                          "div",
                                          {
                                            class: "settings-option",
                                            title: "位置",
                                            onClick: (t) => {
                                              const el = t.currentTarget || t.target
                                              window.openPosMenu && window.openPosMenu(el, (0, Vue.unref)(p))
                                            },
                                          },
                                          [(0, Vue.createElementVNode)("i", { class: "fa-solid fa-flag" }, null, -1)],
                                          10,
                                          Te,
                                        ),
                                      ]),
                                    ,
                              (0, Vue.createCommentVNode)(" 入口显示模式 "),
                              (0, Vue.createElementVNode)("div", { class: "settings-title" }, "入口", -1),
                              (0, Vue.createElementVNode)("div", { class: "settings-options" }, [
                                (0, Vue.createElementVNode)(
                                  "div",
                                  {
                                    class: "settings-option",
                                    title: "入口",
                                    onClick: (t) => {
                                      const el = t.currentTarget || t.target
                                      window.openEntryMenu && window.openEntryMenu(el)
                                    },
                                  },
                                  [(0, Vue.createElementVNode)("i", { class: "fa-solid fa-list-check" }, null, -1)],
                                  10,
                                  Te,
                                ),
                              ]),
                              (0, Vue.createCommentVNode)(" 捕捉模式 - 手动/自动 "),
                              (0, Vue.createElementVNode)("div", { class: "settings-title" }, "模式", -1),
                              (0, Vue.createElementVNode)("div", { class: "settings-options" }, [
                                (0, Vue.createElementVNode)(
                                  "div",
                                  {
                                    class: (0, Vue.normalizeClass)([
                                      "settings-option",
                                      { "settings-option--active": "manual" === (0, Vue.unref)(captureModeActive) },
                                    ]),
                                    title: "手动",
                                    onClick: () => setCaptureModeUI("manual"),
                                  },
                                  [(0, Vue.createElementVNode)("i", { class: "fa-solid fa-hand-pointer" }, null, -1)],
                                  10,
                                  Te,
                                ),
                                (0, Vue.createElementVNode)(
                                  "div",
                                  {
                                    class: (0, Vue.normalizeClass)([
                                      "settings-option",
                                      { "settings-option--active": "auto" === (0, Vue.unref)(captureModeActive) },
                                    ]),
                                    title: "自动",
                                    onClick: () => setCaptureModeUI("auto"),
                                  },
                                  [(0, Vue.createElementVNode)("i", { class: "fa-solid fa-bolt" }, null, -1)],
                                  10,
                                  Te,
                                ),
                              ]),
                              (0, Vue.createElementVNode)("div", { class: "settings-divider" }, null, -1),
                              (0, Vue.createElementVNode)(
                                "div",
                                { class: "settings-option clear-memory-row", title: "清空释放记忆", onClick: clearMemoryUI },
                                [(0, Vue.createElementVNode)("i", { class: "fa-solid fa-broom" }, null, -1)],
                                10,
                                Le,
                              )
                              ]))
                                  : (0, Vue.createCommentVNode)("v-if", !0),
                              ]),
                              _: 1,
                            },
                          ),
                          (0, Vue.createCommentVNode)(" 空状态提示（没有插件和悬浮球时显示） "),
                          0 !== (0, Vue.unref)(r).length || 0 !== (0, Vue.unref)(i).length
                            ? (0, Vue.createCommentVNode)("v-if", !0)
                            : ((0, Vue.openBlock)(),
                              (0, Vue.createElementBlock)("div", De, [
                                ...(A[5] ||
                                  (A[5] = [
                                    (0, Vue.createElementVNode)(
                                      "span",
                                      { class: "panel-empty-text" },
                                      [
                                        (0, Vue.createTextVNode)("暂无内容"),
                                        (0, Vue.createElementVNode)("br"),
                                        (0, Vue.createTextVNode)("点击上方按钮捕获悬浮球"),
                                      ],
                                      -1,
                                    ),
                                  ])),
                              ])),
                        ],
                        2,
                      ),
                      [[Vue.vShow, (0, Vue.unref)(a)]],
                    ),
                  ]),
                  _: 1,
                },
                8,
                ["name"],
              ),
            ],
            2,
          )
        )
      )
    },
  })
export const panelComponent = withScopeId(Re, [["__scopeId", "data-v-da7fb8b4"]])
