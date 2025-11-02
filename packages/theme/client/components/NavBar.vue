<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core';
import { useData } from 'vitepress';
import VPNavBarAppearance from 'vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue';
import VPNavBarExtra from 'vitepress/dist/client/theme-default/components/VPNavBarExtra.vue';
import VPNavBarHamburger from 'vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue';
import VPNavBarMenu from 'vitepress/dist/client/theme-default/components/VPNavBarMenu.vue';
import VPNavBarSocialLinks from 'vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue';
import VPNavBarTranslations from 'vitepress/dist/client/theme-default/components/VPNavBarTranslations.vue';
import { ref, watchPostEffect } from 'vue';
import VPNavBarTitle from './NavBarTitle.vue';
import VPNavBarSearch from './VPNavBarSearch.vue';

const props = defineProps<{
  isScreenOpen: boolean
}>();

defineEmits<{
  (e: 'toggle-screen'): void
}>();

const { y } = useWindowScroll();
const { frontmatter } = useData();
const classes = ref<Record<string, boolean>>({});

watchPostEffect(() => {
  classes.value = {
    'home': frontmatter.value.layout === 'home',
    'top': y.value === 0,
    'screen-open': props.isScreenOpen,
  };
});
</script>

<template>
  <div class="VPNavBar" :class="classes">
    <div class="wrapper">
      <div class="container">
        <div class="title">
          <VPNavBarTitle>
            <template #nav-bar-title-before>
              <slot name="nav-bar-title-before" />
            </template>
            <template #nav-bar-title-after>
              <slot name="nav-bar-title-after" />
            </template>
          </VPNavBarTitle>
        </div>

        <div class="content">
          <div class="content-body">
            <slot name="nav-bar-content-before" />
            <VPNavBarSearch class="search" />
            <VPNavBarMenu class="menu" />
            <VPNavBarTranslations class="translations" />
            <VPNavBarAppearance class="appearance" />
            <VPNavBarSocialLinks class="social-links" />
            <VPNavBarExtra class="extra" />
            <slot name="nav-bar-content-after" />
            <VPNavBarHamburger class="hamburger" :active="isScreenOpen" @click="$emit('toggle-screen')" />
          </div>
        </div>
      </div>
    </div>

    <div class="divider">
      <div class="divider-line" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.VPNavBar {
  position: relative;
  height: var(--vp-nav-height);
  pointer-events: none;
  white-space: nowrap;
  transition: background-color 0.25s;
  background-image: radial-gradient(transparent 1px, var(--vp-c-bg) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);
}

.VPNavBar.screen-open {
  transition: none;
  background-color: var(--vp-nav-bg-color);
  border-bottom: 1px solid var(--vp-c-divider);
}

.VPNavBar:not(.home) {
  background-color: var(--vp-nav-bg-color);
}

:deep(.VPNavBarMenuLink) {
  border-bottom: 2px solid transparent;
}

:deep(.VPNavBarMenuLink.active) {
  border-bottom-color: var(--vp-c-brand-1);
}

@media (min-width: 960px) {
  .VPNavBar:not(.home) {
    background-color: transparent;
  }
}

.wrapper {
  padding: 0 8px 0 24px;
}

@media (min-width: 768px) {
  .wrapper {
    padding: 0 32px;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  height: var(--vp-nav-height);
  pointer-events: none;
}

.container > .title,
.container > .content {
  pointer-events: none;
}

.container :deep(*) {
  pointer-events: auto;
}

.title {
  flex-shrink: 0;
  height: calc(var(--vp-nav-height) - 1px);
  transition: background-color 0.5s;
}

.content {
  flex-grow: 1;
}

.content-body {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: var(--vp-nav-height);
  transition: background-color 0.5s;
}

@media (max-width: 767px) {
  .content-body {
    column-gap: 0.5rem;
  }
}

.menu + .translations::before,
.menu + .appearance::before,
.menu + .social-links::before,
.translations + .appearance::before,
.appearance + .social-links::before {
  margin-right: 8px;
  margin-left: 8px;
  width: 1px;
  height: 24px;
  background-color: var(--vp-c-divider);
  content: '';
}

.menu + .appearance::before,
.translations + .appearance::before {
  margin-right: 16px;
}

.appearance + .social-links::before {
  margin-left: 16px;
}

.social-links {
  margin-right: -8px;
}

.divider {
  width: 100%;
  height: 1px;
}

.divider-line {
  width: 100%;
  height: 1px;
  transition: background-color 0.5s;
  background-color: var(--vp-c-gutter);
}
</style>
