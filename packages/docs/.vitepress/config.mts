import type { EPThemeConfig } from 'vitepress-theme-element-plus'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdContainer from 'markdown-it-container'
import { defineConfig } from 'vitepress'
import { createDemoContainer } from 'vitepress-better-demo-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { mdExternalLinkIcon, mdTableWrapper, mdTag, mdTooltip } from 'vitepress-theme-element-plus/node'

export default defineConfig<EPThemeConfig>({
  vite: {
    plugins: [
      groupIconVitePlugin(),
    ],
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
  appearance: true,
  lastUpdated: false,
  // Markdown 配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    config(md) {
      md.use(groupIconMdPlugin)
      md.use(mdExternalLinkIcon)
      md.use(mdTag)
      md.use(mdTooltip)
      md.use(mdTableWrapper)
      md.use(mdContainer, 'demo', createDemoContainer(md, {
        demoDir: path.resolve(
          dirname(fileURLToPath(import.meta.url)),
          '../demo',
        ),
        autoImportWrapper: false,
      }))
    },
  },
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
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Demo Page', link: '/guide/demo-page' },
        ],
      },
    ],
    externalLinkIcon: true,
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
