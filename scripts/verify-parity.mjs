/**
 * 等价性校验：证明「搬运 + 重命名」没有改变函数体。
 *
 * 做法：取基线版本的 index.js，施加与重构时相同的重命名映射，再与拆分后的
 * 模块逐字节比对函数体。这样即使重构过程改过名字，也能严格证明代码未被改动。
 *
 * 用法：node scripts/verify-parity.mjs scripts/parity/<spec>.json
 *
 * spec.json:
 * {
 *   "base": "9a96308",                    // git ref
 *   "file": "src/panel/pagination.js",    // 拆分后的模块
 *   "rename": { "S": "ballContainer" },   // 旧名 -> 新名
 *   "expect": {                           // 新模块中的函数名 -> 基线中的函数名（可省略，默认同名）
 *     "appendBall": "fbAppendBall"
 *   }
 * }
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { renameSymbols, grabFunctions } from './lib/rename.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const specPath = process.argv[2]
if (!specPath) {
  console.error('用法: node scripts/verify-parity.mjs <spec.json>')
  process.exit(1)
}
const spec = JSON.parse(fs.readFileSync(path.resolve(root, specPath), 'utf8'))

const baseSrc = execSync(`git show ${spec.base}:src/index.js`, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
const { code: renamed, missing } = renameSymbols(baseSrc, Object.entries(spec.rename || {}))
if (missing.length) {
  console.error(`✗ 基线中找不到这些标识符: ${missing.join(', ')}`)
  process.exit(1)
}

const expect = spec.expect || {}
const names = Object.keys(expect)
const oldNames = names.map((n) => expect[n] ?? n)

const newSrc = fs.readFileSync(path.join(root, spec.file), 'utf8')
const oldFns = grabFunctions(renamed, names)
const newFns = grabFunctions(newSrc, names)

let bad = 0
let ok = 0
for (const name of names) {
  const oldName = expect[name] ?? name
  const oldText = oldFns[name]
  const newText = newFns[name]
  if (!oldText) { console.error(`✗ 基线中找不到函数 ${name}（重命名后应为该名）`); bad++; continue }
  if (!newText) { console.error(`✗ ${spec.file} 中找不到函数 ${name}`); bad++; continue }
  if (oldText !== newText) {
    bad++
    console.error(`✗ ${name} 函数体不一致`)
    const a = oldText.split('\n')
    const b = newText.split('\n')
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) {
        console.error(`   首个差异在第 ${i + 1} 行\n   基线: ${a[i]}\n   现在: ${b[i]}`)
        break
      }
    }
  } else ok++
}

console.log(`${bad === 0 ? '✓' : '✗'} ${spec.file}: ${ok}/${names.length} 个函数与基线逐字节一致`)
process.exitCode = bad ? 1 : 0
