# 介绍

这是一个 Element Plus 视觉规范的 VitePress 主题，主要诉求是在多套组件文档之间保持一致的观感与交互。主题本身尽量保持轻量，所有 Markdown 能力、站点配置和 Vite 扩展都通过显式配置完成，便于按需取舍。可以直接参考 `packages/docs/.vitepress/config.mts` 获得最完整的示例。

::: tip 提示
本主题基于 Vitepress 2.x 开发，请勿与 1.x 混用。
:::

## 快速开始

### 安装依赖

```bash
pnpm add -D vitepress-theme-element-plus vitepress-better-demo-plugin vitepress-plugin-group-icons markdown-it-container
```
如果需要在 TypeScript 项目中获得更完整的提示，可额外安装 `@types/markdown-it-container`。

### 创建配置文件

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

### 注册主题入口
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

## 配置项

本主题与官方主题的配置项几乎保持一致，目前仅额外添加version字段

## Markdown 增强

以下插件可根据需要安装，如果全部安装可直接复制上方的配置项

### 链接与表格

``` ts
import { mdExternalLinkIcon, mdTableWrapper } from 'vitepress-theme-element-plus/node'
```

`mdExternalLinkIcon` 为外链附加图标且统一 `vp-link` 样式；`mdTableWrapper` 会把表格包裹在 `.vp-table` 中以获得横向滚动与统一线条。

### 标签语法

``` ts
import { mdTag } from 'vitepress-theme-element-plus/node'
```

`mdTag` 允许在文本中写 `^(Beta)`、`^(deprecated)` 等标签，渲染为彩色圆角徽标；对于 `beta`、`deprecated`、`a11y`、`required` 等特殊值会自动附带语义类名。

### API Tooltip

``` ts
import { mdTooltip } from 'vitepress-theme-element-plus/node'
```

`mdTooltip` 解析
``` md
^[属性类型]`描述`
```
这样的语法，生成 `<api-typing>` 组件，常用于 API 表格里说明类型或补充信息。

### 任务列表

``` ts
import { mdTaskList } from 'vitepress-theme-element-plus/node'
```

element-plus风格的任务列表。完整的配置类型声明如下：

``` ts
export interface ElementPlusTaskListOptions {
  disabled?: boolean
  itemClass?: string
  listClass?: string
  checkboxClass?: string
  labelClass?: string
}
```

大部分情况下只需要配置disabled属性即可。

## 插件特性

::: warning 提示
本文档额外使用了两个独立的依赖，没有将其集成在插件内，如果不使用部分功能与`element-plus`无法保持一致。
:::

### `vitepress-better-demo-plugin`

完整配置项可参考[官方文档](https://vitepress-better-demo-plugin.pages.dev/)

自定义的 `demoDir`（示例为 `packages/docs/demo`）会被扫描，你可以在该目录下放入 `*.vue`、`*.tsx` 等组件，随后在 Markdown 里通过容器引用：
```md
::: demo 这里可以补充示例描述、交互说明等内容。
demo/demo.vue
:::
```
插件会自动生成实时预览、代码折叠、复制按钮以及 StackBlitz / CodeSandbox / Github / Gitlab 快捷入口；借助 `tab.order`、`stackblitz` 等选项可以按需裁剪功能。
由于 `autoImportWrapper: false`，需要像示例主题入口那样显式注册 `VitepressDemoBox` 与 `VitepressDemoPlaceholder`，从而继承 Element Plus 风格的示例外观。

### `vitepress-plugin-group-icons`

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
