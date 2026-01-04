# Vitepress 插件

为保持风格与官方文档一致，你需要自行安装、配置两个插件，如果不在意风格完全一致可以忽略。

## `vitepress-better-demo-plugin`

完整配置项可参考[官方文档](https://vitepress-better-demo-plugin.pages.dev/)

自定义的 `demoDir`（示例为 `packages/docs/demo`）会被扫描，你可以在该目录下放入 `*.vue`、`*.tsx` 等组件，随后在 Markdown 里通过容器引用：
```md
::: demo 这里可以补充示例描述、交互说明等内容。
demo/demo.vue
:::
```
插件会自动生成实时预览、代码折叠、复制按钮以及 StackBlitz / CodeSandbox / Github / Gitlab 快捷入口；借助 `tab.order`、`stackblitz` 等选项可以按需裁剪功能。
由于 `autoImportWrapper: false`，需要像示例主题入口那样显式注册 `VitepressDemoBox` 与 `VitepressDemoPlaceholder`，从而继承 Element Plus 风格的示例外观。

## `vitepress-plugin-group-icons`

完整配置项可参考[官方文档](https://vp.yuy1n.io/)

Markdown 插件 `groupIconMdPlugin` 会为代码块标题和 `::: code-group` 内的标签注入 `data-title`，Vite 插件部分随后根据这些标题生成 `virtual:group-icons.css`，自动给 `pnpm`、`vue`、`vite` 等常见关键字匹配合适的 Iconify 图标。

你可以在代码块信息字符串中直接书写关键字：
  ```bash [pnpm install]
  pnpm add vitepress-theme-element-plus
  ```
  也可以使用 `~collection:name~` 指定任意 Iconify 图标，示例：
  ```ts [setup ~logos:vitejs~]
  import { createApp } from 'vue'
  ```
若需要在多语言代码组中共享图标，只需在 `::: code-group` 的 `label` 中添加相同写法；插件会监听热更新并在编辑时立即刷新对应 CSS。
主题入口中的 `import 'virtual:group-icons.css'` 必不可少，它确保生成的 CSS 会注入到客户端与构建产物中。

通过以上配置，就能完整复现 `packages/docs/.vitepress/config.mts` 中的主题行为，并在此基础上自由拓展。若需扩展新的 Markdown 插件或调整文档导航，只需在配置文件中继续添加即可。
