import globals from 'globals'

/**
 * 酒馆助手脚本运行环境注入的全局（平台契约，见 docs）。
 * 这些标识符由宿主 iframe 提供，不参与打包，也不能被改写。
 */
const platformGlobals = {
  Vue: 'readonly',
  $: 'readonly',
  toastr: 'readonly',
  z: 'readonly',
  getScriptId: 'readonly',
  getVariables: 'readonly',
  replaceVariables: 'readonly',
}

export default [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...platformGlobals },
    },
    rules: {
      // 拆分模块时的主要防线：漏掉的 import 会在这里暴露，
      // 否则标识符会静默退化为全局引用，只在运行时炸。
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none' }],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.nodeBuiltin,
    },
    rules: { 'no-undef': 'error', 'no-unused-vars': ['warn', { args: 'none' }] },
  },
]
