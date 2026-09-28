import { klona as e } from "https://testingcf.jsdelivr.net/npm/klona/+esm"
var t = {
    424(e, t, n) {
      function a(e, t) {
        for (var n = [], a = {}, o = 0; o < t.length; o++) {
          var r = t[o],
            i = r[0],
            l = { id: e + ":" + o, css: r[1], media: r[2], sourceMap: r[3] }
          a[i] ? a[i].parts.push(l) : n.push((a[i] = { id: i, parts: [l] }))
        }
        return n
      }
      n.d(t, { A: () => g })
      var o = "undefined" != typeof document
      if ("undefined" != typeof DEBUG && DEBUG && !o)
        throw new Error(
          "vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.",
        )
      var r = {},
        i = o && (document.head || document.getElementsByTagName("head")[0]),
        l = null,
        s = 0,
        A = !1,
        c = function () {},
        p = null,
        d = "data-vue-ssr-id",
        u = "undefined" != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())
      function g(e, t, n, o) {
        ;((A = n), (p = o || {}))
        var i = a(e, t)
        return (
          C(i),
          function (t) {
            for (var n = [], o = 0; o < i.length; o++) {
              var l = i[o]
              ;((s = r[l.id]).refs--, n.push(s))
            }
            t ? C((i = a(e, t))) : (i = [])
            for (o = 0; o < n.length; o++) {
              var s
              if (0 === (s = n[o]).refs) {
                for (var A = 0; A < s.parts.length; A++) s.parts[A]()
                delete r[s.id]
              }
            }
          }
        )
      }
      function C(e) {
        for (var t = 0; t < e.length; t++) {
          var n = e[t],
            a = r[n.id]
          if (a) {
            a.refs++
            for (var o = 0; o < a.parts.length; o++) a.parts[o](n.parts[o])
            for (; o < n.parts.length; o++) a.parts.push(b(n.parts[o]))
            a.parts.length > n.parts.length && (a.parts.length = n.parts.length)
          } else {
            var i = []
            for (o = 0; o < n.parts.length; o++) i.push(b(n.parts[o]))
            r[n.id] = { id: n.id, refs: 1, parts: i }
          }
        }
      }
      function f() {
        var e = document.createElement("style")
        return ((e.type = "text/css"), i.appendChild(e), e)
      }
      function b(e) {
        var t,
          n,
          a = document.querySelector("style[" + d + '~="' + e.id + '"]')
        if (a) {
          if (A) return c
          a.parentNode.removeChild(a)
        }
        if (u) {
          var o = s++
          ;((a = l || (l = f())), (t = m.bind(null, a, o, !1)), (n = m.bind(null, a, o, !0)))
        } else
          ((a = f()),
            (t = x.bind(null, a)),
            (n = function () {
              a.parentNode.removeChild(a)
            }))
        return (
          t(e),
          function (a) {
            if (a) {
              if (a.css === e.css && a.media === e.media && a.sourceMap === e.sourceMap) return
              t((e = a))
            } else n()
          }
        )
      }
      var v,
        h =
          ((v = []),
          function (e, t) {
            return ((v[e] = t), v.filter(Boolean).join("\n"))
          })
      function m(e, t, n, a) {
        var o = n ? "" : a.css
        if (e.styleSheet) e.styleSheet.cssText = h(t, o)
        else {
          var r = document.createTextNode(o),
            i = e.childNodes
          ;(i[t] && e.removeChild(i[t]), i.length ? e.insertBefore(r, i[t]) : e.appendChild(r))
        }
      }
      function x(e, t) {
        var n = t.css,
          a = t.media,
          o = t.sourceMap
        if (
          (a && e.setAttribute("media", a),
          p.ssrId && e.setAttribute(d, t.id),
          o &&
            ((n += "\n/*# sourceURL=" + o.sources[0] + " */"),
            (n +=
              "\n/*# sourceMappingURL=data:application/json;base64," +
              btoa(unescape(encodeURIComponent(JSON.stringify(o)))) +
              " */")),
          e.styleSheet)
        )
          e.styleSheet.cssText = n
        else {
          for (; e.firstChild;) e.removeChild(e.firstChild)
          e.appendChild(document.createTextNode(n))
        }
      }
    },
    492(e) {
      e.exports = function (e) {
        var t = e[1],
          n = e[3]
        if (!n) return t
        if ("function" == typeof btoa) {
          var a = btoa(unescape(encodeURIComponent(JSON.stringify(n)))),
            o = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),
            r = "/*# ".concat(o, " */")
          return [t].concat([r]).join("\n")
        }
        return [t].join("\n")
      }
    },
    502(e, t) {
      t.A = (e, t) => {
        const n = e.__vccOpts || e
        for (const [e, a] of t) n[e] = a
        return n
      }
    },
    705(e, t, n) {
      var a = n(882)
      ;(a.__esModule && (a = a.default),
        "string" == typeof a && (a = [[e.id, a, ""]]),
        a.locals && (e.exports = a.locals))
      ;(0, n(424).A)("ffda7b94", a, !1, { ssrId: !0 })
    },
    748(e) {
      e.exports = function (e) {
        var t = []
        return (
          (t.toString = function () {
            return this.map(function (t) {
              var n = "",
                a = void 0 !== t[5]
              return (
                t[4] && (n += "@supports (".concat(t[4], ") {")),
                t[2] && (n += "@media ".concat(t[2], " {")),
                a && (n += "@layer".concat(t[5].length > 0 ? " ".concat(t[5]) : "", " {")),
                (n += e(t)),
                a && (n += "}"),
                t[2] && (n += "}"),
                t[4] && (n += "}"),
                n
              )
            }).join("")
          }),
          (t.i = function (e, n, a, o, r) {
            "string" == typeof e && (e = [[null, e, void 0]])
            var i = {}
            if (a)
              for (var l = 0; l < this.length; l++) {
                var s = this[l][0]
                null != s && (i[s] = !0)
              }
            for (var A = 0; A < e.length; A++) {
              var c = [].concat(e[A])
              ;(a && i[c[0]]) ||
                (void 0 !== r &&
                  (void 0 === c[5] ||
                    (c[1] = "@layer".concat(c[5].length > 0 ? " ".concat(c[5]) : "", " {").concat(c[1], "}")),
                  (c[5] = r)),
                n && (c[2] ? ((c[1] = "@media ".concat(c[2], " {").concat(c[1], "}")), (c[2] = n)) : (c[2] = n)),
                o &&
                  (c[4]
                    ? ((c[1] = "@supports (".concat(c[4], ") {").concat(c[1], "}")), (c[4] = o))
                    : (c[4] = "".concat(o))),
                t.push(c))
            }
          }),
          t
        )
      }
    },
    882(e, t, n) {
      ;(n.r(t), n.d(t, { default: () => l }))
      var a = n(492),
        o = n.n(a),
        r = n(748),
        i = n.n(r)()(o())
      i.push([
        e.id,
        '.edge-panel-root[data-v-da7fb8b4]{position:fixed;z-index:500;pointer-events:none}.edge-panel-root[data-v-da7fb8b4] *{pointer-events:auto}.edge-panel-root--left[data-v-da7fb8b4]{left:10px;right:auto;top:300px;transform:none}.edge-panel-root--right[data-v-da7fb8b4]{left:auto;right:10px;top:300px;transform:none}.edge-panel-root--top[data-v-da7fb8b4]{top:var(--v9d17ecc4);left:50%;transform:translateX(-50%)}.edge-panel-root--bottom[data-v-da7fb8b4]{top:var(--v9d17ecc4);left:50%;transform:translateX(-50%) translateY(-100%)}.edge-panel-root--left[data-v-da7fb8b4] .icon-panel--left[data-v-da7fb8b4]{right:-50px;left:auto;top:50%;transform:translateY(-50%);flex-direction:column;border-radius:0 12px 12px 0;border-left:none;box-shadow:4px 0 20px rgba(0,0,0,.3),inset 0 1px 0 hsla(0,0%,100%,.08),inset 0 -1px 0 rgba(0,0,0,.1)}.edge-panel-root--right[data-v-da7fb8b4] .icon-panel--right[data-v-da7fb8b4]{left:-50px;right:auto;top:50%;transform:translateY(-50%);flex-direction:column;border-radius:12px 0 0 12px;border-right:none;box-shadow:-4px 0 20px rgba(0,0,0,.3),inset 0 1px 0 hsla(0,0%,100%,.08),inset 0 -1px 0 rgba(0,0,0,.1)}.edge-panel-root--horizontal .icon-panel[data-v-da7fb8b4]{overflow:visible}.edge-panel-root--left .icon-panel[data-v-da7fb8b4]{overflow:visible}.edge-panel-root--right .icon-panel[data-v-da7fb8b4]{overflow:visible}.edge-panel-root--horizontal .settings-panel[data-v-da7fb8b4]{position:absolute;left:50%;transform:translateX(-50%);top:calc(100% + 6px);margin:0;z-index:8;box-shadow:0 8px 18px rgba(0,0,0,.24);background:var(--v447886dc);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:8px}.edge-panel-root--bottom .settings-panel[data-v-da7fb8b4]{top:auto;left:50%;transform:translateX(-50%);bottom:calc(100% + 6px);box-shadow:0 -8px 18px rgba(0,0,0,.24)}.edge-panel-root--left .settings-panel[data-v-da7fb8b4]{position:absolute;left:calc(100% + 6px);top:50%;transform:translateY(-50%);z-index:8;box-shadow:8px 0 18px rgba(0,0,0,.24);background:var(--v447886dc);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:8px}.edge-panel-root--right .settings-panel[data-v-da7fb8b4]{position:absolute;right:calc(100% + 6px);top:50%;transform:translateY(-50%);z-index:8;box-shadow:-8px 0 18px rgba(0,0,0,.24);background:var(--v447886dc);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:8px}.edge-panel-root--horizontal .settings-title[data-v-da7fb8b4],.edge-panel-root--horizontal .settings-label[data-v-da7fb8b4]{text-align:center}.edge-panel-root--left[data-v-da7fb8b4] .edge-tab--left[data-v-da7fb8b4]{left:0;right:auto;top:50%;transform:translateY(-50%);width:16px;height:46px;border-left:none;border-bottom:none;border-radius:0 10px 10px 0;box-shadow:3px 0 16px rgba(0,0,0,.24),inset 0 1px 0 hsla(0,0%,100%,.1),inset 0 -1px 0 rgba(0,0,0,.12)}.edge-panel-root--left[data-v-da7fb8b4] .edge-tab--left[data-v-da7fb8b4] i[data-v-da7fb8b4]{transform:rotate(0deg)}.edge-panel-root--right[data-v-da7fb8b4] .edge-tab--right[data-v-da7fb8b4]{right:0;left:auto;top:50%;transform:translateY(-50%);width:16px;height:46px;border-right:none;border-bottom:none;border-radius:10px 0 0 10px;box-shadow:-3px 0 16px rgba(0,0,0,.24),inset 0 1px 0 hsla(0,0%,100%,.1),inset 0 -1px 0 rgba(0,0,0,.12)}.edge-panel-root--right[data-v-da7fb8b4] .edge-tab--right[data-v-da7fb8b4] i[data-v-da7fb8b4]{transform:rotate(0deg)}.edge-tab[data-v-da7fb8b4]{position:absolute;background:var(--v447886dc);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--v70503c70);cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:.85}.edge-tab i[data-v-da7fb8b4]{font-size:10px;color:var(--v2826bcb2);opacity:.8;transition:all .25s ease}.edge-tab--has-plugins[data-v-da7fb8b4]::after{content:"";position:absolute;width:4px;height:4px;background:var(--ec7cae14);border-radius:50%;opacity:.9;box-shadow:0 0 2px var(--ec7cae14)}.edge-tab--left[data-v-da7fb8b4]{right:0;top:50%;transform:translateY(-50%);width:14px;height:50px;border-right:none;border-radius:8px 0 0 8px;box-shadow:-2px 0 12px rgba(0,0,0,.25),inset 0 1px 0 hsla(0,0%,100%,.08),inset 0 -1px 0 rgba(0,0,0,.1)}.edge-tab--left.edge-tab--has-plugins[data-v-da7fb8b4]::after{top:8px;left:4px}.edge-tab--right[data-v-da7fb8b4]{right:0;top:50%;transform:translateY(-50%);width:14px;height:50px;border-right:none;border-radius:8px 0 0 8px;box-shadow:-2px 0 12px rgba(0,0,0,.25),inset 0 1px 0 hsla(0,0%,100%,.08),inset 0 -1px 0 rgba(0,0,0,.1)}.edge-tab--right.edge-tab--has-plugins[data-v-da7fb8b4]::after{top:8px;left:4px}.edge-tab--top[data-v-da7fb8b4]{top:0;left:50%;transform:translateX(-50%);width:50px;height:14px;border-top:none;border-radius:0 0 8px 8px;box-shadow:0 2px 12px rgba(0,0,0,.25),inset 1px 0 0 hsla(0,0%,100%,.08),inset -1px 0 0 rgba(0,0,0,.1)}.edge-tab--top.edge-tab--has-plugins[data-v-da7fb8b4]::after{bottom:4px;right:8px}.edge-tab--bottom[data-v-da7fb8b4]{bottom:0;left:50%;transform:translateX(-50%);width:50px;height:14px;border-bottom:none;border-radius:8px 8px 0 0;box-shadow:0 -2px 12px rgba(0,0,0,.25),inset 1px 0 0 hsla(0,0%,100%,.08),inset -1px 0 0 rgba(0,0,0,.1)}.edge-tab--bottom.edge-tab--has-plugins[data-v-da7fb8b4]::after{top:4px;right:8px}.icon-panel[data-v-da7fb8b4]{position:absolute;background:var(--v447886dc);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--v70503c70);padding:6px;display:flex;gap:6px;align-items:center}.icon-panel--left[data-v-da7fb8b4]{right:0;top:50%;transform:translateY(-50%);min-width:44px;flex-direction:column;border-right:none;border-radius:10px 0 0 10px;box-shadow:-4px 0 20px rgba(0,0,0,.3),inset 0 1px 0 hsla(0,0%,100%,.08),inset 0 -1px 0 rgba(0,0,0,.1)}.icon-panel--right[data-v-da7fb8b4]{left:0;top:50%;transform:translateY(-50%);min-width:44px;flex-direction:column;border-left:none;border-radius:0 10px 10px 0;box-shadow:4px 0 20px rgba(0,0,0,.3),inset 0 1px 0 hsla(0,0%,100%,.08),inset 0 -1px 0 rgba(0,0,0,.1)}.icon-panel--top[data-v-da7fb8b4]{top:0;left:50%;transform:translateX(-50%);min-height:44px;flex-direction:row;border-top:none;border-radius:0 0 10px 10px;box-shadow:0 4px 20px rgba(0,0,0,.3),inset 1px 0 0 hsla(0,0%,100%,.08),inset -1px 0 0 rgba(0,0,0,.1)}.icon-panel--bottom[data-v-da7fb8b4]{bottom:0;left:50%;transform:translateX(-50%);min-height:44px;flex-direction:row;border-bottom:none;border-radius:10px 10px 0 0;box-shadow:0 -4px 20px rgba(0,0,0,.3),inset 1px 0 0 hsla(0,0%,100%,.08),inset -1px 0 0 rgba(0,0,0,.1)}.edge-panel-root--horizontal .panel-header[data-v-da7fb8b4]{width:24px;height:30px;margin-bottom:0;margin-right:4px}.edge-panel-root--horizontal .panel-icons[data-v-da7fb8b4]{flex-direction:row;gap:4px}.edge-panel-root--horizontal .captured-balls-container[data-v-da7fb8b4]{flex-direction:row;overflow:hidden;max-width:155px;align-items:center;justify-content:center}.edge-panel-root--horizontal .panel-divider[data-v-da7fb8b4]{width:1px;height:28px;background:linear-gradient(180deg,transparent,var(--v70503c70),transparent);margin:0 2px}.edge-panel-root--horizontal .panel-actions[data-v-da7fb8b4]{flex-direction:row;padding-top:0;padding-left:0;gap:2px;margin-top:auto;margin-bottom:auto}.edge-panel-root--horizontal .action-icon[data-v-da7fb8b4]{width:26px;height:28px}.edge-panel-root--horizontal .panel-empty[data-v-da7fb8b4]{flex-direction:row;padding:4px 8px}.edge-panel-root--horizontal .panel-empty .panel-empty-text[data-v-da7fb8b4]{max-width:none;white-space:nowrap}.edge-panel-root--horizontal .settings-panel[data-v-da7fb8b4]{flex-direction:row;align-items:center;gap:6px;padding:4px 8px;margin-top:0;margin-left:4px}.edge-panel-root--horizontal .settings-options[data-v-da7fb8b4]{flex-direction:row;gap:4px}.edge-panel-root--horizontal .settings-option[data-v-da7fb8b4]{width:24px;height:24px}.edge-panel-root--horizontal .settings-divider[data-v-da7fb8b4]{width:1px;height:20px;margin:0 2px}.edge-panel-root--horizontal .settings-row[data-v-da7fb8b4]{flex-direction:row;gap:4px}.panel-header[data-v-da7fb8b4]{background:transparent;width:30px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:6px;transition:all .2s ease;margin-bottom:2px;flex-shrink:0}.panel-header i[data-v-da7fb8b4]{font-size:11px;color:var(--v2826bcb2);opacity:.6;transition:all .2s ease}.panel-header[data-v-da7fb8b4]:hover{background:hsla(0,0%,100%,.08)}.panel-header:hover i[data-v-da7fb8b4]{opacity:1;color:var(--ec7cae14)}.panel-icons[data-v-da7fb8b4]{display:flex;flex-direction:column;gap:4px;align-items:center}.captured-balls-container[data-v-da7fb8b4]{display:flex;align-items:center;justify-content:center;min-height:0;max-height:147px;overflow:hidden;position:relative}.captured-balls-container[data-v-da7fb8b4] >*{cursor:pointer !important;transition:filter .2s ease,transform .1s ease !important;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}.captured-balls-container[data-v-da7fb8b4] >*:hover{filter:brightness(1.15) !important}.panel-divider[data-v-da7fb8b4]{height:1px;background:linear-gradient(90deg,transparent,var(--v70503c70),transparent);margin:4px 2px;opacity:.5;flex-shrink:0}.plugin-icon[data-v-da7fb8b4]{--plugin-color:var(--ec7cae14);width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:hsla(0,0%,100%,.06);border:1px solid hsla(0,0%,100%,.1);border-radius:6px;cursor:pointer;transition:all .2s cubic-bezier(0.4,0,0.2,1);position:relative;box-shadow:0 1px 2px rgba(0,0,0,.15),inset 0 1px 0 hsla(0,0%,100%,.08)}.plugin-icon i[data-v-da7fb8b4]{font-size:12px;color:var(--v2826bcb2);opacity:.8;transition:all .2s ease}.plugin-icon[data-v-da7fb8b4]:hover{background:hsla(0,0%,100%,.12);border-color:var(--plugin-color);transform:scale(1.05);box-shadow:0 2px 6px rgba(0,0,0,.2),inset 0 1px 0 hsla(0,0%,100%,.12)}.plugin-icon:hover i[data-v-da7fb8b4]{opacity:1;color:var(--plugin-color)}.plugin-icon[data-v-da7fb8b4]:active{transform:scale(0.92);box-shadow:0 1px 1px rgba(0,0,0,.2)}.plugin-icon--active[data-v-da7fb8b4]{background:hsla(0,0%,100%,.14);border-color:var(--plugin-color);box-shadow:0 1px 4px rgba(0,0,0,.2),0 0 0 1px var(--plugin-color)}.plugin-icon--active i[data-v-da7fb8b4]{opacity:1;color:var(--plugin-color)}.plugin-icon--active[data-v-da7fb8b4]::after{content:"";position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);width:12px;height:2px;background:var(--plugin-color);border-radius:1px;box-shadow:0 0 2px var(--plugin-color)}.panel-actions[data-v-da7fb8b4]{display:flex;flex-direction:column;gap:2px;align-items:center;align-self:center}.action-icon[data-v-da7fb8b4]{width:28px;height:26px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0);border:none;border-radius:6px;cursor:pointer;transition:all .2s ease}.action-icon i[data-v-da7fb8b4]{font-size:11px;color:var(--v2826bcb2);opacity:.4;transition:all .2s ease}.action-icon[data-v-da7fb8b4]:hover{background:hsla(0,0%,100%,.08)}.action-icon:hover i[data-v-da7fb8b4]{opacity:.9;color:var(--ec7cae14)}.action-icon[data-v-da7fb8b4]:active{transform:scale(0.92)}.action-icon:active i[data-v-da7fb8b4]{opacity:1}.action-icon--active[data-v-da7fb8b4]{background:rgba(59,130,246,.2)}.action-icon--active i[data-v-da7fb8b4]{opacity:1;color:#3b82f6}.action-icon--active[data-v-da7fb8b4]:hover{background:rgba(59,130,246,.3)}.panel-empty[data-v-da7fb8b4]{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:6px 4px;opacity:.4}.panel-empty i[data-v-da7fb8b4]{font-size:14px;color:var(--v2826bcb2)}.panel-empty .panel-empty-text[data-v-da7fb8b4]{font-size:9px;color:var(--v2826bcb2);text-align:center;line-height:1.2;max-width:50px}.settings-panel[data-v-da7fb8b4]{display:flex;flex-direction:column;gap:6px;padding:6px;margin-top:2px}.settings-title[data-v-da7fb8b4]{font-size:9px;color:var(--v2826bcb2);opacity:.6;text-align:center}.settings-options[data-v-da7fb8b4]{display:flex;flex-direction:column;gap:2px}.settings-option[data-v-da7fb8b4]{width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:hsla(0,0%,100%,.06);border:1px solid hsla(0,0%,100%,.1);border-radius:5px;cursor:pointer;transition:all .2s ease}.settings-option i[data-v-da7fb8b4]{font-size:10px;color:var(--v2826bcb2);opacity:.6}.settings-option[data-v-da7fb8b4]:hover{background:hsla(0,0%,100%,.12);border-color:var(--ec7cae14)}.settings-option:hover i[data-v-da7fb8b4]{opacity:1;color:var(--ec7cae14)}.settings-option--active[data-v-da7fb8b4]{background:rgba(59,130,246,.2);border-color:#3b82f6}.settings-option--active i[data-v-da7fb8b4]{opacity:1;color:#3b82f6}.settings-divider[data-v-da7fb8b4]{height:1px;background:linear-gradient(90deg,transparent,var(--v70503c70),transparent);margin:2px 0;opacity:.5}.settings-row[data-v-da7fb8b4]{display:flex;flex-direction:column;align-items:center;gap:2px}.settings-label[data-v-da7fb8b4]{font-size:8px;color:var(--v2826bcb2);opacity:.6}.settings-toggle[data-v-da7fb8b4]{width:30px;height:16px;background:hsla(0,0%,100%,.1);border-radius:8px;cursor:pointer;position:relative;transition:all .2s ease}.settings-toggle[data-v-da7fb8b4]:hover{background:hsla(0,0%,100%,.15)}.settings-toggle--active[data-v-da7fb8b4]{background:rgba(59,130,246,.4)}.settings-toggle--active .settings-toggle-knob[data-v-da7fb8b4]{transform:translateX(14px);background:#3b82f6}.settings-toggle-knob[data-v-da7fb8b4]{width:12px;height:12px;background:var(--v2826bcb2);border-radius:50%;position:absolute;top:2px;left:2px;transition:all .2s ease}.settings-fade-enter-active[data-v-da7fb8b4],.settings-fade-leave-active[data-v-da7fb8b4]{transition:all .2s ease}.settings-fade-enter-from[data-v-da7fb8b4],.settings-fade-leave-to[data-v-da7fb8b4]{opacity:0;transform:scale(0.95)}.panel-slide-left-enter-active[data-v-da7fb8b4],.panel-slide-left-leave-active[data-v-da7fb8b4]{transition:all .25s cubic-bezier(0.4,0,0.2,1)}.panel-slide-left-enter-from[data-v-da7fb8b4],.panel-slide-left-leave-to[data-v-da7fb8b4]{opacity:0;transform:translateY(-50%) translateX(20px)}.panel-slide-left-enter-to[data-v-da7fb8b4],.panel-slide-left-leave-from[data-v-da7fb8b4]{opacity:1;transform:translateY(-50%) translateX(0)}.panel-slide-right-enter-active[data-v-da7fb8b4],.panel-slide-right-leave-active[data-v-da7fb8b4]{transition:all .25s cubic-bezier(0.4,0,0.2,1)}.panel-slide-right-enter-from[data-v-da7fb8b4],.panel-slide-right-leave-to[data-v-da7fb8b4]{opacity:0;transform:translateY(-50%) translateX(-20px)}.panel-slide-right-enter-to[data-v-da7fb8b4],.panel-slide-right-leave-from[data-v-da7fb8b4]{opacity:1;transform:translateY(-50%) translateX(0)}.panel-slide-top-enter-active[data-v-da7fb8b4],.panel-slide-top-leave-active[data-v-da7fb8b4]{transition:all .25s cubic-bezier(0.4,0,0.2,1)}.panel-slide-top-enter-from[data-v-da7fb8b4],.panel-slide-top-leave-to[data-v-da7fb8b4]{opacity:0;transform:translateX(-50%) translateY(-20px)}.panel-slide-top-enter-to[data-v-da7fb8b4],.panel-slide-top-leave-from[data-v-da7fb8b4]{opacity:1;transform:translateX(-50%) translateY(0)}.panel-slide-bottom-enter-active[data-v-da7fb8b4],.panel-slide-bottom-leave-active[data-v-da7fb8b4]{transition:all .25s cubic-bezier(0.4,0,0.2,1)}.panel-slide-bottom-enter-from[data-v-da7fb8b4],.panel-slide-bottom-leave-to[data-v-da7fb8b4]{opacity:0;transform:translateX(-50%) translateY(20px)}.panel-slide-bottom-enter-to[data-v-da7fb8b4],.panel-slide-bottom-leave-from[data-v-da7fb8b4]{opacity:1;transform:translateX(-50%) translateY(0)}.fb-pages-layer[data-v-da7fb8b4]{display:flex;flex-direction:column}.edge-panel-root--horizontal .fb-pages-layer[data-v-da7fb8b4]{flex-direction:row}.icon-panel--left .fb-pages-layer[data-v-da7fb8b4],.icon-panel--right .fb-pages-layer[data-v-da7fb8b4]{flex-direction:column!important}.fb-page[data-v-da7fb8b4]{display:flex;flex-shrink:0;flex-direction:column;align-items:center;justify-content:center}.edge-panel-root--horizontal .fb-page[data-v-da7fb8b4]{flex-direction:row}.icon-panel--left .fb-page[data-v-da7fb8b4],.icon-panel--right .fb-page[data-v-da7fb8b4]{flex-direction:column!important}.captured-balls-container[data-v-da7fb8b4] .fb-page>*{cursor:pointer!important;transition:filter .2s ease,transform .1s ease!important;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}.captured-balls-container[data-v-da7fb8b4] .fb-page>*:active{transform:scale(0.95)!important}.fb-arrow[data-v-da7fb8b4]{display:flex;align-items:center;justify-content:center;width:24px;height:24px;color:var(--v2826bcb2);opacity:.7;cursor:pointer;font-size:18px;user-select:none;flex-shrink:0;transition:opacity .15s;line-height:1;align-self:center}.fb-arrow[data-v-da7fb8b4]:hover{opacity:1}.fb-arrow--disabled[data-v-da7fb8b4]{opacity:.18;cursor:default}.icon-panel--left .fb-arrow[data-v-da7fb8b4],.icon-panel--right .fb-arrow[data-v-da7fb8b4]{transform:rotate(90deg);margin-left:5px}.edge-panel-root--horizontal .fb-arrow[data-v-da7fb8b4],.icon-panel--top .fb-arrow[data-v-da7fb8b4],.icon-panel--bottom .fb-arrow[data-v-da7fb8b4]{margin-top:-5px}@media (min-width: 769px){.edge-panel-root--left[data-v-da7fb8b4] .edge-tab--left[data-v-da7fb8b4]{width:14px;height:50px}.edge-panel-root--right[data-v-da7fb8b4] .edge-tab--right[data-v-da7fb8b4]{width:14px;height:50px}.edge-panel-root--left[data-v-da7fb8b4]{left:0}.edge-panel-root--right[data-v-da7fb8b4]{right:0}.edge-panel-root--left[data-v-da7fb8b4] .icon-panel--left[data-v-da7fb8b4]{left:0;right:auto}.edge-panel-root--right[data-v-da7fb8b4] .icon-panel--right[data-v-da7fb8b4]{right:0;left:auto}}.edge-tab-fade-leave-active[data-v-da7fb8b4]{transition:none}.edge-tab-fade-enter-active[data-v-da7fb8b4]{transition:opacity .3s ease}.edge-tab-fade-enter-from[data-v-da7fb8b4],.edge-tab-fade-leave-to[data-v-da7fb8b4]{opacity:0}',
        "",
        {
          version: 3,
          sources: ["webpack://./src/集成控件/EdgePanel.vue"],
          names: [],
          mappings:
            "AAIA,kCACE,cAAA,CACA,WAAA,CACA,mBAAA,CAEA,oCACE,mBAAA,CAMF,wCACE,qBAAA,CACA,OAAA,CAEA,4CAAA,CAMF,yCACE,qBAAA,CACA,OAAA,CACA,0BAAA,CAMF,uCACE,oBAAA,CACA,QAAA,CAEA,0BAAA,CAMF,0CACE,oBAAA,CACA,QAAA,CAEA,4CAAA,CAOJ,2BACE,iBAAA,CACA,2BAAA,CACA,0BAAA,CACA,kCAAA,CACA,iCAAA,CACA,cAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,WAAA,CACA,6CAAA,CAEA,6BACE,cAAA,CACA,sBAAA,CACA,UAAA,CACA,wBAAA,CAGF,iCACE,SAAA,CACA,2BAAA,CAEA,mCACE,SAAA,CACA,qBAAA,CAIJ,kCACE,UAAA,CAIF,+CACE,UAAA,CACA,iBAAA,CACA,SAAA,CACA,UAAA,CACA,0BAAA,CACA,iBAAA,CACA,UAAA,CACA,kCAAA,CAOF,iCACE,OAAA,CACA,OAAA,CACA,0BAAA,CACA,UAAA,CACA,WAAA,CACA,iBAAA,CACA,yBAAA,CACA,sGACE,CAIF,uCACE,UAAA,CACA,sGACE,CAKJ,wCACE,UAAA,CAGF,8DACE,OAAA,CACA,QAAA,CAKJ,kCACE,MAAA,CACA,OAAA,CACA,0BAAA,CACA,UAAA,CACA,WAAA,CACA,gBAAA,CACA,yBAAA,CACA,qGACE,CAIF,wCACE,UAAA,CACA,qGACE,CAKJ,yCACE,UAAA,CAGF,+DACE,OAAA,CACA,SAAA,CAMJ,gCACE,KAAA,CACA,QAAA,CACA,0BAAA,CACA,UAAA,CACA,WAAA,CACA,eAAA,CACA,yBAAA,CACA,qGACE,CAIF,sCACE,WAAA,CACA,qGACE,CAKJ,uCACE,WAAA,CAGF,6DACE,UAAA,CACA,SAAA,CAQJ,mCACE,QAAA,CACA,QAAA,CACA,0BAAA,CACA,UAAA,CACA,WAAA,CACA,kBAAA,CACA,yBAAA,CACA,sGACE,CAIF,yCACE,WAAA,CACA,sGACE,CAKJ,0CACE,WAAA,CAGF,gEACE,OAAA,CACA,SAAA,CAQN,6BACE,iBAAA,CACA,2BAAA,CACA,0BAAA,CACA,kCAAA,CACA,iCAAA,CACA,UAAA,CACA,YAAA,CACA,OAAA,CAGA,mCACE,OAAA,CACA,OAAA,CACA,0BAAA,CACA,cAAA,CACA,qBAAA,CACA,iBAAA,CACA,0BAAA,CACA,qGACE,CAMJ,oCACE,MAAA,CACA,OAAA,CACA,0BAAA,CACA,cAAA,CACA,qBAAA,CACA,gBAAA,CACA,0BAAA,CACA,oGACE,CAMJ,kCACE,KAAA,CACA,QAAA,CACA,0BAAA,CACA,eAAA,CACA,kBAAA,CACA,eAAA,CACA,0BAAA,CACA,oGACE,CAMJ,qCACE,QAAA,CACA,QAAA,CACA,0BAAA,CACA,eAAA,CACA,kBAAA,CACA,kBAAA,CACA,0BAAA,CACA,qGACE,CAQJ,4DACE,UAAA,CACA,WAAA,CACA,eAAA,CACA,gBAAA,CAGF,2DACE,kBAAA,CACA,OAAA,CAGF,wEACE,kBAAA,CACA,gBAAA,CACA,iBAAA,CACA,sBAAA,CACA,iCAAA,CACA,kBAAA,CACA,kBAAA,CACA,eAAA,CACA,YAAA,CACA,OAAA,CAEA,wFACE,SAAA,CAEA,kGACE,+BAAA,CACA,iBAAA,CAEA,mGACE,2BAAA,CACA,iBAAA,CAGF,4EACE,aAAA,CACA,cAAA,CACA,qBAAA,CACA,+BAAA,CAEA,iFACE,qBAAA,CAKJ,6DACE,SAAA,CACA,WAAA,CACA,2EAAA,CACA,YAAA,CAGF,6DACE,kBAAA,CACA,aAAA,CACA,cAAA,CACA,OAAA,CACA,yBAAA,CACA,iBAAA,CACA,eAAA,CACA,eAAA,CAGF,2DACE,UAAA,CACA,WAAA,CAGF,2DACE,kBAAA,CACA,eAAA,CAEA,6EACE,cAAA,CACA,kBAAA,CAIJ,8DACE,kBAAA,CACA,kBAAA,CACA,OAAA,CACA,eAAA,CACA,YAAA,CACA,eAAA,CAGF,gEACE,kBAAA,CACA,OAAA,CAGF,gEACE,UAAA,CACA,WAAA,CAGF,gEACE,SAAA,CACA,WAAA,CACA,YAAA,CAGF,4DACE,kBAAA,CACA,OAAA,CAOJ,+BACE,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,cAAA,CACA,iBAAA,CACA,uBAAA,CACA,iBAAA,CACA,aAAA,CAEA,iCACE,cAAA,CACA,sBAAA,CACA,UAAA,CACA,uBAAA,CAGF,qCACE,8BAAA,CAEA,uCACE,SAAA,CACA,qBAAA,CAQN,8BACE,YAAA,CACA,qBAAA,CACA,OAAA,CAMF,2CACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,OAAA,CACA,YAAA,CAIA,8CACE,yBAAA,CACA,wDAAA,CACA,iBAAA,CACA,iCAAA,CAEA,qDACE,iCAAA,CAGF,qDACE,iCAAA,CAQN,gCACE,UAAA,CACA,0EAAA,CACA,cAAA,CACA,UAAA,CACA,aAAA,CAIF,8BACE,8BAAA,CAEA,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,8BAAA,CACA,mCAAA,CACA,iBAAA,CACA,cAAA,CACA,8CAAA,CACA,iBAAA,CACA,qEACE,CAGF,gCACE,cAAA,CACA,sBAAA,CACA,UAAA,CACA,wBAAA,CAGF,oCACE,8BAAA,CACA,gCAAA,CACA,qBAAA,CACA,uEACE,CAGF,sCACE,SAAA,CACA,yBAAA,CAIJ,qCACE,qBAAA,CACA,mCAAA,CAIF,sCACE,8BAAA,CACA,gCAAA,CACA,iEACE,CAGF,wCACE,SAAA,CACA,yBAAA,CAGF,6CACE,UAAA,CACA,iBAAA,CACA,WAAA,CACA,QAAA,CACA,0BAAA,CACA,UAAA,CACA,UAAA,CACA,8BAAA,CACA,iBAAA,CACA,sCAAA,CAMN,gCACE,YAAA,CACA,qBAAA,CACA,OAAA,CACA,eAAA,CAIF,8BACE,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,wBAAA,CACA,WAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CAEA,gCACE,cAAA,CACA,sBAAA,CACA,UAAA,CACA,uBAAA,CAGF,oCACE,8BAAA,CAEA,sCACE,UAAA,CACA,qBAAA,CAIJ,qCACE,qBAAA,CAEA,uCACE,SAAA,CAKJ,sCACE,8BAAA,CAEA,wCACE,SAAA,CACA,aAAA,CAGF,4CACE,8BAAA,CAMN,8BACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,OAAA,CACA,eAAA,CACA,UAAA,CAEA,gCACE,cAAA,CACA,sBAAA,CAGF,gDACE,cAAA,CACA,sBAAA,CACA,iBAAA,CACA,eAAA,CACA,cAAA,CAOJ,iCACE,YAAA,CACA,qBAAA,CACA,OAAA,CACA,WAAA,CACA,yBAAA,CACA,iBAAA,CACA,cAAA,CAGF,iCACE,cAAA,CACA,sBAAA,CACA,UAAA,CACA,iBAAA,CAGF,mCACE,YAAA,CACA,qBAAA,CACA,OAAA,CAGF,kCACE,UAAA,CACA,WAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CACA,8BAAA,CACA,mCAAA,CACA,iBAAA,CACA,cAAA,CACA,uBAAA,CAEA,oCACE,cAAA,CACA,sBAAA,CACA,UAAA,CAGF,wCACE,8BAAA,CACA,4BAAA,CAEA,0CACE,SAAA,CACA,qBAAA,CAIJ,0CACE,8BAAA,CACA,oBAAA,CAEA,4CACE,SAAA,CACA,aAAA,CAKN,mCACE,UAAA,CACA,0EAAA,CACA,YAAA,CACA,UAAA,CAGF,+BACE,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,OAAA,CAGF,iCACE,cAAA,CACA,sBAAA,CACA,UAAA,CAGF,kCACE,UAAA,CACA,WAAA,CACA,6BAAA,CACA,iBAAA,CACA,cAAA,CACA,iBAAA,CACA,uBAAA,CAEA,wCACE,8BAAA,CAGF,0CACE,8BAAA,CAEA,gEACE,0BAAA,CACA,kBAAA,CAKN,uCACE,UAAA,CACA,WAAA,CACA,2BAAA,CACA,iBAAA,CACA,iBAAA,CACA,OAAA,CACA,QAAA,CACA,uBAAA,CAMF,0FAEE,uBAAA,CAGF,oFAEE,SAAA,CACA,qBAAA,CAMF,gGAEE,6CAAA,CAGF,0FAEE,SAAA,CACA,2CAAA,CAGF,0FAEE,SAAA,CACA,wCAAA,CAMF,kGAEE,6CAAA,CAGF,4FAEE,SAAA,CACA,4CAAA,CAGF,4FAEE,SAAA,CACA,wCAAA,CAMF,8FAEE,6CAAA,CAGF,wFAEE,SAAA,CACA,4CAAA,CAGF,wFAEE,SAAA,CACA,wCAAA,CAMF,oGAEE,6CAAA,CAGF,8FAEE,SAAA,CACA,2CAAA,CAGF,8FAEE,SAAA,CACA,wCAAA",
          sourcesContent: [
            "\n// ============================================\n// 根容器 - 支持四个位置\n// ============================================\n.edge-panel-root {\n  position: fixed;\n  z-index: 500;\n  pointer-events: none;\n\n  * {\n    pointer-events: auto;\n  }\n\n  // 左侧位置：吸附在聊天面板左边缘外侧，垂直居中\n  // panelPositionStyle 是聊天面板左边缘的 x 坐标\n  // 面板和展开内容都在聊天面板左边的背景上，向左展开\n  &--left {\n    left: v-bind('panelPositionStyle');\n    top: 50%;\n    // 使用 translateX(-100%) 将面板放到坐标的左边\n    transform: translateX(-100%) translateY(-50%);\n  }\n\n  // 右侧位置：吸附在聊天面板右边缘外侧，垂直居中\n  // panelPositionStyle 是聊天面板右边缘的 x 坐标\n  // 面板和展开内容都在聊天面板右边的背景上，向右展开\n  &--right {\n    left: v-bind('panelPositionStyle');\n    top: 50%;\n    transform: translateY(-50%);\n  }\n\n  // 顶部位置：吸附在设置栏下边缘外侧，水平居中\n  // panelPositionStyle 是设置栏下边缘的 y 坐标\n  // 面板和展开内容都在设置栏下方的背景上，向上展开到设置栏下方\n  &--top {\n    top: v-bind('panelPositionStyle');\n    left: 50%;\n    // 面板从设置栏下边缘开始向下展开\n    transform: translateX(-50%);\n  }\n\n  // 底部位置：吸附在输入框上边缘外侧，水平居中\n  // panelPositionStyle 是输入框上边缘的 y 坐标\n  // 面板和展开内容都在输入框上方的背景上，向下展开到输入框上方\n  &--bottom {\n    top: v-bind('panelPositionStyle');\n    left: 50%;\n    // 使用 translateY(-100%) 将面板放到坐标的上方\n    transform: translateX(-50%) translateY(-100%);\n  }\n}\n\n// ============================================\n// 边缘箭头标签 - 基础样式\n// ============================================\n.edge-tab {\n  position: absolute;\n  background: v-bind('themeColors.glassBg');\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid v-bind('themeColors.borderColor');\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  opacity: 0.85;\n  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n\n  i {\n    font-size: 10px;\n    color: v-bind('themeColors.textColor');\n    opacity: 0.8;\n    transition: all 0.25s ease;\n  }\n\n  &:hover {\n    opacity: 1;\n    background: v-bind('themeColors.glassHoverBg');\n\n    i {\n      opacity: 1;\n      color: v-bind('themeColors.quoteColor');\n    }\n  }\n\n  &:active {\n    opacity: 0.9;\n  }\n\n  // 有插件时的指示器\n  &--has-plugins::after {\n    content: '';\n    position: absolute;\n    width: 6px;\n    height: 6px;\n    background: v-bind('themeColors.quoteColor');\n    border-radius: 50%;\n    opacity: 0.9;\n    box-shadow: 0 0 4px v-bind('themeColors.quoteColor');\n  }\n\n  // 左侧位置：小箭头紧贴根容器右边缘（也就是紧贴聊天面板左边缘外侧）\n  // 根容器使用 translateX(-100%) 使其右边缘对齐聊天面板左边缘\n  // 所以小箭头用 right: 0 即可紧贴聊天面板左边缘\n  // 小箭头圆角在左边（靠近背景那侧），右边紧贴聊天面板无边框无圆角\n  &--left {\n    right: 0; // 在根容器右边缘，不需要额外偏移\n    top: 50%;\n    transform: translateY(-50%);\n    width: 14px;\n    height: 50px;\n    border-right: none; // 右侧紧贴聊天面板，无边框\n    border-radius: 8px 0 0 8px; // 圆角在左边（靠近背景那侧）\n    box-shadow:\n      -2px 0 12px rgba(0, 0, 0, 0.25),\n      inset 0 1px 0 rgba(255, 255, 255, 0.08),\n      inset 0 -1px 0 rgba(0, 0, 0, 0.1);\n\n    &:hover {\n      width: 20px;\n      box-shadow:\n        -3px 0 16px rgba(0, 0, 0, 0.3),\n        inset 0 1px 0 rgba(255, 255, 255, 0.12),\n        inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n    }\n\n    &:active {\n      width: 12px;\n    }\n\n    &.edge-tab--has-plugins::after {\n      top: 8px;\n      left: 4px;\n    }\n  }\n\n  // 右侧位置：小箭头在根容器左边缘（紧贴聊天面板右边缘）\n  &--right {\n    left: 0; // 在根容器左边缘\n    top: 50%;\n    transform: translateY(-50%);\n    width: 14px;\n    height: 50px;\n    border-left: none;\n    border-radius: 0 8px 8px 0;\n    box-shadow:\n      2px 0 12px rgba(0, 0, 0, 0.25),\n      inset 0 1px 0 rgba(255, 255, 255, 0.08),\n      inset 0 -1px 0 rgba(0, 0, 0, 0.1);\n\n    &:hover {\n      width: 20px;\n      box-shadow:\n        3px 0 16px rgba(0, 0, 0, 0.3),\n        inset 0 1px 0 rgba(255, 255, 255, 0.12),\n        inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n    }\n\n    &:active {\n      width: 12px;\n    }\n\n    &.edge-tab--has-plugins::after {\n      top: 8px;\n      right: 4px;\n    }\n  }\n\n  // 顶部位置：小箭头在根容器下边缘（紧贴设置栏下边缘）\n  // 面板从设置栏下边缘向下展开，箭头也在下方\n  &--top {\n    top: 0; // 在根容器上边缘\n    left: 50%;\n    transform: translateX(-50%);\n    width: 50px;\n    height: 14px;\n    border-top: none;\n    border-radius: 0 0 8px 8px;\n    box-shadow:\n      0 2px 12px rgba(0, 0, 0, 0.25),\n      inset 1px 0 0 rgba(255, 255, 255, 0.08),\n      inset -1px 0 0 rgba(0, 0, 0, 0.1);\n\n    &:hover {\n      height: 20px;\n      box-shadow:\n        0 3px 16px rgba(0, 0, 0, 0.3),\n        inset 1px 0 0 rgba(255, 255, 255, 0.12),\n        inset -1px 0 0 rgba(0, 0, 0, 0.15);\n    }\n\n    &:active {\n      height: 12px;\n    }\n\n    &.edge-tab--has-plugins::after {\n      bottom: 4px;\n      right: 8px;\n    }\n  }\n\n  // 底部位置：小箭头紧贴根容器下边缘（也就是紧贴输入框上边缘外侧）\n  // 根容器使用 translateY(-100%) 使其下边缘对齐输入框上边缘\n  // 所以小箭头用 bottom: 0 即可紧贴输入框上边缘\n  // 小箭头圆角在上边（靠近背景那侧），下边紧贴输入框无边框无圆角\n  &--bottom {\n    bottom: 0; // 在根容器下边缘，不需要额外偏移\n    left: 50%;\n    transform: translateX(-50%);\n    width: 50px;\n    height: 14px;\n    border-bottom: none; // 下边紧贴输入框，无边框\n    border-radius: 8px 8px 0 0; // 圆角在上边（靠近背景那侧）\n    box-shadow:\n      0 -2px 12px rgba(0, 0, 0, 0.25),\n      inset 1px 0 0 rgba(255, 255, 255, 0.08),\n      inset -1px 0 0 rgba(0, 0, 0, 0.1);\n\n    &:hover {\n      height: 20px;\n      box-shadow:\n        0 -3px 16px rgba(0, 0, 0, 0.3),\n        inset 1px 0 0 rgba(255, 255, 255, 0.12),\n        inset -1px 0 0 rgba(0, 0, 0, 0.15);\n    }\n\n    &:active {\n      height: 12px;\n    }\n\n    &.edge-tab--has-plugins::after {\n      top: 4px;\n      right: 8px;\n    }\n  }\n}\n\n// ============================================\n// 展开的图标面板 - 基础样式\n// ============================================\n.icon-panel {\n  position: absolute;\n  background: v-bind('themeColors.glassBg');\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);\n  border: 1px solid v-bind('themeColors.borderColor');\n  padding: 6px;\n  display: flex;\n  gap: 6px;\n\n  // 左侧位置：面板在根容器内，向左展开\n  &--left {\n    right: 0; // 在根容器右边缘内侧\n    top: 50%;\n    transform: translateY(-50%);\n    min-width: 44px;\n    flex-direction: column;\n    border-right: none;\n    border-radius: 10px 0 0 10px;\n    box-shadow:\n      -4px 0 20px rgba(0, 0, 0, 0.3),\n      inset 0 1px 0 rgba(255, 255, 255, 0.08),\n      inset 0 -1px 0 rgba(0, 0, 0, 0.1);\n  }\n\n  // 右侧位置：面板在根容器内，向右展开\n  &--right {\n    left: 0; // 在根容器左边缘内侧\n    top: 50%;\n    transform: translateY(-50%);\n    min-width: 44px;\n    flex-direction: column;\n    border-left: none;\n    border-radius: 0 10px 10px 0;\n    box-shadow:\n      4px 0 20px rgba(0, 0, 0, 0.3),\n      inset 0 1px 0 rgba(255, 255, 255, 0.08),\n      inset 0 -1px 0 rgba(0, 0, 0, 0.1);\n  }\n\n  // 顶部位置：面板在根容器内，从设置栏下边缘向下展开\n  &--top {\n    top: 0; // 在根容器上边缘内侧\n    left: 50%;\n    transform: translateX(-50%);\n    min-height: 44px;\n    flex-direction: row;\n    border-top: none;\n    border-radius: 0 0 10px 10px;\n    box-shadow:\n      0 4px 20px rgba(0, 0, 0, 0.3),\n      inset 1px 0 0 rgba(255, 255, 255, 0.08),\n      inset -1px 0 0 rgba(0, 0, 0, 0.1);\n  }\n\n  // 底部位置：面板在根容器内，从输入框上边缘向上展开\n  &--bottom {\n    bottom: 0; // 在根容器下边缘内侧\n    left: 50%;\n    transform: translateX(-50%);\n    min-height: 44px;\n    flex-direction: row;\n    border-bottom: none;\n    border-radius: 10px 10px 0 0;\n    box-shadow:\n      0 -4px 20px rgba(0, 0, 0, 0.3),\n      inset 1px 0 0 rgba(255, 255, 255, 0.08),\n      inset -1px 0 0 rgba(0, 0, 0, 0.1);\n  }\n}\n\n// 水平布局时的调整\n.edge-panel-root--horizontal {\n  .panel-header {\n    width: 24px;\n    height: 30px;\n    margin-bottom: 0;\n    margin-right: 4px;\n  }\n\n  .panel-icons {\n    flex-direction: row;\n    gap: 4px;\n  }\n\n  .captured-balls-container {\n    flex-direction: row;\n    overflow-x: auto;\n    overflow-y: hidden;\n    scroll-behavior: smooth;\n    -webkit-overflow-scrolling: touch;\n    scrollbar-width: none;\n    white-space: nowrap;\n    max-width: 260px;\n    padding: 2px 0;\n    gap: 4px;\n\n    &::-webkit-scrollbar {\n      height: 3px;\n    }\n\n    &::-webkit-scrollbar-track {\n      background: transparent;\n    }\n\n    &::-webkit-scrollbar-thumb {\n      background: transparent;\n    }\n\n    :deep(> *) {\n      flex-shrink: 0;\n      margin-right: 0;\n      transform: scale(0.75);\n      transition: transform 0.2s ease;\n\n      &:active {\n        transform: scale(0.7);\n      }\n    }\n  }\n\n  .panel-divider {\n    width: 1px;\n    height: 28px;\n    background: linear-gradient(180deg, transparent, v-bind('themeColors.borderColor'), transparent);\n    margin: 0 2px;\n  }\n\n  .panel-actions {\n    flex-direction: row;\n    padding-top: 0;\n    padding-left: 0;\n    gap: 2px;\n  }\n\n  .action-icon {\n    width: 26px;\n    height: 28px;\n  }\n\n  .panel-empty {\n    flex-direction: row;\n    padding: 4px 8px;\n\n    .panel-empty-text {\n      max-width: none;\n      white-space: nowrap;\n    }\n  }\n\n  .settings-panel {\n    flex-direction: row;\n    align-items: center;\n    gap: 6px;\n    padding: 4px 8px;\n    margin-top: 0;\n    margin-left: 4px;\n  }\n\n  .settings-options {\n    flex-direction: row;\n    gap: 4px;\n  }\n\n  .settings-option {\n    width: 24px;\n    height: 24px;\n  }\n\n  .settings-divider {\n    width: 1px;\n    height: 20px;\n    margin: 0 2px;\n  }\n\n  .settings-row {\n    flex-direction: row;\n    gap: 4px;\n  }\n}\n\n// 底部定位：设置面板向上弹出\n.edge-panel-root--bottom {\n  .settings-panel {\n    top: auto;\n    bottom: calc(100% + 6px);\n    box-shadow: 0 -8px 18px rgba(0, 0, 0, 0.24);\n  }\n}\n\n\n// ============================================\n// 面板头部 - 收起按钮\n// ============================================\n.panel-header {\n  width: 30px;\n  height: 26px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 6px;\n  transition: all 0.2s ease;\n  margin-bottom: 2px;\n  flex-shrink: 0;\n\n  i {\n    font-size: 11px;\n    color: v-bind('themeColors.textColor');\n    opacity: 0.6;\n    transition: all 0.2s ease;\n  }\n\n  &:hover {\n    background: rgba(255, 255, 255, 0.08);\n\n    i {\n      opacity: 1;\n      color: v-bind('themeColors.quoteColor');\n    }\n  }\n}\n\n// ============================================\n// 插件图标列表\n// ============================================\n.panel-icons {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n// ============================================\n// 捕获的悬浮球容器\n// ============================================\n.captured-balls-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 2px;\n  min-height: 0;\n\n  // 容器内的悬浮球 - 不强制修改尺寸，由 JS 通过 transform 缩放\n  // 只添加视觉效果，同时防止滑动时误触\n  :deep(> *) {\n    cursor: pointer !important;\n    transition: filter 0.2s ease, transform 0.1s ease !important;\n    user-select: none;\n    -webkit-tap-highlight-color: transparent;\n\n    &:active {\n      transform: scale(0.92) !important;\n    }\n\n    &:hover {\n      filter: brightness(1.15) !important;\n    }\n  }\n}\n\n// ============================================\n// 分隔线\n// ============================================\n.panel-divider {\n  height: 1px;\n  background: linear-gradient(90deg, transparent, v-bind('themeColors.borderColor'), transparent);\n  margin: 4px 2px;\n  opacity: 0.5;\n  flex-shrink: 0;\n}\n\n// 单个插件图标 - 缩小尺寸\n.plugin-icon {\n  --plugin-color: v-bind('themeColors.quoteColor');\n\n  width: 28px;\n  height: 28px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  position: relative;\n  box-shadow:\n    0 1px 2px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.08);\n\n  i {\n    font-size: 12px;\n    color: v-bind('themeColors.textColor');\n    opacity: 0.8;\n    transition: all 0.2s ease;\n  }\n\n  &:hover {\n    background: rgba(255, 255, 255, 0.12);\n    border-color: var(--plugin-color);\n    transform: scale(1.05);\n    box-shadow:\n      0 2px 6px rgba(0, 0, 0, 0.2),\n      inset 0 1px 0 rgba(255, 255, 255, 0.12);\n\n    i {\n      opacity: 1;\n      color: var(--plugin-color);\n    }\n  }\n\n  &:active {\n    transform: scale(0.92);\n    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);\n  }\n\n  // 激活状态\n  &--active {\n    background: rgba(255, 255, 255, 0.14);\n    border-color: var(--plugin-color);\n    box-shadow:\n      0 1px 4px rgba(0, 0, 0, 0.2),\n      0 0 0 1px var(--plugin-color);\n\n    i {\n      opacity: 1;\n      color: var(--plugin-color);\n    }\n\n    &::after {\n      content: '';\n      position: absolute;\n      bottom: -2px;\n      left: 50%;\n      transform: translateX(-50%);\n      width: 12px;\n      height: 2px;\n      background: var(--plugin-color);\n      border-radius: 1px;\n      box-shadow: 0 0 2px var(--plugin-color);\n    }\n  }\n}\n\n// 操作按钮区域 - 紧凑布局\n.panel-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding-top: 2px;\n}\n\n// 操作按钮图标 - 紧凑\n.action-icon {\n  width: 28px;\n  height: 26px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: transparent;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n\n  i {\n    font-size: 11px;\n    color: v-bind('themeColors.textColor');\n    opacity: 0.4;\n    transition: all 0.2s ease;\n  }\n\n  &:hover {\n    background: rgba(255, 255, 255, 0.08);\n\n    i {\n      opacity: 0.9;\n      color: v-bind('themeColors.quoteColor');\n    }\n  }\n\n  &:active {\n    transform: scale(0.92);\n\n    i {\n      opacity: 1;\n    }\n  }\n\n  // 激活状态（捕获模式中）\n  &--active {\n    background: rgba(59, 130, 246, 0.2);\n\n    i {\n      opacity: 1;\n      color: #3b82f6;\n    }\n\n    &:hover {\n      background: rgba(59, 130, 246, 0.3);\n    }\n  }\n}\n\n// 空状态 - 紧凑\n.panel-empty {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  padding: 6px 4px;\n  opacity: 0.4;\n\n  i {\n    font-size: 14px;\n    color: v-bind('themeColors.textColor');\n  }\n\n  .panel-empty-text {\n    font-size: 9px;\n    color: v-bind('themeColors.textColor');\n    text-align: center;\n    line-height: 1.2;\n    max-width: 50px;\n  }\n}\n\n// ============================================\n// 设置面板 - 紧凑\n// ============================================\n.settings-panel {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 6px;\n  margin-top: 2px;\n}\n\n.settings-title {\n  font-size: 9px;\n  color: v-bind('themeColors.textColor');\n  opacity: 0.6;\n  text-align: center;\n}\n\n.settings-options {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.settings-option {\n  width: 24px;\n  height: 24px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 5px;\n  cursor: pointer;\n  transition: all 0.2s ease;\n\n  i {\n    font-size: 10px;\n    color: v-bind('themeColors.textColor');\n    opacity: 0.6;\n  }\n\n  &:hover {\n    background: rgba(255, 255, 255, 0.12);\n    border-color: v-bind('themeColors.quoteColor');\n\n    i {\n      opacity: 1;\n      color: v-bind('themeColors.quoteColor');\n    }\n  }\n\n  &--active {\n    background: rgba(59, 130, 246, 0.2);\n    border-color: #3b82f6;\n\n    i {\n      opacity: 1;\n      color: #3b82f6;\n    }\n  }\n}\n\n.settings-divider {\n  height: 1px;\n  background: linear-gradient(90deg, transparent, v-bind('themeColors.borderColor'), transparent);\n  margin: 2px 0;\n  opacity: 0.5;\n}\n\n.settings-row {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 2px;\n}\n\n.settings-label {\n  font-size: 8px;\n  color: v-bind('themeColors.textColor');\n  opacity: 0.6;\n}\n\n.settings-toggle {\n  width: 30px;\n  height: 16px;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 8px;\n  cursor: pointer;\n  position: relative;\n  transition: all 0.2s ease;\n\n  &:hover {\n    background: rgba(255, 255, 255, 0.15);\n  }\n\n  &--active {\n    background: rgba(59, 130, 246, 0.4);\n\n    .settings-toggle-knob {\n      transform: translateX(14px);\n      background: #3b82f6;\n    }\n  }\n}\n\n.settings-toggle-knob {\n  width: 12px;\n  height: 12px;\n  background: v-bind('themeColors.textColor');\n  border-radius: 50%;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  transition: all 0.2s ease;\n}\n\n// ============================================\n// 设置面板淡入淡出动画\n// ============================================\n.settings-fade-enter-active,\n.settings-fade-leave-active {\n  transition: all 0.2s ease;\n}\n\n.settings-fade-enter-from,\n.settings-fade-leave-to {\n  opacity: 0;\n  transform: scale(0.95);\n}\n\n// ============================================\n// 面板滑入动画 - 左侧（从右向左滑入）\n// ============================================\n.panel-slide-left-enter-active,\n.panel-slide-left-leave-active {\n  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.panel-slide-left-enter-from,\n.panel-slide-left-leave-to {\n  opacity: 0;\n  transform: translateY(-50%) translateX(20px);\n}\n\n.panel-slide-left-enter-to,\n.panel-slide-left-leave-from {\n  opacity: 1;\n  transform: translateY(-50%) translateX(0);\n}\n\n// ============================================\n// 面板滑入动画 - 右侧（从左向右滑入）\n// ============================================\n.panel-slide-right-enter-active,\n.panel-slide-right-leave-active {\n  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.panel-slide-right-enter-from,\n.panel-slide-right-leave-to {\n  opacity: 0;\n  transform: translateY(-50%) translateX(-20px);\n}\n\n.panel-slide-right-enter-to,\n.panel-slide-right-leave-from {\n  opacity: 1;\n  transform: translateY(-50%) translateX(0);\n}\n\n// ============================================\n// 面板滑入动画 - 顶部（从上向下滑入，因为面板从设置栏下边缘向下展开）\n// ============================================\n.panel-slide-top-enter-active,\n.panel-slide-top-leave-active {\n  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.panel-slide-top-enter-from,\n.panel-slide-top-leave-to {\n  opacity: 0;\n  transform: translateX(-50%) translateY(-20px);\n}\n\n.panel-slide-top-enter-to,\n.panel-slide-top-leave-from {\n  opacity: 1;\n  transform: translateX(-50%) translateY(0);\n}\n\n// ============================================\n// 面板滑入动画 - 底部（从下向上滑入，因为面板从输入框上边缘向上展开）\n// ============================================\n.panel-slide-bottom-enter-active,\n.panel-slide-bottom-leave-active {\n  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.panel-slide-bottom-enter-from,\n.panel-slide-bottom-leave-to {\n  opacity: 0;\n  transform: translateX(-50%) translateY(20px);\n}\n\n.panel-slide-bottom-enter-to,\n.panel-slide-bottom-leave-from {\n  opacity: 1;\n  transform: translateX(-50%) translateY(0);\n}\n",
          ],
          sourceRoot: "",
        },
      ])
      const l = i
    },
  },
  n = {}
function a(e) {
  var o = n[e]
  if (void 0 !== o) return o.exports
  var r = (n[e] = { id: e, exports: {} })
  return (t[e](r, r.exports, a), r.exports)
}
;((a.n = (e) => {
  var t = e && e.__esModule ? () => e.default : () => e
  return (a.d(t, { a: t }), t)
}),
  (a.d = (e, t) => {
    for (var n in t) a.o(t, n) && !a.o(e, n) && Object.defineProperty(e, n, { enumerable: !0, get: t[n] })
  }),
  (a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
  (a.r = (e) => {
    ;("undefined" != typeof Symbol &&
      Symbol.toStringTag &&
      Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
      Object.defineProperty(e, "__esModule", { value: !0 }))
  }))
const o = Vue
function r(e, t = !1) {
  const n = window.parent.getComputedStyle(e)
  if (t) {
    if ("fixed" !== n.position && "absolute" !== n.position) return !1
  } else if ("fixed" !== n.position) return !1
  if ("none" === n.display || "hidden" === n.visibility) return !1
  let a = e.offsetWidth,
    o = e.offsetHeight
  if (0 === a || 0 === o) {
    const t = e.getBoundingClientRect()
    ;((a = t.width), (o = t.height))
  }
  if (a < 18 || a > 150 || o < 18 || o > 150) return !1
  const r = a / o
  return !(r < 0.5 || r > 2)
}
function i(e) {
  const t = e.querySelector('i[class*="fa-"]')
  if (t) {
    const e = t.className
      .split(" ")
      .filter(
        (e) =>
          e.startsWith("fa-") ||
          "fa" === e ||
          e.startsWith("fas") ||
          e.startsWith("far") ||
          e.startsWith("fab") ||
          "fa-solid" === e ||
          "fa-regular" === e ||
          "fa-brands" === e,
      )
    return e.length > 0 ? e.join(" ") : t.className
  }
  const n = e.querySelector('.ball-inner i, [class*="inner"] i, [class*="content"] i')
  if (n) {
    const e = n.className
      .split(" ")
      .filter(
        (e) =>
          e.startsWith("fa-") ||
          "fa" === e ||
          e.startsWith("fas") ||
          e.startsWith("far") ||
          e.startsWith("fab") ||
          "fa-solid" === e ||
          "fa-regular" === e ||
          "fa-brands" === e,
      )
    return e.length > 0 ? e.join(" ") : n.className
  }
  const a = e.querySelector("i")
  if (a && a.className) return a.className
  if (e.querySelector("svg")) return "fa-solid fa-circle"
  return e.querySelector("img") ? "fa-solid fa-image" : "fa-solid fa-puzzle-piece"
}
function l(e) {
  const t = e.getAttribute("title")
  if (t) return t
  const n = e.getAttribute("aria-label")
  if (n) return n
  const a = e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")
  return a || "悬浮球"
}
function s(e, t) {
  if ("BODY" === e.tagName || "HTML" === e.tagName) return !1
  const n = e.getBoundingClientRect(),
    a = n.width,
    o = n.height
  if (a < 16 || a > 160 || o < 16 || o > 160) return !1
  const r = a / o
  if (r < 0.35 || r > 2.8) return !1
  const i =
    `${e.id || ""} ${String(e.className || "")} ${e.getAttribute("title") || ""} ${e.getAttribute("aria-label") || ""}`.toLowerCase()
  if (/close-btn|header-close|modal-close|overlay-close|dismiss|collapse|fa-xmark|fa-times|fa-close|btn-close/.test(i))
    return !1
  if (
    (/(上一张|下一张|上一页|下一页|上一首|下一首|previous|next)/.test(i) ||
      /(?:^|\s|_|-)(?:popover|popup|dropdown|dropdown-menu|drop-down|menu|tooltip|popper|listbox|context-menu|contextmenu|select-options|abs-panel|floating-panel-options|submenu|sub-menu|option-list|picker|preview-nav|prev|next|previous|carousel|slide|gallery-nav|img-nav|image-nav)(?:\s|_|-|$)/.test(i)) &&
      a <= 160 &&
      o <= 160
  )
    return !1
  if (/关闭|收起|取消/.test(i) && a <= 40 && o <= 40) return !1
  for (let n = e.parentElement; n && n !== window.parent.document.body; n = n.parentElement) {
    let r = null
    try {
      r = window.parent.getComputedStyle(n)
    } catch {}
    if (!r) continue
    if ("fixed" !== r.position && "absolute" !== r.position) continue
    const i = n.getBoundingClientRect()
    if (i.width > a * 1.8 && i.height > o * 1.8 && (i.width > 120 || i.height > 80)) return !1
  }
  const l = "pointer" === t.cursor || "move" === t.cursor || "grab" === t.cursor,
    s = null !== e.querySelector("i, svg, img"),
    A =
      String(e.className || "").includes("ball") ||
      String(e.className || "").includes("floating") ||
      String(e.className || "").includes("button") ||
      String(e.className || "").includes("fab") ||
      String(e.className || "").includes("float"),
    c = e.classList.contains("ui-draggable"),
    txt = (e.textContent || "").trim().length
  if (txt > 4 && !s && !A && !c) return !1
  return !!(l || s || A || c)
}
function collectIframeFrames() {
  const e = []
  try {
    window.parent.document.querySelectorAll("iframe").forEach((t) => {
      try {
        t.contentDocument && e.push(t)
      } catch {}
    })
  } catch {}
  return e
}
function collectIframeDocs() {
  return collectIframeFrames().map((e) => e.contentDocument)
}
function elementsFromPointAcrossFrames(e, t) {
  const n = []
  try {
    n.push(...window.parent.document.elementsFromPoint(e, t))
  } catch {}
  for (const a of collectIframeFrames()) {
    try {
      const o = a.getBoundingClientRect(),
        r = e - o.left,
        i = t - o.top
      if (r < 0 || i < 0 || r > o.width || i > o.height) continue
      n.push(...a.contentDocument.elementsFromPoint(r, i))
    } catch {}
  }
  return n
}
function composeTransform(e, t) {
  const s = `scale(${t})`
  if (!e || "none" === e) return s
  if (!/(rotate|skew|scale|matrix|matrix3d)/.test(e)) return s
  const n = e.match(/^matrix\(([^)]+)\)$/)
  if (n) {
    const a = n[1].split(",").map((e) => parseFloat(e))
    if (a.length >= 6 && 1 === a[0] && 0 === a[1] && 0 === a[2] && 1 === a[3]) return s
  }
  return `${e} ${s}`
}
let A = null,
  c = !1,
  _fbCapturedIframeDocs = [],
  p = null,
  d = null,
  u = null,
  g = null,
  C = null
function f(e, t, n, a, o) {
  const r = elementsFromPointAcrossFrames(e, t).filter((e) => "capture-mode-overlay" !== e.id)
  if (r.length > 0) {
    const e = (function (hitStack, ownScriptId) {
      const candidates = [],
        visited = new Set()
      for (const startEl of hitStack) {
        let node = startEl
        for (; node; ) {
          if (visited.has(node)) {
            node = node.parentElement
            continue
          }
          visited.add(node)
          if (
            (node.getAttribute("script_id") || node.closest("[script_id]")?.getAttribute("script_id")) === ownScriptId ||
            "capture-mode-overlay" === node.id
          ) {
            node = node.parentElement
            continue
          }
          const style = (node.ownerDocument?.defaultView || window.parent).getComputedStyle(node),
            pos = style.position
          if (s(node, style)) {
            const rect = node.getBoundingClientRect(),
              area = rect.width * rect.height,
              cls = String(node.className || "").toLowerCase(),
              txtLen = (node.textContent || "").trim().length,
              cur = style.cursor,
              br = style.borderRadius
            let sc = 0
            ;(("fixed" === pos || "absolute" === pos ? (sc += 20) : "relative" === pos && (sc += 10)),
              (cls.includes("ball") || cls.includes("circle")) && (sc += 45),
              cls.includes("floating") && (sc += 30),
              cls.includes("fab") && (sc += 30),
              cls.includes("float") && (sc += 15),
              node.classList.contains("ui-draggable") && (sc += 35),
              ("pointer" === cur || "move" === cur || "grab" === cur) && (sc += 15),
              (null !== node.querySelector("i, svg, img") || (node.childElementCount <= 2 && txtLen <= 2)) && (sc += 15),
              (br.includes("50%") || /50%/.test(br)) && (sc += 12),
              area >= 400 && area <= 6400 && (sc += 8),
              txtLen > 6 && (sc -= 30))
            // 与多个"同名兄弟"并列的元素，通常是菜单/列表里的功能项而不是独立的悬浮球
            // （悬浮球一般是独立存在的），这里降权而非直接淘汰，避免误伤真正的多球场景
            const parentEl = node.parentElement
            if (parentEl && cls) {
              let sameClassSiblingCount = 0
              for (const sib of parentEl.children)
                if (sib !== node && String(sib.className || "").toLowerCase() === cls) sameClassSiblingCount++
              if (sameClassSiblingCount >= 2) sc -= 25
            }
            candidates.push({ element: node, area, score: sc })
          }
          node = node.parentElement
        }
      }
      if (0 === candidates.length) return null
      // 点击位置命中的元素往往是"外层容器(悬浮球) > 内层图标/文字"这种包含关系的一条链。
      // 之前的做法是对"包含了其他候选"的容器做重罚，导致内层小图标反而抢走外层球本体。
      // 这里改为：若某候选被其它候选包含，则不作为最终结果的备选——只在"未被任何候选包含"
      // 的最外层元素里挑分数最高的，这样点击图标时拿到的是图标所在的整个悬浮球容器。
      const outermost = candidates.filter(
        (cand) => !candidates.some((other) => other !== cand && other.element.contains(cand.element)),
      )
      const pool = outermost.length > 0 ? outermost : candidates
      pool.sort((a, b) => (b.score !== a.score ? b.score - a.score : b.area - a.area))
      return pool[0].element
    })(r, n)
    e && a(e) ? (removeReleasedFp(Y(e)), toastr.success(`已捕获: ${l(e)}`)) : e || toastr.warning("请点击一个悬浮元素")
  }
  o()
}
function b(e, t, n) {
  if (c) return
  ;((c = !0),
    (function (e) {
      if (A) return
      const t = window.parent.document
      ;((A = t.createElement("div")),
        (A.id = "capture-mode-overlay"),
        A.setAttribute("script_id", e),
        (A.style.cssText =
          "\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background: rgba(0, 0, 0, 0.3);\n    z-index: 2147483646;\n    cursor: crosshair;\n    pointer-events: none;\n  "))
      const n = t.createElement("div")
      ;((n.style.cssText =
        "\n    position: fixed;\n    top: 20px;\n    left: 50%;\n    transform: translateX(-50%);\n    background: rgba(0, 0, 0, 0.8);\n    color: white;\n    padding: 12px 24px;\n    border-radius: 8px;\n    font-size: 14px;\n    z-index: 2147483647;\n    pointer-events: none;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n  "),
        (n.textContent = "点击要捕获的悬浮球，按 ESC 或右键取消"),
        A.appendChild(n),
        t.body.appendChild(A))
    })(e))
  const a = window.parent.document
  ;((p = (a) => {
    if (!c) return
    ;(a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation())
    f(a.clientX, a.clientY, e, t, n)
  }),
    (d = (e) => {
      c && (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation())
    }),
    (u = (a) => {
      if (!c) return
      ;(a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation())
      const o = a.changedTouches[0]
      if (!o) return
      f(o.clientX, o.clientY, e, t, n)
    }),
    (g = (e) => {
      c && "Escape" === e.key && (e.preventDefault(), e.stopPropagation(), n())
    }),
    (C = (e) => {
      c && (e.preventDefault(), e.stopPropagation(), n())
    }),
    (_fbCapturedIframeDocs = [a, ...collectIframeDocs()]),
    _fbCapturedIframeDocs.forEach((e) => {
      e.addEventListener("click", p, !0)
      e.addEventListener("touchstart", d, { capture: !0, passive: !1 })
      e.addEventListener("touchend", u, { capture: !0, passive: !1 })
      e.addEventListener("keydown", g, !0)
      e.addEventListener("contextmenu", C, !0)
    }))
}
function v() {
  if (!c) return
  c = !1
  const e = window.parent.document,
    _p = p,
    _d = d,
    _u = u,
    _g = g,
    _C = C
  ;(e.removeEventListener("click", _p, !0),
    e.removeEventListener("touchstart", _d, !0),
    e.removeEventListener("touchend", _u, !0),
    e.removeEventListener("keydown", _g, !0),
    e.removeEventListener("contextmenu", _C, !0),
    (p = null),
    (d = null),
    (u = null),
    (g = null),
    (C = null),
    _fbCapturedIframeDocs.forEach((e) => {
      e.removeEventListener("click", _p, !0)
      e.removeEventListener("touchstart", _d, !0)
      e.removeEventListener("touchend", _u, !0)
      e.removeEventListener("keydown", _g, !0)
      e.removeEventListener("contextmenu", _C, !0)
    }),
    (_fbCapturedIframeDocs = []),
    A && (A.remove(), (A = null)))
}
const h = new Set([
    "position",
    "top",
    "left",
    "right",
    "bottom",
    "zIndex",
    "z-index",
    "transform",
    "margin",
    "marginTop",
    "marginLeft",
    "marginRight",
    "marginBottom",
    "margin-top",
    "margin-left",
    "margin-right",
    "margin-bottom",
  ]),
  m = new Map(),
  x = new WeakMap(),
  y = new WeakMap(),
  w = new WeakMap(),
  B = new WeakMap(),
  E = new WeakMap(),
  Pv = new Map()
let S = null
let layer = null
let fbPageIndex = 0
let fbPageCount = 1
const FB_PER_PAGE = { horizontal: 3, vertical: 5 }
function fbPerPage() {
  return fbIsHoriz() ? FB_PER_PAGE.horizontal : FB_PER_PAGE.vertical
}
function fbIsHoriz() {
  if (!S) return !1
  // horizontal flag 在根容器 .edge-panel-root 上, 向上查找
  let n = S
  while (n && !(n.classList && n.classList.contains("edge-panel-root"))) n = n.parentNode
  return !!(n && n.classList && n.classList.contains("edge-panel-root--horizontal"))
}
function fbCreatePage() {
  const p = window.parent.document.createElement("div")
  p.className = "fb-page"
  p.style.display = "flex"
  p.style.flexDirection = fbIsHoriz() ? "row" : "column"
  p.style.alignItems = "center"
  p.style.justifyContent = "center"
  p.style.flexShrink = "0"
  p.setAttribute("data-fb-page", String(layer ? layer.children.length : 0))
  if (layer) layer.appendChild(p)
  return p
}
function fbCurrentPage() {
  if (!layer) return null
  return layer.children.length ? layer.children[0] : null
}
function fbAppendBall(el, before) {
  if (!layer) return
  if (before && before.parentNode && layer.contains(before)) {
    before.parentNode.insertBefore(el, before)
    fbRebuildLayer()
    return
  }
  let page = layer.children.length ? layer.children[layer.children.length - 1] : null
  if (!page || page.children.length >= fbPerPage()) page = fbCreatePage()
  page.appendChild(el)
  fbRebuildLayer()
}
function fbRebuildLayer() {
  if (!layer) return
  fbPageCount = Math.max(1, layer.children.length)
  if (fbPageIndex >= fbPageCount) fbPageIndex = fbPageCount - 1
  if (fbPageIndex < 0) fbPageIndex = 0
  fbApplyPage()
  fbUpdateArrows()
}
function fbReorient() {
  if (!layer) return
  const horiz = fbIsHoriz()
  layer.style.flexDirection = horiz ? "row" : "column"
  for (let k = 0; k < layer.children.length; k++) {
    layer.children[k].style.flexDirection = horiz ? "row" : "column"
  }
}
function fbApplyPage() {
  if (!layer) return
  const horiz = fbIsHoriz()
  for (let k = 0; k < layer.children.length; k++) {
    const p = layer.children[k]
    p.style.flexDirection = horiz ? "row" : "column"
    p.style.display = k === fbPageIndex ? "flex" : "none"
  }
}
function fbGoPage(d) {
  fbPageIndex = Math.max(0, Math.min(fbPageCount - 1, fbPageIndex + d))
  fbApplyPage()
  fbUpdateArrows()
}
function fbUpdateArrows() {
  const doc = window.parent && window.parent.document ? window.parent.document : document
  const prev = doc.querySelector("[data-fb-page-prev]")
  const next = doc.querySelector("[data-fb-page-next]")
  if (prev) prev.classList.toggle("fb-arrow--disabled", fbPageIndex <= 0)
  if (next) next.classList.toggle("fb-arrow--disabled", fbPageIndex >= fbPageCount - 1)
}
function fbCompactPages() {
  if (!layer) return
  // 按视觉顺序收集所有页里的球
  const balls = []
  for (let i = 0; i < layer.children.length; i++) {
    const p = layer.children[i]
    for (let j = 0; j < p.children.length; j++) balls.push(p.children[j])
  }
  // 清空所有页
  while (layer.firstChild) layer.removeChild(layer.firstChild)
  // 重新顺位打包：每页填满 fbPerPage() 个，后面球自动补位
  const per = fbPerPage(),
    doc = window.parent && window.parent.document ? window.parent.document : document,
    horiz = fbIsHoriz()
  let page = null
  balls.forEach((b) => {
    if (!page || page.children.length >= per) {
      page = doc.createElement("div")
      page.className = "fb-page"
      page.style.display = "flex"
      page.style.flexDirection = horiz ? "row" : "column"
      page.style.alignItems = "center"
      page.style.justifyContent = "center"
      page.style.flexShrink = "0"
      layer.appendChild(page)
    }
    page.appendChild(b)
  })
  fbRebuildLayer()
  fbApplyPage()
  fbUpdateArrows()
}
function fbCompactAfterRemove(el) {
  if (!el || !el.parentNode) return
  el.parentNode.removeChild(el)
  fbCompactPages()
}
function k() {
  return S
}
function P(e, t) {
  try {
    const n = window.parent.$
    if (!n) return void console.warn("[集成控件] 父窗口没有 jQuery")
    const a = n(e)
    if (a.hasClass("ui-draggable")) {
      t && m.set(t, !0)
      try {
        a.draggable("disable")
      } catch {}
    }
    a.find(".ui-draggable").each(function () {
      try {
        n(this).draggable("disable")
      } catch {}
    })
  } catch {}
}
function F(e) {
  const t = E.get(e)
  if (t?.isProtected) return
  const n = new Map(),
    a = e.style
  h.forEach((e) => {
    const t = a.getPropertyValue(e) || a[e]
    t && n.set(e, t)
  })
  const o = a.setProperty.bind(a),
    r = a.removeProperty.bind(a)
  let i = !1
  ;((a.setProperty = function (e, t, n) {
    const a = e.replace(/([A-Z])/g, "-$1").toLowerCase()
    if ((!h.has(e) && !h.has(a)) || i) return o(e, t, n || "")
  }),
    (a.removeProperty = function (e) {
      const t = e.replace(/([A-Z])/g, "-$1").toLowerCase()
      return (!h.has(e) && !h.has(t)) || i ? r(e) : ""
    }),
    h.forEach((e) => {
      const t = a[e]
      try {
        Object.defineProperty(a, e, {
          get: () => n.get(e) || t || "",
          set(t) {
            i && (n.set(e, t), o(e, t, "important"))
          },
          configurable: !0,
          enumerable: !0,
        })
      } catch {}
    }))
  const l = {
    originalStyleDescriptor: Object.getOwnPropertyDescriptor(HTMLElement.prototype, "style"),
    isProtected: !0,
    protectedProperties: h,
    cachedValues: n,
    allowModification: () => {
      i = !0
    },
    disallowModification: () => {
      i = !1
    },
  }
  ;((l.originalSetProperty = o), E.set(e, l))
}
function N(e, t, n, a) {
  const o = E.get(e)
  if (o?.isProtected) {
    const r = o
    ;(r.allowModification && r.allowModification(),
      r.originalSetProperty ? r.originalSetProperty(t, n, a || "") : e.style.setProperty(t, n, a || ""),
      o.cachedValues.set(t, n),
      r.disallowModification && r.disallowModification())
  } else e.style.setProperty(t, n, a || "")
}
function I(e, t) {
  for (const [n, a] of Object.entries(t)) Array.isArray(a) ? N(e, n, a[0], a[1]) : N(e, n, a)
}
function Xv(e) {
  if (Pv.has(e)) return
  const t = []
  Pv.set(e, t)
  const restoreEntry = (entry) => {
    const idx = t.indexOf(entry)
    if (idx > -1) t.splice(idx, 1)
    entry._popupObserver && (entry._popupObserver.disconnect(), (entry._popupObserver = null))
    const r = entry.popup
    entry._stop &&
      (r.removeEventListener("click", entry._stop), r.removeEventListener("touchend", entry._stop))
    r.style.cssText = entry.style
    entry.parent &&
      entry.parent.isConnected &&
      (entry.nextSibling && entry.nextSibling.isConnected && entry.nextSibling.parentElement === entry.parent
        ? entry.parent.insertBefore(r, entry.nextSibling)
        : entry.parent.appendChild(r))
  }
  const n = new MutationObserver((a) => {
    for (const o of a) {
      if (o.type === "attributes" && (o.attributeName === "style" || o.attributeName === "class")) {
        const r = o.target
        if (r === e) continue
        const i = window.parent.getComputedStyle(r)
        const l = i.display !== "none" && i.visibility !== "hidden"
        const s = i.position === "absolute" || i.position === "fixed"
        if (l && s && !t.some((p) => p.popup === r)) {
          const c = r.parentElement,
            p = r.nextSibling,
            d = r.style.cssText,
            u = (ev) => { ev.stopPropagation() }
          r.addEventListener("click", u)
          r.addEventListener("touchend", u)
          const entry = { popup: r, parent: c, nextSibling: p, style: d, _stop: u, _popupObserver: null }
          t.push(entry)
          window.parent.document.body.appendChild(r)
          const C = r.getBoundingClientRect(),
            g = e.getBoundingClientRect()
          let f = g.top - C.height - 6,
            b = g.left
          const v = window.parent.innerWidth,
            h = window.parent.innerHeight
          if (b + C.width > v - 8) b = v - C.width - 8
          if (b < 8) b = 8
          if (f < 8) f = Math.min(g.bottom + 6, h - C.height - 8)
          ;(r.style.position = "fixed"),
            (r.style.top = f + "px"),
            (r.style.left = b + "px"),
            (r.style.zIndex = "10001"),
            (r.style.margin = "0")
          // r 移出 e 的子树后，上面这个观察 e 的 MutationObserver 再也收不到 r 自身的属性变化通知，
          // 单独给它挂一个自身观察者，保证它自己变 display:none/visibility:hidden 时也能正确归位，
          // 不然会一直卡在 body 下（隐藏但脱离原位置）直到球被释放。
          const po = new MutationObserver(() => {
            const ii = window.parent.getComputedStyle(r)
            const ll = ii.display !== "none" && ii.visibility !== "hidden"
            if (!ll) restoreEntry(entry)
          })
          po.observe(r, { attributes: !0, attributeFilter: ["style", "class"] })
          entry._popupObserver = po
        } else if (!l && s) {
          const entry = t.find((p) => p.popup === r)
          entry && restoreEntry(entry)
        }
      }
    }
  })
  n.observe(e, { attributes: !0, subtree: !0, attributeFilter: ["style", "class"] }),
    (t._observer = n)
}
function Yv(e) {
  const t = Pv.get(e)
  if (!t) return
  t._observer && (t._observer.disconnect(), (t._observer = null))
  for (const n of t)
    n.popup &&
      n.style !== void 0 &&
      (n._popupObserver && (n._popupObserver.disconnect(), (n._popupObserver = null)),
      n._stop &&
        (n.popup.removeEventListener("click", n._stop),
        n.popup.removeEventListener("touchend", n._stop)),
      (n.popup.style.cssText = n.style),
      n.parent &&
        n.parent.isConnected &&
        (n.nextSibling && n.nextSibling.isConnected && n.nextSibling.parentElement === n.parent
          ? n.parent.insertBefore(n.popup, n.nextSibling)
          : n.parent.appendChild(n.popup)))
  Pv.delete(e)
}
function M(e, t) {
  q(e)
  Xv(e)
  const n = (e) => {
      e.stopPropagation()
    },
    a = (e) => {
      e.stopPropagation()
    },
    o = (e) => {
      e.preventDefault()
    },
    r =
      "qrv21-trigger-v21" === e.id
        ? "inline-native"
        : "ai-floating-panel-launcher" === e.id ||
            "auto_illustrator_conso_floating_panel_root" === e.id ||
            e.classList.contains("ai-floating-panel-root")
          ? "root-open"
          : "default"
  ;(e.addEventListener("mousemove", n, !0),
    e.addEventListener("touchmove", a, !0),
    e.addEventListener("dragstart", o, !0),
    w.set(e, n),
    B.set(e, a),
    y.set(e, o))
  if (t && "root-open" === r) {
    const n = (a) => {
      if (a.defaultPrevented || 0 !== a.button) return
      ;(a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation(), Ne.clickCapturedBall(t, r))
    }
    ;(e.addEventListener("click", n, !0), x.set(e, n))
  }
}
function q(e) {
  let t = !1
  Yv(e)
  const n = w.get(e)
  n && (e.removeEventListener("mousemove", n, !0), w.delete(e), (t = !0))
  const a = B.get(e)
  a && (e.removeEventListener("touchmove", a, !0), B.delete(e), (t = !0))
  const o = y.get(e)
  o && (e.removeEventListener("dragstart", o, !0), y.delete(e), (t = !0))
  const r = x.get(e)
  r && (e.removeEventListener("click", r, !0), x.delete(e), (t = !0))
}
function O(e) {
  if (!S) return (console.warn("[集成控件] 悬浮球容器未设置，无法移动悬浮球"), void L(e.element))
  const t = e.element
  let n = t.offsetWidth,
    a = t.offsetHeight
  if (0 === n || 0 === a) {
    const e = t.getBoundingClientRect()
    ;((n = e.width), (a = e.height))
  }
  ;(0 === n && (n = 50), 0 === a && (a = 50))
  const o = Math.min(34 / n, 34 / a),
    r = (n * (1 - o)) / 2,
    tr = composeTransform(window.parent.getComputedStyle(t).transform, o)
  ;(P(t, e.id),
    t.setAttribute("data-edge-ball-id", e.id),
    fbAppendBall(t),
    F(t),
    I(t, {
      position: ["relative", "important"],
      top: ["auto", "important"],
      left: ["auto", "important"],
      right: ["auto", "important"],
      bottom: ["auto", "important"],
      "z-index": ["auto", "important"],
      opacity: ["1", "important"],
      visibility: ["visible", "important"],
      "pointer-events": ["auto", "important"],
      transform: [tr, "important"],
      "transform-origin": ["center center", "important"],
      margin: [`-${Math.max(0, r - 2)}px`, "important"],
      "flex-shrink": ["0", "important"],
    }),
    M(t, e.id))
}
function V(e) {
  const t = e.element
  ;(!(function (e) {
    const t = E.get(e)
    if (t && t.isProtected)
      try {
        const n = t,
          a = e.style
        n.allowModification && n.allowModification()
        const o = CSSStyleDeclaration.prototype.setProperty,
          r = CSSStyleDeclaration.prototype.removeProperty
        ;((a.setProperty = o),
          (a.removeProperty = r),
          h.forEach((e) => {
            try {
              delete a[e]
            } catch {}
          }),
          (t.isProtected = !1),
          E.delete(e))
      } catch {}
  })(t),
    q(t),
    t.removeAttribute("data-edge-ball-id"),
    fbCompactAfterRemove(t),
    (t.style.cssText = e.originalStyle),
    (t.style.position = e.originalPosition?.positionValue || "fixed"),
    !e.originalStyle &&
      (e.originalPosition.top && "auto" !== e.originalPosition.top && (t.style.top = e.originalPosition.top),
      e.originalPosition.left && "auto" !== e.originalPosition.left && (t.style.left = e.originalPosition.left),
      e.originalPosition.right && "auto" !== e.originalPosition.right && (t.style.right = e.originalPosition.right),
      e.originalPosition.bottom && "auto" !== e.originalPosition.bottom && (t.style.bottom = e.originalPosition.bottom)),
    (t.style.opacity = e.originalPosition?.opacityValue || "1"),
    (t.style.visibility = e.originalPosition?.visibilityValue || "visible"),
    (t.style.pointerEvents = e.originalPosition?.pointerEventsValue || "auto"))
  const n = e.originalParent && e.originalParent.isConnected,
    a = e.originalNextSibling && e.originalNextSibling.isConnected
  ;(n
    ? a && e.originalNextSibling.parentNode === e.originalParent
      ? e.originalParent.insertBefore(t, e.originalNextSibling)
      : e.originalParent.appendChild(t)
    : window.parent.document.body.appendChild(t),
    (function (e, t) {
      try {
        const n = window.parent.$
        if (!n) return void console.warn("[集成控件] 父窗口没有 jQuery")
        const a = n(e),
          o = !!t && m.get(t),
          r = a.hasClass("ui-draggable")
        if (o || r) {
          try {
            a.draggable("enable")
          } catch {}
          t && m.delete(t)
        }
        a.find(".ui-draggable").each(function () {
          try {
            n(this).draggable("enable")
          } catch {}
        })
      } catch {}
    })(t, e.id))
}
function G(e, t) {
  if (!S) return (console.warn("[集成控件] 悬浮球容器未设置，无法移动悬浮球"), void L(e.element))
  const n = e.element
  let a = n.offsetWidth,
    o = n.offsetHeight
  if (0 === a || 0 === o) {
    const e = n.getBoundingClientRect()
    ;((a = e.width), (o = e.height))
  }
  ;(0 === a && (a = 50), 0 === o && (o = 50))
  const r = Math.min(34 / a, 34 / o),
    i = (a * (1 - r)) / 2,
    tr = composeTransform(window.parent.getComputedStyle(n).transform, r)
  ;(fbAppendBall(n, t),
    n.setAttribute("data-edge-ball-id", e.id),
    F(n),
    I(n, {
      position: ["relative", "important"],
      top: ["auto", "important"],
      left: ["auto", "important"],
      right: ["auto", "important"],
      bottom: ["auto", "important"],
      "z-index": ["auto", "important"],
      opacity: ["1", "important"],
      visibility: ["visible", "important"],
      "pointer-events": ["auto", "important"],
      transform: [tr, "important"],
      "transform-origin": ["center center", "important"],
      margin: [`-${Math.max(0, i - 2)}px`, "important"],
      "flex-shrink": ["0", "important"],
    }),
    P(n, e.id),
    M(n, e.id))
}
function L(e) {
  ;(e.style.setProperty("opacity", "0", "important"),
    e.style.setProperty("pointer-events", "none", "important"),
    e.style.setProperty("transform", "translateX(-9999px)", "important"))
}
function Y(e) {
  return {
    scriptId: e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id") || null,
    elementId: e.id || null,
    classSelector: U(e),
    title: e.getAttribute("title") || null,
  }
}
function W(e, t) {
  if (e.scriptId || t.scriptId) {
    return !(!e.scriptId || !t.scriptId || e.scriptId !== t.scriptId)
  }
  if (e.elementId || t.elementId) {
    return !(!e.elementId || !t.elementId || e.elementId !== t.elementId)
  }
  if (!((e.classSelector && t.classSelector) || (e.title && t.title))) return !1
  if (e.classSelector && t.classSelector && e.title && t.title) {
    return e.classSelector === t.classSelector && e.title === t.title
  }
  if (e.classSelector && t.classSelector) {
    return e.classSelector === t.classSelector
  }
  if (e.title && t.title) {
    return e.title === t.title
  }
  return !1
}
function j(e) {
  return !!(e.scriptId || e.elementId || e.classSelector || e.title)
}
function U(e) {
  const t = e.className
  if (t && "string" == typeof t) {
    const e = t
      .split(" ")
      .filter(
        (e) =>
          !!e &&
          !e.startsWith("ui-") &&
          !e.startsWith("data-v-") &&
          !/^_[a-zA-Z0-9]+$/.test(e) &&
          "active" !== e &&
          "hover" !== e &&
          "focus" !== e &&
          "disabled" !== e &&
          "open" !== e &&
          "closed" !== e &&
          "visible" !== e &&
          "hidden" !== e,
      )
      .sort()
    if (e.length > 0) return "." + e.join(".")
  }
  return null
}
const X = z,
  T = X.z.object({
    scriptId: X.z.string().nullable(),
    elementId: X.z.string().nullable(),
    classSelector: X.z.string().nullable(),
    title: X.z.string().nullable(),
  }),
  D = X.z
    .object({
      savedBalls: X.z
        .array(
          X.z.object({
            fingerprint: T,
            icon: X.z.string(),
            name: X.z.string(),
            originalPosition: X.z
              .object({ top: X.z.string(), left: X.z.string(), right: X.z.string(), bottom: X.z.string() })
              .optional(),
            originalStyle: X.z.string().optional(),
            order: X.z.number().optional(),
          }),
        )
        .default([]),
      releasedFingerprints: X.z.array(T).default([]),
    })
    .prefault({})
function R() {
  try {
    return getScriptId()
  } catch {
    return "集成控件"
  }
}
const J = (0, o.ref)([])
const Rb = (0, o.ref)([])
function isReleasedFp(e) {
  for (const t of Rb.value) if (W(e, t)) return !0
  return !1
}
function saveReleasedFps() {
  try {
    const e = {
      ...(getVariables({ type: "script", script_id: R() }) ?? {}),
      releasedFingerprints: JSON.parse(JSON.stringify(Rb.value)),
    }
    replaceVariables(e, { type: "script", script_id: R() })
  } catch {}
}
function addReleasedFp(e) {
  if (!e || !j(e)) return
  if (isReleasedFp(e)) return
  Rb.value = [
    ...Rb.value,
    {
      scriptId: e.scriptId ?? null,
      elementId: e.elementId ?? null,
      classSelector: e.classSelector ?? null,
      title: e.title ?? null,
    },
  ]
  saveReleasedFps()
}
function removeReleasedFp(e) {
  if (!e) return
  const n = Rb.value.length
  Rb.value = Rb.value.filter((t) => !W(e, t))
  if (Rb.value.length !== n) saveReleasedFps()
}
let Q = !1,
  H = !1,
  K = 0
function Z(e) {
  ;(K--, K <= 0 && ((K = 0), H && ((H = !1), ee(e))))
}
function ee(e) {
  try {
    const t = [],
      a = new Map()
    if (layer) {
      let idx = 0
      for (const page of Array.from(layer.children))
        for (const ball of Array.from(page.children)) a.set(ball, idx++)
    }
    for (const n of Object.values(e))
      if (j(n.fingerprint)) {
        const e = {
            scriptId: n.fingerprint.scriptId,
            elementId: n.fingerprint.elementId,
            classSelector: n.fingerprint.classSelector,
            title: n.fingerprint.title,
          },
          o = a.get(n.element) ?? t.length
        t.push({
          fingerprint: e,
          icon: n.icon,
          name: n.name,
          originalPosition: n.originalPosition
            ? {
                top: n.originalPosition.top,
                left: n.originalPosition.left,
                right: n.originalPosition.right,
                bottom: n.originalPosition.bottom,
              }
            : void 0,
          originalStyle: n.originalStyle,
          order: o,
        })
      }
    t.sort((e, t) => (e.order ?? 0) - (t.order ?? 0))
    const o = { ...(getVariables({ type: "script", script_id: R() }) ?? {}), savedBalls: t },
      r = JSON.parse(JSON.stringify(o))
    ;(replaceVariables(r, { type: "script", script_id: R() }), (J.value = r.savedBalls))
  } catch {}
}
function te(e) {
  for (const t of J.value) if (W(e, t.fingerprint)) return t
  return null
}
function ae(e) {
  J.value = J.value.filter((t) => !W(e, t.fingerprint))
}
const oe = (0, o.ref)(!1)
const re = X.z
    .object({
      panelPosition: X.z.enum(["left", "right", "top", "bottom"]).nullable().default(null),
      captureMode: X.z.enum(["manual", "auto"]).nullable().default("manual"),
    })
    .prefault({}),
  ie = (0, o.ref)({ panelPosition: null, captureMode: "manual" }),
  le = (0, o.computed)(() => ie.value.panelPosition ?? "top"),
  se = (0, o.computed)(() => "top" === le.value || "bottom" === le.value),
  Ae = (0, o.computed)(() => "left" === le.value || "right" === le.value)
function ce() {
  try {
    const t = {
      ...(getVariables({ type: "script", script_id: getScriptId() }) ?? {}),
      integration_settings: e(ie.value),
    }
    ;(console.info("[集成控件] 保存设置:", ie.value), replaceVariables(t, { type: "script", script_id: getScriptId() }))
  } catch (e) {
    console.warn("[集成控件] 保存设置失败:", e)
  }
}
const pe = {
    settings: ie,
    isMobile: oe,
    effectivePosition: le,
    isHorizontalLayout: se,
    isVerticalLayout: Ae,
    initSettings: function () {
      ;((oe.value = (function () {
        const e = window.parent,
          t = e.innerWidth,
          n = "ontouchstart" in e || navigator.maxTouchPoints > 0
        return t < 768 || (n && t < 1024)
      })()),
        console.info("[集成控件] 移动端检测:", oe.value))
      try {
        const e = getVariables({ type: "script", script_id: getScriptId() })
        console.info("[集成控件] 读取的脚本变量:", e)
        const t = e?.integration_settings
        if (t && "object" == typeof t) {
          const e = re.parse(t)
          ;((ie.value = e), console.info("[集成控件] 解析后的设置:", e, "有效位置:", le.value))
        } else
          ((ie.value = { panelPosition: null, captureMode: "manual" }), console.info("[集成控件] 没有保存的设置，使用默认位置:", le.value))
      } catch (e) {
        ;(console.warn("[集成控件] 读取设置失败，使用默认值:", e), (ie.value = { panelPosition: null, captureMode: "manual" }))
      }
    },
    saveSettings: ce,
    setPanelPosition: function (e) {
      ;(console.info("[集成控件] 设置面板位置:", e), (ie.value.panelPosition = e), ce())
      try {
        window.setTimeout(() => {
          try {
            fbReorient()
          } catch (err) {}
        }, 40)
      } catch (err) {}
    },
    setCaptureMode: function (e) {
      const t = "auto" === e ? "auto" : "manual"
      ;(ie.value.captureMode = t, ce())
      try {
        this.syncAutoScan()
      } catch {}
    },
    getCaptureMode: function () {
      return "auto" === ie.value.captureMode ? "auto" : "manual"
    },
    syncAutoScan: function () {
      if ("auto" === this.getCaptureMode() && Ne.autoCaptureEnabled.value) {
        if (!lt) ft()
      } else if (lt) bt()
    },
    clearReleasedFps: function () {
      ;(Rb.value = [], saveReleasedFps())
    },
    getReleasedFpCount: function () {
      return Rb.value.length
    },
    cleanup: function () {},
  },
  de = (0, o.ref)({}),
  ue = (0, o.ref)({}),
  ge = (0, o.ref)(!0),
  Ce = (0, o.ref)(!1),
  fe = (0, o.ref)(!1),
  be = (0, o.ref)("auto"),
  ve = (0, o.ref)("auto"),
  he = [],
  me = (0, o.computed)(() => Object.values(de.value).sort((e, t) => (e.order ?? 100) - (t.order ?? 100))),
  xe = (0, o.computed)(() => Object.values(ue.value)),
  ye = (0, o.computed)(() => Object.keys(de.value).length > 0 || Object.keys(ue.value).length > 0)
function Se(e) {
  for (const t of Object.values(ue.value)) if (W(e, t.fingerprint)) return !0
  return !1
}
function ke(e) {
  for (const t of Object.values(ue.value)) if (W(e, t.fingerprint)) return t
  return null
}
function Pe() {
  const e = Object.values(ue.value)
  ;((ue.value = {}),
    ee(ue.value),
    e.forEach((e) => {
      ;(e.element.isConnected && V(e), he.forEach((t) => t(e.id, e.fingerprint, e.element)))
    }))
}
function Fe(e, t) {
  const n = ue.value[e]
  if (n) {
    const e = n.element,
      o = e && layer && layer.contains(e) ? e.nextSibling : null,
      r = window.parent.getComputedStyle(t)
    ;((n.originalParent = t.parentElement),
      (n.originalNextSibling = t.nextSibling),
      (n.originalStyle = t.style.cssText),
      (n.originalPosition = {
        top: r.top,
        left: r.left,
        right: r.right,
        bottom: r.bottom,
        positionValue: r.position,
        opacityValue: r.opacity,
        visibilityValue: r.visibility,
        pointerEventsValue: r.pointerEvents,
      }),
      (n.originalDisplay = r.display || "flex"),
      (n.fingerprint = Y(t)),
      (n.element = t),
      G(n, o),
      e && e.isConnected && e !== t && e.remove())
  }
}
const Ne = {
  plugins: de,
  capturedBalls: ue,
  autoCaptureEnabled: ge,
  isCaptureModeActive: Ce,
  isPanelOpen: fe,
  panelLeftPosition: ve,
  panelPositionStyle: be,
  pendingRestoreBalls: J,
  effectivePosition: pe.effectivePosition,
  isHorizontalLayout: pe.isHorizontalLayout,
  isVerticalLayout: pe.isVerticalLayout,
  isMobile: pe.isMobile,
  settings: pe.settings,
  sortedPlugins: me,
  capturedBallsList: xe,
  hasPlugins: ye,
  registerPlugin: function (e) {
    de.value[e.id] = e
  },
  unregisterPlugin: function (e) {
    delete de.value[e]
  },
  addCapturedBall: function (e) {
    const t = ke(e.fingerprint)
    if (t) Fe(t.id, e.element)
    else if (ue.value[e.id]) Fe(e.id, e.element)
    else {
      if (((ue.value = { ...ue.value, [e.id]: e }), void 0 !== e.order)) {
        const t = k()
        if (t) {
          const n = Object.values(ue.value)
            .filter((t) => t.id !== e.id && void 0 !== t.order)
            .sort((e, t) => (e.order ?? 0) - (t.order ?? 0))
          let a = null
          for (const o of n)
            if ((o.order ?? 0) > e.order && t && t.contains(o.element)) {
              a = o.element
              break
            }
          G(e, a)
        } else O(e)
      } else O(e)
      ;(ae(e.fingerprint), H || ee(ue.value))
    }
  },
  removeCapturedBall: function (e) {
    const t = ue.value[e]
    if (t) {
      const n = t.element,
        a = t.fingerprint,
        { [e]: _, ...o } = ue.value
      ;((ue.value = o), ae(a), ee(ue.value), n && V(t), he.forEach((t) => t(e, a, n)))
    }
  },
  clickCapturedBall: function (e, t = "default") {
    const n = ue.value[e]
    if (!n) return
    const a = n.element,
      o = n.element,
      r = n.order,
      i = window.parent || window,
      ballName = n.name
    if ("root-open" === t) {
      const t = () => {
        if (!a.isConnected || ue.value[e]) return
        ;(a.removeAttribute("data-edge-panel-ignore"), gt(a, { order: r }))
      }
      ;(a.setAttribute("data-edge-panel-ignore", "1"), this.removeCapturedBall(e))
      const n =
        a.closest("#auto_illustrator_conso_floating_panel_root") ||
        i.document.getElementById("auto_illustrator_conso_floating_panel_root")
      const o =
        a.id === "ai-floating-panel-launcher"
          ? a
          : n?.querySelector("#ai-floating-panel-launcher,.ai-floating-panel-launcher")
      if (n && o) {
        ;(n.setAttribute("data-edge-panel-ignore", "1"), o.setAttribute("data-edge-panel-ignore", "1"))
        const r = o.getBoundingClientRect(),
          s = r.left + r.width / 2,
          l = r.top + r.height / 2,
          u = new (i.PointerEvent || PointerEvent)("pointerdown", {
            bubbles: !0,
            cancelable: !0,
            clientX: s,
            clientY: l,
            button: 0,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: !0,
          }),
          c = new (i.PointerEvent || PointerEvent)("pointermove", {
            bubbles: !0,
            cancelable: !0,
            clientX: s + 4,
            clientY: l + 4,
            button: 0,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: !0,
          }),
          d = new (i.PointerEvent || PointerEvent)("pointerup", {
            bubbles: !0,
            cancelable: !0,
            clientX: s + 4,
            clientY: l + 4,
            button: 0,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: !0,
          })
        try {
          ;(o.dispatchEvent(u), i.document.dispatchEvent(c), i.document.dispatchEvent(d))
        } catch {}
        try {
          i.localStorage?.setItem(
            "auto_illustrator_conso_floating_panel_position",
            JSON.stringify({ x: Math.round(r.left), y: Math.round(r.top) }),
          )
        } catch {}
        setTimeout(() => {
          try {
            o.click()
          } catch {
            try {
              const e = (i && i.MouseEvent) || MouseEvent
              o.dispatchEvent(new e("click", { bubbles: !0, cancelable: !0, view: i }))
            } catch {}
          }
        }, 80)
        const h = setInterval(() => {
          if (!n.isConnected || ue.value[e]) return void clearInterval(h)
          n.classList.contains("open") ||
            (clearInterval(h),
            setTimeout(() => {
              ;(n.removeAttribute("data-edge-panel-ignore"), o.removeAttribute("data-edge-panel-ignore"), t())
            }, 120))
        }, 250)
        ;(setTimeout(() => clearInterval(h), 15000), toastr.info(`已在原位置打开: ${ballName}`))
        return
      }
      if (n) {
        n.classList.add("open")
        const o = setInterval(() => {
          if (!n.isConnected || ue.value[e]) return void clearInterval(o)
          n.classList.contains("open") || (clearInterval(o), setTimeout(t, 120))
        }, 250)
        setTimeout(() => clearInterval(o), 15000)
      }
      toastr.info(`已在原位置打开: ${ballName}`)
      return
    }
    const l = (e, t, n = {}) => {
      try {
        const a = i[t] || window[t]
        a && e.dispatchEvent(new a(n.type, { bubbles: !0, cancelable: !0, view: i, ...n }))
      } catch {}
    }
    const s = () => {
      let wasExpanded = !1
      const ballId = e
      const t = () => {
        const e = String(a.getAttribute("aria-expanded") || "").toLowerCase(),
          t = `${a.className || ""} ${o.className || ""}`.toLowerCase()
        return "true" === e || /(^|\s)(active|open|opened|expanded|selected)(\s|$)/.test(t)
      }
      const n = setInterval(() => {
        if (!a.isConnected || ue.value[ballId]) return void clearInterval(n)
        const o = t()
        o
          ? (wasExpanded = !0)
          : wasExpanded &&
            (clearInterval(n),
            setTimeout(() => {
              if (!a.isConnected || ue.value[ballId]) return
              ;(a.removeAttribute("data-edge-panel-ignore"), gt(a, { order: r }))
            }, 120))
      }, 250)
      setTimeout(() => clearInterval(n), 15000)
      setTimeout(() => {
        const cleanup = () => {
          ;(a.removeEventListener("click", cleanup, !0),
            a.removeEventListener("touchend", cleanup, !0),
            setTimeout(() => {
              if (!a.isConnected || ue.value[ballId]) return
              ;(a.removeAttribute("data-edge-panel-ignore"), gt(a, { order: r }))
            }, 120))
        }
        ;(a.addEventListener("click", cleanup, !0), a.addEventListener("touchend", cleanup, !0))
      }, 400)
    }
    ;(a.setAttribute("data-edge-panel-ignore", "1"),
      this.removeCapturedBall(e),
      setTimeout(() => {
        ;(l(o, "PointerEvent", { type: "pointerdown", button: 0, buttons: 1, pointerType: "mouse", isPrimary: !0 }),
          l(o, "MouseEvent", { type: "mousedown", button: 0, buttons: 1 }),
          l(o, "PointerEvent", { type: "pointerup", button: 0, buttons: 0, pointerType: "mouse", isPrimary: !0 }),
          l(o, "MouseEvent", { type: "mouseup", button: 0, buttons: 0 }))
        try {
          o.click()
        } catch {
          l(o, "MouseEvent", { type: "click", button: 0, buttons: 0 })
        }
      }, 48),
      s(),
      toastr.info(`已在原位置打开: ${ballName}`))
  },
  releaseAllBalls: Pe,
  releaseAllBallsWithoutSaving: function () {
    const e = Object.values(ue.value)
    ;((ue.value = {}),
      e.forEach((e) => {
        ;(e.element.isConnected && V(e), he.forEach((t) => t(e.id, e.fingerprint, e.element)))
      }))
  },
  updateCapturedBallElement: Fe,
  cleanupInvalidBalls: function () {
    const e = []
    for (const [t, n] of Object.entries(ue.value)) n.element.isConnected || e.push(t)
    if (e.length > 0) {
      for (const t of e) {
        const e = ue.value[t]
        ;(e && he.forEach((n) => n(t, e.fingerprint, e.element)), delete ue.value[t])
      }
      ;((ue.value = { ...ue.value }), ee(ue.value))
    }
    for (const [t, n] of ct) {
      ;(t.isConnected && ue.value[n]) || ct.delete(t)
    }
  },
  onBallReleased: function (e) {
    return (
      he.push(e),
      () => {
        const t = he.indexOf(e)
        t > -1 && he.splice(t, 1)
      }
    )
  },
  togglePanel: function () {
    fe.value = !fe.value
  },
  closePanel: function () {
    fe.value = !1
  },
  openPanel: function () {
    fe.value = !0
  },
  setPanelLeftPosition: function (e) {
    ;((ve.value = e), (be.value = e))
  },
  updatePanelPositionStyle: function (e) {
    const t = pe.effectivePosition.value
    if (e)
      switch (t) {
        case "left":
          be.value = `${Math.round(e.left)}px`
          break
        case "right":
          be.value = `${Math.round(e.right)}px`
          break
        case "top":
          be.value = `${Math.round(e.top)}px`
          break
        case "bottom":
          be.value = `${Math.round(e.bottom)}px`
      }
    else
      switch (t) {
        case "left":
        case "top":
          be.value = "0px"
          break
        case "right":
          be.value = `${window.parent.innerWidth}px`
          break
        case "bottom":
          be.value = `${window.parent.innerHeight}px`
      }
  },
  initSettings: pe.initSettings,
  setPanelPosition: pe.setPanelPosition,
  toggleAutoCapture: function () {
    ;((ge.value = !ge.value), ge.value || Pe())
    pe.syncAutoScan()
  },
  enterCaptureMode: function () {
    Ce.value = !0
  },
  exitCaptureMode: function () {
    Ce.value = !1
  },
  toggleCaptureMode: function () {
    Ce.value = !Ce.value
  },
  setBallContainer: function (e) {
    S = e
    layer = null
    if (e) {
      const horiz = (function () {
        let n = e
        while (n && !(n.classList && n.classList.contains("edge-panel-root"))) n = n.parentNode
        return !!(n && n.classList && n.classList.contains("edge-panel-root--horizontal"))
      })()
      layer = window.parent.document.createElement("div")
      layer.className = "fb-pages-layer"
      layer.style.display = "flex"
      layer.style.flexDirection = horiz ? "row" : "column"
      fbCreatePage()
      e.appendChild(layer)
    }
    fbPageIndex = 0
    fbRebuildLayer()
  },
  fbGoPage: fbGoPage,
  fbGetPageState: function () {
    return { index: fbPageIndex, count: fbPageCount, per: fbPerPage() }
  },
  getBallContainer: k,
  moveBallToContainer: O,
  moveBallBackToOriginal: V,
  hideFloatingBall: L,
  showFloatingBall: function (e, t) {
    e.style.cssText = t
  },
  initPersistence: function () {
    if (!Q) {
      Q = !0
      try {
        const t = R(),
          n = getVariables({ type: "script", script_id: t }),
          a = D.parse(n)
        ;(a.savedBalls.length > 0 && (J.value = e(a.savedBalls)),
          a.releasedFingerprints && a.releasedFingerprints.length > 0 && (Rb.value = a.releasedFingerprints))
      } catch {}
    }
  },
  saveCapturedBalls: () => ee(ue.value),
  findPendingRestoreBall: te,
  shouldRestoreBall: function (e, t, n) {
    return null !== te({ scriptId: e, elementId: n || null, classSelector: t, title: null })
  },
  markBallRestored: ae,
  removeFromPendingRestore: ae,
  getPendingRestoreBalls: function () {
    return J.value
  },
  extractFingerprint: Y,
  generateBallIdFromFingerprint: function (e) {
    if (e.scriptId) return `ball_script_${e.scriptId}`
    if (e.elementId) return `ball_id_${e.elementId}`
    if (e.classSelector || e.title) {
      return `ball_combined_${(function (e) {
        let t = 0
        for (let n = 0; n < e.length; n++) ((t = (t << 5) - t + e.charCodeAt(n)), (t &= t))
        return Math.abs(t)
      })(`${e.classSelector || ""}_${e.title || ""}`)}`
    }
    return `ball_random_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  },
  fingerprintsMatch: W,
  isValidFingerprint: j,
  isFingerprintCaptured: Se,
  findCapturedBallByFingerprint: ke,
  getClassSelector: U,
  isElementIdCaptured: function (e) {
    return !!e && Se({ scriptId: null, elementId: e, classSelector: null, title: null })
  },
}
const Ie = _,
  Me = (0, o.ref)({
    barBg: "rgba(30, 30, 40, 0.9)",
    controlBg: "rgba(45, 55, 72, 0.8)",
    controlHoverBg: "rgba(35, 45, 62, 0.8)",
    buttonBg: "rgba(74, 85, 104, 0.8)",
    textColor: "#e2e8f0",
    borderColor: "#718096",
    hoverBg: "rgba(20, 20, 30, 0.9)",
    panelBg: "rgba(26, 32, 44, 1)",
    quoteColor: "#9ca3af",
    glassBg: "rgba(30, 30, 40, 0.8)",
    glassHoverBg: "rgba(20, 20, 30, 0.7)",
  })
let qe = null
const Oe = (e, t) => {
    if (!e || "transparent" === e) return `rgba(0, 0, 0, ${t})`
    try {
      if (e.startsWith("rgba")) {
        const n = e.substring(e.indexOf("(") + 1, e.lastIndexOf(")")).split(",")
        if (n.length >= 3) return `rgba(${n[0].trim()}, ${n[1].trim()}, ${n[2].trim()}, ${t})`
      } else if (e.startsWith("rgb")) {
        const n = e.substring(e.indexOf("(") + 1, e.lastIndexOf(")")).split(",")
        if (n.length >= 3) return `rgba(${n[0].trim()}, ${n[1].trim()}, ${n[2].trim()}, ${t})`
      }
    } catch {}
    return e
  },
  $e = (e, t) => {
    try {
      if (e.startsWith("rgba")) {
        const n = e.substring(e.indexOf("(") + 1, e.lastIndexOf(")")).split(",")
        if (n.length >= 3) {
          let e = parseInt(n[0].trim(), 10),
            a = parseInt(n[1].trim(), 10),
            o = parseInt(n[2].trim(), 10)
          const r = n.length > 3 ? parseFloat(n[3].trim()) : 1
          return (
            (e = Math.max(0, e - e * t)),
            (a = Math.max(0, a - a * t)),
            (o = Math.max(0, o - o * t)),
            `rgba(${Math.round(e)}, ${Math.round(a)}, ${Math.round(o)}, ${r})`
          )
        }
      }
    } catch {}
    return e
  },
  _e = () => {
    try {
      const e = window.parent.document
      let t = "rgba(30, 30, 40, 0.9)",
        n = "rgba(20, 20, 30, 0.9)",
        a = "rgba(45, 55, 72, 0.8)",
        o = "rgba(35, 45, 62, 0.8)",
        r = "rgba(74, 85, 104, 0.8)",
        i = "#e2e8f0",
        l = "#718096",
        s = "rgba(26, 32, 44, 1)",
        A = "#9ca3af",
        c = "rgba(30, 30, 40, 0.6)",
        p = "rgba(20, 20, 30, 0.7)"
      const d = (() => {
        if ("function" != typeof $) {
          const e = window.parent.document.querySelector(".simplebar-content-wrapper") || window.parent.document.querySelector("#chat")
          return e || null
        }
        const e = $(window.parent.document),
          t = [".simplebar-content-wrapper", "#chat"]
        for (const n of t) {
          const t = e.find(n)
          if (t.length > 0) return t.first()
        }
        return null
      })()
      if (d) {
        let a = window.parent.getComputedStyle(d[0]).backgroundColor
        ;(("rgba(0, 0, 0, 0)" !== a && "transparent" !== a) ||
          (a = window.parent.getComputedStyle(e.body).backgroundColor),
          (s = Oe(a, 1)))
        const o = e.querySelector("#top-bar")
        if (o) {
          const e = window.parent.getComputedStyle(o).backgroundColor
          t = Oe("rgba(0, 0, 0, 0)" !== e && "transparent" !== e ? e : a, 1)
        } else t = Oe(a, 1)
        ;((n = $e(t, 0.15)), (c = Oe(t, 0.6)), (p = Oe(n, 0.7)))
      }
      const u = e.querySelector(".mes:not(.user-mes)")
      if (u) {
        const e = window.parent.getComputedStyle(u).backgroundColor
        ;((a = Oe(e, 1)), (o = $e(a, 0.15)))
      }
      const g = e.querySelector(".mes_text")
      g && (i = window.parent.getComputedStyle(g).color)
      const C = e.querySelector(".mes_text blockquote")
      if (C) A = window.parent.getComputedStyle(C).color
      else {
        const t = e.querySelector("blockquote")
        if (t) A = window.parent.getComputedStyle(t).color
        else {
          const t = window.parent.getComputedStyle(e.documentElement).getPropertyValue("--SmartThemeQuoteColor").trim()
          t && (A = t)
        }
      }
      const f = e.querySelector(".fa-solid")
      if (f) {
        const e = window.parent.getComputedStyle(f).color
        r = Oe(e, 1)
      }
      const b = e.querySelector("#send_textarea")
      ;(b && (l = window.parent.getComputedStyle(b).borderColor),
        (Me.value = {
          barBg: t,
          hoverBg: n,
          controlBg: a,
          controlHoverBg: o,
          buttonBg: r,
          textColor: i,
          borderColor: l,
          panelBg: s,
          quoteColor: A,
          glassBg: c,
          glassHoverBg: p,
        }))
    } catch (e) {
      console.warn("[集成控件] 获取父窗口样式失败:", e)
    }
  },
  Ve = {
    themeColors: Me,
    initializeThemeObserver: () => {
      _e()
      try {
        const e = (0, Ie.debounce)(_e, 250)
        ;((qe = new MutationObserver(e)),
          qe.observe(window.parent.document.head, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }),
          qe.observe(window.parent.document.body, { attributes: !0, attributeFilter: ["class", "style"] }),
          qe.observe(window.parent.document.documentElement, { attributes: !0, attributeFilter: ["style", "class"] }))
        const t = window.parent.document.querySelector("#chat")
        ;(t && qe.observe(t, { attributes: !0, attributeFilter: ["style", "class"], childList: !0 }),
          console.log("[集成控件] 主题监听器已初始化"))
      } catch (e) {
        console.error("[集成控件] 无法监听主题变化:", e)
      }
    },
    disconnectThemeObserver: () => {
      qe?.disconnect()
    },
    updateThemeColors: _e,
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
  Re = (0, o.defineComponent)({
    __name: "EdgePanel",
    setup(e) {
      ;(0, o.useCssVars)((e) => ({
        v9d17ecc4: (0, o.unref)(c),
        v447886dc: (0, o.unref)(x).glassBg,
        v70503c70: (0, o.unref)(x).borderColor,
        v2826bcb2: (0, o.unref)(x).textColor,
        v5e0fea74: (0, o.unref)(x).glassHoverBg,
        ec7cae14: (0, o.unref)(x).quoteColor,
      }))
      const t = (0, o.ref)(null),
        n = (0, o.ref)(!1),
        releaseMode = (0, o.ref)(!1),
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
        } = Ne,
        { themeColors: x } = Ve,
        y = [
          { value: "left", label: "左侧", icon: "fa-solid fa-arrow-left" },
          { value: "right", label: "右侧", icon: "fa-solid fa-arrow-right" },
          { value: "top", label: "顶部", icon: "fa-solid fa-arrow-up" },
          { value: "bottom", label: "底部", icon: "fa-solid fa-arrow-down" },
        ],
        w = (0, o.computed)(() => {
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
        B = (0, o.computed)(() => {
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
        E = (0, o.computed)(() => {
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
              addReleasedFp(n.fingerprint || Y(e)),
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
          addReleasedFp(Y(e)),
          b(`ball_${n}`),
          e.removeAttribute("data-edge-panel-ignore"),
          (filterPendingBall(null, e)),
          toastr.info("已释放悬浮球"),
          !0)
        )
      }
      function filterPendingBall(fp, e) {
  const a = fp || Y(e)
  J.value = J.value.filter((t) => !W(t.fingerprint, a))
  try {
    const o = { ...(getVariables({ type: "script", script_id: R() }) ?? {}), savedBalls: JSON.parse(JSON.stringify(J.value)) }
    replaceVariables(o, { type: "script", script_id: R() })
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
              const t = Object.keys(Ne.capturedBalls.value).length
              const r = Ne.autoCaptureEnabled.value
              Ne.autoCaptureEnabled.value = !0
              try {
                Ct(!0)
              } finally {
                Ne.autoCaptureEnabled.value = r
              }
              const a = Object.keys(Ne.capturedBalls.value).length
              toastr.success(
                a > 0 ? (a > t ? `已全部捕捉 ${a - t} 个悬浮球（共 ${a} 个）` : `当前已收纳 ${a} 个悬浮球`) : "未发现可捕捉的悬浮球",
              )
            } else {
              const t = Object.values(Ne.capturedBalls.value)
              if (0 === t.length) return void toastr.info("当前没有已收纳的悬浮球")
              for (const e of t) {
                try {
                  addReleasedFp(e.fingerprint)
                  Ne.removeCapturedBall(e.id)
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
      const captureModeActive = (0, o.ref)(pe.getCaptureMode())
      function setCaptureModeUI(aMode) {
        if (aMode === captureModeActive.value) return
        captureModeActive.value = aMode
        pe.setCaptureMode(aMode)
        toastr.info(aMode === "auto" ? "已切换到自动模式：悬浮球将自动收纳" : "已切换到手动模式：长按捕捉=全部收纳")
      }
      function clearMemoryUI() {
        const t = pe.getReleasedFpCount()
        if (0 === t) return void toastr.info("当前无记忆")
        ;(pe.clearReleasedFps(), toastr.success(`已清空 ${t} 条释放记忆`))
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
          r = (0, o.unref)(d) ? n : a
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
        (0, o.watch)(
          i,
          (e) => {
            console.info("[EdgePanel] capturedBallsList 更新:", e.length, "个", e)
          },
          { immediate: !0, deep: !0 },
        ),
        (0, o.watch)(a, (e) => {
          e || ((n.value = !1), (releaseMode.value = !1))
        }),
        (0, o.onMounted)(() => {
          ;(Ve.initializeThemeObserver(), t.value && h(t.value))
        }),
        (0, o.onUnmounted)(() => {
          ;(Ve.disconnectThemeObserver(), h(null), (releaseMode.value = !1))
        }),
        (e, A) => (
          (0, o.openBlock)(),
          (0, o.createElementBlock)(
            "div",
            {
              class: (0, o.normalizeClass)([
                "edge-panel-root",
                [`edge-panel-root--${(0, o.unref)(p)}`, { "edge-panel-root--horizontal": (0, o.unref)(d) }],
              ]),
            },
            [
              (0, o.createCommentVNode)(" 边缘箭头标签 "),
              (0, o.createVNode)(
                o.Transition,
                { name: "edge-tab-fade", persisted: "" },
                {
                  default: (0, o.withCtx)(() => [
                    (0, o.withDirectives)(
                      (0, o.createElementVNode)(
                        "div",
                        {
                          class: (0, o.normalizeClass)([
                            "edge-tab",
                            { "edge-tab--has-plugins": (0, o.unref)(l), [`edge-tab--${(0, o.unref)(p)}`]: !0 },
                          ]),
                          title: "快速导航",
                          onClick: A[0] || (A[0] = (...e) => (0, o.unref)(C) && (0, o.unref)(C)(...e)),
                        },
                        [(0, o.createElementVNode)("i", { class: (0, o.normalizeClass)(w.value) }, null, 2)],
                        2,
                      ),
                      [[o.vShow, !(0, o.unref)(a)]],
                    ),
                  ]),
                },
              ),
              (0, o.createCommentVNode)(" 展开的图标面板 "),
              (0, o.createVNode)(
                o.Transition,
                { name: E.value, persisted: "" },
                {
                  default: (0, o.withCtx)(() => [
                    (0, o.withDirectives)(
                      (0, o.createElementVNode)(
                        "div",
                        { class: (0, o.normalizeClass)(["icon-panel", [`icon-panel--${(0, o.unref)(p)}`]]) },
                        [
                          (0, o.createCommentVNode)(" 面板头部 - 收起按钮 "),
                          (0, o.createElementVNode)(
                            "div",
                            {
                              class: "panel-header",
                              onClick: A[1] || (A[1] = (...e) => (0, o.unref)(f) && (0, o.unref)(f)(...e)),
                            },
                            [(0, o.createElementVNode)("i", { class: (0, o.normalizeClass)(B.value) }, null, 2)],
                          ),
                          (0, o.createCommentVNode)(" 插件图标列表 "),
                          (0, o.createElementVNode)("div", Ge, [
                            (0, o.createCommentVNode)(" 手动注册的插件 "),
                            ((0, o.openBlock)(!0),
                            (0, o.createElementBlock)(
                              o.Fragment,
                              null,
                              (0, o.renderList)(
                                (0, o.unref)(r),
                                (e) => (
                                  (0, o.openBlock)(),
                                  (0, o.createElementBlock)(
                                    "div",
                                    {
                                      key: e.id,
                                      class: (0, o.normalizeClass)([
                                        "plugin-icon",
                                        { "plugin-icon--active": e.isActive?.() },
                                      ]),
                                      title: e.name,
                                      style: (0, o.normalizeStyle)(
                                        e.iconColor ? { "--plugin-color": e.iconColor } : {},
                                      ),
                                      onClick: (t) =>
                                        (function (e) {
                                          e.onClick()
                                        })(e),
                                    },
                                    [(0, o.createElementVNode)("i", { class: (0, o.normalizeClass)(e.icon) }, null, 2)],
                                    14,
                                    Le,
                                  )
                                ),
                              ),
                              128,
                            )),
                            (0, o.createCommentVNode)(" 分隔线（当同时存在注册插件和捕获悬浮球时显示） "),
                            (0, o.unref)(r).length > 0 && (0, o.unref)(i).length > 0
                              ? ((0, o.openBlock)(), (0, o.createElementBlock)("div", Ye))
                              : (0, o.createCommentVNode)("v-if", !0),
                            (0, o.createCommentVNode)(" 捕获的悬浮球容器 - 支持滑动，防误触 "),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: "fb-arrow fb-arrow--prev",
                                "data-fb-page-prev": "",
                                "aria-hidden": "true",
                                onClick: () => fbGoPage(-1),
                              },
                              [(0, o.createTextVNode)("\u2039")],
                            ),
                            (0, o.createElementVNode)(
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
                              [(0, o.createCommentVNode)(" 悬浮球元素会被动态移动到这里，左右滑动浏览，点击激活 ")],
                              544,
                            ),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: "fb-arrow fb-arrow--next",
                                "data-fb-page-next": "",
                                "aria-hidden": "true",
                                onClick: () => fbGoPage(1),
                              },
                              [(0, o.createTextVNode)("\u203a")],
                            ),
                          ]),
                          (0, o.createCommentVNode)(" 分隔线（当有内容时显示） "),
                          (0, o.unref)(r).length > 0 || (0, o.unref)(i).length > 0
                            ? ((0, o.openBlock)(), (0, o.createElementBlock)("div", We))
                            : (0, o.createCommentVNode)("v-if", !0),
                          (0, o.createCommentVNode)(" 操作按钮区域 - 紧凑布局，集中放置 "),
                          (0, o.createElementVNode)("div", je, [
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: (0, o.normalizeClass)([
                                  "action-icon",
                                  { "action-icon--active": (0, o.unref)(s) },
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
                                    (0, o.createElementVNode)("i", { class: "fa-solid fa-crosshairs" }, null, -1),
                                  ])),
                              ],
                              2,
                            ),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: (0, o.normalizeClass)([
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
                                    (0, o.createElementVNode)("i", { class: "fa-solid fa-box-open" }, null, -1),
                                  ])),
                              ],
                              2,
                            ),
                            (0, o.createElementVNode)(
                              "div",
                              {
                                class: (0, o.normalizeClass)(["action-icon", { "action-icon--active": n.value }]),
                                title: "设置面板位置",
                                onClick: P,
                              },
                              [
                                ...(A[3] ||
                                  (A[3] = [(0, o.createElementVNode)("i", { class: "fa-solid fa-gear" }, null, -1)])),
                              ],
                              2,
                            ),
                          ]),
                          (0, o.createCommentVNode)(" 设置面板 "),
                          (0, o.createVNode)(
                            o.Transition,
                            { name: "settings-fade" },
                            {
                              default: (0, o.withCtx)(() => [
                                n.value
                                  ? ((0, o.openBlock)(),
                                    (0, o.createElementBlock)("div", Ue, [
                                      A[4] ||
                                        (A[4] = (0, o.createElementVNode)(
                                          "div",
                                          { class: "settings-title" },
                                          "位置",
                                          -1,
                                        )),
                                      (0, o.createElementVNode)("div", Xe, [
                                        (0, o.createElementVNode)(
                                          "div",
                                          {
                                            class: "settings-option",
                                            title: "位置",
                                            onClick: (t) => {
                                              const el = t.currentTarget || t.target
                                              window.openPosMenu && window.openPosMenu(el, (0, o.unref)(p))
                                            },
                                          },
                                          [(0, o.createElementVNode)("i", { class: "fa-solid fa-flag" }, null, -1)],
                                          10,
                                          Te,
                                        ),
                                      ]),
                                    ,
                              (0, o.createCommentVNode)(" 入口显示模式 "),
                              (0, o.createElementVNode)("div", { class: "settings-title" }, "入口", -1),
                              (0, o.createElementVNode)("div", { class: "settings-options" }, [
                                (0, o.createElementVNode)(
                                  "div",
                                  {
                                    class: "settings-option",
                                    title: "入口",
                                    onClick: (t) => {
                                      const el = t.currentTarget || t.target
                                      window.openEntryMenu && window.openEntryMenu(el)
                                    },
                                  },
                                  [(0, o.createElementVNode)("i", { class: "fa-solid fa-list-check" }, null, -1)],
                                  10,
                                  Te,
                                ),
                              ]),
                              (0, o.createCommentVNode)(" 捕捉模式 - 手动/自动 "),
                              (0, o.createElementVNode)("div", { class: "settings-title" }, "模式", -1),
                              (0, o.createElementVNode)("div", { class: "settings-options" }, [
                                (0, o.createElementVNode)(
                                  "div",
                                  {
                                    class: (0, o.normalizeClass)([
                                      "settings-option",
                                      { "settings-option--active": "manual" === (0, o.unref)(captureModeActive) },
                                    ]),
                                    title: "手动",
                                    onClick: () => setCaptureModeUI("manual"),
                                  },
                                  [(0, o.createElementVNode)("i", { class: "fa-solid fa-hand-pointer" }, null, -1)],
                                  10,
                                  Te,
                                ),
                                (0, o.createElementVNode)(
                                  "div",
                                  {
                                    class: (0, o.normalizeClass)([
                                      "settings-option",
                                      { "settings-option--active": "auto" === (0, o.unref)(captureModeActive) },
                                    ]),
                                    title: "自动",
                                    onClick: () => setCaptureModeUI("auto"),
                                  },
                                  [(0, o.createElementVNode)("i", { class: "fa-solid fa-bolt" }, null, -1)],
                                  10,
                                  Te,
                                ),
                              ]),
                              (0, o.createElementVNode)("div", { class: "settings-divider" }, null, -1),
                              (0, o.createElementVNode)(
                                "div",
                                { class: "settings-option clear-memory-row", title: "清空释放记忆", onClick: clearMemoryUI },
                                [(0, o.createElementVNode)("i", { class: "fa-solid fa-broom" }, null, -1)],
                                10,
                                Le,
                              )
                              ]))
                                  : (0, o.createCommentVNode)("v-if", !0),
                              ]),
                              _: 1,
                            },
                          ),
                          (0, o.createCommentVNode)(" 空状态提示（没有插件和悬浮球时显示） "),
                          0 !== (0, o.unref)(r).length || 0 !== (0, o.unref)(i).length
                            ? (0, o.createCommentVNode)("v-if", !0)
                            : ((0, o.openBlock)(),
                              (0, o.createElementBlock)("div", De, [
                                ...(A[5] ||
                                  (A[5] = [
                                    (0, o.createElementVNode)(
                                      "span",
                                      { class: "panel-empty-text" },
                                      [
                                        (0, o.createTextVNode)("暂无内容"),
                                        (0, o.createElementVNode)("br"),
                                        (0, o.createTextVNode)("点击上方按钮捕获悬浮球"),
                                      ],
                                      -1,
                                    ),
                                  ])),
                              ])),
                        ],
                        2,
                      ),
                      [[o.vShow, (0, o.unref)(a)]],
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
a(705)
const Je = (0, a(502).A)(Re, [["__scopeId", "data-v-da7fb8b4"]])
let Qe = null,
  He = null,
  Ze = null,
  et = null,
  edgePanelViewportResizeHandler = null,
  edgePanelViewportScrollHandler = null,
  edgePanelFocusHandler = null,
  edgePanelKeyboardPointerHandler = null,
  edgePanelKeyboardClickHandler = null,
  edgePanelKeyboardToggleGuardUntil = 0,
  edgePanelFrameObserver = null,
  edgePanelRuntimeCleaned = !1,
  edgePanelHostActionObserver = null,
  edgePanelHostClickHandler = null,
  edgePanelArtifactMonitor = null,
  edgePanelStyleHost = null
const edgePanelParentWin = window.parent,
  edgePanelParentDoc = edgePanelParentWin.document,
  edgePanelRuntimeId = (function () {
    try {
      return getScriptId()
    } catch (e) {
      return ""
    }
  })(),
  edgePanelRuntimeOwner = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
  edgePanelRuntimeKeys = ["__floating_ball_storage_runtime__", "__edge_panel_runtime__"],
  edgePanelCurrentFrameName = (function () {
    try {
      return String(window?.name || "").trim()
    } catch (e) {
      return ""
    }
  })()
try {
  edgePanelRuntimeKeys.forEach((e) => {
    const t = edgePanelParentWin[e]
    t && "function" == typeof t.cleanup && t.cleanup()
  })
} catch (e) {
  console.warn("[集成控件] 清理旧运行时失败:", e)
}
function edgePanelResolveCurrentFrame() {
  try {
    const e = window.frameElement
    if (e && e.ownerDocument === edgePanelParentDoc) return e
  } catch (e) {}
  if (!edgePanelCurrentFrameName || "function" != typeof edgePanelParentDoc.getElementById) return null
  const e = edgePanelParentDoc.getElementById(edgePanelCurrentFrameName)
  return e && "iframe" === String(e.tagName || "").toLowerCase() ? e : null
}
function edgePanelMarkOwned(e) {
  return (e && e.setAttribute("data-edge-panel-owner", edgePanelRuntimeOwner), e)
}
function edgePanelRemoveOwnedArtifacts() {
  try {
    edgePanelParentDoc.querySelectorAll(`[data-edge-panel-owner="${edgePanelRuntimeOwner}"]`).forEach((e) => {
      e.remove()
    })
  } catch (e) {}
}
function edgePanelRemoveStaleArtifacts() {
  if (!edgePanelRuntimeId) return
  try {
    edgePanelParentDoc
      .querySelectorAll(`body > div[script_id="${edgePanelRuntimeId}"], head > div[script_id="${edgePanelRuntimeId}"]`)
      .forEach((e) => {
        e.remove()
      })
  } catch (e) {}
}
function edgePanelRegisterRuntime(e) {
  try {
    edgePanelRuntimeKeys.forEach((t) => {
      edgePanelParentWin[t] = { id: edgePanelRuntimeId, owner: edgePanelRuntimeOwner, cleanup: e }
    })
  } catch (e) {
    console.warn("[集成控件] 注册运行时失败:", e)
  }
}
function edgePanelClearRuntimeRegistration() {
  try {
    edgePanelRuntimeKeys.forEach((e) => {
      const t = edgePanelParentWin[e]
      t && t.owner === edgePanelRuntimeOwner && delete edgePanelParentWin[e]
    })
  } catch (e) {}
}
function edgePanelAttachFrameDetachWatcher(e) {
  if (
    edgePanelFrameObserver ||
    edgePanelRuntimeCleaned ||
    edgePanelParentWin === window ||
    "undefined" == typeof MutationObserver
  )
    return
  const t = edgePanelParentDoc.body || edgePanelParentDoc.documentElement
  if (!t) return
  ;((edgePanelFrameObserver = new MutationObserver(() => {
    if (edgePanelRuntimeCleaned) return
    const t = edgePanelResolveCurrentFrame()
    ;(t && t.isConnected) || e()
  })),
    edgePanelFrameObserver.observe(t, { childList: !0, subtree: !0 }))
}
function edgePanelEnsureArtifacts(e) {
  if (edgePanelRuntimeCleaned) return
  let t = !1
  ;(it && !it.isConnected && edgePanelParentDoc.body && (edgePanelParentDoc.body.appendChild(it), (t = !0)),
    edgePanelStyleHost &&
      !edgePanelStyleHost.isConnected &&
      edgePanelParentDoc.head &&
      (edgePanelParentDoc.head.appendChild(edgePanelStyleHost), (t = !0)),
    e && e(t))
}
function edgePanelStartArtifactMonitor(e) {
  ;(edgePanelArtifactMonitor &&
    (edgePanelParentWin.clearInterval(edgePanelArtifactMonitor), (edgePanelArtifactMonitor = null)),
    (edgePanelArtifactMonitor = edgePanelParentWin.setInterval(() => {
      edgePanelEnsureArtifacts(e)
    }, 1200)))
}
function edgePanelIsElement(e) {
  return !!(e && 1 === e.nodeType)
}
function edgePanelIsOwnedNode(e) {
  return !!(
    edgePanelIsElement(e) &&
    "function" == typeof e.closest &&
    e.closest(`[data-edge-panel-owner="${edgePanelRuntimeOwner}"]`)
  )
}
function edgePanelNodeMentionsScriptByText(e) {
  if (!e || !edgePanelRuntimeId) return !1
  try {
    const t = (e.textContent || "").toLowerCase(),
      n = edgePanelRuntimeId.toLowerCase()
    if (t.includes(n)) return !0
    const a = e.getAttribute?.("script_id") || ""
    if (a === edgePanelRuntimeId) return !0
  } catch (e) {}
  return !1
}
function edgePanelScheduleAggressivePresenceCheck() {
  ;[120, 360, 900, 1800, 3200].forEach((e) => {
    edgePanelParentWin.setTimeout(() => {
      if (edgePanelRuntimeCleaned) return
      const t = edgePanelResolveCurrentFrame()
      ;(t && t.isConnected) || edgePanelRuntimeCleanup()
    }, e)
  })
}
function edgePanelAttachHostActionWatchers() {
  if (edgePanelHostActionObserver || !edgePanelParentDoc.body) return
  ;((edgePanelHostClickHandler = (e) => {
    const t = e.target
    if (!edgePanelIsElement(t) || edgePanelIsOwnedNode(t)) return
    const n = t.closest("button,input,label,.menu_button,.fa-trash,.fa-trash-can,.fa-xmark,.fa-ban")
    if (!n) return
    let a = n
    for (let e = 0; a && e < 5; e += 1, a = a.parentElement)
      if (edgePanelNodeMentionsScriptByText(a)) return void edgePanelScheduleAggressivePresenceCheck()
  }),
    edgePanelParentDoc.addEventListener("click", edgePanelHostClickHandler, !0),
    (edgePanelHostActionObserver = new MutationObserver((e) => {
      for (const t of e)
        if ("childList" === t.type)
          for (const e of t.removedNodes)
            if (edgePanelIsElement(e)) {
              if (edgePanelNodeMentionsScriptByText(e)) return void edgePanelRuntimeCleanup()
              if ("function" == typeof e.querySelector) {
                const t = [...e.querySelectorAll("*")].some((e) => edgePanelNodeMentionsScriptByText(e))
                if (t) return void edgePanelRuntimeCleanup()
              }
            }
    })),
    edgePanelHostActionObserver.observe(edgePanelParentDoc.body, { childList: !0, subtree: !0 }))
}
function tt() {
  const e = window.parent.document,
    t = e.querySelector("#sheld")
  if (t) return t
  const n = e.querySelector("#chat")
  if (n) return n
  const a = e.querySelector(".simplebar-content-wrapper")
  return a || null
}
function nt() {
  const e = window.parent.document,
    t = e.querySelector("#top-settings-holder")
  if (t) return t
  const n = e.querySelector(".top-settings-holder")
  return n || null
}
function at() {
  const e = window.parent.document,
    t = e.querySelector("#form_sheld")
  if (t) return t
  const n = e.querySelector("#send_form")
  return n || null
}
function edgePanelViewportBounds() {
  const e = edgePanelParentWin,
    t = e.visualViewport
  if (t && t.width && t.height) {
    const e = t.offsetLeft || 0,
      n = t.offsetTop || 0
    return { left: e, top: n, right: e + t.width, bottom: n + t.height, width: t.width, height: t.height }
  }
  return { left: 0, top: 0, right: e.innerWidth, bottom: e.innerHeight, width: e.innerWidth, height: e.innerHeight }
}
function edgePanelFocusedInputRect() {
  try {
    const e = edgePanelParentDoc.activeElement
    if (!e) return null
    const t = String(e.tagName || "").toLowerCase(),
      n = "textarea" === t || "input" === t || !!e.isContentEditable || !!e.closest?.('[contenteditable="true"]')
    if (!n || "function" != typeof e.getBoundingClientRect) return null
    const a = e.getBoundingClientRect()
    return a && a.height && a.width ? a : null
  } catch (e) {
    return null
  }
}
function edgePanelIsTextInputFocused() {
  return !!edgePanelFocusedInputRect()
}
function edgePanelKeyboardOpen() {
  try {
    return !!(pe.isMobile.value && edgePanelIsTextInputFocused())
  } catch (e) {
    return !1
  }
}
function edgePanelClampPanelAnchor(e, t) {
  const n = edgePanelViewportBounds(),
    a = 8
  if ("top" === e) return Math.max(t, n.top + a)
  if ("bottom" === e) {
    const o = at()
    if (o) {
      const t = o.getBoundingClientRect()
      let i = t.top
      if (edgePanelKeyboardOpen()) {
        const l = edgePanelFocusedInputRect()
        if (l && l.top > n.top + 120 && l.top < n.bottom - a) {
          i = Math.min(i, l.top - a)
        }
      }
      return Math.max(n.top + 28, i)
    }
    if (edgePanelKeyboardOpen()) {
      let i = n.bottom - 96 - a,
        l = edgePanelFocusedInputRect()
      return (l && l.top > n.top + 120 && l.top < n.bottom - a && (i = Math.min(i, l.top - a)), Math.max(n.top + 28, i))
    }
    const e = n.bottom - a
    return Math.max(n.top + 28, Math.min(t, e))
  }
  return t
}
function edgePanelPx(e) {
  return `${Math.round(e)}px`
}
function edgePanelIsEdgeTabEvent(e) {
  const t = e?.target
  return !!(edgePanelIsElement(t) && edgePanelIsOwnedNode(t) && t.closest?.(".edge-tab,.panel-header"))
}
function edgePanelSchedulePositionRefresh(e) {
  ;[0, 80, 220, 480, 820, 1500, 2600, 4000].forEach((t) => edgePanelParentWin.setTimeout(() => ot(e, !0), t))
}
function edgePanelPreserveKeyboardToggle(e) {
  if (!pe.isMobile.value || !edgePanelIsTextInputFocused() || !edgePanelIsEdgeTabEvent(e)) return
  const t = Date.now()
  ;(e.preventDefault?.(), e.stopPropagation?.())
  if (t < edgePanelKeyboardToggleGuardUntil) return
  ;((edgePanelKeyboardToggleGuardUntil = t + 450),
    Ne.togglePanel(),
    edgePanelSchedulePositionRefresh(Ne.setPanelLeftPosition))
}
function edgePanelSuppressGuardedClick(e) {
  Date.now() < edgePanelKeyboardToggleGuardUntil &&
    edgePanelIsEdgeTabEvent(e) &&
    (e.preventDefault?.(), e.stopPropagation?.())
}
function ot(e, t = !1) {
  const n = (function (e) {
    const t = tt(),
      n = nt(),
      a = at(),
      o = edgePanelViewportBounds()
    switch (e) {
      case "left":
        return edgePanelPx(o.left)
      case "right":
        return edgePanelPx(o.right)
      case "top":
        if (n) {
          const t = n.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, t.bottom))
        }
        if (t) {
          const n = t.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, n.top))
        }
        // 锚点未就绪：不提交视口兜底值（避免面板跳到顶部/底部边缘），等锚点出现后由定时刷新校正
        return null
      case "bottom":
        if (edgePanelKeyboardOpen()) return edgePanelPx(edgePanelClampPanelAnchor(e, o.bottom))
        if (a) {
          const t = a.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, t.top))
        }
        if (t) {
          const n = t.getBoundingClientRect()
          return edgePanelPx(edgePanelClampPanelAnchor(e, n.bottom))
        }
        // 锚点未就绪：不提交视口兜底值（避免面板跳到顶部/底部边缘），等锚点出现后由定时刷新校正
        return null
      default:
        if (t) {
          const e = t.getBoundingClientRect()
          return edgePanelPx(e.right)
        }
        return edgePanelPx(o.right)
    }
  })(pe.effectivePosition.value)
  if (null !== n) {
    ;(t || et !== n) && ((et = n), e(n))
  }
}
let rt = null,
  it = null,
  lt = null,
  glt = null,
  st = null,
  mt = 0 // 全量兜底扫描的节流计数器（见 Ct() 中的用法）
const At = new Set(),
  ct = new Map(),
  pt = (function () {
    try {
      return getScriptId()
    } catch {
      return "集成控件"
    }
  })()
function dt(e) {
  Ne.registerPlugin(e)
}
function ut(e) {
  Ne.unregisterPlugin(e)
}
function gt(e, t) {
  if (e.hasAttribute("data-edge-panel-ignore")) return !1
  if (At.has(e)) return !1
  const n = Ne.extractFingerprint(e)
  if (n.scriptId === pt) return !1
  if (!Ne.isValidFingerprint(n)) return !1
  if (Ne.isFingerprintCaptured(n)) {
    const t = Ne.generateBallIdFromFingerprint(n)
    return (Ne.updateCapturedBallElement(t, e), At.add(e), !1)
  }
  At.add(e)
  const a = window.parent.getComputedStyle(e),
    o = a.display || "flex",
    r = Ne.generateBallIdFromFingerprint(n),
    s = {
      top: a.top,
      left: a.left,
      right: a.right,
      bottom: a.bottom,
      positionValue: a.position,
      opacityValue: a.opacity,
      visibilityValue: a.visibility,
      pointerEventsValue: a.pointerEvents,
    },
    A = e.style.cssText,
    c = {
      id: r,
      fingerprint: n,
      element: e,
      icon: i(e),
      name: l(e),
      originalPosition: s,
      originalDisplay: o,
      originalParent: e.parentElement,
      originalNextSibling: e.nextSibling,
      originalStyle: A,
      order: t?.order,
    }
  return (ct.set(e, r), Ne.addCapturedBall(c), removeReleasedFp(n), !0)
}
// ==== 悬浮球识别参数（可按需微调，数值越严格越保守）====
const BALL_SIZE_MIN = 20,        // 悬浮球最小边长(px)
  BALL_SIZE_MAX = 120,           // 悬浮球最大边长(px)
  BALL_RATIO_MIN = 0.6,          // 最小宽高比（越接近1越接近正圆/正方）
  BALL_RATIO_MAX = 1.7,          // 最大宽高比
  BALL_SCORE_THRESHOLD = 4,      // 打分制通过阈值，命中信号总分需 >= 该值才自动捕获
  BALL_ZINDEX_MIN = 999          // 视为"高层级"的 z-index 下限

// 判断一个元素是否"很像"悬浮球：先用硬性条件排除明显不是的元素，
// 再用加权打分综合判断，避免任何单一弱信号（比如仅仅 cursor:pointer）就误判。
function isFloatingBallCandidate(e, ownScriptId) {
  const style = window.parent.getComputedStyle(e)

  // ---------- 第一层：硬性排除（命中任意一条直接淘汰） ----------
  if ("fixed" !== style.position && "absolute" !== style.position) return !1

  // 排除常见的弹层/菜单/下拉/提示/翻页控件（避免误补点开后弹出的子元素）
  const tokens =
    (e.id || "") + " " + String(e.className || "") + " " + (e.getAttribute("title") || "") + " " + (e.getAttribute("aria-label") || "")
  if (
    /(?:^|\s|_|-)(?:popover|popup|dropdown|dropdown-menu|drop-down|menu|tooltip|popper|listbox|context-menu|contextmenu|select-options|abs-panel|floating-panel-options|submenu|sub-menu|option-list|picker|preview-nav|prev|next|previous|carousel|slide|gallery-nav|img-nav|image-nav)(?:\s|_|-|$)/.test(
      tokens.toLowerCase(),
    ) ||
    /(上一张|下一张|上一页|下一页|上一首|下一首|previous|next)/.test(tokens.toLowerCase())
  )
    return !1

  if (e.hasAttribute("data-edge-panel-ignore")) return !1
  if ("none" === style.display || "hidden" === style.visibility || "0" === style.opacity) return !1
  if ((e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id")) === ownScriptId) return !1
  if ("auto" === pe.getCaptureMode() && isReleasedFp(Y(e))) return !1
  if (S && S.contains(e)) return !1
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

function Ct(forceFullScan) {
  if (!Ne.autoCaptureEnabled.value) return
  const selectors = [
      "[script_id]",
      '[class*="ball"]',
      '[class*="floating"]',
      '[class*="float"]',
      '[class*="fab"]',
      '[class*="draggable"]',
      ".ui-draggable",
      '[style*="position: fixed"]',
      '[style*="position:fixed"]',
      '[style*="position: absolute"]',
      '[style*="position:absolute"]',
    ],
    candidates = new Set(),
    docs = [window.parent.document, ...collectIframeDocs()]
  for (const doc of docs)
    for (const sel of selectors)
      try {
        doc.querySelectorAll(sel).forEach((el) => candidates.add(el))
      } catch {}

  // 兜底全量扫描：只收集"计算样式为 fixed"的元素（覆盖靠 CSS class 而非行内样式实现悬浮
  // 定位的情况）。不收集 absolute 元素，因为 absolute 在普通布局中极其常见，纳入兜底扫描
  // 会显著增加误捕概率；已知的 absolute 悬浮球仍可被上面的选择器命中。
  // 这一步比较费性能，不必每次定时器触发（每 2 秒）都跑一次；但也不能只跑一次，否则页面
  // 加载完成之后才动态出现、且没有匹配到上面任何选择器的悬浮球会永远扫不到。
  // 这里用计数器把它节流到大约每 6 个 tick（配合 2 秒的定时器约等于 12 秒）跑一次。
  if (forceFullScan || mt <= 0) {
    docs.forEach((doc) => {
      try {
        let scanRoot
        try {
          scanRoot = doc.querySelectorAll("button:not(#chat, #chat *), div:not(#chat, #chat *), span:not(#chat, #chat *), a:not(#chat, #chat *)")
        } catch {
          scanRoot = doc.querySelectorAll("button, div, span, a")
        }
        scanRoot.forEach((el) => {
          try {
            if ("fixed" === window.parent.getComputedStyle(el).position) candidates.add(el)
          } catch {}
        })
      } catch {}
    })
    mt = 6
  } else mt--

  const passed = []
  candidates.forEach((el) => {
    if (!At.has(el) && isFloatingBallCandidate(el, pt)) passed.push(el)
  })
  // 同一条 DOM 包含链上可能同时命中多个候选（例如外层球容器 + 内部又是 absolute
  // 定位的图标包装层都各自达到了打分阈值）。这种情况下只保留"最外层"的一个再去
  // 捕获，避免同一个悬浮球被拆成两条记录（球容器一条、内部图标又单独一条）。
  const toCapture = passed.filter((el) => !passed.some((other) => other !== el && other.contains(el)))
  toCapture.forEach((el) => gt(el))
}
function ft() {
  Ne.autoCaptureEnabled.value &&
    "auto" === pe.getCaptureMode() &&
    (mt = 0,
      (lt = setInterval(() => {
        ;(window.parent.document.hidden || document.hidden) || Ct()
      }, 2e3)),
      (glt = setTimeout(() => Ct(!0), 300)))
}
function bt() {
  glt && clearTimeout(glt)
  ;(lt && (clearInterval(lt), (lt = null)), (glt = null))
  mt = 0
}
function vt() {
  if (0 === J.value.length) return
  ;(K++, H || (H = !0))
  const e = new Set(),
    t = (e) =>
      JSON.stringify({ scriptId: e.scriptId, elementId: e.elementId, classSelector: e.classSelector, title: e.title }),
    n = (n, a) => {
      const o = t(n.fingerprint)
      if (e.has(o)) return !0
      const i = { originalPosition: n.originalPosition, originalStyle: n.originalStyle, order: n.order }
      if (n.fingerprint.scriptId) {
        if (n.fingerprint.scriptId === pt) return (e.add(o), !0)
        const t = a.querySelectorAll(`[script_id="${n.fingerprint.scriptId}"]`)
        for (const n of t) {
          const t = n
          if (r(t, !0) && gt(t, i)) return (e.add(o), !0)
        }
        return !1
      }
      if (n.fingerprint.elementId) {
        try {
          const t = a.getElementById(n.fingerprint.elementId)
          if (t) {
            if (r(t, !0) && gt(t, i)) return (e.add(o), !0)
          }
        } catch {}
        return !1
      }
      let l = ""
      if (
        (n.fingerprint.classSelector && n.fingerprint.title
          ? (l = `${n.fingerprint.classSelector}[title="${n.fingerprint.title}"]`)
          : n.fingerprint.classSelector
            ? (l = n.fingerprint.classSelector)
            : n.fingerprint.title && (l = `[title="${n.fingerprint.title}"]`),
        l)
      )
        try {
          const t = a.querySelectorAll(l)
          for (const a of t) {
            const t = a
            if (r(t, !0)) {
              const a = Ne.extractFingerprint(t)
              if (Ne.fingerprintsMatch(a, n.fingerprint) && gt(t, i)) return (e.add(o), !0)
            }
          }
        } catch {}
      return !1
    },
    a = (o) => {
      const docs = [window.parent.document, ...collectIframeDocs()],
        i = J.value.filter((n) => !e.has(t(n.fingerprint)) && !isReleasedFp(n.fingerprint))
      for (const e of i) for (const r of docs) if (n(e, r)) break
      if (J.value.filter((n) => !e.has(t(n.fingerprint)) && !isReleasedFp(n.fingerprint)).length > 0)
        if (o < 120) {
          const d = o <= 8 ? 400 : 1500
          setTimeout(() => a(o + 1), d)
        } else Z(Ne.capturedBalls.value)
      else Z(Ne.capturedBalls.value)
    }
  setTimeout(() => a(1), 500)
}
function ht() {
  ;(Ne.initPersistence(),
    pe.initSettings(),
    edgePanelRemoveStaleArtifacts(),
    !edgePanelParentDoc.getElementById("edge-panel-viewport-fix") && (function () {
      var s = edgePanelParentDoc.createElement("style");
      s.id = "edge-panel-viewport-fix";
      s.textContent =
        "@media (min-width:769px){" +
        ".edge-panel-root--left{transform:translateY(-50%)!important;}" +
        ".edge-panel-root--right{transform:translateY(-50%)!important;}" +
        "}" +
        "@media (max-width:768px){" +
        ".edge-panel-root--left{left:0!important;transform:none!important;}" +
        ".edge-panel-root--right{left:auto!important;right:0!important;transform:none!important;}" +
        ".edge-tab--left{border-radius:0 12px 12px 0!important;}" +
        ".edge-tab--right{border-radius:12px 0 0 12px!important;}" +
        ".icon-panel--left{left:0!important;right:auto!important;border-radius:0 14px 14px 0!important;}" +
        ".icon-panel--right{right:0!important;left:auto!important;border-radius:14px 0 0 14px!important;}" +
        ".edge-tab{backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;}" +
        ".icon-panel{backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;box-shadow:0 8px 32px rgba(0,0,0,0.35)!important;}" +
        ".plugin-icon{border-radius:10px!important;}" +
        ".action-icon{border-radius:8px!important;}" +
        ".panel-header:hover{background:transparent!important;}" +
        ".edge-tab-fade-leave-active{transition:none}" +
        ".edge-tab-fade-enter-active{transition:opacity .3s ease}" +
        ".edge-tab-fade-enter-from,.edge-tab-fade-leave-to{opacity:0}" +
        "}";
      (edgePanelParentDoc.head || edgePanelParentDoc.documentElement).appendChild(s);
    })(),
    (it = edgePanelMarkOwned(edgePanelParentDoc.createElement("div"))),
    it.setAttribute("script_id", edgePanelRuntimeId),
    edgePanelParentDoc.body.appendChild(it),
    (rt = (0, o.createApp)(Je)),
    rt.mount(it),
    (function () {
      if (edgePanelParentDoc.head.querySelector(`div[script_id="${edgePanelRuntimeId}"]`)) return
      ;((edgePanelStyleHost = edgePanelMarkOwned(edgePanelParentDoc.createElement("div"))),
        edgePanelStyleHost.setAttribute("script_id", edgePanelRuntimeId),
        document.querySelectorAll("head > style").forEach((t) => {
          edgePanelStyleHost.appendChild(t.cloneNode(!0))
        }),
        edgePanelParentDoc.head.appendChild(edgePanelStyleHost))
    })(),
    ft(),
    pe.syncAutoScan(),
    st ||
      (st = setInterval(() => {
        Ne.cleanupInvalidBalls()
      }, 3e4)))
  const e = (function (e, t, n, a, o, i) {
      return (l) => {
        if (t.has(l) || l.hasAttribute("data-edge-panel-ignore")) return
        const s = Y(l)
        if (s.scriptId === e) return
        if (!s.scriptId && !s.elementId) return
        const A = n(s)
        if (A) return void (r(l) && (a(A.id, l), t.add(l)))
        const c = o(s)
        if (c && r(l)) {
          const e = { originalPosition: c.originalPosition, originalStyle: c.originalStyle, order: c.order }
          i(l, e)
        }
      }
    })(pt, At, Ne.findCapturedBallByFingerprint, Ne.updateCapturedBallElement, te, gt),
    t = (function (e, t, n, a) {
      return (o) => {
        if (e.has(o) || o.hasAttribute("data-edge-panel-ignore")) return
        const i = (function (e) {
          return e.getAttribute("script_id") || e.closest("[script_id]")?.getAttribute("script_id") || null
        })(o)
        if (i) return
        if (o.id) return
        const l = Y(o)
        if (!t(l)) return
        const s = n(l)
        if (s && r(o)) {
          const e = { originalPosition: s.originalPosition, originalStyle: s.originalStyle, order: s.order }
          a(o, e)
        }
      }
    })(At, Ne.isValidFingerprint, te, gt)
  ;(!(function (e) {
    if (Qe) return
    const t = window.parent.document
    ;((Qe = new MutationObserver((t) => {
      for (const n of t)
        if ("childList" === n.type)
          for (const t of n.addedNodes)
            if (t.nodeType === Node.ELEMENT_NODE) {
              const n = t
              // 跳过聊天正文区域：AI 流式输出时这里的 DOM 变更极其频繁，而悬浮球从不会渲染
              // 在聊天消息内容里，提前排除可以避免每次打字机刷新都触发一整轮选择器扫描
              if (n.closest && n.closest("#chat, .mes_text, .swipe_block, blockquote, pre, code")) continue
              ;(e.checkAndCaptureNewFloatingBall(n),
                e.checkAndCaptureFloatingBallByClass(n),
                n.querySelectorAll("[script_id]").forEach((t) => {
                  e.checkAndCaptureNewFloatingBall(t)
                }),
                n.querySelectorAll("[id]").forEach((t) => {
                  e.checkAndCaptureNewFloatingBall(t)
                }))
              const a = [
                ".note-save-selection-ball",
                '[class*="floating"]',
                '[class*="float"]',
                '[class*="ball"]',
                '[class*="fab"]',
                '[class*="draggable"]',
                ".ui-draggable",
                '[style*="position: absolute"]',
                '[style*="position:absolute"]',
              ]
              for (const t of a)
                try {
                  n.querySelectorAll(t).forEach((t) => {
                    e.checkAndCaptureFloatingBallByClass(t)
                  })
                } catch {}
            }
    })),
      Qe.observe(t.body, { childList: !0, subtree: !0 }))
  })({ checkAndCaptureNewFloatingBall: e, checkAndCaptureFloatingBallByClass: t }),
    (function (e) {
      et = null
      const t = tt(),
        n = nt(),
        a = at()
      ;(ot(e, !0),
        (He = new ResizeObserver(() => {
          ot(e)
        })),
        t && He.observe(t),
        n && He.observe(n),
        a && He.observe(a),
        $(window.parent).on("resize.edgePanel", () => ot(e)))
      const o = window.parent.document
      let r = t,
        i = n,
        l = a
      ;((Ze = new MutationObserver(() => {
        const t = tt(),
          n = nt(),
          a = at()
        let o = !1
        ;(t !== r && ((r = t), t && He && He.observe(t), (o = !0)),
          n !== i && ((i = n), n && He && He.observe(n), (o = !0)),
          a !== l && ((l = a), a && He && He.observe(a), (o = !0)),
          o && ot(e, !0))
      })),
        Ze.observe(o.body, { childList: !0, subtree: !0 }))
    })(Ne.setPanelLeftPosition),
    (function (e) {
      const t = edgePanelParentWin.visualViewport
      if (t) {
        ;((edgePanelViewportResizeHandler = () => ot(e, !0)),
          (edgePanelViewportScrollHandler = () => ot(e, !0)),
          t.addEventListener("resize", edgePanelViewportResizeHandler, { passive: !0 }),
          t.addEventListener("scroll", edgePanelViewportScrollHandler, { passive: !0 }))
      }
      ;((edgePanelFocusHandler = () => edgePanelSchedulePositionRefresh(e)),
        edgePanelParentDoc.addEventListener("focusin", edgePanelFocusHandler, !0),
        edgePanelParentDoc.addEventListener("focusout", edgePanelFocusHandler, !0))
    })(Ne.setPanelLeftPosition),
    (function () {
      ;((edgePanelKeyboardPointerHandler = (e) => edgePanelPreserveKeyboardToggle(e)),
        (edgePanelKeyboardClickHandler = (e) => edgePanelSuppressGuardedClick(e)),
        edgePanelParentDoc.addEventListener("pointerdown", edgePanelKeyboardPointerHandler, {
          capture: !0,
          passive: !1,
        }),
        edgePanelParentDoc.addEventListener("touchstart", edgePanelKeyboardPointerHandler, {
          capture: !0,
          passive: !1,
        }),
        edgePanelParentDoc.addEventListener("mousedown", edgePanelKeyboardPointerHandler, { capture: !0, passive: !1 }),
        edgePanelParentDoc.addEventListener("click", edgePanelKeyboardClickHandler, !0))
    })(),
    (0, o.watch)(pe.effectivePosition, () => {
      ot(Ne.setPanelLeftPosition, !0)
      try {
        window.setTimeout(() => {
          try {
            fbReorient()
          } catch (err) {}
        }, 40)
      } catch (err) {}
    }),
    vt(),
    Ne.onBallReleased((e, t, n) => {
      n && (At.delete(n), ct.delete(n))
    }),
    (0, o.watch)(Ne.isCaptureModeActive, (e, t) => {
      e && !t ? b(pt, gt, () => Ne.exitCaptureMode()) : !e && t && v()
    }))
  const n = () => {
      if (edgePanelRuntimeCleaned) return
      ;((edgePanelRuntimeCleaned = !0),
        bt(),
        v(),
        Qe && (Qe.disconnect(), (Qe = null)),
        He && (He.disconnect(), (He = null)),
        Ze && (Ze.disconnect(), (Ze = null)),
        edgePanelFrameObserver && (edgePanelFrameObserver.disconnect(), (edgePanelFrameObserver = null)),
        edgePanelArtifactMonitor &&
          (edgePanelParentWin.clearInterval(edgePanelArtifactMonitor), (edgePanelArtifactMonitor = null)),
        edgePanelHostActionObserver && (edgePanelHostActionObserver.disconnect(), (edgePanelHostActionObserver = null)),
        edgePanelHostClickHandler &&
          (edgePanelParentDoc.removeEventListener("click", edgePanelHostClickHandler, !0),
          (edgePanelHostClickHandler = null)),
        $(window).off(".edgePanelLifecycle"),
        $(window.parent).off(".edgePanelLifecycle"),
        $(window.parent).off("resize.edgePanel"))
      const e = edgePanelParentWin.visualViewport
      ;(e && edgePanelViewportResizeHandler && e.removeEventListener("resize", edgePanelViewportResizeHandler),
        e && edgePanelViewportScrollHandler && e.removeEventListener("scroll", edgePanelViewportScrollHandler),
        edgePanelFocusHandler &&
          (edgePanelParentDoc.removeEventListener("focusin", edgePanelFocusHandler, !0),
          edgePanelParentDoc.removeEventListener("focusout", edgePanelFocusHandler, !0)),
        edgePanelKeyboardPointerHandler &&
          (edgePanelParentDoc.removeEventListener("pointerdown", edgePanelKeyboardPointerHandler, !0),
          edgePanelParentDoc.removeEventListener("touchstart", edgePanelKeyboardPointerHandler, !0),
          edgePanelParentDoc.removeEventListener("mousedown", edgePanelKeyboardPointerHandler, !0)),
        edgePanelKeyboardClickHandler &&
          edgePanelParentDoc.removeEventListener("click", edgePanelKeyboardClickHandler, !0),
        (edgePanelViewportResizeHandler = null),
        (edgePanelViewportScrollHandler = null),
        (edgePanelFocusHandler = null),
        (edgePanelKeyboardPointerHandler = null),
        (edgePanelKeyboardClickHandler = null),
        (edgePanelKeyboardToggleGuardUntil = 0),
        (et = null),
        st && (clearInterval(st), (st = null)),
        Ne.releaseAllBallsWithoutSaving(),
        At.clear(),
        ct.clear(),
        rt && (rt.unmount(), (rt = null)),
        edgePanelRemoveOwnedArtifacts(),
        edgePanelClearRuntimeRegistration())
    },
    edgePanelCleanupSettings = () => {
      pe.cleanup()
    },
    edgePanelRuntimeCleanup = () => {
      ;(n(), edgePanelCleanupSettings())
    }
  ;(edgePanelRegisterRuntime(edgePanelRuntimeCleanup),
    edgePanelAttachFrameDetachWatcher(edgePanelRuntimeCleanup),
    edgePanelAttachHostActionWatchers(),
    edgePanelStartArtifactMonitor(() => {
      ot(Ne.setPanelLeftPosition, !0)
    }),
    edgePanelSchedulePositionRefresh(Ne.setPanelLeftPosition),
    $(window).on("unload.edgePanelLifecycle", edgePanelRuntimeCleanup),
    $(window.parent).on("pagehide.edgePanelLifecycle", edgePanelRuntimeCleanup),
    $(window.parent).on("beforeunload.edgePanelLifecycle", edgePanelRuntimeCleanup))
}
$(() => {
  try {
    ht()
  } catch (e) {
    console.error("[集成控件] 启动失败:", e)
  }
})
;(function () {
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
        opt.addEventListener("touchend", function (ev) { ev.preventDefault(); ev.stopPropagation(); try { pe.setPanelPosition(it[0]) } catch (e) {}; closePosMenu() }, { passive: false })
        opt.addEventListener("mousedown", function (ev) { ev.preventDefault(); ev.stopPropagation() })
        opt.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); try { pe.setPanelPosition(it[0]) } catch (e) {}; closePosMenu() })
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

    function cleanup() {
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
      $(PW).on("pagehide.fbInputEntry", cleanup)
      $(PW).on("beforeunload.fbInputEntry", cleanup)
    }
  } catch (e) {
    try {
      console.error("[输入框入口] 启动失败:", e)
    } catch (_) {}
  }
})()

export {
  gt as captureElement,
  Ne as pluginStore,
  dt as registerPlugin,
  Ct as scanFloatingBalls,
  ft as startBallScanning,
  bt as stopBallScanning,
  ut as unregisterPlugin,
}
