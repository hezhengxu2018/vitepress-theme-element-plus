import type { Header } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'

const ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/

// cached list of anchor elements from resolveHeaders
const resolvedHeaders: { element: HTMLHeadElement, link: string }[] = []

export type MenuItem = Omit<Header, 'slug' | 'children'> & {
  element: HTMLHeadElement
  titleTags: string[]
  children?: MenuItem[]
}

export function resolveTitle(theme: DefaultTheme.Config): string {
  return (
    (typeof theme.outline === 'object'
      && !Array.isArray(theme.outline)
      && theme.outline.label)
    || theme.outlineTitle
    || 'On this page'
  )
}

export function getHeaders(range: DefaultTheme.Config['outline']): MenuItem[] {
  const headers = Array.from(document.querySelectorAll('.VPDoc :where(h1,h2,h3,h4,h5,h6)'))
    .filter(el => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1])
      const { text, tags } = serializeHeader(el)
      return {
        element: el as HTMLHeadElement,
        title: text,
        titleTags: tags,
        link: `#${el.id}`,
        level,
      }
    })

  return resolveHeaders(headers, range)
}

function serializeHeader(h: Element): { text: string, tags: string[] } {
  let text = ''
  const tags: string[] = []
  for (const node of Array.from(h.childNodes)) {
    if (node.nodeType === 1) {
      const element = node as HTMLElement
      if (ignoreRE.test(element.className))
        continue
      if (element.classList.contains('el-tag') || element.classList.contains('vp-tag')) {
        tags.push(element.outerHTML)
        continue
      }
      text += element.textContent ?? ''
    }
    else if (node.nodeType === 3) {
      const value = node.textContent ?? ''
      text += value
    }
  }
  return {
    text: text.trim(),
    tags,
  }
}

export function resolveHeaders(
  headers: MenuItem[],
  range?: DefaultTheme.Config['outline'],
): MenuItem[] {
  if (range === false) {
    return []
  }

  const levelsRange
    = (typeof range === 'object' && !Array.isArray(range)
      ? range.level
      : range) || 2

  const [high, low]: [number, number]
    = typeof levelsRange === 'number'
      ? [levelsRange, levelsRange]
      : levelsRange === 'deep'
        ? [2, 6]
        : levelsRange

  return buildTree(headers, high, low)
}

function buildTree(data: MenuItem[], min: number, max: number): MenuItem[] {
  resolvedHeaders.length = 0

  const result: MenuItem[] = []
  const stack: (MenuItem | { level: number, shouldIgnore: true })[] = []

  data.forEach((item) => {
    const node = { ...item, children: [] }
    let parent = stack[stack.length - 1]

    while (parent && parent.level >= node.level) {
      stack.pop()
      parent = stack[stack.length - 1]
    }

    if (
      node.element.classList.contains('ignore-header')
      || (parent && 'shouldIgnore' in parent)
    ) {
      stack.push({ level: node.level, shouldIgnore: true })
      return
    }

    if (node.level > max || node.level < min)
      return
    resolvedHeaders.push({ element: node.element, link: node.link })

    if (parent)
      (parent as MenuItem).children.push(node)
    else result.push(node)

    stack.push(node)
  })

  return result
}
