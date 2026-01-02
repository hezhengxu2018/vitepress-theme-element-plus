import type { DefaultTheme } from 'vitepress'
import { useMediaQuery } from '@vueuse/core'
import { useData } from 'vitepress'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { NOT_ARTICLE_LAYOUTS } from '../../shared/constants'
import { ensureStartingSlash } from '../utils/common'

export function useSidebar() {
  const { frontmatter, theme, page } = useData()
  const is960 = useMediaQuery('(min-width: 960px)')
  const isOpen = ref(false)
  const sidebar = ref<DefaultTheme.SidebarItem[]>([])

  function updateSidebar() {
    const sidebarConfig = theme.value.sidebar
    const relativePath = page.value?.relativePath ?? '/'
    const nextSidebar = resolveSidebar(sidebarConfig, relativePath)

    if (JSON.stringify(nextSidebar) !== JSON.stringify(sidebar.value))
      sidebar.value = nextSidebar
  }

  watch(
    () => [page.value?.relativePath, theme.value.sidebar],
    () => updateSidebar(),
    { immediate: true, deep: true, flush: 'sync' },
  )

  const hasSidebar = computed(() => {
    return (
      frontmatter.value.sidebar !== false
      && sidebar.value.length > 0
      && frontmatter.value.layout !== 'home'
    )
  })

  const hasAside = computed(() => {
    if (NOT_ARTICLE_LAYOUTS.includes(frontmatter.value.layout))
      return false

    if (frontmatter.value.aside !== undefined && frontmatter.value.aside !== null)
      return !!frontmatter.value.aside

    return theme.value.aside !== false
  })

  const leftAside = computed(() => {
    if (!hasAside.value)
      return false

    return frontmatter.value.aside === null
      ? theme.value.aside === 'left'
      : frontmatter.value.aside === 'left'
  })

  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value)

  const sidebarGroups = computed(() => {
    return hasSidebar.value ? groupSidebarItems(sidebar.value) : []
  })

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value ? close() : open()
  }

  return {
    isOpen,
    sidebar,
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
    isSidebarEnabled,
    open,
    close,
    toggle,
  }
}

export function useCloseSidebarOnEscape() {
  let triggerElement: HTMLButtonElement | undefined
  const { isOpen, close } = useSidebar()

  watchEffect(() => {
    triggerElement = isOpen.value
      ? (document.activeElement as HTMLButtonElement)
      : undefined
  })

  onMounted(() => {
    window.addEventListener('keyup', onEscape)
  })

  onUnmounted(() => {
    window.removeEventListener('keyup', onEscape)
  })

  function onEscape(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen.value) {
      close()
      triggerElement?.focus()
    }
  }
}

function resolveSidebar(
  sidebarConfig: DefaultTheme.Sidebar | undefined,
  relativePath: string,
): DefaultTheme.SidebarItem[] {
  if (!sidebarConfig)
    return []

  if (Array.isArray(sidebarConfig))
    return withBase(sidebarConfig)

  const normalizedPath = ensureStartingSlash(relativePath)
  const matchingDir = Object.keys(sidebarConfig)
    .sort((a, b) => b.split('/').length - a.split('/').length)
    .find(dir => normalizedPath.startsWith(ensureStartingSlash(dir)))

  const matched = matchingDir ? sidebarConfig[matchingDir] : []

  if (Array.isArray(matched))
    return withBase(matched)

  return withBase(matched?.items ?? [], matched?.base)
}

function withBase(
  items: DefaultTheme.SidebarItem[],
  base?: string,
): DefaultTheme.SidebarItem[] {
  return items.map((_item) => {
    const item: DefaultTheme.SidebarItem = { ..._item }
    const resolvedBase = item.base || base

    if (resolvedBase && item.link) {
      item.link = resolvedBase
        + item.link.replace(/^\//, resolvedBase.endsWith('/') ? '' : '/')
    }

    if (item.items)
      item.items = withBase(item.items, resolvedBase)

    return item
  })
}

function groupSidebarItems(
  sidebarItems: DefaultTheme.SidebarItem[],
): DefaultTheme.SidebarItem[] {
  const groups: DefaultTheme.SidebarItem[] = []
  let lastGroupIndex = 0

  sidebarItems.forEach((item) => {
    if (item.items && item.items.length) {
      lastGroupIndex = groups.push(item)
      return
    }

    if (!groups[lastGroupIndex])
      groups.push({ items: [] })

    const group = groups[lastGroupIndex]
    if (!group.items)
      group.items = []

    group.items.push(item)
  })

  return groups
}
