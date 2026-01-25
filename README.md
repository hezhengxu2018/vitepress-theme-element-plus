# VitePress Theme Element Plus

VitePress Theme Element Plus is a pnpm workspace that contains a reusable Element Plus–inspired VitePress theme (`packages/theme`) and a showcase/documentation site (`packages/docs`). The theme keeps the familiar Element Plus layout, typography, and component language while exposing composable Markdown helpers, demo containers, and icon automation so multiple doc sites can share a consistent experience.

## Repository Structure

```
├─ package.json            # workspace scripts + shared tooling
├─ packages
│  ├─ theme                # VitePress theme source, styles, and node helpers
│  └─ docs                 # Reference site showing the theme in action
└─ pnpm-workspace.yaml     # declares the two workspace packages
```

- `packages/theme` ships the actual theme entry (`client`, `shared`, `styles`) plus `node` helpers (`mdExternalLinkIcon`, `mdTableWrapper`, `mdTag`, `mdTooltip`, `mdTaskList`). `tsdown` compiles these into `packages/theme/dist`.
- `packages/docs` hosts guide content, demo components, and the `.vitepress` directory that demonstrates how to wire the theme up with Markdown/Vite plugins.

## Features

- **Element Plus visual language** – Reuses Element Plus tokens and utility styles so docs match the official design system.
- **Extended layout** – Custom `Layout.vue`, local navigation, and sidebar controls that wrap the default VitePress theme.
- **Markdown enhancements** – `mdExternalLinkIcon`, `mdTableWrapper`, `mdTag`, `mdTooltip`, and `mdTaskList` add icons, scrollable tables, semantic badges, API tooltips, and Element Plus–styled checklists directly inside Markdown.
- **First-class demo workflow** – `vitepress-better-demo-plugin` powers `:::demo` containers that render live previews, collapse/expand code, copy snippets, and jump into StackBlitz/CodeSandbox.
- **Group icon automation** – `vitepress-plugin-group-icons` injects Iconify glyphs into code block headers based on keywords like `pnpm`, `vue`, or explicit `~logos:vitejs~` markers.
- **Workspace-ready tooling** – Node 24.11.0 + pnpm 10 via Volta, ESLint (`@antfu/eslint-config`), lint-staged, and Husky hooks keep formatting and commit hygiene consistent.

## Prerequisites

- Node.js 24.11.0 (managed automatically if you use Volta as recommended in `package.json`).
- pnpm 10.x (`corepack enable` or install manually).

## Installation

```bash
pnpm install
```

The root `prepare` script runs `husky install` and `pnpm run build:theme`, ensuring `packages/theme/dist` exists for downstream builds (including CI/CD environments like Cloudflare Pages).

## Common Scripts

| Command                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| `pnpm dev`                      | Launches the docs site (`pnpm -C packages/docs dev`) with hot reload. |
| `pnpm build`                    | Runs `pnpm -r build` to compile both the theme and docs.              |
| `pnpm build:theme`              | Builds only `packages/theme` via `tsdown`.                            |
| `pnpm build:docs`               | Static site build for the docs (`vitepress build`).                   |
| `pnpm -C packages/docs preview` | Preview the generated docs output locally.                            |
| `pnpm lint-staged`              | Runs ESLint auto-fixes on staged files (triggered by Husky).          |

When contributing to the theme, prefer `pnpm -C packages/theme build:watch` for faster rebuilds.

## Workflow Tips

1. **Install dependencies** – Always run `pnpm install` from the repo root so workspace links and the `prepare` hook run correctly.
2. **Develop docs** – Use `pnpm dev` to iterate on both theme and docs; VitePress will hot reload when you edit files in `packages/theme`.
3. **Validate builds** – Before opening a PR, run `pnpm build:theme` and `pnpm build:docs`, then `pnpm -C packages/docs preview` to click through demo pages (as noted in `AGENTS.md` guidelines).
4. **Commit style** – Use `pnpm commit` (czg) for Conventional Commits; lint-staged + Husky will auto-fix lintable files.

## Using the Theme in Another Project

1. Install the dependencies in your target docs project:

   ```bash
   pnpm add -D vitepress-theme-element-plus vitepress-better-demo-plugin \
     vitepress-plugin-group-icons markdown-it-container
   pnpm add -D @types/markdown-it-container # optional but recommended
   ```

2. Configure VitePress (`.vitepress/config.mts`) similar to the example in `packages/docs/.vitepress/config.mts`:

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

- **Code theming** – `markdown.theme.light/dark` is set to `github-light` and `github-dark`.
- **External link icons** – `mdExternalLinkIcon` appends a visual cue and aligns with `vp-link` styling.
- **Table wrapper** – `mdTableWrapper` adds scrollable containers so wide tables render nicely on mobile.
- **Inline tags** – `mdTag` converts patterns like `^(Beta)` into color-coded labels (e.g., `beta`, `deprecated`, `a11y`).
- **API tooltips** – `mdTooltip` turns `^[prop]("string | number")` into `<api-typing>` components for quick type hints.
- **Task lists** – `mdTaskList` renders GitHub-style checkboxes with Element Plus markup so docs inherit the framework’s checkbox visuals and accessibility.
- **Demo containers** – `::: demo` blocks point to files under `packages/docs/demo`, showing live previews with StackBlitz/CodeSandbox buttons, copy buttons, and collapsible code panes.
- **Group icons** – `groupIconMdPlugin` + `groupIconVitePlugin` map keywords or `~collection:name~` markers to Iconify glyphs and expose them via `virtual:group-icons.css`.

## Deployment Notes

- Cloudflare Pages (or any CI) should run `pnpm install` at the repo root so the workspace dependencies link correctly and `prepare` builds the theme.
- The docs build must always run **after** `packages/theme/dist` exists; if you customize CI, keep the sequence `pnpm install && pnpm run build`.
- For local sanity checks before deploying, run:
  ```bash
  pnpm build:theme
  pnpm build:docs
  pnpm -C packages/docs preview
  ```

## Contributing

1. Fork and clone the repository.
2. Run `pnpm install`.
3. Use `pnpm dev` for day-to-day development.
4. Ensure `pnpm build:theme`, `pnpm build:docs`, and linting pass.
5. Commit using `pnpm commit` (czg) to follow Conventional Commits.

Bug reports and feature requests are welcome via GitHub Issues or Discussions.

## License

MIT © Hezhengxu. See [`LICENSE`](./LICENSE) for details.
