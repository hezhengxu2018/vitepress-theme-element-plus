import type { DefaultTheme, Theme } from 'vitepress'
import type { EPMobilePreviewConfig, MobilePreviewModule, MobilePreviewRegistry } from './client/mobile-preview'
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
// #region snippet
export interface FooterBlogrollLink {
  text: string
  link: string
}

export interface FooterBlogrollSection {
  title: string
  children: FooterBlogrollLink[]
}

export interface EPThemeFooter extends DefaultTheme.Footer {
  /**
   * 友情链接配置
   */
  blogroll?: FooterBlogrollSection[]
}

export interface EPThemeConfig extends DefaultTheme.Config {
  /**
   * 文档版本号
   */
  version?: string
  /**
   * 移动端预览配置
   */
  mobilePreview?: EPMobilePreviewConfig
  footer?: EPThemeFooter
}
// #endregion snippet

export { Layout }
export {
  mobilePreviewRegistryKey,
  normalizeMobilePreviewId,
  normalizeMobilePreviewRoot,
  resolveMobilePreviewId,
} from './client/mobile-preview'
export type { EPMobilePreviewConfig, MobilePreviewModule, MobilePreviewRegistry }
export default EPTheme
