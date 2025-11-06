import type MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'

const renderToken: RenderRule = (tokens, idx, options, env, self) =>
  self.renderToken(tokens, idx, options)

export default function mdExternalLinkIcon(md: MarkdownIt): void {
  const defaultLinkOpenRenderer = md.renderer.rules.link_open || renderToken
  const defaultLinkCloseRenderer = md.renderer.rules.link_close || renderToken
  let isExternalLink = false

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const href = token.attrGet('href')

    if (href) {
      token.attrJoin('class', 'vp-link')
      if (/^(?:ht|f)tps?:\/\/?/.test(href)) {
        isExternalLink = true
      }
    }

    return defaultLinkOpenRenderer(tokens, idx, options, env, self)
  }

  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    if (isExternalLink) {
      isExternalLink = false
      return `<svg viewBox="0 0 24 24" class="link-icon"><path fill="currentColor" d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm11-3v8h-2V6.413l-7.793 7.794l-1.414-1.414L17.585 5H13V3z"/></svg>${self.renderToken(
        tokens,
        idx,
        options,
      )}`
    }

    return defaultLinkCloseRenderer(tokens, idx, options, env, self)
  }
}
