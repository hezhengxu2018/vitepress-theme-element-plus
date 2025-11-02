<script lang="ts" setup>
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue';
// compatible with vitepress-plugin-pagefind
</script>

<template>
  <VPNavBarSearch />
</template>

<style>
@media (min-width: 768px) {
  .VPNavBarSearch.VPNavBarSearch {
    flex-grow: unset;
    padding-right: 24px;
  }
}

@media (min-width: 960px) {
  .VPNavBarSearch.VPNavBarSearch {
    padding-right: 32px;
  }
}
</style>