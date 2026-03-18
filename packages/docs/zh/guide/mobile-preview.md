---
title: 移动端预览
description: 独立展示带手机壳 iframe 的移动端 Demo 预览页面。
keywords:
  - mobile preview
  - iframe simulator
  - VitePress 移动端示例
lang: zh-CN
outline: [2, 3]
mobileDemo: mobile-preview-demo.vue
---

# 移动端预览

## 预览说明

- 桌面宽屏下，右侧会显示固定的手机壳预览区域。
- 窄屏下，手机壳会退化为一个 `Open mobile preview` 链接，点击后打开独立的移动运行时页面。
- iframe 内部运行的是 `packages/docs/demo/mobile-preview-demo.vue`，用于验证 `Dialog`、`position: fixed`、`100vh` 等典型移动端场景。

## 适合检查的点

- 弹层是否只出现在 iframe 内，而不是覆盖整个文档站。
- 底部固定操作栏是否按移动端视口工作。
- 切换文档主题后，iframe 是否同步浅色 / 深色模式。

## 配置步骤

### 1、建立 demo registry
该步骤是独立预览能正常生效的前提。`mobile-preview` layout 会从 `mobilePreviewRegistryKey` 注入的 registry 中，根据 demo id 查找并加载对应组件。具体代码可以参考[快速开始](/zh/guide/quick-start#注册主题入口)中的 `mobilePreviewRegistry` 相关代码。

### 2、配置预览组件

`themeConfig.mobilePreview` 当前支持以下配置：

| 配置项         | 说明                      | 默认值       |
| -------------- | ------------------------- | ------------ |
| `previewPath`  | 独立预览页路径            | `'preview/'` |
| `deviceWidth`  | 侧边手机壳的外层宽度      | `390`        |
| `deviceHeight` | iframe 内部可视区域高度   | `760`        |
| `demoRoot`     | `mobileDemo` 的默认根路径 | `'demo/'`    |

示例：

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

`previewPath` 支持几种常见写法：

- `preview/`：相对于当前 locale 根路径解析。比如根语言页面 `/component/input` 会得到 `/preview/`，而 `/en/component/input` 会得到 `/en/preview/`。
- `../preview/`：仍然基于 locale 根路径做相对跳转，适合多个文档分组共用一个预览入口。
- `/preview/`：显式写成站点绝对路径。

:::tip 提示
相对路径的解析基于站点实际配置的 locale 前缀，而不是简单取当前路由的第一段。因此即使根语言页面本身位于 `/component/*` 这样的嵌套路由下，`preview/` 仍然会稳定解析到 `/preview/`。
:::

页面只需要在 frontmatter 中声明 `mobileDemo`：

```yml
---
mobileDemo: mobile-preview-demo.vue
---
```

默认会从 `themeConfig.mobilePreview.demoRoot` 指定的目录解析这个值。比如当 `demoRoot` 为 `demo/` 时，`mobileDemo: mobile-preview-demo.vue` 最终会解析为 `demo/mobile-preview-demo.vue`。如果你不想依赖根目录配置，也可以继续写完整路径。

:::tip 提示
`mobileDemo` 本质上只是一个用于查找组件的 id 或路径字符串，它最终必须能在第一步注册的 registry 中解析到实际组件。文档正文里展示的 demo 不一定非要和移动端预览加载的是同一个组件，但如果你希望两边保持一致，就应该让 `mobileDemo` 指向你注册到 registry 的那个组件。
:::

### 3、配置独立预览页面

使用 `themeConfig.mobilePreview.previewPath` 指定的路径，在对应位置新建一个 `index.md` 文件，核心配置是使用 `mobile-preview` 的 layout。完成后会生成一个独立的预览页面；iframe 和打开新页面的链接本质上都会指向这个页面，并通过 query 参数传入组件 id，然后由该 layout 从第一步注册的 registry 中找到对应组件进行渲染。

如果你使用的是相对路径：

- `preview/` 通常对应 locale 根目录下的 `preview/index.md`
- `../preview/` 表示从 locale 根目录回退一层后再解析 `preview/index.md`

```md
---
title: Mobile Preview
layout: mobile-preview
---
```
