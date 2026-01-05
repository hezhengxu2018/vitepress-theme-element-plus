# 介绍

::: warning 注意
本主题基于 Vitepress 2.x 开发，请勿与 1.x 混用。
:::

这是一个 Element Plus 视觉规范的 VitePress 主题，主要诉求是在多套组件文档之间保持一致的观感与交互。主题本身尽量保持轻量，所有 Markdown 能力、站点配置和 Vite 扩展都通过显式配置完成，便于按需取舍。可以直接参考 `packages/docs/.vitepress/config.mts` 获得最完整的示例。

::: tip 提示
本依赖使用源码分发的形式，即依赖中的vue文件未经过编译。如果有使用时有缺失的依赖请根据提示安装。
:::

## 配置项

本主题与官方主题的配置项几乎保持一致，目前添加了version字段和footer中的blogroll配置项，用于显示文档的版本和友情链接。完整的配置例子请参考[快速开始](./quick-start)

配置项的类型声明如下：

<<< @../../theme/index.ts#snippet
