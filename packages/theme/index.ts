import type { DefaultTheme, Theme } from 'vitepress'
import { ElTag } from 'element-plus'
import VPTheme from 'vitepress/theme'
import Bili from './client/components/Bili.vue'
import Layout from './client/components/Layout.vue'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-tag.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const EPTheme: Theme = {
  extends: VPTheme,
  Layout,
  enhanceApp({ app, siteData }) {
    const themeConfig = siteData.value.themeConfig
    if (!import.meta.env.SSR) {
      if (!themeConfig.scrollRestoration) {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual'
        }
      }

      else {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'auto'
        }
      }

      if ((import.meta as any).hot) {
        let scrollPosition = 0;
        // 监听热模块替换之前的事件
        (import.meta as any).hot.on('vite:beforeUpdate', () => {
          // 保存当前的滚动位置
          scrollPosition = window.scrollY || document.documentElement.scrollTop
        });

        // 监听热模块替换之后的事件
        (import.meta as any).hot.on('vite:afterUpdate', () => {
          // 恢复保存的滚动位置
          window.scrollTo(0, scrollPosition)
        })
      }
    }
    app.component('Bili', Bili)
    app.component('ElTag', ElTag)
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

// export { default as Home } from './components/pages/Home.vue'
// export { default as Doc } from './components/pages/Doc.vue'
// export { default as SinglePage } from './components/pages/SinglePage.vue'
// export { default as ChangeLog } from './components/pages/ChangeLog.vue'
// export { default as Sponsor } from './components/pages/Sponsor.vue'
// export { default as Jump } from './components/pages/Jump.vue'

// 导出类型
// export * from './types'
