<script setup lang="ts">
import type { HookFetchRequest } from 'hook-fetch'
import type { BubbleListItemProps } from 'vue-element-plus-x/types/BubbleList'
import { ElButton } from 'element-plus'
import hookFetch from 'hook-fetch'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { BubbleList, Sender, useXStream } from 'vue-element-plus-x'
import AiMarkdownRenderer from './AiMarkdownRenderer.vue'

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
}

interface AskResponse {
  answer?: string
  error?: string
}

interface BubbleItem extends BubbleListItemProps {
  id: number
  role: ChatMessage['role']
}

const endpoint = import.meta.env.VITE_ASK_AI_ENDPOINT || '/api/ask'
const sseOptions = {
  doneSymbol: '[DONE]',
}

const askClient = hookFetch.create({
  headers: {
    'content-type': 'application/json',
  },
  withCredentials: true,
})
const senderInputStyle = {
  resize: 'none',
  maxHeight: '176px',
  maxWidth: '100%',
  minHeight: '22px',
  height: 'auto',
}
const senderAutoSize = {
  minRows: 1,
  maxRows: 6,
}

const messages = ref<ChatMessage[]>([])
const input = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const activeAssistantId = ref<number | null>(null)
const { startStream, cancel: cancelStream, data: streamData, error: streamError } = useXStream()
const streamCursor = ref(0)
const streamAssistantId = ref<number | null>(null)
let messageId = 0
let currentRequest: HookFetchRequest<unknown, unknown> | null = null

const canSubmit = computed(() => {
  return input.value.trim().length > 0 && !isLoading.value
})

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

function appendMessage(message: Omit<ChatMessage, 'id'>) {
  const id = ++messageId
  messages.value.push({
    id,
    ...message,
  })
  return id
}

function getMessageById(id: number) {
  return messages.value.find(message => message.id === id)
}

function appendAssistantChunk(id: number, chunk: string) {
  if (!chunk)
    return
  const assistantMessage = getMessageById(id)
  if (!assistantMessage)
    return
  assistantMessage.content += chunk
}

function extractTextFromPayload(payload: unknown, depth = 0): string {
  if (depth > 4)
    return ''

  if (typeof payload === 'string')
    return payload

  if (Array.isArray(payload))
    return payload.map(item => extractTextFromPayload(item, depth + 1)).join('')

  if (!payload || typeof payload !== 'object')
    return ''

  const record = payload as Record<string, unknown>
  const directText = ['response', 'text', 'delta', 'token', 'content', 'output_text']
    .find(key => typeof record[key] === 'string')
  if (directText)
    return record[directText] as string

  return extractTextFromPayload(record.data, depth + 1)
}

function parseDataLine(dataValue: unknown) {
  if (dataValue == null)
    return ''

  const rawLine = typeof dataValue === 'string' ? dataValue : String(dataValue)
  const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine
  // SSE `data:` value may have one optional leading space.
  const normalizedLine = line.startsWith(' ') ? line.slice(1) : line

  if (!normalizedLine || normalizedLine.trim() === sseOptions.doneSymbol)
    return ''

  try {
    const payload = JSON.parse(normalizedLine) as unknown
    return extractTextFromPayload(payload)
  }
  catch {
    return normalizedLine
  }
}

async function resolveErrorMessage(error: unknown) {
  if (error && typeof error === 'object') {
    const errorObject = error as {
      message?: unknown
      response?: unknown
      status?: unknown
    }

    if (errorObject.response instanceof Response) {
      try {
        const payload = await errorObject.response.clone().json() as AskResponse
        if (typeof payload?.error === 'string' && payload.error)
          return payload.error
      }
      catch {
        // Ignore parse error and fallback to generic message.
      }

      if (typeof errorObject.status === 'number')
        return `Request failed (${errorObject.status})`
    }

    if (typeof errorObject.message === 'string' && errorObject.message)
      return errorObject.message
  }

  if (error instanceof Error && error.message)
    return error.message

  return '请求失败，请稍后重试。'
}

function clearMessages() {
  if (isLoading.value)
    return
  messages.value = []
  errorMessage.value = ''
}

async function sendMessage(internalValue?: string) {
  const query = (typeof internalValue === 'string' ? internalValue : input.value).trim()
  if (!query || isLoading.value)
    return

  errorMessage.value = ''
  appendMessage({
    role: 'user',
    content: query,
  })
  const assistantId = appendMessage({
    role: 'assistant',
    content: '',
  })
  activeAssistantId.value = assistantId
  input.value = ''
  isLoading.value = true

  try {
    const request = askClient.post(endpoint, {
      query,
      stream: true,
    })
    currentRequest = request
    const response = await request.response

    if (response.body) {
      streamCursor.value = 0
      streamAssistantId.value = assistantId
      await startStream({ readableStream: response.body })

      if (streamError.value)
        throw streamError.value
    }
    else {
      let payload: AskResponse | undefined
      try {
        payload = await response.json() as AskResponse
      }
      catch {
        payload = undefined
      }
      appendAssistantChunk(assistantId, payload?.answer || '')
    }

    const assistantMessage = getMessageById(assistantId)
    if (assistantMessage && !assistantMessage.content.trim()) {
      assistantMessage.content = '未返回答案，请检查 AI Search 索引或模型配置。'
    }
  }
  catch (error) {
    const message = await resolveErrorMessage(error)
    errorMessage.value = message
    const assistantMessage = getMessageById(assistantId)
    if (assistantMessage) {
      assistantMessage.content = `请求失败：${message}`
    }
  }
  finally {
    cancelStream()
    streamAssistantId.value = null
    streamCursor.value = 0
    currentRequest = null
    isLoading.value = false
    activeAssistantId.value = null
  }
}

watch(
  () => streamData.value.length,
  (length) => {
    const assistantId = streamAssistantId.value
    if (assistantId === null || !length)
      return

    for (; streamCursor.value < length; streamCursor.value++) {
      const item = streamData.value[streamCursor.value]
      const text = parseDataLine(item.data)
      if (text)
        appendAssistantChunk(assistantId, text)
    }
  },
  { flush: 'sync' },
)

onBeforeUnmount(() => {
  cancelStream()
  currentRequest?.abort()
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
      :auto-size="senderAutoSize"
      :input-style="senderInputStyle"
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
