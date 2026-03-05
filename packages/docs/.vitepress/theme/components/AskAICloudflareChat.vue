<script setup lang="ts">
import type { BubbleListItemProps } from 'vue-element-plus-x/types/BubbleList'
import type { ChatMessage } from '../composables/useAskAICloudflareChat'
import { ElButton } from 'element-plus'
import { computed } from 'vue'
import { BubbleList, Sender } from 'vue-element-plus-x'
import { useAskAICloudflareChat } from '../composables/useAskAICloudflareChat'
import AiMarkdownRenderer from './AiMarkdownRenderer.vue'

interface BubbleItem extends BubbleListItemProps {
  id: number
  role: ChatMessage['role']
}

const {
  messages,
  input,
  isLoading,
  errorMessage,
  activeAssistantId,
  canSubmit,
  clearMessages,
  sendMessage,
} = useAskAICloudflareChat()

const bubbleList = computed<BubbleItem[]>(() => {
  return messages.value.map((message) => {
    const isAssistant = message.role === 'assistant'
    const isCurrentStreaming = activeAssistantId.value === message.id && isLoading.value

    return {
      id: message.id,
      role: message.role,
      content: message.content,
      placement: isAssistant ? 'start' : 'end',
      variant: isAssistant ? 'borderless' : 'filled',
      noStyle: isAssistant,
      loading: isCurrentStreaming && !message.content,
      maxWidth: 'calc(--vp-ask-ai-panel-width - 40px)',
    }
  })
})
</script>

<template>
  <section class="ask-ai-chat">
    <p v-if="!messages.length" class="ask-ai-chat__placeholder">
      输入问题后将调用 Cloudflare AI Search 返回答案。
    </p>

    <BubbleList
      class="ask-ai-chat__bubble-list"
      :list="bubbleList"
      :auto-scroll="true"
      max-height="100%"
      show-back-button
    >
      <template #content="{ item }">
        <ClientOnly v-if="item.role === 'assistant'">
          <AiMarkdownRenderer
            :markdown="item.content || ''"
            :enable-breaks="true"
          />
          <template #fallback>
            <span class="ask-ai-message__plain">{{ item.content }}</span>
          </template>
        </ClientOnly>
        <span v-else class="ask-ai-message__plain">{{ item.content }}</span>
      </template>
    </BubbleList>

    <div class="ask-ai-chat__status">
      <p v-if="errorMessage" class="ask-ai-chat__error">
        {{ errorMessage }}
      </p>
      <ElButton
        v-if="messages.length"
        size="small"
        text
        type="primary"
        :disabled="isLoading"
        @click="clearMessages"
      >
        清空会话
      </ElButton>
    </div>

    <Sender
      v-model="input"
      class="ask-ai-chat__sender"
      :loading="isLoading"
      :submit-btn-disabled="!canSubmit"
      :allow-speech="false"
      clearable
      placeholder="请输入问题"
      @submit="sendMessage"
    />
  </section>
</template>

<style scoped>
.ask-ai-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: 12px;
}

.ask-ai-chat__placeholder {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.ask-ai-chat__bubble-list {
  flex: 1;
  min-height: 0;
}

.ask-ai-chat__bubble-list :deep(.el-bubble:not(.el-bubble-no-style) .el-bubble-content-wrapper .el-bubble-content) {
  padding: 8px 11px;
  font-size: 13px;
  line-height: 1.55;
  min-height: auto;
  --bubble-content-max-width: 340px;
}

.ask-ai-chat__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 20px;
}

.ask-ai-chat__error {
  margin: 0;
  color: var(--vp-c-danger-1);
  font-size: 12px;
}

.ask-ai-chat__sender {
  flex-shrink: 0;
}

.ask-ai-chat__sender :deep(.el-textarea__inner) {
  height: auto !important;
  min-height: 22px !important;
}

.ask-ai-message__plain {
  white-space: pre-wrap;
}
</style>
