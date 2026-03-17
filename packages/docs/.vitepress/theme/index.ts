import type { MobilePreviewRegistry } from 'vitepress-theme-element-plus'
import { ElTag } from 'element-plus'
import {
  VitepressEpDemoBox,
  VitepressEpDemoPlaceholder,
} from 'vitepress-better-demo-plugin/theme/element-plus'
import Theme, {
  mobilePreviewRegistryKey,
} from 'vitepress-theme-element-plus'
import 'virtual:group-icons.css'

const mobilePreviewRegistry = Object.fromEntries(
  Object.entries(import.meta.glob('../../**/*.vue')).map(([path, loader]) => [
    path.replace('../../', ''),
    loader,
  ]),
) as MobilePreviewRegistry

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp?.(ctx)

    const { app } = ctx
    app.component('ElTag', ElTag)
    app.component('VitepressDemoBox', VitepressEpDemoBox)
    app.component('VitepressDemoPlaceholder', VitepressEpDemoPlaceholder)
    app.provide(mobilePreviewRegistryKey, mobilePreviewRegistry)
  },
} as typeof Theme
