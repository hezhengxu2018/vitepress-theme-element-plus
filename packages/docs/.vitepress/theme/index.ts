import { ElTag } from 'element-plus'
import {
  VitepressEpDemoBox,
  VitepressEpDemoPlaceholder,
} from 'vitepress-better-demo-plugin/theme/element-plus'
import Theme from 'vitepress-theme-element-plus'
import { h } from 'vue'
import AskAICloudflareChat from './components/AskAICloudflareChat.vue'
import 'virtual:group-icons.css'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'ask-ai-panel-content': () => h(AskAICloudflareChat),
    })
  },
  enhanceApp({ app }) {
    app.component('ElTag', ElTag)
    app.component('VitepressDemoBox', VitepressEpDemoBox)
    app.component('VitepressDemoPlaceholder', VitepressEpDemoPlaceholder)
  },
} as typeof Theme
