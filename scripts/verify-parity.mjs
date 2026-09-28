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
 *   },
 *   "rewrites": {                         // 有意改写：先施加到基线的函数体上，再比对
 *     "isFloatingBallCandidate": [
 *       { "desc": "排除正则抽到 name-exclusions.js", "find": "...", "replace": "..." }
 *     ]
 *   }
 * }
 *
 * rewrites 的用途：当重构不只是搬运（比如把内联正则抽成共享常量、把状态私有化），
 * 逐字节比对必然失败。此时把**有意为之的改写**显式登记下来，工具会先把同样的
 * 改写施加到基线函数体上再比对——这样"改写"是被审阅过的、可复现的，
 * 而不是用一句"已知差异"糊过去。
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

const newSrc = fs.readFileSync(path.join(root, spec.file), 'utf8')
const oldFns = grabFunctions(renamed, names)
const newFns = grabFunctions(newSrc, names)

let bad = 0
let ok = 0
/**
 * 逐行比较：允许整体缩进差异（搬运时对象方法会整体减 2 格），其余必须完全一致。
 *
 * 注释行不参与比较：注释只说明「为什么」，不影响行为，补注释或改写注释
 * 都不该让等价性证明失败。若要改的恰恰是代码，仍会被如实检出。
 * （行尾注释因其所在行含代码，仍参与比较。）
 */
function isCommentLine(line) {
  const l = line.trim()
  return !l || l.startsWith('//') || l.startsWith('/*') || l.startsWith('*')
}
function compareLines(oldText, newText) {
  const strip = (t) => {
    const raw = t
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => !isCommentLine(l))
    // 把跨行的空 catch 折叠回单行写法：`catch {` + `}` 与 `catch {}` 语义相同，
    // 差别只来自「有没有在 catch 块里写注释」，不应判为不一致。
    const out = []
    for (let i = 0; i < raw.length; i++) {
      if (/catch\s*\{\s*$/.test(raw[i]) && raw[i + 1] === '}') {
        out.push(raw[i].replace(/\s*\{\s*$/, '') + ' {}')
        i++
        continue
      }
      out.push(raw[i])
    }
    return out
  }
  const a = strip(oldText)
  const b = strip(newText)
  const mismatch = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i]
    const y = b[i]
    // 允许基线结尾的 `},`（const 链）对应新模块的 `}`
    const looselySame = (x ?? '').replace(/,$/, '') === (y ?? '').replace(/,$/, '')
    if (x !== y && !looselySame) mismatch.push(i)
  }
  return mismatch
}

const rewrites = spec.rewrites || {}
let rewritten = 0

for (const name of names) {
  let oldText = oldFns[name]
  const newText = newFns[name]
  for (const rw of rewrites[name] || []) {
    if (!oldText.includes(rw.find)) {
      console.error(`✗ ${name}: 改写「${rw.desc}」的 find 片段在基线里找不到（规格写错了？）`)
      bad++
      oldText = null
      break
    }
    oldText = oldText.split(rw.find).join(rw.replace)
    rewritten++
  }
  if (oldText === null) continue
  if (!oldText) { console.error(`✗ 基线中找不到函数 ${name}（重命名后应为该名）`); bad++; continue }
  if (!newText) { console.error(`✗ ${spec.file} 中找不到函数 ${name}`); bad++; continue }
  const mismatch = compareLines(oldText, newText)
  if (mismatch.length) {
    bad++
    console.error(`✗ ${name} 函数体不一致（${mismatch.length} 处）`)
    const a = oldText.split('\n')
    const b = newText.split('\n')
    for (const i of mismatch.slice(0, 5)) {
      console.error(`   差异在第 ${i + 1} 行\n   基线: ${a[i]}\n   现在: ${b[i]}`)
    }
  } else ok++
}

const rwNote = rewritten ? `（施加了 ${rewritten} 处已登记的有意改写）` : ''
console.log(`${bad === 0 ? '✓' : '✗'} ${spec.file}: ${ok}/${names.length} 个函数与基线一致${rwNote}`)
process.exitCode = bad ? 1 : 0
