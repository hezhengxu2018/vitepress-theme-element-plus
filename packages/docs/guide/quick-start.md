# 快速开始

根据下面的步骤操作可快速获得与 Element-plus 文档网站几乎一致的渲染效果。如果有不需要的插件或配置项可自行选择。

## 安装依赖

```bash
pnpm add -D vitepress-theme-element-plus vitepress-better-demo-plugin vitepress-plugin-group-icons markdown-it-container
```
如果需要在 TypeScript 项目中获得更完整的提示，可额外安装 `@types/markdown-it-container`。

## 创建配置文件

以下片段摘自 `packages/docs/.vitepress/config.mts`，展示了如何把主题、Markdown 插件和 Vite 行为串联在一起：

```ts
// .vitepress/config.mts
import type { EPThemeConfig } from 'vitepress-theme-element-plus'
import path from 'node:path'
import mdContainer from 'markdown-it-container'
import { defineConfig } from 'vitepress'
import { createDemoContainer } from 'vitepress-better-demo-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { mdExternalLinkIcon, mdTableWrapper, mdTag, mdTaskList, mdTooltip } from 'vitepress-theme-element-plus/node'

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
      md.use(mdTableWrapper)
      md.use(mdTaskList, {
        disabled: false,
      })
      md.use(mdContainer, 'demo', createDemoContainer(md, {
        demoDir: path.resolve(__dirname, '../demo'),
        autoImportWrapper: false,
      }))
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    search: { provider: 'local' },
    sidebar: [/* ... */],
  },
})
```

## 注册主题入口
在 `.vitepress/theme/index.ts` 中复用主题默认导出，并把 demo 包裹组件和图标样式挂入 VitePress：

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
}
```
