/**
 * 静态检查：逐文件语法校验 + 完整打包试运行（不落盘）
 *
 * 用法：npm run check
 */
import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'src')

/** 递归收集 src 下的 .js */
function walk(dir) {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.js')) out.push(p)
  }
  return out
}

const files = walk(srcDir)
let failed = 0

for (const file of files) {
  const rel = path.relative(root, file)
  try {
    await esbuild.transform(fs.readFileSync(file, 'utf8'), { loader: 'js', format: 'esm' })
  } catch (e) {
    failed++
    console.error(`✗ ${rel}\n${e.message}`)
  }
}

if (failed === 0) console.log(`✓ ${files.length} 个文件语法通过`)

// 完整打包试运行：能出产物才算依赖图正确
try {
  await esbuild.build({
    entryPoints: [path.join(srcDir, 'index.js')],
    bundle: true,
    format: 'esm',
    target: ['es2021'],
    charset: 'utf8',
    external: ['https://*', 'http://*'],
    loader: { '.css': 'text' },
    write: false,
    logLevel: 'warning',
  })
  console.log('✓ 依赖图完整，可打包')
} catch {
  process.exitCode = 1
}

if (failed) process.exitCode = 1
