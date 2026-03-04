---
title: Ask AI Sidebar
description: Enable the Ask AI trigger and right sliding panel with themeConfig.askAi, then render your own chat logic through slots.
keywords:
  - vitepress-theme-element-plus Ask AI
  - askAi config
  - VitePress AI sidebar
---

# Ask AI Sidebar

`vitepress-theme-element-plus` provides a configurable Ask AI trigger and right-side sliding panel. The theme only ships the layout and interaction shell, not model integration logic.

## Enable It

Configure `themeConfig.askAi` in `.vitepress/config.mts` (or `config.ts`):

```ts
import type { EPThemeConfig } from 'vitepress-theme-element-plus'
import { defineConfig } from 'vitepress'

export default defineConfig<EPThemeConfig>({
  themeConfig: {
    askAi: {
      enabled: true,
      triggerText: 'Ask AI',
      title: 'Chat',
      width: 380,
    },
  },
})
```

## Options

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Enables Ask AI. Trigger button and panel only render when this is `true`. |
| `triggerText` | `string` | `'Ask AI'` | Label text for the navbar trigger button. |
| `title` | `string` | `'Chat'` | Header title shown in the panel. |
| `width` | `number \| string` | `420` | Panel width. `number` is converted to `px`; `string` accepts any valid CSS width value. |

## Slot Integration

Use theme `Layout` slots to mount your own chat UI:

| Slot Name | Location | Description |
| --- | --- | --- |
| `ask-ai-panel-header` | Panel header | Customize the header (replace default title and close icon). |
| `ask-ai-panel-content` | Panel body | Main chat content such as messages, input box, and streaming output. |
| `ask-ai-panel-footer` | Panel footer | Optional footer area for disclaimers or quick actions. |

All three slots receive the same slot props:

- `isOpen`: Whether the panel is currently open.
- `open`: Open the panel.
- `close`: Close the panel.
- `toggle`: Toggle panel state.

Example:

```ts
import Theme from 'vitepress-theme-element-plus'
import { h } from 'vue'

export default {
  extends: Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'ask-ai-panel-content': ({ close }) =>
        h('div', [
          h('p', 'Mount your chat component here'),
          h('button', { onClick: close }, 'Close'),
        ]),
    })
  },
}
```

## Current Layout Behavior

- On desktop (`>= 960px`), the Ask AI trigger appears next to the navbar search.
- When opened, the panel pushes main content left and the navbar yields width.
- The top search box is hidden while the panel is open.
- When viewport width is below `1680px` and the panel is open, the right outline is hidden to reduce layout squeeze.
