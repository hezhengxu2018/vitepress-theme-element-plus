import type { DefaultTheme, Theme } from 'vitepress'
import { ElTag } from 'element-plus'
import VPTheme from 'vitepress/theme'
import ApiTyping from './client/components/ApiTyping.vue'
import Bili from './client/components/Bili.vue'
import Layout from './client/components/Layout.vue'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-tag.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const EPTheme: Theme = {
  extends: VPTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Bili', Bili)
    app.component('ElTag', ElTag)
    app.component('ApiTyping', ApiTyping)
  },
}

export interface EPThemeConfig extends DefaultTheme.Config {
  /**
   * 文档版本号
   */
  version?: string
}

export { Layout }
export default EPTheme
