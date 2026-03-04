---
title: Ask AI 侧栏
description: 通过 themeConfig.askAi 启用导航栏入口与右侧滑出聊天面板，并用插槽接入自己的聊天实现。
keywords:
  - vitepress-theme-element-plus Ask AI
  - askAi 配置
  - VitePress AI 侧栏
---

# Ask AI 侧栏

`vitepress-theme-element-plus` 内置了一个可配置的 Ask AI 入口和右侧滑出面板。主题只负责布局与交互壳层，不内置具体的模型调用逻辑。

## 启用方式

在 `.vitepress/config.mts`（或 `config.ts`）里配置 `themeConfig.askAi`：

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

## 配置项

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | 是否启用 Ask AI 功能。只有 `true` 时才显示入口按钮与侧栏。 |
| `triggerText` | `string` | `'Ask AI'` | 导航栏按钮文案。 |
| `title` | `string` | `'Chat'` | 侧栏头部标题。 |
| `width` | `number \| string` | `420` | 侧栏宽度。`number` 会被转换成像素，`string` 可传任意 CSS 宽度值。 |

## 插槽扩展

你可以通过主题 `Layout` 的插槽接入聊天 UI 与业务逻辑：

| 插槽名 | 位置 | 说明 |
| --- | --- | --- |
| `ask-ai-panel-header` | 侧栏头部 | 自定义头部内容（可替换默认标题与关闭按钮）。 |
| `ask-ai-panel-content` | 侧栏主体 | 聊天消息、输入框、流式输出等核心内容。 |
| `ask-ai-panel-footer` | 侧栏底部 | 可选底部区域，例如免责声明或快捷操作。 |

上述 3 个插槽都能拿到相同的 slot props：

- `isOpen`: 当前侧栏是否展开。
- `open`: 打开侧栏。
- `close`: 关闭侧栏。
- `toggle`: 切换侧栏开关。

示例：

```ts
import Theme from 'vitepress-theme-element-plus'
import { h } from 'vue'

export default {
  extends: Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'ask-ai-panel-content': ({ close }) =>
        h('div', [
          h('p', '在这里接入你的聊天组件'),
          h('button', { onClick: close }, '关闭'),
        ]),
    })
  },
}
```

## 当前布局行为

- 桌面端（`>= 960px`）在导航搜索框旁显示 Ask AI 按钮。
- 展开侧栏后，页面主内容会向左压缩，导航栏同步让位。
- 侧栏展开时会隐藏顶部搜索框。
- 当屏幕宽度小于 `1680px` 且侧栏展开时，会隐藏文档右侧 outline 区域以避免挤压内容。

## Cloudflare AI Search 对接

文档示例站已内置了最小可用接入：

- Pages Function: `packages/docs/functions/api/ask.ts`
- 前端会话组件: `packages/docs/.vitepress/theme/components/AskAICloudflareChat.vue`
- 插槽挂载入口: `packages/docs/.vitepress/theme/index.ts`

部署时需要在 Cloudflare Pages 项目中配置：

- `AI`：Workers AI 绑定（变量名必须与函数代码一致）。
- `RAG_ID`：你创建好的 AI Search 索引 ID。

本地开发默认请求 `/api/ask`。如果你需要切换成其他后端地址，可设置环境变量 `VITE_ASK_AI_ENDPOINT` 覆盖默认值。
