/**
 * 作用域感知的重命名核心。
 *
 * 文本替换在重构期不可用：模块级 `j`（指纹校验）与循环变量 `j` 会互相误伤。
 * 这里用 espree 解析 + eslint-scope 解析作用域，只改指向目标变量的标识符。
 */
import { parse } from 'espree'
import * as eslintScope from 'eslint-scope'

/** 解析出源码中模块（顶层）作用域的所有变量名 → 变量对象 */
export function topLevelVariables(src) {
  const ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true })
  const manager = eslintScope.analyze(ast, { ecmaVersion: 2022, sourceType: 'module', optimistic: true })
  const moduleScope = manager.globalScope.childScopes.find((s) => s.type === 'module') || manager.globalScope
  const byName = new Map()
  for (const v of moduleScope.variables) byName.set(v.name, v)
  return byName
}

/**
 * 重命名模块作用域的顶层标识符。
 * @param {string} src 源码
 * @param {Array<[string,string]>} pairs [旧名, 新名]
 * @returns {{code: string, counts: Record<string, number>, missing: string[]}}
 */
export function renameSymbols(src, pairs) {
  const variables = topLevelVariables(src)
  const edits = []
  const counts = {}
  const missing = []

  for (const [from, to] of pairs) {
    const variable = variables.get(from)
    if (!variable) {
      missing.push(from)
      continue
    }
    const seen = new Set()
    let n = 0
    for (const id of [...variable.identifiers, ...variable.references.map((r) => r.identifier)]) {
      if (!id.range || seen.has(id.range[0]) || id.name !== from) continue
      seen.add(id.range[0])
      edits.push({ start: id.range[0], end: id.range[1], to })
      n++
    }
    counts[from] = n
  }

  edits.sort((a, b) => b.start - a.start)
  let code = src
  for (const e of edits) code = code.slice(0, e.start) + e.to + code.slice(e.end)
  return { code, counts, missing }
}

/**
 * 按名字抓取模块顶层的函数文本（含 `export` 前缀的也识别）。
 *
 * 支持两种形态，且两者抓到的都是「初始化的表达式」语义一致的部分：
 * - `function foo() {}`（FunctionDeclaration）
 * - `const foo = () => {}` / `const foo = function () {}`（顶层 const 的箭头/函数表达式）
 *
 * 后者的写法在搬运时可能从 `foo = ...`（const 链）变为 `const foo = ...`，
 * 因此比对时会剥掉 `const`/`export const` 前缀，只比表达式本体。
 */
export function grabFunctions(src, names) {
  const ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true })
  const out = {}
  for (const node of ast.body) {
    const decl = node.type === 'ExportNamedDeclaration' ? node.declaration : node
    if (decl?.type === 'FunctionDeclaration' && names.includes(decl.id.name)) {
      out[decl.id.name] = src.slice(decl.range[0], decl.range[1])
      continue
    }
    if (decl?.type !== 'VariableDeclaration') continue
    for (const d of decl.declarations) {
      if (!names.includes(d.id.name)) continue
      // 只接受函数/箭头函数初值；其它初值属于普通变量，不参与函数比对
      if (d.init?.type !== 'ArrowFunctionExpression' && d.init?.type !== 'FunctionExpression') continue
      out[d.id.name] = src.slice(d.init.range[0], d.init.range[1])
    }
  }
  return out
}
