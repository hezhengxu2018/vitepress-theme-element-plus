import type { EPThemeConfig } from 'vitepress-theme-element-plus'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import mdContainer from 'markdown-it-container'
import { defineConfig } from 'vitepress'
import { createDemoContainer } from 'vitepress-better-demo-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { mdExternalLinkIcon, mdTableWrapper, mdTag, mdTaskList, mdTooltip } from 'vitepress-theme-element-plus/node'
import pkg from '../package.json'
import { createSeoHead, DEFAULT_DESCRIPTION, enhancePageData, SITE_NAME, SITE_URL } from './seo'

export default defineConfig<EPThemeConfig>({
  lang: 'zh-CN',
  vite: {
    plugins: [
      groupIconVitePlugin(),
    ],
    ssr: {
      noExternal: [
        'vitepress-theme-element-plus',
        'vitepress-better-demo-plugin',
      ],
    },
    optimizeDeps: {
      exclude: ['vitepress-theme-element-plus'],
    },
    build: {
      cssMinify: false,
    },
  },
  // 站点配置
  title: SITE_NAME,
  titleTemplate: ':title · Element Plus 风格 VitePress 主题',
  description: DEFAULT_DESCRIPTION,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],
  appearance: true,
  transformPageData: enhancePageData,
  transformHead({ pageData }) {
    return createSeoHead(pageData)
  },
  // Markdown 配置
  markdown: {
    math: true,
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
      md.use(mdTaskList, {
        disabled: false,
      })
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
    version: pkg.version,
    siteTitle: SITE_NAME,
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/quick-start' },
          { text: 'Vitepress 插件', link: '/guide/vitepress-plugin' },
          { text: 'Markdown 插件', link: '/guide/md-plugin' },
          { text: '修改配色', link: '/guide/theme' },
          { text: '渲染测试页', link: '/guide/demo-page' },
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
      blogroll: [
        {
          title: '链接',
          children: [
            { text: 'GitHub', link: 'https://github.com/hezhengxu2018' },
            { text: 'Element Plus', link: 'https://element-plus.org/' },
            { text: 'VitePress', link: 'https://vitepress.vuejs.org/' },
            { text: 'Vitepress Better Demo Plugin', link: 'https://vitepress-better-demo-plugin.pages.dev/' },
          ],
        },
        {
          title: '参考',
          children: [
            { text: 'Dux Docs', link: 'https://duxweb.github.io/vitepress-theme/' },
            { text: 'VitePress Theme Mild', link: 'https://theme.hacxy.cn/' },
            { text: 'Vitepress Theme Teek', link: 'https://vp.teek.top/' },
            { text: 'VitePress Carbon', link: 'https://carbon.breno.tech/' },
          ],
        },
        {
          title: '例子',
          children: [
            { text: 'Silver Formily Element Plus', link: 'https://element-plus.silver-formily.org/' },
            { text: 'Silver Formily Vue', link: 'https://vue.silver-formily.org/' },
          ],
        },
      ],
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: '官方配置项', link: 'https://vitepress.dev/zh/reference/site-config' },
    ],
  },
  sitemap: {
    hostname: SITE_URL,
  },
})
