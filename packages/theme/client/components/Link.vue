<script lang="ts" setup>
import { ElIcon } from 'element-plus';
import { computed } from 'vue';
import { EXTERNAL_URL_RE } from "vitepress/dist/client/shared";
import { normalizeLink } from "vitepress/dist/client/theme-default/support/utils";

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
      <i-ri-external-link-line class="link-icon" />
    </ElIcon>
  </component>
</template>
