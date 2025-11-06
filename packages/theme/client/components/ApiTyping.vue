<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue'
import { ElTooltip, ElButton } from 'element-plus'

defineProps({
  type: String,
  details: String,
})
</script>

<template>
  <span class="api-typing-container">
    <code class="api-typing">
      {{ type }}
    </code>
    <ClientOnly>
      <ElTooltip v-if="details" effect="light" trigger="click">
        <ElButton
          text
          :icon="Warning"
          aria-label="Type details"
          class="api-typing__warning-icon"
        />
        <template #content>
          <slot>
            <div class="m-1" style="max-width: 600px">
              <code
                style="
                  color: var(--code-tooltip-color);
                  background-color: var(--code-tooltip-bg-color);
                "
              >
                {{ details }}
              </code>
            </div>
          </slot>
        </template>
      </ElTooltip>
    </ClientOnly>
  </span>
</template>

<style scoped lang="scss">
.api-typing-container {
  display: inline-flex;
  align-items: center;
}
.api-typing {
  margin-right: 4px;
}
.api-typing__warning-icon {
  padding: 8px;
}
</style>