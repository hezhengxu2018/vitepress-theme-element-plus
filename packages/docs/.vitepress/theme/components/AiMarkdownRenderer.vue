<script setup lang="ts">
import type { Highlighter } from 'shiki'
import MarkdownIt from 'markdown-it'
import { computed, onMounted, shallowRef } from 'vue'

interface Props {
  markdown?: string
  enableBreaks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  markdown: '',
  enableBreaks: true,
})

const SHIKI_THEMES = {
  light: 'github-light',
  dark: 'github-dark',
} as const

const SHIKI_LANGS = [
  'bash',
  'css',
  'diff',
  'html',
  'ini',
  'java',
  'javascript',
  'json',
  'jsx',
  'markdown',
  'python',
  'ruby',
  'rust',
  'sql',
  'toml',
  'tsx',
  'typescript',
  'vue',
  'xml',
  'yaml',
] as const

const LANGUAGE_ALIASES: Record<string, string> = {
  cjs: 'javascript',
  js: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  txt: 'text',
  plaintext: 'text',
}

const FALLBACK_SHIKI_STYLE = '--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e'

let highlighterPromise: Promise<Highlighter | null> | null = null

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')
}

function toLanguageClass(value: string) {
  return value.replace(/[^a-z0-9_-]/g, '-')
}

function normalizeLanguage(rawInfo: string) {
  const rawLanguage = rawInfo
    .trim()
    .split(/\s+/, 1)[0]
    ?.replace(/\{.*\}$/, '')
    .toLowerCase() || 'text'

  return LANGUAGE_ALIASES[rawLanguage] || rawLanguage
}

function renderPlainCodeBlock(code: string) {
  const lines = escapeHtml(code)
    .split('\n')
    .map(line => `<span class="line">${line || ' '}</span>`)
    .join('\n')

  return `<pre class="shiki shiki-themes github-light github-dark" style="${FALLBACK_SHIKI_STYLE}" tabindex="0" dir="ltr"><code>${lines}</code></pre>`
}

function ensurePreDirection(html: string) {
  return html.replace('<pre ', '<pre dir="ltr" ')
}

async function getShikiHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki')
      .then(({ createHighlighter }) => createHighlighter({
        themes: Object.values(SHIKI_THEMES),
        langs: [...SHIKI_LANGS],
      }))
      .catch((error) => {
        console.error('[AskAI] Failed to initialize Shiki highlighter.', error)
        return null
      })
  }

  return highlighterPromise
}

const highlighter = shallowRef<Highlighter | null>(null)

const markdownParser = computed(() => {
  const parser = new MarkdownIt({
    html: false,
    breaks: props.enableBreaks,
    linkify: true,
    highlight(code, info) {
      const normalizedLanguage = normalizeLanguage(info || '')
      const languageClass = toLanguageClass(normalizedLanguage || 'text')
      const showLanguage = Boolean(info && info.trim())

      const renderBlock = (codeHtml: string) => {
        const languageTag = showLanguage ? `<span class="lang">${escapeHtml(normalizedLanguage)}</span>` : ''
        return `<div class="language-${languageClass}">${codeHtml}${languageTag}</div>`
      }

      const highlighterInstance = highlighter.value
      if (!highlighterInstance)
        return renderBlock(renderPlainCodeBlock(code))

      const resolvedLanguage = highlighterInstance.resolveLangAlias(normalizedLanguage)
      const supportedLanguage = highlighterInstance.getLoadedLanguages().includes(resolvedLanguage)
        ? resolvedLanguage
        : 'text'

      try {
        return renderBlock(ensurePreDirection(highlighterInstance.codeToHtml(code, {
          lang: supportedLanguage,
          themes: SHIKI_THEMES,
          defaultColor: false,
        })))
      }
      catch {
        return renderBlock(renderPlainCodeBlock(code))
      }
    },
  })

  const defaultRenderLinkOpen = parser.renderer.rules.link_open
    || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  parser.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') || ''
    if (/^https?:\/\//i.test(href)) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noreferrer')
    }
    return defaultRenderLinkOpen(tokens, idx, options, env, self)
  }

  return parser
})

const renderedHtml = computed(() => {
  return markdownParser.value.render(props.markdown || '')
})

onMounted(async () => {
  highlighter.value = await getShikiHighlighter()
})
</script>

<template>
  <article class="vp-doc ask-ai-markdown" v-html="renderedHtml" />
</template>
