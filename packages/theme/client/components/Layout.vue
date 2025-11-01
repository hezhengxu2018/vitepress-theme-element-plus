<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue';
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue';
import { layoutInfoInjectionKey, registerWatchers } from 'vitepress/dist/client/theme-default/composables/layout'
import { useSidebarControl } from 'vitepress/dist/client/theme-default/composables/sidebar'
import { computed, provide, useSlots, watch } from 'vue';
import { useCloseSidebarOnEscape } from '../hooks/useSidebar';
import Content from './Content.vue';
import VMFooter from './Footer.vue';
import LocalNav from './LocalNav.vue';
import Sidebar from './Sidebar.vue';
import Nav from './Nav.vue';

const { frontmatter } = useData();

useCloseSidebarOnEscape();
const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar
} = useSidebarControl()

const route = useRoute();
watch(() => route.path, close);

registerWatchers({ closeSidebar })

const slots = useSlots();
const heroImageSlotExists = computed(() => !!slots['home-hero-image']);

provide(layoutInfoInjectionKey, heroImageSlotExists);
</script>

<template>
  <div v-if="frontmatter.layout !== false" class="Layout VMLayout" :class="frontmatter.pageClass">
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

    <VMFooter />
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
</style>
