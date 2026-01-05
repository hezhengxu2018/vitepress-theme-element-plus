<script setup lang="ts">
import { ElTag } from 'element-plus'
import { useData } from 'vitepress'
import VPImage from 'vitepress/dist/client/theme-default/components/VPImage.vue'
import { normalizeLink } from 'vitepress/dist/client/theme-default/support/utils.js'
import { computed } from 'vue'
import { useLangs } from '../hooks/useLangs'

const { site, theme } = useData()
const { currentLang } = useLangs()
const link = computed(() =>
  typeof theme.value.logoLink === 'string'
    ? theme.value.logoLink
    : theme.value.logoLink?.link,
)

const rel = computed(() =>
  typeof theme.value.logoLink === 'string'
    ? undefined
    : theme.value.logoLink?.rel,
)

const target = computed(() =>
  typeof theme.value.logoLink === 'string'
    ? undefined
    : theme.value.logoLink?.target,
)
</script>

<template>
  <div class="VPNavBarTitle">
    <a
      class="title"
      :href="link ?? normalizeLink(currentLang.link)"
      :rel="rel"
      :target="target"
    >
      <slot name="nav-bar-title-before" />
      <VPImage v-if="theme.logo" class="logo" :image="theme.logo" />
      <ElTag v-if="theme.version" type="primary" round>{{ theme.version }}</ElTag>
      <span v-if="theme.siteTitle" v-html="theme.siteTitle" />
      <span v-else-if="theme.siteTitle === undefined">{{ site.title }}</span>
      <slot name="nav-bar-title-after" />
    </a>
  </div>
</template>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  width: 100%;
  height: var(--vp-nav-height);
  font-size: 16px;
  color: var(--vp-c-text-1);
  transition: opacity 0.25s;
}

.title .el-tag {
  font-weight: normal;
}

@media (min-width: 960px) {
  .title {
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .title span:last-child {
    display: none;
  }
}

:deep(.logo) {
  margin-right: 14px;
  height: var(--vp-nav-logo-height);
}

:deep(.el-tag.el-tag--primary) {
  background-color: var(--bg-brand-color);
  color: var(--vp-c-brand);
  margin-right: 14px;
}
</style>
