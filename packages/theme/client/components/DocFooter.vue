<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElIcon } from "element-plus";
import { useEditLink } from 'vitepress/dist/client/theme-default/composables/edit-link.js'
import { usePrevNext } from 'vitepress/dist/client/theme-default/composables/prev-next.js'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue';
import VPDocFooterLastUpdated from 'vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue';

const { theme, page, frontmatter } = useData()

const editLink = useEditLink()
const control = usePrevNext()

const hasEditLink = computed(
  () => theme.value.editLink && frontmatter.value.editLink !== false
)
const hasLastUpdated = computed(() => page.value.lastUpdated)
const showFooter = computed(
  () =>
    hasEditLink.value ||
    hasLastUpdated.value ||
    control.value.prev ||
    control.value.next
)
</script>

<template>
  <footer v-if="showFooter" class="VPDocFooter">
    <slot name="doc-footer-before" />

    <div v-if="hasEditLink || hasLastUpdated" class="edit-info">
      <div v-if="hasEditLink" class="edit-link">
        <VPLink class="edit-link-button" :href="editLink.url" :no-icon="true">
          <span class="vpi-square-pen edit-link-icon" />
          {{ editLink.text }}
        </VPLink>
      </div>

      <div v-if="hasLastUpdated" class="last-updated">
        <VPDocFooterLastUpdated />
      </div>
    </div>

    <nav
      v-if="control.prev?.link || control.next?.link"
      class="prev-next"
      aria-labelledby="doc-footer-aria-label"
    >
      <span class="visually-hidden" id="doc-footer-aria-label">Pager</span>

      <div class="pager prev">
        <a v-if="control.prev?.link" :href="control.prev.link">
          <ElIcon>
            <ArrowLeft />
          </ElIcon>
          <span class="title" v-html="control.prev.text"></span>
        </a>
      </div>
      <div class="pager next">
        <a v-if="control.next?.link" :href="control.next.link">          
          <span class="title" v-html="control.next.text"></span>
          <ElIcon>
            <ArrowRight />
          </ElIcon>
        </a>
      </div>
    </nav>
  </footer>
</template>

<style scoped>
.VPDocFooter {
  margin-top: 64px;
}

.edit-info {
  padding-bottom: 18px;
}

@media (min-width: 640px) {
  .edit-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 14px;
  }
}

.edit-link-button {
  display: flex;
  align-items: center;
  border: 0;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}

.edit-link-button:hover {
  color: var(--vp-c-brand-2);
}

.edit-link-icon {
  margin-right: 8px;
}

.prev-next {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.pager {
  display: flex;
  flex-shrink: 0;
  width: 50%;
}

.pager a {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  height: 24px;
  font-size: 14px;
  font-weight: 500;
}

.pager.next {
  justify-content: flex-end;
  padding-right: 12px;
}

.next .el-icon {
  margin-left: 4px;
}

.pager.prev {
  justify-content: flex-start;
  padding-left: 12px;
}

.prev .el-icon {
  margin-right: 4px;
}

.title {
  display: block;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}
</style>