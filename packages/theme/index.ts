import type { DefaultTheme, Theme } from 'vitepress'
import VPTheme from 'vitepress/theme'
import Layout from './client/components/Layout.vue'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-tag.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/index.scss'
import './styles/base.scss'
import './styles/code.scss'
import './styles/doc-content.scss'
import './styles/tag-content.scss'

const EPTheme: Theme = {
  extends: VPTheme,
  Layout,
}

export interface EPThemeConfig extends DefaultTheme.Config {
  /**
   * 文档版本号
   */
  version?: string
}

export { Layout }
export default EPTheme
