/**
 * 输入框入口：在宿主输入框旁挂一个悬浮按钮，用于开/关面板。
 *
 * 按钮支持三种入口模式（静态按钮 / 动态按钮 / 悬浮球），长按或右键切换；
 * 位置菜单可直接调整面板贴边方向。按钮会跟随输入框区域自动重挂（MutationObserver）。
 *
 * 本模块几乎自包含，只依赖宿主的 `$`（jQuery）与 settingsApi。
 * 注意：原实现把 cleanup 只绑在 pagehide/beforeunload 上，
 * 脚本被删/热重载时按钮与 observer 会残留（技术债 A2）；
 * 现在额外导出 cleanupInputEntry()，由主运行时的销毁流程调用。
 */

import { settingsApi } from '../settings.js'

/** 安装时登记的清理函数，供主运行时销毁时调用 */
let activeCleanup = null

export function installInputEntry() {

try {
  const PW = window.parent,
    PD = PW && PW.document
  if (!PD) return
  const BTN_ID = "fb-storage-input-entry"
  if (PW.__fbInputEntryInstalled && PD.getElementById(BTN_ID)) return
  PW.__fbInputEntryInstalled = true
  PW.__fbInputEntryCleaned = false

  const STATIC_ID = "fb-storage-input-entry-static"
  const DYN_ID = "fb-storage-input-entry-dyn"
  const POP_ID = "fb-storage-mode-popover"
  const LS_KEY = "fbStorageEntryMode"

  function getMode() {
    try {
      let m = PW.localStorage.getItem(LS_KEY)
      if (m === "both") m = "edge"
      return m === "edge" || m === "input" || m === "longpress" ? m : "edge"
    } catch (e) {
      return "edge"
    }
  }
  function setMode(m) {
    try {
      PW.localStorage.setItem(LS_KEY, m)
    } catch (e) {}
    applyMode()
  }

  function ensureStaticStyle() {
    if (PD.getElementById(STATIC_ID)) return
    let s = PD.createElement("style")
    s.id = STATIC_ID
    s.textContent =
      "#" +
      BTN_ID +
      "{display:flex;align-items:center;justify-content:center;" +
      "align-self:center;cursor:pointer;opacity:.65;padding:0 6px;min-width:22px;" +
      "box-sizing:border-box;transition:opacity .2s ease;" +
      "-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;" +
      "-webkit-user-select:none;-moz-user-select:none;user-select:none;" +
      "touch-action:manipulation;}" +
      "#" +
      BTN_ID +
      ":hover{opacity:1;}" +
      "#" +
      BTN_ID +
      " i{font-size:1.05em;line-height:1;pointer-events:none;}" +
      "#form_sheld:has(#send_textarea:focus) #" +
      BTN_ID +
      "{display:none !important}"
    ;(PD.head || PD.documentElement).appendChild(s)
  }
  function ensureDynStyle() {
    let s = PD.getElementById(DYN_ID)
    if (!s) {
      s = PD.createElement("style")
      s.id = DYN_ID
      ;(PD.head || PD.documentElement).appendChild(s)
    }
    return s
  }

  function applyMode() {
    let m = getMode()
    ensureDynStyle().textContent =
      m === "input" || m === "longpress" ? ".edge-panel-root .edge-tab{display:none!important;}" : ""
    let btn = PD.getElementById(BTN_ID)
    if (btn) btn.style.display = m === "edge" || m === "longpress" ? "none" : "flex"
  }

  const NOSEL_ID = "fb-storage-nosel"
  let noselTimer = null
  function suppressSelection() {
    try {
      let sel = PW.getSelection && PW.getSelection()
      if (sel && sel.removeAllRanges) sel.removeAllRanges()
    } catch (e) {}
    try {
      let s = PD.getElementById(NOSEL_ID)
      if (!s) {
        s = PD.createElement("style")
        s.id = NOSEL_ID
        s.textContent =
          "html.fb-nosel,html.fb-nosel *{-webkit-user-select:none!important;" +
          "user-select:none!important;-webkit-touch-callout:none!important;}"
        ;(PD.head || PD.documentElement).appendChild(s)
      }
      let de = PD.documentElement
      de.classList.add("fb-nosel")
      if (noselTimer) PW.clearTimeout(noselTimer)
      noselTimer = PW.setTimeout(function () {
        de.classList.remove("fb-nosel")
      }, 700)
    } catch (e) {}
  }

  function clickEl(el) {
    if (!el) return
    try {
      el.dispatchEvent(new PW.MouseEvent("click", { bubbles: true, cancelable: true, view: PW }))
    } catch (e) {
      try {
        el.click()
      } catch (_) {}
    }
  }
  function togglePanel() {
    let root = PD.querySelector(".edge-panel-root")
    if (!root) return
    let icon = root.querySelector(".icon-panel")
    let hidden = !icon || PW.getComputedStyle(icon).display === "none"
    if (hidden) clickEl(root.querySelector(".edge-tab"))
    else clickEl(root.querySelector(".panel-header"))
  }

  function closePopover() {
    let pop = PD.getElementById(POP_ID)
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop)
    PD.removeEventListener("click", onDocClick, true)
  }
  function onDocClick(e) {
    let pop = PD.getElementById(POP_ID),
      btn = PD.getElementById(BTN_ID)
    if (!pop) return
    if (pop.contains(e.target)) return
    if (btn && btn.contains(e.target)) return
    closePopover()
  }
  function openPopover(anchorEl) {
    closePopover()
    let cur = getMode()
    let items = [
      ["input", "输入框按钮"],
      ["edge", "边缘拉手"],
      ["longpress", "长按空白处"],
    ]
    let pop = PD.createElement("div")
    pop.id = POP_ID
    pop.style.cssText =
      "position:fixed;z-index:100000;min-width:172px;padding:6px;" +
      "background:rgba(28,28,32,.96);color:#eee;border:1px solid rgba(255,255,255,.12);" +
      "border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.45);" +
      "font-size:13px;line-height:1.4;backdrop-filter:blur(12px);" +
      "-webkit-backdrop-filter:blur(12px);-webkit-user-select:none;user-select:none;"
    let title = PD.createElement("div")
    title.textContent = "入口显示模式"
    title.style.cssText = "padding:4px 8px 6px;opacity:.6;font-size:12px;"
    pop.appendChild(title)
    items.forEach(function (it) {
      let opt = PD.createElement("div")
      opt.textContent = (it[0] === cur ? "● " : "○ ") + it[1]
      opt.style.cssText =
        "padding:7px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;" +
        (it[0] === cur ? "background:rgba(255,255,255,.10);" : "")
      opt.addEventListener("mouseenter", function () {
        opt.style.background = "rgba(255,255,255,.14)"
      })
      opt.addEventListener("mouseleave", function () {
        opt.style.background = it[0] === getMode() ? "rgba(255,255,255,.10)" : "transparent"
      })

      opt.addEventListener(
        "touchstart",
        function (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        },
        { passive: false },
      )
      opt.addEventListener(
        "touchend",
        function (ev) {
          ev.preventDefault()
          ev.stopPropagation()
          setMode(it[0])
          closePopover()
        },
        { passive: false },
      )
      opt.addEventListener("click", function (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        setMode(it[0])
        closePopover()
      })
      pop.appendChild(opt)
    })
    PD.body.appendChild(pop)

    let r = anchorEl.getBoundingClientRect()
    let ph = pop.offsetHeight,
      pwd = pop.offsetWidth
    let vw = PW.innerWidth,
      vh = PW.innerHeight
    let top = r.top - ph - 8
    if (top < 8) top = Math.min(r.bottom + 8, vh - ph - 8)
    let left = r.left + r.width / 2 - pwd / 2
    if (left + pwd > vw - 8) left = vw - pwd - 8
    if (left < 8) left = 8
    pop.style.top = top + "px"
    pop.style.left = left + "px"
    setTimeout(function () {
      PD.addEventListener("click", onDocClick, true)
    }, 0)
  }

  function bindButton(btn) {
    let longTimer = null,
      longFired = false,
      touchHandled = false
    let sx = 0,
      sy = 0,
      moved = false

    function startLong() {
      clearLong()
      longFired = false
      longTimer = PW.setTimeout(function () {
        longFired = true
        suppressSelection()
        openPopover(btn)
      }, 450)
    }
    function clearLong() {
      if (longTimer) {
        PW.clearTimeout(longTimer)
        longTimer = null
      }
    }

    btn.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault()
        if (e.touches && e.touches[0]) {
          sx = e.touches[0].clientX
          sy = e.touches[0].clientY
        }
        moved = false
        startLong()
      },
      { passive: false },
    )
    btn.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches && e.touches[0]) {
          if (Math.abs(e.touches[0].clientX - sx) > 10 || Math.abs(e.touches[0].clientY - sy) > 10) {
            moved = true
            clearLong()
          }
        }
      },
      { passive: true },
    )
    btn.addEventListener(
      "touchend",
      function (e) {
        e.preventDefault()
        clearLong()
        touchHandled = true
        PW.setTimeout(function () {
          touchHandled = false
        }, 400)
        if (longFired) {
          longFired = false
          return
        }
        if (!moved) togglePanel()
      },
      { passive: false },
    )
    btn.addEventListener("touchcancel", function () {
      clearLong()
      moved = true
    })

    btn.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return
      e.preventDefault()
      startLong()
    })
    btn.addEventListener("mouseup", clearLong)
    btn.addEventListener("mouseleave", clearLong)
    btn.addEventListener("click", function (e) {
      if (touchHandled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (longFired) {
        e.preventDefault()
        e.stopPropagation()
        longFired = false
        return
      }
      togglePanel()
    })
    btn.addEventListener("contextmenu", function (e) {
      e.preventDefault()
      openPopover(btn)
    })
  }
    window.openPosMenu = function(anchorEl, curPos) {
    closePosMenu()
    const items = [
      ["left", "左侧"],
      ["right", "右侧"],
      ["top", "顶部"],
      ["bottom", "底部"],
    ]
    let pop = PD.createElement("div")
    pop.id = "fb-storage-pos-popover"
    pop.style.cssText = "position:fixed;z-index:100001;padding:8px 10px;border-radius:10px;font-size:13px;line-height:1.4;-webkit-user-select:none;user-select:none;"
    let ref = (PD.querySelector(".edge-panel-root .icon-panel") || PD.querySelector(".edge-panel-root .settings-panel"))
    if (ref) {
      let cs = PW.getComputedStyle(ref)
      let a = ["background", "backdrop-filter", "-webkit-backdrop-filter", "border", "box-shadow", "color"]
      for (let k = 0; k < a.length; k++) {
        try { let v = cs.getPropertyValue(a[k]); if (v && v !== "none") pop.style[a[k]] = v } catch (e) {}
      }
    }
    if (!pop.style.background) pop.style.background = "rgba(28,28,32,.9)"

    items.forEach(function (it) {
      let opt = PD.createElement("div")
      opt.textContent = (it[0] === curPos ? "● " : "○ ") + it[1]
      opt.style.cssText = "padding:7px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;" + (it[0] === curPos ? "background:rgba(255,255,255,.10);" : "")
      opt.addEventListener("touchstart", function (ev) { ev.preventDefault(); ev.stopPropagation() }, { passive: false })
      opt.addEventListener("touchend", function (ev) { ev.preventDefault(); ev.stopPropagation(); try { settingsApi.setPanelPosition(it[0]) } catch (e) {}; closePosMenu() }, { passive: false })
      opt.addEventListener("mousedown", function (ev) { ev.preventDefault(); ev.stopPropagation() })
      opt.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); try { settingsApi.setPanelPosition(it[0]) } catch (e) {}; closePosMenu() })
      opt.addEventListener("mouseenter", function () { opt.style.background = "rgba(255,255,255,.14)" })
      opt.addEventListener("mouseleave", function () { opt.style.background = it[0] === curPos ? "rgba(255,255,255,.10)" : "transparent" })
      pop.appendChild(opt)
    })
    PD.body.appendChild(pop)
    let r = anchorEl.getBoundingClientRect()
    let pw = pop.offsetWidth, ph = pop.offsetHeight
    let vw = PW.innerWidth, vh = PW.innerHeight
    // 参考 二级容器(设置面板) 与主面板的间距大小
    let base = PD.querySelector(".edge-panel-root .settings-panel") || PD.querySelector(".edge-panel-root .icon-panel")
    let br = base ? base.getBoundingClientRect() : r
    let GAP = 6
    let top, left
    if (curPos === "top") { top = br.bottom + GAP; left = r.left + r.width / 2 - pw / 2 }
    else if (curPos === "bottom") { top = br.top - ph - GAP; left = r.left + r.width / 2 - pw / 2 }
    else if (curPos === "left") { left = br.right + GAP; top = r.top + r.height / 2 - ph / 2 }
    else { left = br.left - pw - GAP; top = r.top + r.height / 2 - ph / 2 }
    if (top < 8) top = Math.min(br.bottom + 8, vh - ph - 8)
    if (left < 8) left = 8
    if (left + pw > vw - 8) left = vw - pw - 8
    pop.style.top = top + "px"
    pop.style.left = left + "px"
    setTimeout(function () { PD.addEventListener("click", posMenuDocClick, true) }, 0)
  }
  function closePosMenu() {
    let pop = PD.getElementById("fb-storage-pos-popover")
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop)
    PD.removeEventListener("click", posMenuDocClick, true)
  }
  function posMenuDocClick(e) {
    let pop = PD.getElementById("fb-storage-pos-popover")
    if (!pop) return
    if (pop.contains(e.target)) return
    let btn = e.target.closest && (e.target.closest('.settings-option[title="位置"]') || e.target.closest(".fa-flag"))
    if (btn) return
    closePosMenu()
  }

  window.openEntryMenu = function(anchorEl) {
    closeEntryMenu()
    const cur = getMode()
    const items = [
      ["edge", "边缘拉手"],
      ["input", "输入框按钮"],
      ["longpress", "长按空白处"],
    ]
    let pop = PD.createElement("div")
    pop.id = "fb-storage-entry-popover"
    pop.style.cssText = "position:fixed;z-index:100001;padding:8px 10px;border-radius:10px;font-size:13px;line-height:1.4;-webkit-user-select:none;user-select:none;"
    let ref = PD.querySelector(".edge-panel-root .icon-panel") || PD.querySelector(".edge-panel-root .settings-panel")
    if (ref) {
      let cs = PW.getComputedStyle(ref)
      let a = ["background", "backdrop-filter", "-webkit-backdrop-filter", "border", "box-shadow", "color"]
      for (let k = 0; k < a.length; k++) {
        try { let v = cs.getPropertyValue(a[k]); if (v && v !== "none") pop.style[a[k]] = v } catch (e) {}
      }
    }
    if (!pop.style.background) pop.style.background = "rgba(28,28,32,.9)"
    items.forEach(function (it) {
      let opt = PD.createElement("div")
      opt.textContent = (it[0] === cur ? "● " : "○ ") + it[1]
      opt.style.cssText = "padding:7px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;" + (it[0] === cur ? "background:rgba(255,255,255,.10);" : "")
      opt.addEventListener("touchstart", function (ev) { ev.preventDefault(); ev.stopPropagation() }, { passive: false })
      opt.addEventListener("touchend", function (ev) { ev.preventDefault(); ev.stopPropagation(); setMode(it[0]); closeEntryMenu() }, { passive: false })
      opt.addEventListener("mousedown", function (ev) { ev.preventDefault(); ev.stopPropagation() })
      opt.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); setMode(it[0]); closeEntryMenu() })
      opt.addEventListener("mouseenter", function () { opt.style.background = "rgba(255,255,255,.14)" })
      opt.addEventListener("mouseleave", function () { opt.style.background = getMode() === it[0] ? "rgba(255,255,255,.10)" : "transparent" })
      pop.appendChild(opt)
    })
    PD.body.appendChild(pop)
    let r = anchorEl.getBoundingClientRect()
    let pw = pop.offsetWidth, ph = pop.offsetHeight
    let vw = PW.innerWidth, vh = PW.innerHeight
    let base = PD.querySelector(".edge-panel-root .settings-panel") || PD.querySelector(".edge-panel-root .icon-panel")
    let br = base ? base.getBoundingClientRect() : r
    let rootEl = PD.querySelector(".edge-panel-root")
    let curPos = "top"
    if (rootEl) {
      if (rootEl.classList.contains("edge-panel-root--bottom")) curPos = "bottom"
      else if (rootEl.classList.contains("edge-panel-root--left")) curPos = "left"
      else if (rootEl.classList.contains("edge-panel-root--right")) curPos = "right"
      else curPos = "top"
    }
    let top, left
    if (curPos === "top") { top = br.bottom + 6; left = r.left + r.width / 2 - pw / 2 }
    else if (curPos === "bottom") { top = br.top - ph - 6; left = r.left + r.width / 2 - pw / 2 }
    else if (curPos === "left") { left = br.right + 6; top = r.top + r.height / 2 - ph / 2 }
    else { left = br.left - pw - 6; top = r.top + r.height / 2 - ph / 2 }
    if (top < 8) top = Math.min(br.bottom + 8, vh - ph - 8)
    if (left < 8) left = 8
    if (left + pw > vw - 8) left = vw - pw - 8
    pop.style.top = top + "px"
    pop.style.left = left + "px"
    setTimeout(function () { PD.addEventListener("click", entryMenuDocClick, true) }, 0)
  }
  function closeEntryMenu() {
    let pop = PD.getElementById("fb-storage-entry-popover")
    if (pop && pop.parentNode) pop.parentNode.removeChild(pop)
    PD.removeEventListener("click", entryMenuDocClick, true)
  }
  function entryMenuDocClick(e) {
    let pop = PD.getElementById("fb-storage-entry-popover")
    if (!pop) return
    if (pop.contains(e.target)) return
    let btn = e.target.closest && (e.target.closest('.settings-option[title="入口"]') || e.target.closest(".fa-list-check"))
    if (btn) return
    closeEntryMenu()
  }


  // ===== 长按空白处 开/关 (longpress 模式) =====
  let lpTimer = null, lpStartX = 0, lpStartY = 0, lpActive = false
  function isBlankLongPressArea(el) {
    if (!el) return false
    try {
      if (el.closest("input,textarea,select,[contenteditable='true'],[contenteditable]")) return false
      if (el.closest(".edge-panel-root,[data-edge-ball-id]")) return false
      if (el.closest(".mes_text,blockquote,pre,code,textarea,.swipe_block")) return false
    } catch (e) {}
    // 有活动文本选区 -> 视为复制手势，放行
    try { let sel = PW.getSelection && PW.getSelection(); if (sel && !sel.isCollapsed) return false } catch (e) {}
    return true
  }
  function lpStart(e) {
    // 桌面鼠标左键长按才走 timer；触屏靠 contextmenu 触发（避免双触发）；右键仅走 contextmenu
    if (getMode() !== "longpress") return
    if (e.type === "touchstart") return
    if (e.button !== 0) return
    if (!isBlankLongPressArea(e.target)) return
    lpActive = true; lpStartX = e.clientX; lpStartY = e.clientY
    if (lpTimer) PW.clearTimeout(lpTimer)
    lpTimer = PW.setTimeout(function () {
      if (lpActive && getMode() === "longpress") togglePanel()
      lpActive = false
    }, 600)
  }
  function lpMove(e) {
    if (!lpActive) return
    let t = e.touches && e.touches[0] ? e.touches[0] : e
    if (Math.abs(t.clientX - lpStartX) > 10 || Math.abs(t.clientY - lpStartY) > 10) {
      lpActive = false
      if (lpTimer) { PW.clearTimeout(lpTimer); lpTimer = null }
    }
  }
  function lpCancel() { lpActive = false; if (lpTimer) { PW.clearTimeout(lpTimer); lpTimer = null } }
  function lpHandler(e) {
    if (getMode() !== "longpress") return
    let target = e.target
    if (!isBlankLongPressArea(target)) return
    e.preventDefault()
    e.stopPropagation()
    togglePanel()
  }
  // 绑定
  PD.addEventListener("touchstart", lpStart, { passive: true })
  PD.addEventListener("touchmove", lpMove, { passive: true })
  PD.addEventListener("touchend", lpCancel)
  PD.addEventListener("touchcancel", lpCancel)
  PD.addEventListener("mousedown", lpStart, true)
  PD.addEventListener("mouseup", lpCancel, true)
  PD.addEventListener("mousemove", lpMove, true)
  PD.addEventListener("contextmenu", lpHandler, true)

function bindEdgeTabMenu() {
    let root = PD.querySelector(".edge-panel-root")
    if (!root || root.__fbMenuBound) return
    root.__fbMenuBound = true
    let lt = null,
      lf = false
    let mlt = null,
      mlf = false
    function isTab(t) {
      return t && t.closest && t.closest(".edge-tab")
    }

    root.addEventListener(
      "contextmenu",
      function (e) {
        let tab = isTab(e.target)
        if (!tab) return
        e.preventDefault()
        e.stopPropagation()
        openPopover(tab)
      },
      true,
    )

    root.addEventListener(
      "mousedown",
      function (e) {
        if (e.button !== 0) return
        let tab = isTab(e.target)
        if (!tab) return
        mlf = false
        mlt = PW.setTimeout(function () {
          mlf = true
          suppressSelection()
          openPopover(tab)
        }, 500)
      },
      true,
    )
    root.addEventListener(
      "mouseup",
      function () {
        if (mlt) {
          PW.clearTimeout(mlt)
          mlt = null
        }
      },
      true,
    )
    root.addEventListener(
      "mouseleave",
      function () {
        if (mlt) {
          PW.clearTimeout(mlt)
          mlt = null
        }
      },
      true,
    )

    root.addEventListener(
      "click",
      function (e) {
        if (mlf && isTab(e.target)) {
          e.preventDefault()
          e.stopPropagation()
          mlf = false
        }
      },
      true,
    )

    root.addEventListener(
      "touchstart",
      function (e) {
        let tab = isTab(e.target)
        if (!tab) return
        lf = false
        lt = PW.setTimeout(function () {
          lf = true
          suppressSelection()
          openPopover(tab)
        }, 500)
      },
      { passive: true, capture: true },
    )
    root.addEventListener(
      "touchend",
      function (e) {
        if (lt) {
          PW.clearTimeout(lt)
          lt = null
        }
        if (lf) {
          e.preventDefault()
          e.stopPropagation()
          lf = false
        }
      },
      { passive: false, capture: true },
    )
    root.addEventListener("touchcancel", function () {
      if (lt) {
        PW.clearTimeout(lt)
        lt = null
      }
      lf = false
    })
  }

  function findAnchor() {
    return (
      PD.querySelector("#rightSendForm") ||
      PD.querySelector("#leftSendForm") ||
      PD.querySelector("#send_form") ||
      PD.querySelector("#form_sheld")
    )
  }
  function mount() {
    bindEdgeTabMenu()
    let anchor = findAnchor()
    if (!anchor) return false
    ensureStaticStyle()
    if (PD.getElementById(BTN_ID)) {
      applyMode()
      return true
    }
    let btn = PD.createElement("div")
    btn.id = BTN_ID
    btn.title = "悬浮球收纳：点击开/关面板，长按或右键切换入口"
    let ic = PD.createElement("i")
    ic.className = "fa-solid fa-circle-notch"
    btn.appendChild(ic)
    bindButton(btn)
    anchor.appendChild(btn)
    applyMode()
    return true
  }

  let mountAttempts = 0
  const MAX_ATTEMPTS = 20

  function tryMountUntilSuccess() {
    if (PW.__fbInputEntryCleaned || mountAttempts >= MAX_ATTEMPTS) return
    mountAttempts++
    bindEdgeTabMenu()
    if (!PD.getElementById(BTN_ID)) {
      try {
        if (mount()) return
      } catch (e) {}
      PW.setTimeout(tryMountUntilSuccess, 300 * Math.min(mountAttempts, 5))
    }
  }

  const mountObserver = new MutationObserver(() => {
    if (PW.__fbInputEntryCleaned) {
      mountObserver.disconnect()
      return
    }
    if (!PD.getElementById(BTN_ID)) {
      mountAttempts = 0
      tryMountUntilSuccess()
    } else {
      applyMode()
    }
  })
  mountObserver.observe(PD.body, { childList: true, subtree: true })
    activeCleanup = cleanupImpl

  function cleanupImpl() {
    PW.__fbInputEntryCleaned = true
    PW.__fbInputEntryInstalled = false
    try {
      mountObserver.disconnect()
    } catch (e) {}
    try {
      PD.removeEventListener("touchstart", lpStart, { passive: true })
      PD.removeEventListener("touchmove", lpMove, { passive: true })
      PD.removeEventListener("touchend", lpCancel)
      PD.removeEventListener("touchcancel", lpCancel)
      PD.removeEventListener("mousedown", lpStart, true)
      PD.removeEventListener("mouseup", lpCancel, true)
      PD.removeEventListener("mousemove", lpMove, true)
      PD.removeEventListener("contextmenu", lpHandler, true)
    } catch (e) {}
    closePopover()
    const b = PD.getElementById(BTN_ID)
    if (b && b.parentNode) b.parentNode.removeChild(b)
  }

  try {
    mount()
  } catch (e) {}
  if (typeof $ === "function") {
    $(function () {
      try {
        mount()
      } catch (e) {}
    })
    $(PW).on("pagehide.fbInputEntry", cleanupImpl)
    $(PW).on("beforeunload.fbInputEntry", cleanupImpl)
  }
} catch (e) {
  try {
    console.error("[输入框入口] 启动失败:", e)
  } catch (_) {}
}
}

/**
 * 回收输入框入口：移除按钮、断开 observer、解绑拖拽与菜单监听。
 * 由主运行时的 cleanup 调用（修复 A2：原实现只在页面卸载时清理）。
 */
export function cleanupInputEntry() {
  if (typeof activeCleanup === 'function') {
    try {
      activeCleanup()
    } catch (e) {}
    activeCleanup = null
  }
}
