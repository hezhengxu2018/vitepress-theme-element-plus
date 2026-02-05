---
title: Render Tests
description: 逐项验证 demo 容器、代码组、提示块和 Markdown 扩展渲染是否符合 VitePress Theme Element Plus 的预期。
keywords:
  - VitePress Demo Page
  - 文档渲染测试
  - Element Plus 主题对照表
lang: zh-CN
outline: [2, 5]
image: /logo.svg
---

# 渲染测试页
该页面用于验证主题内置的 Markdown 扩展与插件是否工作正常。按照各小节描述逐一检查，可快速确认自定义主题在本地或部署环境中的表现。

## 1. Demo 容器与示例组件

下面的 Demo 使用 `vitepress-better-demo-plugin` 生成，重点关注：

- 预览区是否成功渲染 `packages/docs/demo/demo.vue`。
- 右上角是否出现代码折叠、复制、StackBlitz/CodeSandbox/GitHub/GitLab 按钮。
- 展开代码后，`vue` Tab 默认为选中，语法高亮是否正常。

::: demo 示例容器用于验证 Element Plus 风格的 Demo 包裹组件。
demo
:::

## 2. 代码块标题图标（`vitepress-plugin-group-icons`）<ElTag effect="dark">New</ElTag>

单个代码块会根据标题里的关键字自动注入图标：

```bash [pnpm install]
pnpm add vitepress-theme-element-plus
```

多语言代码组同样支持关键字或指定 Iconify 名称（如 `~logos:vitejs~`），保存后 Vite 会热刷新 `virtual:group-icons.css`：

::: code-group

```ts [setup ~logos:vitejs~]
import Theme from 'vitepress-theme-element-plus'
import { createApp } from 'vue'
```

```bash [pnpm dev]
pnpm -C packages/docs dev
```

:::

## 3. 标签、Tooltip 与外部链接

- `^(beta)` `^(deprecated)` 等语法应渲染为彩色徽标。
- \^[prop-name]\`string\` 应生成 `<api-typing>` 组件以展示类型信息。
- 外部链接会自动带有图标并套用 `vp-link` 样式，比如 [Element Plus 官网](https://element-plus.org)。

示例段落：

> 该功能目前 ^(beta)，属性 `color` 接受 ^[color](`string`)，若需要更多信息请访问 [Element Plus 官网](https://element-plus.org)。

## 4. API 表格与滚动容器

`mdTableWrapper` 会为表格添加 `.vp-table` 包裹层，确保在窄屏下出现横向滚动条。检查表格线条、悬停状态与 Tooltip 交互：

| 属性                         | 描述                                                 | 默认值    |
| ---------------------------- | ---------------------------------------------------- | --------- |
| `size` ^(a11y) ^(deprecated) | ^[Enum]`'small'\|'default'\|'large'`                 | `default` |
| `zIndex` ^(1.1.0)            | 弹层层级，支持 `number`，超过 2000 可避免被遮挡      | `2000`    |
| `teleported` ^(beta)         | 是否将弹层挂载到 `body`，验证标签与 Tooltip 混合显示 | `true`    |

## 5. 提示块与列表

`vitepress-theme-element-plus` 继承 VitePress 的自定义块样式，下方用于验证标题、正文与列表对齐是否符合预期：

::: tip 检查项

1. 切换浅色/深色模式，确认配色一致。
2. 缩放浏览器宽度，确保响应式间距正常。
3. 使用本页所有交互（复制代码、折叠 Demo 等）以排查潜在脚本错误。
   :::

::: warning 警告

1. 切换浅色/深色模式，确认配色一致。
2. 缩放浏览器宽度，确保响应式间距正常。
3. 使用本页所有交互（复制代码、折叠 Demo 等）以排查潜在脚本错误。
   :::
   完成以上检查后，即可确认主题的主要渲染能力正常工作。如需扩展新的测试项，可按相同模式增加段落，保持“说明 + 预期行为”的结构即可。

## 6. Markdown 语法示例

该分节集中展示 VitePress 默认 Markdown 语法的渲染效果，方便检查基础格式是否受主题样式影响。

### 无序与有序列表

- 使用 `-`、`*` 或 `+` 开头都应渲染为无序列表项。
- 列表项之间保留 4px 间距，嵌套段落需继承行高。
  - 二级列表应缩进对齐，行内代码如 `const foo = 'bar'` 需保持等宽字体。
- 列表中可继续插入 **粗体**、_斜体_、或 ~~删除线~~。

1. 有序列表应自动编号。
2. 多位数编号要与段落左对齐。
3. 结合 [外部链接](https://vitepress.dev) 或 `kbd` 样式验证颜色与状态。

### 引用与嵌套内容

> 一级引用块用于突出段落。
>
> > 可以在内部继续嵌套引用，并包含列表：
> >
> > - [x] 任务 1
> > - [ ] 任务 2

### 文字强调与行内元素

文本中的 **粗体**、_斜体_、`inline code`、以及 [链接文字](https://element-plus.org) 应继承主题主色。使用 <sup>上标</sup> 或 <sub>下标</sub> 等语法也应正常显示。内联 `MathJax`（如 $E = mc^2$）若启用插件应保持基线位置。

### 标题与 outline 层级 <ElTag>Demo</ElTag> <ElTag type="danger">Demo</ElTag>

现在会对标题上的 `ElTag` 做特殊处理，会保持样式的渲染在outline上。
::: warning 注意
你需要手动注册`ElTag`组件。
:::

由于本主题的配置项几乎是扩展自Vitepress的，你可以手动通过 frontmatter 手动指定 outline 的显示层级。但不能渲染层级超过2层以上的outline。

### 分隔线与定义列表

在段落之间插入三条横线可生成分隔线，检查上下间距：

---

术语一
: 定义内容应靠左对齐，并保持与段落相同的字体大小。

术语二
: 可包含多行文本，若换行则在左侧与首行对齐。
