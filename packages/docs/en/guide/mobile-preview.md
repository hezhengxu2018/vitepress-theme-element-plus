---
title: Mobile Preview
description: A dedicated page that showcases the phone-frame iframe preview flow.
keywords:
  - mobile preview
  - iframe simulator
  - VitePress mobile demo
lang: en-US
outline: [2, 3]
mobileDemo: mobile-preview-demo.vue
---

# Mobile Preview

## Preview behavior

- On wide desktop screens, a sticky phone-frame preview appears beside the article.
- On smaller screens, the frame degrades to an `Open mobile preview` link that opens the standalone mobile runtime page.
- The iframe renders `packages/docs/demo/mobile-preview-demo.vue`, which is useful for checking `Dialog`, `position: fixed`, and `100vh` behavior in a narrow viewport.

## What to verify

- Overlays stay inside the iframe rather than covering the whole documentation site.
- The fixed bottom action bar behaves like a real mobile viewport.
- Theme switches on the doc page propagate to the iframe preview.

## Configuration steps

### 1. Build the demo registry

This step is required for standalone preview pages to work. The `mobile-preview` layout reads the registry provided through `mobilePreviewRegistryKey` and uses the demo id to find and load the target component. See the `mobilePreviewRegistry` example in [Quick Start](/en/guide/quick-start#register-the-theme-entry).

### 2. Configure the preview component

`themeConfig.mobilePreview` currently supports these options:

| Option | Description | Default |
| --- | --- | --- |
| `previewPath` | Standalone preview page path | `'preview/'` |
| `deviceWidth` | Outer width of the phone frame shown beside the doc | `390` |
| `deviceHeight` | Height of the iframe viewport inside the frame | `760` |
| `demoRoot` | Default root used to resolve `mobileDemo` | `'demo/'` |

Example:

```ts
const siteConfig = {
  themeConfig: {
    mobilePreview: {
      previewPath: 'preview/',
      deviceWidth: 430,
      deviceHeight: 932,
      demoRoot: 'demo/mobile/',
    },
  },
}
```

`previewPath` supports a few common forms:

- `preview/`: resolved from the current locale root. For example, `/component/input` becomes `/preview/`, while `/en/component/input` becomes `/en/preview/`.
- `../preview/`: still resolved from the locale root, but with one level of relative navigation, which is useful when multiple doc groups share one preview entry.
- `/preview/`: an explicit site-absolute path.

:::tip Tip
Relative preview paths are resolved from the actual locale prefixes declared in the site config, not by blindly taking the first segment of the current route. That means root-locale pages under nested routes such as `/component/*` still resolve `preview/` to `/preview/`.
:::

The doc page only needs a `mobileDemo` field:

```yml
---
mobileDemo: mobile-preview-demo.vue
---
```

By default, this value is resolved against `themeConfig.mobilePreview.demoRoot`. For example, when `demoRoot` is `demo/`, `mobileDemo: mobile-preview-demo.vue` resolves to `demo/mobile-preview-demo.vue`. You can still provide the full path if you prefer not to rely on the root setting.

:::tip Tip
`mobileDemo` is effectively just an id or path string used to look up a component. It still has to resolve to a real component from the registry registered in step 1. The demo shown inside the article body does not have to be the same component as the one used by the mobile preview, but if you want both views to stay aligned, point `mobileDemo` at the component you registered in the registry.
:::

### 3. Configure the standalone preview page

Create an `index.md` file under the path configured by `themeConfig.mobilePreview.previewPath`, and set its layout to `mobile-preview`. This generates the isolated preview page used by both the iframe and the external preview link. The component id is passed in via query string, and the layout resolves it against the registry created in step 1.

When you use a relative `previewPath`:

- `preview/` usually maps to `preview/index.md` under the locale root
- `../preview/` means “step out once, then resolve `preview/index.md`”

```md
---
title: Mobile Preview
layout: mobile-preview
---
```
