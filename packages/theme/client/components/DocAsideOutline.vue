<script setup lang="ts">
import { ElAnchor, ElAnchorLink } from 'element-plus';
import { onContentUpdated, useData } from 'vitepress';
import { shallowRef } from 'vue';
import {
  getHeaders,
  type MenuItem,
  resolveTitle
} from '../utils/client/outline';
import 'element-plus/dist/index.css'

const { frontmatter, theme } = useData();

const headers = shallowRef<MenuItem[]>([]);

onContentUpdated(() => {
  headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline);
});
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
          v-for="{ link, title, children } in headers"
          :key="link"
          :href="link"
          :title="title"
        >
          <template v-if="children" #sub-link>
            <ElAnchorLink
              v-for="{ link: childLink, title: childTitle } in children"
              :key="childLink"
              :href="childLink"
              :title="childTitle"
            />
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
}

.content {
  position: relative;
  padding-left: 16px;
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
</style>
