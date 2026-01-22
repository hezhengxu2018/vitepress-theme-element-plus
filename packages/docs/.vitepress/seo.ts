import type { HeadConfig, PageData } from 'vitepress'

export const SITE_URL = 'https://vitepress-theme-element-plus.silver-fe.dev'
export const SITE_NAME = 'VitePress Theme Element Plus'
export const DEFAULT_DESCRIPTION = 'Element Plus 风格的 VitePress 文档主题，内置 demo 容器、Markdown 插件与品牌化样式。'
const DEFAULT_KEYWORDS = [
  'VitePress Theme Element Plus',
  'Element Plus 文档主题',
  'VitePress 主题',
  '前端文档主题',
]
const DEFAULT_SOCIAL_IMAGE = new URL('/logo.svg', SITE_URL).href

function resolveCanonical(relativePath?: string, explicit?: string) {
  if (explicit)
    return explicit
  if (!relativePath || relativePath === 'index.md')
    return SITE_URL
  const normalized = relativePath
    .replace(/(^|\/)index\.md$/, '')
    .replace(/\.md$/, '')
    .replace(/\/$/, '')
  const pathname = normalized ? `/${normalized}` : '/'
  return new URL(pathname, SITE_URL).href
}

function resolveOgImage(image?: string) {
  if (!image)
    return DEFAULT_SOCIAL_IMAGE
  if (image.startsWith('http'))
    return image
  return new URL(image, SITE_URL).href
}

function normalizeKeywords(input?: string | string[]) {
  if (!input)
    return DEFAULT_KEYWORDS
  const values = Array.isArray(input) ? input : input.split(',')
  const cleaned = values.map(value => value.trim()).filter(Boolean)
  return cleaned.length ? cleaned : DEFAULT_KEYWORDS
}

function toJsonLd(data: Record<string, any>) {
  return JSON.stringify(data).replace(/</g, '\u003C')
}

export function enhancePageData(pageData: PageData) {
  pageData.description = pageData.frontmatter.description ?? pageData.description ?? DEFAULT_DESCRIPTION
}

export function createSeoHead(pageData: PageData): HeadConfig[] {
  const canonical = resolveCanonical(pageData.relativePath, pageData.frontmatter?.canonical)
  const description = pageData.description ?? DEFAULT_DESCRIPTION
  const isHome = pageData.relativePath === 'index.md'
  const pageTitle = pageData.frontmatter?.metaTitle ?? pageData.title ?? SITE_NAME
  const title = pageTitle === SITE_NAME ? SITE_NAME : `${pageTitle} | ${SITE_NAME}`
  const keywords = normalizeKeywords(pageData.frontmatter?.keywords)
  const ogImage = resolveOgImage(pageData.frontmatter?.image ?? pageData.frontmatter?.ogImage)
  const schema = isHome
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SITE_NAME,
        'url': canonical,
        description,
        'inLanguage': 'zh-CN',
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': pageTitle,
        description,
        'inLanguage': 'zh-CN',
        'mainEntityOfPage': canonical,
        'author': {
          '@type': 'Organization',
          'name': SITE_NAME,
        },
        'publisher': {
          '@type': 'Organization',
          'name': SITE_NAME,
          'url': SITE_URL,
          'logo': {
            '@type': 'ImageObject',
            'url': ogImage,
          },
        },
      }
  const head: HeadConfig[] = [
    ['meta', { name: 'keywords', content: keywords.join(', ') }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }],
    ['meta', { property: 'og:url', content: canonical }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:alt', content: `${SITE_NAME} logo` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['link', { rel: 'canonical', href: canonical }],
    ['script', { type: 'application/ld+json' }, toJsonLd(schema)],
  ]
  return head
}
