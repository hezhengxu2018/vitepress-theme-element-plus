---
title: Markdown 插件
description: 了解主题推荐的 mdExternalLinkIcon、mdTag、mdTooltip 等 Markdown 插件，并按需挑选适合的能力。
keywords:
  - VitePress Markdown 插件
  - mdExternalLinkIcon
  - vitepress-theme-element-plus 扩展
---

# Markdown 插件

以下插件可根据需要安装，如果全部安装可直接复制[快速开始](./quick-start)的配置项

## 链接与表格

```ts
import { mdExternalLinkIcon, mdTableWrapper } from 'vitepress-theme-element-plus/node'
```

`mdExternalLinkIcon` 为外链附加图标且统一 `vp-link` 样式；`mdTableWrapper` 会把表格包裹在 `.vp-table` 中以获得横向滚动与统一线条。

## 标签语法

```ts
import { mdTag } from 'vitepress-theme-element-plus/node'
```

`mdTag` 允许在文本中写 `^(Beta)`、`^(deprecated)` 等标签，渲染为彩色圆角徽标；对于 `beta`、`deprecated`、`a11y`、`required` 等特殊值会自动附带语义类名。

## API Tooltip

```ts
import { mdTooltip } from 'vitepress-theme-element-plus/node'
```

`mdTooltip` 解析：

```md
^[属性类型]`描述`
```

这样的语法，生成 `<api-typing>` 组件，常用于 API 表格里说明类型或补充信息。

## 任务列表

```ts
import { mdTaskList } from 'vitepress-theme-element-plus/node'
```

element-plus风格的任务列表。完整的配置类型声明如下：

```ts
export interface ElementPlusTaskListOptions {
  disabled?: boolean
  itemClass?: string
  listClass?: string
  checkboxClass?: string
  labelClass?: string
}
```

大部分情况下只需要配置disabled属性即可。
