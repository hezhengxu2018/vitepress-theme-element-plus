<script setup lang="ts">
import type { BubbleListItemProps } from 'vue-element-plus-x/types/BubbleList'
import { ElButton } from 'element-plus'
import { computed, defineAsyncComponent, ref } from 'vue'
import { BubbleList, Sender } from 'vue-element-plus-x'

interface ChatSource {
  file: string
  score: number | null
}

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
}

interface AskResponse {
  answer?: string
  sources?: ChatSource[]
  error?: string
}

interface BubbleItem extends BubbleListItemProps {
  id: number
  role: ChatMessage['role']
  sources?: ChatSource[]
}

const endpoint = import.meta.env.VITE_ASK_AI_ENDPOINT || '/api/ask'
const XMarkdownClient = defineAsyncComponent(
  () => import('vue-element-plus-x/es/XMarkdown/index.js'),
)
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
let messageId = 0

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
      variant: isAssistant ? 'outlined' : 'filled',
      loading: isCurrentStreaming && !message.content,
      sources: message.sources,
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

function updateAssistantSources(id: number, sources: ChatSource[]) {
  if (!sources.length)
    return
  const assistantMessage = getMessageById(id)
  if (!assistantMessage)
    return
  assistantMessage.sources = sources
}

function normalizeSources(value: unknown): ChatSource[] {
  if (!Array.isArray(value))
    return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object')
        return null
      const source = item as Record<string, unknown>
      const file = typeof source.file === 'string'
        ? source.file
        : typeof source.filename === 'string'
          ? source.filename
          : null
      if (!file)
        return null
      const rawScore = source.score
      return {
        file,
        score: typeof rawScore === 'number' ? rawScore : null,
      } as ChatSource
    })
    .filter((item): item is ChatSource => Boolean(item))
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

function extractSourcesFromPayload(payload: unknown, depth = 0): ChatSource[] {
  if (depth > 4 || !payload || typeof payload !== 'object')
    return []

  const record = payload as Record<string, unknown>
  const normalized = normalizeSources(record.sources)
  if (normalized.length)
    return normalized

  return extractSourcesFromPayload(record.data, depth + 1)
}

function parseDataLine(dataLine: string) {
  if (dataLine === '[DONE]') {
    return { text: '', sources: [] as ChatSource[] }
  }

  try {
    const payload = JSON.parse(dataLine) as unknown
    return {
      text: extractTextFromPayload(payload),
      sources: extractSourcesFromPayload(payload),
    }
  }
  catch {
    return { text: dataLine, sources: [] as ChatSource[] }
  }
}

function consumeSSEBuffer(buffer: string) {
  const textChunks: string[] = []
  let latestSources: ChatSource[] = []
  let cursor = buffer
  let separator = cursor.indexOf('\n\n')

  while (separator !== -1) {
    const eventBlock = cursor.slice(0, separator)
    cursor = cursor.slice(separator + 2)

    const dataLines = eventBlock
      .split('\n')
      .filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).trimStart())

    dataLines.forEach((dataLine) => {
      const { text, sources } = parseDataLine(dataLine)
      if (text)
        textChunks.push(text)
      if (sources.length)
        latestSources = sources
    })

    separator = cursor.indexOf('\n\n')
  }

  return {
    remaining: cursor,
    textChunks,
    latestSources,
  }
}

async function streamAssistantResponse(response: Response, assistantId: number) {
  if (!response.body)
    return

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let isSSE = false
  let sseBuffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done)
      break
    if (!value)
      continue

    const chunk = decoder.decode(value, { stream: true })
    if (!chunk)
      continue

    if (isSSE || chunk.includes('data:') || chunk.includes('event:')) {
      isSSE = true
      sseBuffer += chunk.replace(/\r\n/g, '\n')
      const { remaining, textChunks, latestSources } = consumeSSEBuffer(sseBuffer)
      sseBuffer = remaining
      textChunks.forEach(text => appendAssistantChunk(assistantId, text))
      updateAssistantSources(assistantId, latestSources)
    }
    else {
      appendAssistantChunk(assistantId, chunk)
    }
  }

  const tail = decoder.decode()
  if (tail) {
    if (isSSE) {
      sseBuffer += tail
      const { textChunks, latestSources } = consumeSSEBuffer(`${sseBuffer}\n\n`)
      textChunks.forEach(text => appendAssistantChunk(assistantId, text))
      updateAssistantSources(assistantId, latestSources)
    }
    else {
      appendAssistantChunk(assistantId, tail)
    }
  }
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
    sources: [],
  })
  activeAssistantId.value = assistantId
  input.value = ''
  isLoading.value = true

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query, stream: true }),
    })

    if (!response.ok) {
      let payload: AskResponse | undefined
      try {
        payload = await response.json() as AskResponse
      }
      catch {
        payload = undefined
      }
      throw new Error(payload?.error || `Request failed (${response.status})`)
    }

    await streamAssistantResponse(response, assistantId)

    const assistantMessage = getMessageById(assistantId)
    if (assistantMessage && !assistantMessage.content.trim()) {
      assistantMessage.content = '未返回答案，请检查 AI Search 索引或模型配置。'
    }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '请求失败，请稍后重试。'
    errorMessage.value = message
    const assistantMessage = getMessageById(assistantId)
    if (assistantMessage) {
      assistantMessage.content = `请求失败：${message}`
      assistantMessage.sources = []
    }
  }
  finally {
    isLoading.value = false
    activeAssistantId.value = null
  }
}

function formatScore(score: number | null) {
  if (typeof score !== 'number')
    return '--'
  return score.toFixed(3)
}
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
          <XMarkdownClient
            :markdown="item.content || ''"
            :enable-breaks="true"
          />
          <template #fallback>
            <span class="ask-ai-message__plain">{{ item.content }}</span>
          </template>
        </ClientOnly>
        <span v-else class="ask-ai-message__plain">{{ item.content }}</span>
      </template>

      <template #footer="{ item }">
        <ul v-if="item.sources?.length" class="ask-ai-message__sources">
          <li v-for="source in item.sources" :key="`${item.id}:${source.file}`">
            <span class="ask-ai-source__file">{{ source.file }}</span>
            <span class="ask-ai-source__score">score: {{ formatScore(source.score) }}</span>
          </li>
        </ul>
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
      placeholder="例如：如何在主题中启用 Ask AI 侧栏？"
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

.ask-ai-chat__bubble-list :deep(.el-bubble-content-wrapper .el-bubble-content) {
  padding: 8px 11px;
  font-size: 13px;
  line-height: 1.55;
  min-height: auto;
}

.ask-ai-chat__bubble-list :deep(.el-bubble-content .elx-xmarkdown-container) {
  padding: 0;
  border-radius: 0;
  color: inherit;
}

.ask-ai-chat__bubble-list :deep(.el-bubble-content pre),
.ask-ai-chat__bubble-list :deep(.el-bubble-content code) {
  font-size: 12px;
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

.ask-ai-message__sources {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ask-ai-message__sources li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
}

.ask-ai-source__file {
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ask-ai-source__score {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}
</style>
