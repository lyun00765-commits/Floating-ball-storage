/**
 * 作用域感知的符号重命名（CLI）。
 *
 * 用法：
 *   node scripts/rename-symbols.mjs <file> OLD=NEW [OLD=NEW ...] [--dry]
 *   node scripts/rename-symbols.mjs src/index.js Y=extractFingerprint j=isValidFingerprint --dry
 *
 * 只处理模块作用域（顶层）的变量/函数声明，同名局部变量不受影响。
 */
import fs from 'node:fs'
import { renameSymbols } from './lib/rename.js'

const [, , file, ...args] = process.argv
const pairs = args
  .filter((a) => !a.startsWith('--'))
  .map((a) => {
    const i = a.indexOf('=')
    if (i < 1) throw new Error(`映射格式错误: ${a}`)
    return [a.slice(0, i), a.slice(i + 1)]
  })

if (!file || pairs.length === 0) {
  console.error('用法: node scripts/rename-symbols.mjs <file> OLD=NEW [OLD=NEW ...] [--dry]')
  process.exit(1)
}

const dry = args.includes('--dry')
const src = fs.readFileSync(file, 'utf8')
const { code, counts, missing } = renameSymbols(src, pairs)

let total = 0
for (const [from, to] of pairs) {
  if (missing.includes(from)) {
    console.error(`  ✗ ${from}: 模块作用域内找不到该标识符`)
    process.exitCode = 1
    continue
  }
  console.log(`  ${from} → ${to}  (${counts[from]} 处，含声明与引用)`)
  total += counts[from]
}

if (dry) {
  console.log(`[dry-run] 共 ${total} 处，未写入`)
} else {
  fs.writeFileSync(file, code)
  console.log(`✓ ${file}: 已替换 ${total} 处`)
}
