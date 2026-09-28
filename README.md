# floating-ball-storage（悬浮球收纳）

SillyTavern「酒馆助手」脚本：自动收纳页面上的悬浮球，统一管理、四向贴边。

## 来源

- 原作者：陆韵（重构版 v1.0）
- 致谢：@JessLightsEvrywhr、@路过的无聊小咸鱼（原作）
- GitHub：https://github.com/lyun00765-commits/Floating-ball-storage

## 目录

- `src/` —— 源码（多文件 ESM）
  - `index.js` —— 入口（当前仍是单文件形态，正在逐步拆分）
  - `styles/` —— 面板样式与注入
- `dist/` —— 可导入酒馆的 JSON 产物（`悬浮球收纳-v1.0.json` 为重构前的基线版本）
- `docs/` —— 评估报告与重构日志
- `scripts/` —— 构建与检查脚本

## 开发

```bash
npm install          # 首次
npm run check        # 语法 + 依赖图检查
npm run lint         # no-undef / no-unused-vars（平台全局已列入白名单）
npm run build        # 打包到 build/script.json（不入 git，供本地导入测试）
```

构建产物写入 `build/`，**不提交**；确认稳定后才人工拷入 `dist/` 作为发布版本。

## 平台契约

脚本运行在酒馆助手的 iframe 中，下列标识符由宿主注入，不参与打包：

`Vue`、`$`（jQuery）、`toastr`、`z`（zod）、`getScriptId`、`getVariables`、`replaceVariables`

外部 CDN 依赖（`klona`）通过 `import` URL 引入，esbuild 配置为 external。

## 状态

维护重构中。基线：v1.0（已导入酒馆可用）。重构稳定前不重新打包 JSON。

## 开发约定

- 本地 git 追踪，暂无远程仓库
- 提交格式 `<type>: <描述>`（feat/fix/docs/refactor/chore）
- 破坏性改动前先提交基线或打 tag
