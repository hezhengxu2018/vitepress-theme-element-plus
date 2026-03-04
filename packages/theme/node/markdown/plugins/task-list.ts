import type { PluginWithOptions } from 'markdown-it'
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs'
import type Token from 'markdown-it/lib/token.mjs'

export interface ElementPlusTaskListOptions {
  disabled?: boolean
  itemClass?: string
  listClass?: string
  checkboxClass?: string
  labelClass?: string
}

function startsWithTask(token: Token) {
  return token.type === 'inline'
    && /^\[[x \u00A0]\][ \u00A0]/i.test(token.content)
}

function isTaskListItem(tokens: Token[], index: number) {
  return startsWithTask(tokens[index])
    && tokens[index - 1]?.type === 'paragraph_open'
    && tokens[index - 2]?.type === 'list_item_open'
}

function html(state: StateCore, content: string) {
  const token = new state.Token('html_inline', '', 0)
  token.content = content
  return token
}

function addClass(token: Token | undefined, className: string) {
  if (!token)
    return

  const current = token.attrGet('class')
  if (!current) {
    token.attrSet('class', className)
    return
  }

  const classList = current.split(/\s+/)
  if (classList.includes(className))
    return

  token.attrSet('class', `${current} ${className}`)
}

export const mdElementPlusTaskList: PluginWithOptions<ElementPlusTaskListOptions> = (
  md,
  {
    disabled = true,
    itemClass = 'ep-task-list__item',
    listClass = 'ep-task-list',
    checkboxClass = 'ep-task-list__checkbox',
    labelClass = 'ep-task-list__label',
  } = {},
) => {
  md.core.ruler.after('inline', 'ep-task-list', (state: StateCore & { env: Record<string, number> }) => {
    const { tokens, env } = state
    env.epTaskId ||= 0

    for (let i = 2; i < tokens.length; i++) {
      if (!isTaskListItem(tokens, i))
        continue

      const inlineToken = tokens[i]
      const listItemToken = tokens[i - 2]
      const parentListToken = tokens.findLast((token, idx) => idx < i - 2 && token.level === listItemToken.level - 1 && token.type.endsWith('list_open'))
      const children = inlineToken.children
      if (!children)
        continue

      addClass(listItemToken, itemClass)
      addClass(parentListToken, listClass)

      const textToken = children.find(child => child.type === 'text')
      if (!textToken)
        continue

      const checked = /^\[x\]/i.test(textToken.content)
      textToken.content = textToken.content.replace(/^\[[x \u00A0]\][ \u00A0]?/i, '')

      const id = `ep-task-${env.epTaskId++}`
      const input = `<span class="el-checkbox__input${checked ? ' is-checked' : ''}${disabled ? ' is-disabled' : ''}">
        <span class="el-checkbox__inner"></span>
        <input id="${id}" class="el-checkbox__original" type="checkbox" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} aria-checked="${checked ? 'true' : 'false'}" role="presentation">
      </span>`

      children.unshift(
        html(state, `<label class="el-checkbox ${checkboxClass}" for="${id}" role="checkbox" aria-checked="${checked ? 'true' : 'false'}">`),
        html(state, `${input}<span class="el-checkbox__label ${labelClass}">`),
      )
      children.push(html(state, '</span></label>'))
    }

    return true
  })
}
