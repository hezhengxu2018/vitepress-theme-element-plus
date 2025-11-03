<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import VPSidebarItem from './SidebarItem.vue';

defineProps<{
  items: (DefaultTheme.SidebarItem & { hide?: boolean })[]
}>();

const disableTransition = ref(true);
let timer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  timer = setTimeout(() => {
    timer = null;
    disableTransition.value = false;
  }, 300);
});

onBeforeUnmount(() => {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
});
</script>

<template>
  <template
    v-for="item in items"
    :key="item.link"
  >
    <div
      v-if="!item.hide"
      class="group"
      :class="{ 'no-transition': disableTransition }"
    >
      <VPSidebarItem :item="item" :depth="0" />
    </div>
  </template>
</template>

<style scoped lang="scss">
.no-transition :deep(.caret-icon) {
  transition: none;
}

.group + .group {
  padding-top: 24px;
}
</style>
