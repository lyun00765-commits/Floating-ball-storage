/**
 * 构建：src/ 多文件源码 → 单文件 ESM → 注入酒馆脚本 JSON
 *
 * 产物写入 build/（不入 git）。确认稳定后再人工拷入 dist/ 作为发布版本。
 * 用法：npm run build
 */
import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'build')
const bundleFile = path.join(outDir, 'bundle.js')
const scriptFile = path.join(outDir, 'script.json')

// 酒馆脚本运行在宿主 iframe 内，平台注入的全局（Vue/$/toastr/z/getScriptId…）
// 与外部 CDN 依赖都不参与打包。
const EXTERNAL = ['https://*', 'http://*']

fs.mkdirSync(outDir, { recursive: true })

const result = await esbuild.build({
  entryPoints: [path.join(root, 'src/index.js')],
  bundle: true,
  format: 'esm',
  target: ['es2021'],
  charset: 'utf8',
  external: EXTERNAL,
  loader: { '.css': 'text' },
  outfile: bundleFile,
  minify: false,
  keepNames: true,
  metafile: true,
  logLevel: 'warning',
})

const code = fs.readFileSync(bundleFile, 'utf8')
const meta = JSON.parse(fs.readFileSync(path.join(root, 'scripts/template.json'), 'utf8'))
const script = { ...meta, content: code }
fs.writeFileSync(scriptFile, JSON.stringify(script, null, 2) + '\n')

const kb = (n) => (n / 1024).toFixed(1) + ' KB'
const outputs = Object.values(result.metafile.outputs)[0]
console.log(`源码  ${kb(outputs.inputBytes ?? 0)} → bundle ${kb(code.length)} → script.json ${kb(fs.statSync(scriptFile).size)}`)
