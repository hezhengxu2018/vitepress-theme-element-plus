<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import { useSidebar } from '../hooks/useSidebar'
import VPDocAside from './DocAside.vue'
import VPDocFooter from './DocFooter.vue'
import MobilePreviewFrame from './MobilePreviewFrame.vue'

const { theme, frontmatter } = useData()

const route = useRoute()
const { hasAside, leftAside, hasSidebar } = useSidebar()
const hasMobilePreview = computed(() => typeof frontmatter.value.mobileDemo === 'string' && frontmatter.value.mobileDemo.trim().length > 0)
const showAside = computed(() => hasAside.value)

const pageName = computed(() =>
  route.path.replace(/[./]+/g, '_').replace(/_html$/, ''),
)
</script>

<template>
  <div class="VPDoc" :class="{ 'has-sidebar': hasSidebar, 'has-aside': showAside, 'has-mobile-preview': hasMobilePreview }">
    <slot name="doc-top" />
    <div class="container">
      <div v-if="hasMobilePreview" class="preview">
        <div class="preview-container">
          <MobilePreviewFrame />
        </div>
      </div>

      <div v-if="showAside" class="aside" :class="{ 'left-aside': leftAside }">
        <div class="aside-container">
          <div class="aside-content">
            <VPDocAside>
              <template #aside-top>
                <slot name="aside-top" />
              </template>
              <template #aside-bottom>
                <slot name="aside-bottom" />
              </template>
              <template #aside-outline-before>
                <slot name="aside-outline-before" />
              </template>
              <template #aside-outline-after>
                <slot name="aside-outline-after" />
              </template>
              <template #aside-ads-before>
                <slot name="aside-ads-before" />
              </template>
              <template #aside-ads-after>
                <slot name="aside-ads-after" />
              </template>
            </VPDocAside>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="content-container">
          <slot name="doc-before" />
          <main class="main">
            <Content
              class="doc-content" :class="[
                pageName,
                theme.externalLinkIcon && 'external-link-icon-enabled',
              ]"
            />
          </main>
          <VPDocFooter>
            <template #doc-footer-before>
              <slot name="doc-footer-before" />
            </template>
          </VPDocFooter>
          <slot name="doc-after" />
        </div>
      </div>
    </div>
    <slot name="doc-bottom" />
  </div>
</template>

<style scoped lang="scss">
.VPDoc {
  padding: 32px 24px 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .VPDoc {
    padding: 48px 32px;
  }
}

@media (min-width: 960px) {
  .VPDoc {
    padding: 48px 32px;
  }

  .VPDoc:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .VPDoc:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1440px) {
  .VPDoc.has-aside {
    padding: 64px 48px 48px 64px;
  }

  .VPDoc.has-aside {
    padding: 64px 0 48px 64px;
  }

  .VPDoc .container {
    display: flex;
    justify-content: center;
  }

  .VPDoc.has-mobile-preview .container {
    gap: 32px;
  }

  .VPDoc .aside {
    display: block;
  }

  .VPDoc.has-aside.has-mobile-preview .aside {
    display: none;
  }
}

@media (min-width: 1440px) {
  .VPDoc:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .VPDoc:not(.has-sidebar) .container {
    max-width: 1104px;
  }
}

.container {
  margin: 0 auto;
  width: 100%;
}

.preview {
  margin-bottom: 24px;
  order: 2;
}

.preview-container {
  width: 100%;
  position: sticky;
  top: calc(var(--vp-nav-height) + 32px);
}

.aside {
  position: relative;
  display: none;
  order: 2;
  flex-grow: 1;
  padding-left: 64px;
  padding-right: 32px;
}

.left-aside {
  order: 1;
  padding-left: unset;
  padding-right: 32px;
  padding-left: 16px;
}

.aside-container {
  position: sticky;
  top: calc(var(--vp-nav-height) + 32px);
  margin-top: 0;
  margin-bottom: 32px;
  width: 200px;
  height: calc(100vh - var(--vp-nav-height) - 32px);
  overflow-y: auto;
  scrollbar-width: none;
}

.aside-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 32px;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 1440px) {
  .content {
    order: 1;
    margin: 0;
    min-width: 640px;
  }
}

@media (min-width: 1680px) {
  .VPDoc.has-aside.has-mobile-preview .aside {
    display: block;
  }
}

.content-container {
  margin: 0 auto;
}
</style>
