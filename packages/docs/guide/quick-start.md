# 快速开始

根据下面的步骤操作可快速获得与 Element-plus 文档网站几乎一致的渲染效果。如果有不需要的插件或配置项可自行选择。

## 安装依赖

```bash
pnpm add -D vitepress-theme-element-plus vitepress-better-demo-plugin vitepress-plugin-group-icons markdown-it-container
```
如果需要在 TypeScript 项目中获得更完整的提示，可额外安装 `@types/markdown-it-container`。

## 创建配置文件

以下片段引用自本文档的配置文件，展示了如何把主题、Markdown 插件和 Vite 行为串联在一起。
可以根据需要在此配置文件的基础上进行删改。

<<< @/.vitepress/config.mts

## 注册主题入口
在 `.vitepress/theme/index.ts` 中复用主题默认导出，并把 demo 包裹组件和图标样式挂入 VitePress：

<<< @/.vitepress/theme/index.ts
