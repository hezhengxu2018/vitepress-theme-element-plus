# VitePress Theme Element Plus

- [简体中文 README](README.md)

- [Doc site](https://vitepress-theme-element-plus.silver-fe.dev)

## Overview
VitePress Theme Element Plus is a reusable Element Plus–inspired VitePress theme. The theme mirrors Element Plus layout, typography, and component language while exposing composable Markdown helpers, demo containers, and icon automation so multiple doc sites can keep a consistent experience.

## Features
- **Element Plus visual language** – Reuses Element Plus tokens and utility styles so docs match the official design system.
- **Extended layout** – Custom `Layout.vue`, local navigation, and sidebar controls wrap the default VitePress theme.
- **Markdown enhancements** – Helpers add icons, scrollable tables, semantic badges, tooltips, and Element Plus–styled task lists directly inside Markdown.
- **First-class demo workflow** – `vitepress-better-demo-plugin` powers `:::demo` containers with live previews, foldable code, copy buttons, and StackBlitz/CodeSandbox links.
- **Group icon automation** – `vitepress-plugin-group-icons` injects Iconify glyphs into code block headers based on keywords like `pnpm`, `vue`, or `~logos:vitejs~` markers.
- **Workspace-ready tooling** – Node 24.11.0 + pnpm 10 via Volta, ESLint (`@antfu/eslint-config`), lint-staged, and Husky keep formatting and commit hygiene consistent.

## Getting Started

1. Install the dependencies in your target docs project:
   ```bash
   pnpm add -D vitepress-theme-element-plus vitepress-better-demo-plugin \
     vitepress-plugin-group-icons markdown-it-container
   pnpm add -D @types/markdown-it-container # optional but recommended
   ```
2. Configure VitePress (`.vitepress/config.mts`) similar to `packages/docs/.vitepress/config.mts`:
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
3. Register the theme in `.vitepress/theme/index.ts` so demo components and generated icon CSS load on both client and build outputs:
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

## Markdown & Demo Enhancements
- **Code theming** – `markdown.theme.light/dark` set to `github-light` / `github-dark`.
- **External link icons** – `mdExternalLinkIcon` adds a visual cue aligned with `vp-link` styling.
- **Table wrapper** – `mdTableWrapper` adds scrollable containers so wide tables render nicely on mobile.
- **Inline tags** – `mdTag` converts markers like `^(Beta)` into color-coded labels (e.g., `beta`, `deprecated`, `a11y`).
- **API tooltips** – `mdTooltip` turns `^[prop]("string | number")` into `<api-typing>` components for quick type hints.
- **Task lists** – `mdTaskList` renders GitHub-style checkboxes with Element Plus visuals and accessibility.
- **Demo containers** – `::: demo` blocks under `packages/docs/demo` show live previews with copy buttons and StackBlitz/CodeSandbox quick links.
- **Group icons** – `groupIconMdPlugin` + `groupIconVitePlugin` map keywords or `~collection:name~` markers to Iconify glyphs and expose them via `virtual:group-icons.css`.

## Contributing
1. Fork and clone the repository.
2. Run `pnpm install`.
3. Use `pnpm dev` for day-to-day development.
4. Ensure `pnpm build:theme`, `pnpm build:docs`, and linting pass.
5. Commit using `pnpm commit` (czg) to follow Conventional Commits.

## License
MIT © Hezhengxu. See [`LICENSE`](./LICENSE).
