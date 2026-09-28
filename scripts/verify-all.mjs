/** 依次执行 scripts/parity/ 下所有等价性规格 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'scripts/parity')
const specs = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()

let failed = 0
for (const spec of specs) {
  try {
    process.stdout.write(execFileSync('node', ['scripts/verify-parity.mjs', path.join('scripts/parity', spec)], { cwd: root, encoding: 'utf8' }))
  } catch (e) {
    failed++
    process.stdout.write((e.stdout || '') + (e.stderr || e.message) + '\n')
  }
}
console.log(failed === 0 ? `\n全部 ${specs.length} 份规格通过` : `\n${failed}/${specs.length} 份规格失败`)
process.exitCode = failed ? 1 : 0
