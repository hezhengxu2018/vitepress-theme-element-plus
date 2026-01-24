---
title: VitePress Plugins
description: Configure vitepress-better-demo-plugin and vitepress-plugin-group-icons to reuse Element Plus styled demo containers and code block icons.
keywords:
  - vitepress-better-demo-plugin
  - vitepress-plugin-group-icons
  - VitePress plugin recommendations
---

# VitePress Plugins

To keep the look aligned with the official docs, install and configure the two plugins below. If you do not need pixel-perfect alignment, you can skip them.

## `vitepress-better-demo-plugin`

See the [official docs](https://vitepress-better-demo-plugin.pages.dev/) for full options.

The custom `demoDir` (for example `packages/docs/demo`) is scanned for `*.vue`, `*.tsx`, etc. You can then reference demos in Markdown using the container syntax:

```md
::: demo Add a short description or interaction notes here.
demo/demo.vue
:::
```

The plugin generates a live preview, code folding, copy buttons, and StackBlitz / CodeSandbox / GitHub / GitLab shortcuts. You can trim features with options like `tab.order` and `stackblitz`.

Because `autoImportWrapper: false` is set, you must explicitly register `VitepressDemoBox` and `VitepressDemoPlaceholder` (as in the theme entry) to inherit the Element Plus styled demo wrapper.

## `vitepress-plugin-group-icons`

See the [official docs](https://vp.yuy1n.io/) for full options.

The Markdown plugin `groupIconMdPlugin` injects `data-title` into code block titles and `::: code-group` labels. The Vite plugin then generates `virtual:group-icons.css` so common keywords like `pnpm`, `vue`, or `vite` automatically map to Iconify icons.

You can write a keyword directly in the code block info string:

```bash [pnpm install]
pnpm add vitepress-theme-element-plus
```

Or specify any Iconify icon with `~collection:name~`, for example:

```ts [setup ~logos:vitejs~]
import { createApp } from 'vue'
```

To share the icon across code groups in multiple languages, put the same notation in the `label` of `::: code-group`. The plugin watches HMR and updates the CSS on save.

The `import 'virtual:group-icons.css'` in your theme entry is required to inject the generated CSS into dev and build outputs.

With these two plugins configured, you will match the behavior shown in `packages/docs/.vitepress/config.mts` and can extend from there as needed.
