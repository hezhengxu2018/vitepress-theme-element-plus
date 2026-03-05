<script setup lang="ts">
import { ArrowRightBold } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
import { useAskAIPanel } from '../hooks/useAskAIPanel'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Chat',
})

const { isOpen, open, close, toggle } = useAskAIPanel()
</script>

<template>
  <aside class="VPAskAIPanel" :class="{ 'is-open': isOpen }" aria-live="polite">
    <div class="ask-ai-panel__inner">
      <header class="ask-ai-panel__header">
        <slot name="header" :is-open="isOpen" :open="open" :close="close" :toggle="toggle">
          <h2 class="ask-ai-panel__title">
            {{ title }}
          </h2>
          <ElIcon class="ask-ai-panel__close" @click="close">
            <ArrowRightBold />
          </ElIcon>
        </slot>
      </header>

      <section class="ask-ai-panel__body">
        <slot :is-open="isOpen" :open="open" :close="close" :toggle="toggle" />
      </section>

      <footer v-if="$slots.footer" class="ask-ai-panel__footer">
        <slot name="footer" :is-open="isOpen" :open="open" :close="close" :toggle="toggle" />
      </footer>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.VPAskAIPanel {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  min-height: 100vh;
  border-left: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
}

.ask-ai-panel__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ask-ai-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
}

.ask-ai-panel__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-text-1);
}

.ask-ai-panel__close {
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.ask-ai-panel__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 18px;
}

.ask-ai-panel__footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 14px 18px;
}
</style>
