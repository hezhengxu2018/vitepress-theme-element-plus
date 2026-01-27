# VitePress Theme Element Plus

- [English README](README.en.md)

- [在线文档](https://vitepress-theme-element-plus.silver-fe.dev)

## 概览
VitePress Theme Element Plus 是一个可复用的 Element Plus 风格 VitePress 主题（`packages/theme`）。主题延续了 Element Plus 的布局、排版和组件语言，并提供多种 Markdown 增强、演示容器和图标自动化能力，帮助多个站点复用一致的写作体验。

## 功能亮点
- **Element Plus 视觉语言**：复用 Element Plus 设计令文档与官方体系保持一致。
- **扩展布局**：自定义 `Layout.vue`、局部导航与侧边栏控制，在默认 VitePress 主题之上增强。
- **Markdown 增强**：插件直接在 Markdown 中追加外链图标、可滚动表格、语义标签、API 提示和 Element Plus 风格任务列表。
- **一流的 Demo 工作流**：`vitepress-better-demo-plugin` 驱动 `:::demo` 容器，支持实时预览、折叠代码、复制按钮以及 StackBlitz/CodeSandbox 快捷入口。
- **图标自动化**：`vitepress-plugin-group-icons` 基于 `pnpm`、`vue` 或 `~logos:vitejs~` 等关键字自动注入 Iconify 图标，统一代码块视觉。
- **工作区工具链**：依赖 Node 24.11.0 + pnpm 10（通过 Volta 管理），配合 ESLint（`@antfu/eslint-config`）、lint-staged 与 Husky 保持格式与提交规范。

## 快速开始
1. 在目标文档项目中安装依赖：
   ```bash
   pnpm add -D vitepress-theme-element-plus vitepress-better-demo-plugin \
     vitepress-plugin-group-icons markdown-it-container
   pnpm add -D @types/markdown-it-container # 建议安装以获得类型提示
   ```
2. 参考 `packages/docs/.vitepress/config.mts` 配置 VitePress：
   ```ts
   import type { EPThemeConfig } from 'vitepress-theme-element-plus'
   import path from 'node:path'
   import mdContainer from 'markdown-it-container'
   import { defineConfig } from 'vitepress'
   import { createDemoContainer } from 'vitepress-better-demo-plugin'
   import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
   import {
     mdExternalLinkIcon,
     mdTableWrapper,
     mdTag,
     mdTaskList,
     mdTooltip,
   } from 'vitepress-theme-element-plus/node'

   export default defineConfig<EPThemeConfig>({
     vite: {
       plugins: [groupIconVitePlugin()],
       ssr: {
         noExternal: [
           'vitepress-theme-element-plus',
           'vitepress-better-demo-plugin',
         ],
       },
       optimizeDeps: { exclude: ['vitepress-theme-element-plus'] },
     },
     markdown: {
       config(md) {
         md.use(groupIconMdPlugin)
         md.use(mdExternalLinkIcon)
         md.use(mdTag)
         md.use(mdTooltip)
         md.use(mdTaskList)
         md.use(mdTableWrapper)
         md.use(mdContainer, 'demo', createDemoContainer(md, {
           demoDir: path.resolve(__dirname, '../demo'),
           autoImportWrapper: false,
         }))
       },
     },
     themeConfig: {
       logo: '/logo.svg',
       search: { provider: 'local' },
       sidebar: [{ text: 'Guide', items: [{ text: 'Introduction', link: '/guide/introduction' }] }],
     },
   })
   ```
3. 在 `.vitepress/theme/index.ts` 注册主题，确保 demo 组件与自动生成的图标 CSS 在客户端与构建阶段均可用：
   ```ts
   import {
     VitepressEpDemoBox,
     VitepressEpDemoPlaceholder,
   } from 'vitepress-better-demo-plugin/theme/element-plus'
   import Theme from 'vitepress-theme-element-plus'
   import 'virtual:group-icons.css'

   export default {
     ...Theme,
     enhanceApp({ app }) {
       app.component('VitepressDemoBox', VitepressEpDemoBox)
       app.component('VitepressDemoPlaceholder', VitepressEpDemoPlaceholder)
     },
   } as typeof Theme
   ```

## Markdown 与演示增强
- **代码主题**：`markdown.theme.light/dark` 分别配置为 `github-light` 与 `github-dark`。
- **外链图标**：`mdExternalLinkIcon` 为所有外部链接追加 `vp-link` 风格提示。
- **表格容器**：`mdTableWrapper` 为宽表格添加滚动容器，改善移动端体验。
- **内联标签**：`mdTag` 识别 `^(Beta)` 等标记并渲染彩色标签（如 `beta`、`deprecated`、`a11y`）。
- **API 提示**：`mdTooltip` 将 `^[prop]("string | number")` 转换为 `<api-typing>` 组件，快速展示类型信息。
- **任务列表**：`mdTaskList` 输出 Element Plus 风格的复选框，兼顾无障碍表现。
- **Demo 容器**：`packages/docs/demo` 下的 `::: demo` 块支持实时预览、复制按钮以及 StackBlitz/CodeSandbox 快捷入口。
- **图标分组**：`groupIconMdPlugin` + `groupIconVitePlugin` 基于关键字或 `~collection:name~` 自动注入 Iconify 图标并通过 `virtual:group-icons.css` 暴露样式。

## 贡献指南
1. Fork 并克隆仓库。
2. 执行 `pnpm install` 安装依赖。
3. 日常开发运行 `pnpm dev`。
4. 确认 `pnpm build:theme`、`pnpm build:docs` 与 lint 全部通过。
5. 使用 `pnpm commit`（czg）遵循 Conventional Commits 规范。

## 许可证
MIT © Hezhengxu，详见 [`LICENSE`](./LICENSE)。
