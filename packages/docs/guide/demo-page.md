---
title: Render Tests
lang: zh-CN
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

## 2. 代码块标题图标（`vitepress-plugin-group-icons`）

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
- `^[prop-name](`string | number`)` 应生成 `<api-typing>` 组件以展示类型信息。
- 外部链接会自动带有图标并套用 `vp-link` 样式，比如 [Element Plus 官网](https://element-plus.org)。

示例段落：

> 该功能目前 ^(beta)，属性 `color` 接受 ^[color](`string`)，若需要更多信息请访问 [Element Plus 官网](https://element-plus.org)。

## 4. API 表格与滚动容器

`mdTableWrapper` 会为表格添加 `.vp-table` 包裹层，确保在窄屏下出现横向滚动条。检查表格线条、悬停状态与 Tooltip 交互：

| 属性 | 描述 | 默认值 |
| --- | --- | --- |
| `size` | ^[Enum]`'small'\|'default'\|'large'` | `default` |
| `zIndex` ^(1.1.0) | 弹层层级，支持 `number`，超过 2000 可避免被遮挡 | `2000` |
| `teleported` ^(beta) | 是否将弹层挂载到 `body`，验证标签与 Tooltip 混合显示 | `true` |

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
