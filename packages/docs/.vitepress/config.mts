import type { EPThemeConfig } from 'vitepress-theme-element-plus'
import { defineConfig } from 'vitepress'

export default defineConfig<EPThemeConfig>({
  vite: {
    ssr: {
      noExternal: ['vitepress-theme-element-plus'],
    },
    optimizeDeps: {
      exclude: ['vitepress-theme-element-plus'],
    },
    build: {
      cssMinify: false,
    },
  },

  // 站点配置
  title: 'VitePress Theme Element Plus',
  description: 'A modern and elegant VitePress theme',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],

  // 启用暗色模式
  appearance: true,

  // 启用最后更新时间
  lastUpdated: true,

  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },

  // // 多语言配置
  // locales: {
  //   root: {
  //     label: '简体中文',
  //     lang: 'zh-CN',
  //     title: '',
  //     description: '现代优雅的 VitePress 文档主题',
  //     link: '/zh-CN/',
  //     themeConfig: {
  //       // 中文导航
  //       nav: [
  //         { text: '指南', link: '/zh-CN/guide/' },
  //         { text: '参考', link: '/zh-CN/reference/' },
  //         { text: '关于', link: '/zh-CN/about' },
  //         { text: '捐赠', link: '/zh-CN/sponsor' }
  //       ],
  //       // 中文侧边栏
  //       sidebar: [
  //         {
  //           text: 'Guide',
  //           items: [
  //             { text: 'Introduction', link: '/introduction' },
  //             { text: 'Getting Started', link: '/getting-started' },
  //           ]
  //         }
  //       ]
  //     }
  //   }
  // },

  // 全局主题配置
  themeConfig: {
    // Logo 配置
    logo: '/logo.svg',

    // 搜索配置
    search: {
      provider: 'local',
    },
    version: '1.0.0',
    siteTitle: '',
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
    ],

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hezhengxu2018/vitepress-theme-element-plus' },
    ],

    // Footer 配置
    footer: {
      copyright: 'Release under MIT License',
    },
  },
})
