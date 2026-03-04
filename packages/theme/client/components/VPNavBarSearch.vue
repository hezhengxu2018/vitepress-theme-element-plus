<script lang="ts" setup>
import { ChatDotSquare } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { useData } from 'vitepress'
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue'
import { computed } from 'vue'
import { useAskAIPanel } from '../hooks/useAskAIPanel'
import 'element-plus/theme-chalk/el-button.css'
// compatible with vitepress-plugin-pagefind

const { theme } = useData()
const { isOpen, toggle } = useAskAIPanel()

const askAiConfig = computed(() => (theme.value as {
  askAi?: {
    enabled?: boolean
    triggerText?: string
  }
}).askAi)

const showAskAiButton = computed(() => askAiConfig.value?.enabled === true)
const askAiTriggerText = computed(() => askAiConfig.value?.triggerText || 'Ask AI')
</script>

<template>
  <div class="VPNavBarSearchWrap" :class="{ 'ask-ai-enabled': showAskAiButton }">
    <VPNavBarSearch v-show="!isOpen" class="search" />
    <ElButton
      v-if="showAskAiButton"
      class="ask-ai-trigger"
      type="default"
      text
      bg
      :icon="ChatDotSquare"
      @click="toggle"
    >
      {{ askAiTriggerText }}
    </ElButton>
  </div>
</template>

<style>
.VPNavBarSearchWrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ask-ai-trigger {
  display: none;
}

@media (min-width: 960px) {
  .ask-ai-trigger {
    display: inline-flex;
    align-items: center;
  }
}

@media (min-width: 768px) {
  .VPNavBarSearch.VPNavBarSearch {
    flex-grow: unset;
    padding-right: 24px;
  }

  .VPNavBarSearchWrap.ask-ai-enabled .search.VPNavBarSearch.VPNavBarSearch {
    padding-right: 0;
  }
}

@media (min-width: 960px) {
  .VPNavBarSearch.VPNavBarSearch {
    padding-right: 32px;
  }

  .VPNavBarSearchWrap.ask-ai-enabled .search.VPNavBarSearch.VPNavBarSearch {
    padding-right: 0;
  }
}
</style>
