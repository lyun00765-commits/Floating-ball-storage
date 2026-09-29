# floating-ball-storage（悬浮球收纳）

SillyTavern「酒馆助手」脚本：自动收纳页面上的悬浮球，统一管理、四向贴边。

## 来源

- 原作者：陆韵（重构版）
- 致谢：@JessLightsEvrywhr、@路过的无聊小咸鱼（原作）
- GitHub：https://github.com/lyun00765-commits/Floating-ball-storage

## 目录

- `src/` —— 源码（多文件 ESM，29 个模块）
  - `index.js` —— 入口与装配（依赖注入、组件挂载、生命周期）
  - `capture/` —— 悬浮球识别与捕获（手动点选 / 自动扫描）
  - `panel/` —— 面板装配、分页、几何定位、观察者
  - `persist/` —— 脚本变量持久化（已收纳列表、释放记忆）
  - `core/` —— 无状态工具（DOM/跨 iframe、指纹、颜色、平台接口）
  - `styles/`、`ui/`、`theme.js` —— 样式注入与界面
- `dist/` —— 可导入酒馆的 JSON 产物
  - `悬浮球收纳-v1.0.json` —— 重构前的基线版本（备份）
  - `悬浮球收纳-v1.1.json` —— 重构发布版（备份）
  - `悬浮球收纳-v1.2.json` —— 当前发布版
- `docs/` —— 评估报告、重构日志、交接文档、测试清单
- `scripts/` —— 构建、检查、等价性校验脚本
- `test/` —— 单元测试

## 开发

```bash
npm install          # 首次
npm run check        # 语法 + 依赖图检查
npm run lint         # no-undef / no-unused-vars（平台全局已列入白名单）
npm run test         # 单元测试
npm run verify       # 等价性校验：证明拆分后的代码与基线逐行一致
npm run build        # 打包到 build/script.json（不入 git，供本地导入测试）
```

构建产物写入 `build/`，**不提交**；确认稳定后人工拷入 `dist/` 作为发布版本。

### 等价性校验（`npm run verify`）

`scripts/parity/*.json` 为每个模块保存了「基线版本 + 重命名映射 + 有意改写清单」。
校验时把基线函数体施加同样改写再与当前代码逐行比对，从而证明拆分过程没有夹带
行为变更。注释行不参与比对（注释不影响行为）；确需改动代码时，在该模块的规格里
登记一条 `rewrites`，写明理由。

## 平台契约

脚本运行在酒馆助手的 iframe 中，下列标识符由宿主注入，不参与打包：

`Vue`、`$`（jQuery）、`toastr`、`z`（zod）、`getScriptId`、`getVariables`、`replaceVariables`

外部 CDN 依赖（`klona`）通过 `import` URL 引入，esbuild 配置为 external。

## 状态

**v1.2 已发布。** 4132 行的单文件产物已拆分为 29 个模块；
等价性校验全绿（15 份规格）、单元测试 28 项通过。

已知限制见 `docs/04-测试清单.md` 的「已知限制」一节，设计决策见
`docs/03-交接与后续计划.md`。

## 版本

- **v1.2**（当前）—— 详见 `CHANGELOG.md`
- v1.1 —— 重构发布版（拆分模块 + 等价性校验体系）
- v1.0 —— 重构前基线，单文件产物

## 开发约定

- 本地 git 追踪，暂无远程仓库
- 提交格式 `<type>: <描述>`（feat/fix/docs/refactor/chore）
- 破坏性改动前先提交基线或打 tag
- **改代码前先读 `docs/03-交接与后续计划.md`**：里面记着若干「看起来奇怪但有意为之」的设计
