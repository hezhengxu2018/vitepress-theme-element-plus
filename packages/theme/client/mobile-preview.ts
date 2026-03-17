import type { InjectionKey } from 'vue'

export type MobilePreviewModule = () => Promise<unknown>

export type MobilePreviewRegistry = Record<string, MobilePreviewModule>

export interface EPMobilePreviewConfig {
  /**
   * Locale-relative path of the standalone preview page.
   *
   * @default '/preview/'
   */
  previewPath?: string
  /**
   * Outer device frame width used in the doc layout.
   *
   * @default 390
   */
  deviceWidth?: number
  /**
   * Inner viewport height used in the doc layout.
   *
   * @default 760
   */
  deviceHeight?: number
  /**
   * Root directory used to resolve the `mobileDemo` frontmatter field.
   *
   * @default 'demo/'
   */
  demoRoot?: string
}

export const mobilePreviewRegistryKey: InjectionKey<MobilePreviewRegistry> = Symbol('vitepress-theme-element-plus.mobile-preview-registry')

export function normalizeMobilePreviewId(value: string): string {
  return value
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
}

export function normalizeMobilePreviewRoot(value: string | undefined): string {
  if (!value?.trim())
    return 'demo/'

  return normalizeMobilePreviewId(value)
    .replace(/\/?$/, '/')
}

export function resolveMobilePreviewId(value: string | undefined, root: string | undefined): string {
  const normalizedId = normalizeMobilePreviewId(value ?? '')
  if (!normalizedId)
    return ''

  const normalizedRoot = normalizeMobilePreviewRoot(root)
  return normalizedId.startsWith(normalizedRoot)
    ? normalizedId
    : `${normalizedRoot}${normalizedId}`
}
