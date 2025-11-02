<script lang="ts" setup>
import { useScrollLock } from '@vueuse/core';
import { inBrowser, useData } from 'vitepress';
import { ref, watch } from 'vue';
import VPSidebarGroup from './SidebarGroup.vue';
import { useLayout } from 'vitepress/theme';

const props = defineProps<{
  open: boolean
}>();

const { sidebarGroups, hasSidebar } = useLayout();

// a11y: focus Nav element when menu has opened
const navEl = ref<HTMLElement | null>(null);
const isLocked = useScrollLock(inBrowser ? document.body : null);
watch(
  [props, navEl],
  () => {
    if (props.open) {
      isLocked.value = true;
      navEl.value?.focus();
    }
    else {
      isLocked.value = false;
    }
  },
  { immediate: true, flush: 'post' }
);

const key = ref(0);
watch(
  sidebarGroups,
  () => {
    key.value += 1;
  },
  { deep: true }
);
</script>

<template>
  <aside
    v-if="hasSidebar"
    ref="navEl"
    class="VPSidebar"
    :class="{ open: open && hasSidebar }"
    @click.stop
  >
    <nav
      id="VPSidebarNav"
      class="nav"
      aria-labelledby="sidebar-aria-label"
      tabindex="-1"
    >
      <span id="sidebar-aria-label" class="visually-hidden">
        Sidebar Navigation
      </span>

      <slot name="sidebar-nav-before" />
      <VPSidebarGroup :key="key" :items="sidebarGroups" />
      <slot name="sidebar-nav-after" />
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
.VPSidebar {
  position: fixed;
  top: var(--vp-nav-height);
  bottom: 0;
  left: 0;
  z-index: var(--vp-z-index-sidebar);
  padding: 32px 32px 96px;
  width: calc(100vw - 64px);
  max-width: 320px;
  background-color: var(--vp-c-bg);
  opacity: 0;
  box-shadow: var(--vp-c-shadow-3);
  overflow-x: hidden;
  overflow-y: auto;
  transform: translateX(-100%);
  transition:
    opacity 0.5s,
    transform 0.25s ease;
  overscroll-behavior: contain;
}

.VPSidebar.open {
  top: 0;
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  transition:
    opacity 0.25s,
    transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.dark .VPSidebar {
  box-shadow: var(--vp-shadow-1);
}

@media (min-width: 960px) {
  .VPSidebar {
    padding-top: 0;
    width: var(--vp-sidebar-width);
    max-width: 100%;
    background-color: var(--vp-c-bg);
    opacity: 1;
    visibility: visible;
    box-shadow: none;
    transform: translateX(0);
  }
}

@media (max-width: 960px) {
  .VPSidebar {
    top: 0;
  }
}

.nav {
  outline: 0;
}
</style>
