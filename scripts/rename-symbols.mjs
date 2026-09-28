/**
 * 作用域感知的符号重命名工具。
 *
 * 重构期间大量短名（e/t/a/j/Xv/gt…）需要改成有意义的标识符，文本替换会误伤
 * 同名局部变量（例如模块级函数 j 与循环变量 j 共存）。这里用 espree + eslint-scope
 * 做真实的作用域解析，只改指向目标变量的那些标识符。
 *
 * 用法：
 *   node scripts/rename-symbols.mjs <file> OLD=NEW [OLD=NEW ...]
 *   node scripts/rename-symbols.mjs src/index.js Y=extractFingerprint j=isValidFingerprint --dry
 *
 * 只处理模块作用域（顶层）的变量/函数声明。
 */
import fs from 'node:fs'
import { parse } from 'espree'
import * as eslintScope from 'eslint-scope'

const [, , file, ...args] = process.argv
if (!file || args.filter((a) => !a.startsWith('--')).length === 0) {
  console.error('用法: node scripts/rename-symbols.mjs <file> OLD=NEW [OLD=NEW ...] [--dry]')
  process.exit(1)
}
const dry = args.includes('--dry')
const pairs = args
  .filter((a) => !a.startsWith('--'))
  .map((a) => {
    const i = a.indexOf('=')
    if (i < 1) throw new Error(`映射格式错误: ${a}`)
    return [a.slice(0, i), a.slice(i + 1)]
  })

let code = fs.readFileSync(file, 'utf8')

function topLevelVariables(src) {
  const ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true })
  const manager = eslintScope.analyze(ast, { ecmaVersion: 2022, sourceType: 'module', optimistic: true })
  const moduleScope = manager.globalScope.childScopes.find((s) => s.type === 'module') || manager.globalScope
  const byName = new Map()
  for (const v of moduleScope.variables) byName.set(v.name, v)
  return byName
}

const variables = topLevelVariables(code)
const edits = []

for (const [from, to] of pairs) {
  const variable = variables.get(from)
  if (!variable) {
    console.error(`✗ ${from}: 模块作用域内找不到该标识符`)
    process.exitCode = 1
    continue
  }
  const seen = new Set()
  const targets = [...variable.identifiers, ...variable.references.map((r) => r.identifier)]
  let n = 0
  for (const id of targets) {
    if (!id.range || seen.has(id.range[0])) continue
    seen.add(id.range[0])
    if (id.name !== from) continue
    edits.push({ start: id.range[0], end: id.range[1], to })
    n++
  }
  console.log(`  ${from} → ${to}  (${n} 处，含声明与引用)`)
}

// 从后往前替换，避免位移
edits.sort((a, b) => b.start - a.start)
for (const e of edits) code = code.slice(0, e.start) + e.to + code.slice(e.end)

if (dry) {
  console.log(`[dry-run] ${edits.length} 处未写入`)
} else {
  fs.writeFileSync(file, code)
  console.log(`✓ ${file}: 已替换 ${edits.length} 处`)
}
