---
title: Markdown Plugins
description: Learn the recommended Markdown plugins such as mdExternalLinkIcon, mdTag, and mdTooltip, and choose what you need.
keywords:
  - VitePress Markdown plugins
  - mdExternalLinkIcon
  - vitepress-theme-element-plus extensions
---

# Markdown Plugins

Install only what you need. If you want everything, you can directly copy the config from [Quick Start](./quick-start).

## Links and tables

```ts
import { mdExternalLinkIcon, mdTableWrapper } from 'vitepress-theme-element-plus/node'
```

`mdExternalLinkIcon` adds icons to external links and applies the unified `vp-link` style. `mdTableWrapper` wraps tables in `.vp-table` to enable horizontal scrolling and consistent borders.

## Tag syntax

```ts
import { mdTag } from 'vitepress-theme-element-plus/node'
```

`mdTag` lets you write tags like `^(Beta)` or `^(deprecated)` in text and renders them as colored badges. Special values such as `beta`, `deprecated`, `a11y`, and `required` automatically receive semantic class names.

## API Tooltip

```ts
import { mdTooltip } from 'vitepress-theme-element-plus/node'
```

`mdTooltip` parses syntax like:

```md
^[prop-type]`description`
```

and generates the `<api-typing>` component, which is commonly used in API tables to explain types or add notes.

## Task list

```ts
import { mdTaskList } from 'vitepress-theme-element-plus/node'
```

Element Plus styled task lists. The option types are:

```ts
export interface ElementPlusTaskListOptions {
  disabled?: boolean
  itemClass?: string
  listClass?: string
  checkboxClass?: string
  labelClass?: string
}
```

In most cases, you only need to set `disabled`.
