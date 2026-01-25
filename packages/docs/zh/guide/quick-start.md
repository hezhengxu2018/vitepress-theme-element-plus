---
title: 快速开始
description: 按照安装依赖、配置 VitePress、注册主题入口的步骤，几分钟内完成 VitePress Theme Element Plus 的接入。
keywords:
  - vitepress-theme-element-plus 安装
  - VitePress 快速开始
  - Element Plus 主题接入
---

# 快速开始

根据下面的步骤操作可快速获得与 Element-plus 文档网站几乎一致的渲染效果。如果有不需要的插件或配置项可自行选择。

## 安装依赖

```bash
pnpm add -D vitepress-theme-element-plus vitepress-better-demo-plugin vitepress-plugin-group-icons markdown-it-container element-plus sass-embedded
```

如果需要在 TypeScript 项目中获得更完整的提示，可额外安装 `@types/markdown-it-container`。如果不安装 `element-plus` 和 `sass-embedded` 主题无法正常渲染。

## 创建配置文件

以下片段引用自本文档网站的早期配置文件，展示了如何把主题、Markdown 插件和 Vite 行为串联在一起。
可以根据需要在此配置文件的基础上进行删改。

```ts
import type { EPThemeConfig } from 'vitepress-theme-element-plus'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdContainer from 'markdown-it-container'
import { defineConfig } from 'vitepress'
import { createDemoContainer } from 'vitepress-better-demo-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { mdExternalLinkIcon, mdTableWrapper, mdTag, mdTaskList, mdTooltip } from 'vitepress-theme-element-plus/node'
import pkg from '../package.json'

export default defineConfig<EPThemeConfig>({
  vite: {
    plugins: [
      groupIconVitePlugin(),
    ],
    ssr: {
      noExternal: [
        'vitepress-theme-element-plus',
        'vitepress-better-demo-plugin',
      ],
    },
    optimizeDeps: {
      exclude: ['vitepress-theme-element-plus'],
    },
    build: {
      cssMinify: false,
    },
  },
  // 站点配置
  title: 'VitePress Theme Element Plus',
  description: 'A modern and elegant VitePress theme',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],
  appearance: true,
  // Markdown 配置
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
        demoDir: path.resolve(
          dirname(fileURLToPath(import.meta.url)),
          '../demo',
        ),
        autoImportWrapper: false,
      }))
    },
  },
  // 全局主题配置
  themeConfig: {
    // Logo 配置
    logo: '/logo.svg',

    // 搜索配置
    search: {
      provider: 'local',
    },
    version: pkg.version,
    externalLinkIcon: true,
  },
})
```

## 注册主题入口

在 `.vitepress/theme/index.ts` 中复用主题默认导出，并把 demo 包裹组件和图标样式挂入 VitePress：

<<< @/.vitepress/theme/index.ts
