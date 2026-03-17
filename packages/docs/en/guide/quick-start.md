---
title: Quick Start
description: Install dependencies, configure VitePress, and register the theme to get VitePress Theme Element Plus running in minutes.
keywords:
  - vitepress-theme-element-plus install
  - VitePress quick start
  - Element Plus theme setup
---

# Quick Start

Follow these steps to get a look and feel very close to the Element Plus docs. You can remove any plugins or options you do not need.

## Install dependencies

```bash
pnpm add -D vitepress-theme-element-plus vitepress-better-demo-plugin vitepress-plugin-group-icons markdown-it-container element-plus sass-embedded
```

If you want better TypeScript hints, also install `@types/markdown-it-container`. The theme will not render correctly without `element-plus` and `sass-embedded`.

## Create the config

The snippet below is taken from an earlier version of this site's config. It shows how to wire the theme, Markdown plugins, and Vite options together. Feel free to trim or adjust as needed.

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
  // Site config
  title: 'VitePress Theme Element Plus',
  description: 'A modern and elegant VitePress theme',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],
  appearance: true,
  // Markdown config
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
  // Theme config
  themeConfig: {
    // Logo
    logo: '/logo.svg',

    // Search
    search: {
      provider: 'local',
    },
    version: pkg.version,
    mobilePreview: {
      previewPath: '/preview/',
      deviceWidth: 390,
      deviceHeight: 760,
      demoRoot: 'demo/',
    },
    externalLinkIcon: true,
  },
})
```

## Register the theme entry

In `.vitepress/theme/index.ts`, reuse the theme's default export and register the demo wrapper component plus icon styles:

<<< @/.vitepress/theme/index.ts

If you want mobile previews, the same theme entry should also provide `mobilePreviewRegistryKey`. The example site builds the registry with `import.meta.glob('../../**/*.vue')`, so `mobileDemo` can resolve components relative to `themeConfig.mobilePreview.demoRoot`.

## Mobile Preview

For the complete setup, see [Mobile Preview](/en/guide/mobile-preview).
