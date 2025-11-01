import type { Theme } from 'vitepress'
import VPTheme from 'vitepress/theme'
import Bili from './client/components/Bili.vue'
import ContentWrapper from './client/components/ContentWrapper.vue'
import Layout from './client/components/Layout.vue'
import './client/styles/index.scss'

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
    app.component('ContentWrapper', ContentWrapper)
  },
}
export { Layout }
export default EPTheme

// export { default as NotFound } from './components/pages/NotFound.vue'
// export { default as Home } from './components/pages/Home.vue'
// export { default as Doc } from './components/pages/Doc.vue'
// export { default as SinglePage } from './components/pages/SinglePage.vue'
// export { default as ChangeLog } from './components/pages/ChangeLog.vue'
// export { default as Sponsor } from './components/pages/Sponsor.vue'
// export { default as Jump } from './components/pages/Jump.vue'

// 导出类型
// export * from './types'
