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

const zhNav = [
  { text: '首页', link: '/zh/' },
  { text: '指南', link: '/zh/guide/introduction', activeMatch: '/zh/guide/' },
  { text: '官方配置项', link: 'https://vitepress.dev/zh/reference/site-config' },
]

const zhSidebar = [
  {
    text: '指南',
    items: [
      { text: '介绍', link: '/zh/guide/introduction' },
      { text: '快速开始', link: '/zh/guide/quick-start' },
      { text: 'Vitepress 插件', link: '/zh/guide/vitepress-plugin' },
      { text: 'Markdown 插件', link: '/zh/guide/md-plugin' },
      { text: '修改配色', link: '/zh/guide/theme' },
      { text: '渲染测试页', link: '/zh/guide/render-test-page' },
    ],
  },
]

const enNav = [
  { text: 'Home', link: '/en/' },
  { text: 'Guide', link: '/en/guide/introduction', activeMatch: '/en/guide/' },
  { text: 'Site Config', link: 'https://vitepress.dev/reference/site-config' },
]

const enSidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Introduction', link: '/en/guide/introduction' },
      { text: 'Quick Start', link: '/en/guide/quick-start' },
      { text: 'VitePress Plugins', link: '/en/guide/vitepress-plugin' },
      { text: 'Markdown Plugins', link: '/en/guide/md-plugin' },
      { text: 'Theme', link: '/en/guide/theme' },
      { text: 'Demo Page', link: '/en/guide/render-test-page' },
    ],
  },
]

const zhFooter = {
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
}

const enFooter = {
  copyright: 'Released under the MIT License',
  blogroll: [
    {
      title: 'Links',
      children: [
        { text: 'GitHub', link: 'https://github.com/hezhengxu2018' },
        { text: 'Element Plus', link: 'https://element-plus.org/' },
        { text: 'VitePress', link: 'https://vitepress.vuejs.org/' },
        { text: 'Vitepress Better Demo Plugin', link: 'https://vitepress-better-demo-plugin.pages.dev/' },
      ],
    },
    {
      title: 'References',
      children: [
        { text: 'Dux Docs', link: 'https://duxweb.github.io/vitepress-theme/' },
        { text: 'VitePress Theme Mild', link: 'https://theme.hacxy.cn/' },
        { text: 'Vitepress Theme Teek', link: 'https://vp.teek.top/' },
        { text: 'VitePress Carbon', link: 'https://carbon.breno.tech/' },
      ],
    },
    {
      title: 'Examples',
      children: [
        { text: 'Silver Formily Element Plus', link: 'https://element-plus.silver-formily.org/' },
        { text: 'Silver Formily Vue', link: 'https://vue.silver-formily.org/' },
      ],
    },
  ],
}

export default defineConfig<EPThemeConfig>({
  lang: 'zh-CN',
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: SITE_NAME,
      titleTemplate: ':title · Element Plus 风格 VitePress 主题',
      description: DEFAULT_DESCRIPTION,
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        footer: zhFooter,
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: SITE_NAME,
      titleTemplate: ':title · Element Plus VitePress Theme',
      description: DEFAULT_DESCRIPTION,
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        footer: enFooter,
      },
    },
  },
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
    externalLinkIcon: true,
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hezhengxu2018/vitepress-theme-element-plus' },
    ],

  },
  sitemap: {
    hostname: SITE_URL,
  },
})
