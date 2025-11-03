<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import { useLayout } from 'vitepress/theme'
import { useBackTop } from "../hooks/useBackTop";
import { ElButton } from "element-plus";
import "element-plus/theme-chalk/el-button.css";

defineProps<{
  open: boolean
}>()

defineEmits<{
  (e: 'open-menu'): void
}>()

const { theme } = useData()
const { isHome, hasSidebar, headers, hasLocalNav } = useLayout()
const { y } = useWindowScroll()

const navHeight = ref(0)

onMounted(() => {
  navHeight.value = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--vp-nav-height'
    )
  )
})

const classes = computed(() => {
  return {
    VPLocalNav: true,
    'has-sidebar': hasSidebar.value,
    empty: !hasLocalNav.value,
    fixed: !hasLocalNav.value && !hasSidebar.value
  }
})

const { shouldShow, scrollToTop } = useBackTop()
</script>

<template>
  <div
    v-if="!isHome && (hasLocalNav || hasSidebar || y >= navHeight)"
    :class="classes"
  >
    <div class="container">
      <button
        v-if="hasSidebar"
        class="menu"
        :aria-expanded="open"
        aria-controls="VPSidebarNav"
        @click="$emit('open-menu')"
      >
        <span class="vpi-align-left menu-icon"></span>
        <span class="menu-text">
          {{ theme.sidebarMenuLabel || 'Menu' }}
        </span>
      </button>
      <Transition name="shifting">
        <ElButton
          :class="{ 'go-back-top': true, show: shouldShow }"
          link
          class="height-5"
          @click.prevent.stop="scrollToTop"
        >
          Back to top
        </ElButton>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.VPLocalNav {
  position: sticky;
  top: 0;
  /*rtl:ignore*/
  left: 0;
  z-index: var(--vp-z-index-local-nav);
  border-bottom: 1px solid var(--vp-c-gutter);
  padding-top: var(--vp-layout-top-height, 0px);
  width: 100%;
  background-color: var(--vp-local-nav-bg-color);
  overflow: hidden;
}

.VPLocalNav.fixed {
  position: fixed;
}

@media (min-width: 960px) {
  .VPLocalNav {
    display: none;
  }
}

@media (min-width: 1440px) {
  .VPLocalNav {
    display: none;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu {
  display: flex;
  align-items: center;
  line-height: 24px;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.menu:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

@media (min-width: 960px) {
  .menu {
    display: none;
  }
}

.menu-icon {
  margin-right: 8px;
  font-size: 16px;
}

.menu,
:deep(.VPLocalNavOutlineDropdown > button) {
  padding: 12px 24px 11px;
}

@media (min-width: 768px) {
  .menu,
  :deep(.VPLocalNavOutlineDropdown > button) {
    padding: 12px 32px 11px;
  }
}

.go-back-top {
  transform: translateY(100%);
  opacity: 0;
  padding: 12px 32px 11px;

  &.show {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>