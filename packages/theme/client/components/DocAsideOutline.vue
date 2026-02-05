<script setup lang="ts">
import type { MenuItem } from '../utils/client/outline'
import { ElAnchor, ElAnchorLink } from 'element-plus'
import { onContentUpdated, useData } from 'vitepress'
import { shallowRef } from 'vue'
import {
  getHeaders,

  resolveTitle,
} from '../utils/client/outline'
import 'element-plus/dist/index.css'

const { frontmatter, theme } = useData()

const headers = shallowRef<MenuItem[]>([])

onContentUpdated(() => {
  headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline)
})
</script>

<template>
  <nav
    aria-labelledby="doc-outline-aria-label"
    class="VPDocAsideOutline"
    :class="{ 'has-outline': headers.length > 0 }"
  >
    <div class="content">
      <div
        id="doc-outline-aria-label"
        aria-level="2"
        class="outline-title"
        role="heading"
      >
        {{ resolveTitle(theme) }}
      </div>
      <ElAnchor :offset="70" :bound="120">
        <ElAnchorLink
          v-for="item in headers"
          :key="item.link"
          :href="item.link"
          :title="item.title"
        >
          <template #default>
            <span class="outline-link">
              <span
                class="outline-link__text"
                v-text="item.title"
              />
              <span
                v-if="item.titleTags.length"
                class="outline-link__tags"
              >
                <span
                  v-for="(tagHTML, tagIndex) in item.titleTags"
                  :key="`${item.link}-tag-${tagIndex}`"
                  class="outline-link__tag"
                  v-html="tagHTML"
                />
              </span>
            </span>
          </template>
          <template v-if="item.children && item.children.length" #sub-link>
            <ElAnchorLink
              v-for="child in item.children"
              :key="child.link"
              :href="child.link"
              :title="child.title"
            >
              <template #default>
                <span class="outline-link">
                  <span
                    class="outline-link__text"
                    v-text="child.title"
                  />
                  <template v-if="child.titleTags.length">
                    <span
                      v-for="(tagHTML, tagIndex) in child.titleTags"
                      :key="`${child.link}-tag-${tagIndex}`"
                      v-html="tagHTML"
                    />
                  </template>
                </span>
              </template>
            </ElAnchorLink>
          </template>
        </ElAnchorLink>
      </ElAnchor>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.VPDocAsideOutline {
  display: none;
}

.VPDocAsideOutline.has-outline {
  display: block;

  & :deep(.el-anchor) {
    --el-anchor-active-color: var(--vp-c-brand);
    --el-anchor-marker-bg-color: var(--vp-c-brand);
  }
}

.content {
  position: relative;
  font-size: 13px;
  font-weight: 500;
}

.outline-title {
  font-size: 12px;
  line-height: 30px;
  padding-left: 14px;
  color: var(--text-color-light);
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 0px;
}

.outline-link {
  color: inherit;
  width: 100%;
  display: inline-flex;
}

.outline-link__text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-tag) {
  transform: scale(0.6);
  margin-left: -6px;
  margin-right: -6px;
}
</style>
