<script lang="ts" setup>
import { ElIcon } from 'element-plus';
import { computed } from 'vue';
import { EXTERNAL_URL_RE } from "vitepress/dist/client/shared.js";
import { normalizeLink } from "vitepress/dist/client/theme-default/support/utils.js";

const props = defineProps<{
  tag?: string
  href?: string
  noIcon?: boolean
  target?: string
  rel?: string
}>();

const tag = computed(() => props.tag ?? (props.href ? 'a' : 'span'));
const isExternal = computed(
  () =>
    (props.href && EXTERNAL_URL_RE.test(props.href))
    || props.target === '_blank'
);
</script>

<template>
  <component
    :is="tag"
    class="VPLink"
    :class="{
      'link': href,
      'vp-external-link-icon': isExternal,
      'no-icon': noIcon,
    }"
    :href="href ? normalizeLink(href) : undefined"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="rel ?? (isExternal ? 'noreferrer' : undefined)"
  >
    <slot />
    <ElIcon v-if="href && isExternal && !noIcon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm11-3v8h-2V6.413l-7.793 7.794l-1.414-1.414L17.585 5H13V3z"/></svg>
    </ElIcon>
  </component>
</template>
