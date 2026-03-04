<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue'
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue'
import { layoutInfoInjectionKey, registerWatchers } from 'vitepress/dist/client/theme-default/composables/layout.js'
import { useSidebarControl } from 'vitepress/dist/client/theme-default/composables/sidebar.js'
import { computed, provide, useSlots, watch } from 'vue'
import { useAskAIPanel } from '../hooks/useAskAIPanel'
import { useCloseSidebarOnEscape } from '../hooks/useSidebar'
import AskAIPanel from './AskAIPanel.vue'
import Content from './Content.vue'
import LocalNav from './LocalNav.vue'
import Nav from './Nav.vue'
import Sidebar from './Sidebar.vue'

const { frontmatter, theme } = useData()

useCloseSidebarOnEscape()
const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar,
} = useSidebarControl()

const route = useRoute()
watch(() => route.path, closeSidebar)

registerWatchers({ closeSidebar })

const slots = useSlots()
const { isOpen: isAskAIPanelOpen, panelWidthStyle, setWidth } = useAskAIPanel()
const heroImageSlotExists = computed(() => !!slots['home-hero-image'])
const askAiConfig = computed(() => (theme.value as {
  askAi?: {
    enabled?: boolean
    width?: number | string
    title?: string
  }
}).askAi)
const showAskAiPanel = computed(() => askAiConfig.value?.enabled === true)
const askAiLayoutClass = computed(() => ({
  'has-ask-ai-panel': showAskAiPanel.value,
  'ask-ai-panel-open': showAskAiPanel.value && isAskAIPanelOpen.value,
}))
const askAiLayoutStyle = computed(() => ({
  '--vp-ask-ai-panel-width': panelWidthStyle.value,
}))

watch(
  () => askAiConfig.value?.width,
  width => setWidth(width),
  { immediate: true },
)

provide(layoutInfoInjectionKey, heroImageSlotExists)
</script>

<template>
  <div
    v-if="frontmatter.layout !== false"
    class="Layout VMLayout"
    :class="[frontmatter.pageClass, askAiLayoutClass]"
    :style="askAiLayoutStyle"
  >
    <slot name="layout-top" />
    <VPSkipLink />
    <VPBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar()" />
    <Nav>
      <template #nav-bar-title-before>
        <slot name="nav-bar-title-before" />
      </template>
      <template #nav-bar-title-after>
        <slot name="nav-bar-title-after" />
      </template>
      <template #nav-bar-content-before>
        <slot name="nav-bar-content-before" />
      </template>
      <template #nav-bar-content-after>
        <slot name="nav-bar-content-after" />
      </template>
      <template #nav-screen-content-before>
        <slot name="nav-screen-content-before" />
      </template>
      <template #nav-screen-content-after>
        <slot name="nav-screen-content-after" />
      </template>
    </Nav>
    <LocalNav :open="isSidebarOpen" @open-menu="openSidebar" />

    <Sidebar :open="isSidebarOpen">
      <template #sidebar-nav-before>
        <slot name="sidebar-nav-before" />
      </template>
      <template #sidebar-nav-after>
        <slot name="sidebar-nav-after" />
      </template>
    </Sidebar>

    <div class="content-layout">
      <div class="content-main">
        <Content>
          <template #page-top>
            <slot name="page-top" />
          </template>
          <template #page-bottom>
            <slot name="page-bottom" />
          </template>

          <template #not-found>
            <slot name="not-found" />
          </template>
          <template #home-hero-before>
            <slot name="home-hero-before" />
          </template>
          <template #home-hero-info-before>
            <slot name="home-hero-info-before" />
          </template>
          <template #home-hero-info>
            <slot name="home-hero-info" />
          </template>
          <template #home-hero-info-after>
            <slot name="home-hero-info-after" />
          </template>
          <template #home-hero-actions-after>
            <slot name="home-hero-actions-after" />
          </template>
          <template #home-hero-image>
            <slot name="home-hero-image" />
          </template>
          <template #home-hero-after>
            <slot name="home-hero-after" />
          </template>
          <template #home-features-before>
            <slot name="home-features-before" />
          </template>
          <template #home-features-after>
            <slot name="home-features-after" />
          </template>

          <template #doc-footer-before>
            <slot name="doc-footer-before" />
          </template>
          <template #doc-before>
            <slot name="doc-before" />
          </template>
          <template #doc-after>
            <slot name="doc-after" />
          </template>
          <template #doc-top>
            <slot name="doc-top" />
          </template>
          <template #doc-bottom>
            <slot name="doc-bottom" />
          </template>

          <template #aside-top>
            <slot name="aside-top" />
          </template>
          <template #aside-bottom>
            <slot name="aside-bottom" />
          </template>
          <template #aside-outline-before>
            <slot name="aside-outline-before" />
          </template>
          <template #aside-outline-after>
            <slot name="aside-outline-after" />
          </template>
          <template #aside-ads-before>
            <slot name="aside-ads-before" />
          </template>
          <template #aside-ads-after>
            <slot name="aside-ads-after" />
          </template>
        </Content>
      </div>

      <AskAIPanel v-if="showAskAiPanel" :title="askAiConfig?.title || 'Chat'">
        <template v-if="slots['ask-ai-panel-header']" #header="slotProps">
          <slot name="ask-ai-panel-header" v-bind="slotProps" />
        </template>
        <template v-if="slots['ask-ai-panel-content']" #default="slotProps">
          <slot name="ask-ai-panel-content" v-bind="slotProps" />
        </template>
        <template v-if="slots['ask-ai-panel-footer']" #footer="slotProps">
          <slot name="ask-ai-panel-footer" v-bind="slotProps" />
        </template>
      </AskAIPanel>
    </div>

    <slot name="layout-bottom" />
  </div>
  <Content v-else />
</template>

<style scoped lang="scss">
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-layout {
  min-height: calc(100vh - var(--vp-nav-height));
}

.content-main {
  min-width: 0;
}

@media (min-width: 960px) {
  .Layout.has-ask-ai-panel .content-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 0;
    transition: grid-template-columns 0.24s ease;
  }

  .Layout.has-ask-ai-panel.ask-ai-panel-open .content-layout {
    grid-template-columns: minmax(0, 1fr) var(--vp-ask-ai-panel-width);
  }

  .Layout.has-ask-ai-panel.ask-ai-panel-open :deep(.VPNav) {
    width: calc(100% - var(--vp-ask-ai-panel-width));
  }
}
</style>
