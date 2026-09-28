/**
 * 迷你 DOM：只为测试 panel/pagination.js 而实现，够用即可。
 *
 * 为什么不用 jsdom：项目没有也不打算为此引入依赖（脚本本身是零依赖产物）。
 * pagination.js 用到的 DOM 能力很少——createElement、children、appendChild、
 * removeChild、firstChild、classList、style、setAttribute——手写一遍即可。
 */

class ClassList {
  constructor() {
    this._set = new Set()
  }
  contains(c) {
    return this._set.has(c)
  }
  add(...cs) {
    cs.forEach((c) => this._set.add(c))
  }
  remove(...cs) {
    cs.forEach((c) => this._set.delete(c))
  }
  toggle(c, force) {
    const on = force === undefined ? !this._set.has(c) : !!force
    if (on) this._set.add(c)
    else this._set.delete(c)
    return on
  }
}

export class MiniElement {
  constructor(tag, doc) {
    this.tagName = String(tag).toUpperCase()
    this.ownerDocument = doc
    this.children = []
    this.parentNode = null
    this.style = {}
    this.attrs = new Map()
    this.classList = new ClassList()
    this.textContent = ''
  }
  get className() {
    return [...this.classList._set].join(' ')
  }
  set className(v) {
    this.classList._set = new Set(String(v).split(/\s+/).filter(Boolean))
  }
  get firstChild() {
    return this.children[0] ?? null
  }
  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child)
    child.parentNode = this
    this.children.push(child)
    return child
  }
  insertBefore(child, ref) {
    if (child.parentNode) child.parentNode.removeChild(child)
    const i = ref ? this.children.indexOf(ref) : -1
    if (i < 0) this.children.push(child)
    else this.children.splice(i, 0, child)
    child.parentNode = this
    return child
  }
  removeChild(child) {
    const i = this.children.indexOf(child)
    if (i >= 0) this.children.splice(i, 1)
    child.parentNode = null
    return child
  }
  setAttribute(k, v) {
    this.attrs.set(k, String(v))
  }
  getAttribute(k) {
    return this.attrs.has(k) ? this.attrs.get(k) : null
  }
  hasAttribute(k) {
    return this.attrs.has(k)
  }
  contains(node) {
    let n = node
    while (n) {
      if (n === this) return true
      n = n.parentNode
    }
    return false
  }
  querySelector() {
    return null // pagination 里只用于查翻页箭头，测试中视为不存在
  }
  querySelectorAll() {
    return []
  }
}

export class MiniDocument {
  constructor() {
    this.body = new MiniElement('body', this)
    this.head = new MiniElement('head', this)
    this.documentElement = new MiniElement('html', this)
    this.body.parentNode = this.documentElement
    this.head.parentNode = this.documentElement
    this._byId = new Map()
  }
  createElement(tag) {
    return new MiniElement(tag, this)
  }
  getElementById(id) {
    return this._byId.get(id) ?? null
  }
  querySelector() {
    return null
  }
}

/** 造一个「面板根容器 + 球容器」的场景，并把 window.parent.document 指向它 */
export function setupPanelEnv({ horizontal = false } = {}) {
  const doc = new MiniDocument()
  const root = doc.createElement('div')
  root.className = horizontal ? 'edge-panel-root edge-panel-root--horizontal' : 'edge-panel-root'
  const container = doc.createElement('div')
  container.className = 'captured-balls-container'
  root.appendChild(container)
  doc.body.appendChild(root)

  const prevWindow = globalThis.window
  globalThis.window = { parent: { document: doc } }
  return {
    doc,
    root,
    container,
    restore() {
      if (prevWindow === undefined) delete globalThis.window
      else globalThis.window = prevWindow
    },
  }
}

/** 造一个球元素（pagination 只把它当普通节点处理） */
export function makeBall(doc, id) {
  const el = doc.createElement('div')
  el.setAttribute('data-edge-ball-id', id)
  return el
}
