<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

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

const endpoint = import.meta.env.VITE_ASK_AI_ENDPOINT || '/api/ask'

const messages = ref<ChatMessage[]>([])
const input = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const messageContainerRef = ref<HTMLElement>()
let messageId = 0

const canSubmit = computed(() => {
  return input.value.trim().length > 0 && !isLoading.value
})

function appendMessage(message: Omit<ChatMessage, 'id'>) {
  const id = ++messageId
  messages.value.push({
    id,
    ...message,
  })
  return id
}

function appendAssistantChunk(id: number, chunk: string) {
  if (!chunk)
    return
  const assistantMessage = messages.value.find(message => message.id === id)
  if (!assistantMessage)
    return
  assistantMessage.content += chunk
}

function updateAssistantSources(id: number, sources: ChatSource[]) {
  if (!sources.length)
    return
  const assistantMessage = messages.value.find(message => message.id === id)
  if (!assistantMessage)
    return
  assistantMessage.sources = sources
}

function formatScore(score: number | null) {
  if (typeof score !== 'number')
    return '--'
  return score.toFixed(3)
}

function clearMessages() {
  messages.value = []
  errorMessage.value = ''
}

async function scrollToBottom() {
  await nextTick()
  if (!messageContainerRef.value)
    return
  messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight
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

    await scrollToBottom()
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

async function sendMessage() {
  const query = input.value.trim()
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

    const assistantMessage = messages.value.find(message => message.id === assistantId)
    if (assistantMessage && !assistantMessage.content.trim()) {
      assistantMessage.content = '未返回答案，请检查 AI Search 索引或模型配置。'
    }
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '请求失败，请稍后重试。'
    errorMessage.value = message
    const assistantMessage = messages.value.find(item => item.id === assistantId)
    if (assistantMessage) {
      assistantMessage.content = `请求失败：${message}`
      assistantMessage.sources = []
    }
  }
  finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

watch(
  () => messages.value.length,
  async () => {
    await scrollToBottom()
  },
)
</script>

<template>
  <section class="ask-ai-chat">
    <div ref="messageContainerRef" class="ask-ai-chat__messages">
      <template v-if="messages.length">
        <article
          v-for="message in messages"
          :key="message.id"
          class="ask-ai-message"
          :class="`is-${message.role}`"
        >
          <header class="ask-ai-message__header">
            {{ message.role === 'user' ? '你' : 'AI' }}
          </header>
          <p class="ask-ai-message__content">
            {{ message.content }}
          </p>
          <ul v-if="message.sources?.length" class="ask-ai-message__sources">
            <li v-for="source in message.sources" :key="`${message.id}:${source.file}`">
              <span class="ask-ai-source__file">{{ source.file }}</span>
              <span class="ask-ai-source__score">score: {{ formatScore(source.score) }}</span>
            </li>
          </ul>
        </article>
      </template>
      <p v-else class="ask-ai-chat__placeholder">
        输入问题后将调用 Cloudflare AI Search 返回答案。
      </p>
    </div>

    <p v-if="errorMessage" class="ask-ai-chat__error">
      {{ errorMessage }}
    </p>

    <form class="ask-ai-chat__form" @submit.prevent="sendMessage">
      <textarea
        v-model="input"
        class="ask-ai-chat__input"
        rows="4"
        placeholder="例如：如何在主题中启用 Ask AI 侧栏？"
      />
      <div class="ask-ai-chat__actions">
        <button
          type="button"
          class="ask-ai-chat__btn ask-ai-chat__btn-muted"
          :disabled="isLoading || messages.length === 0"
          @click="clearMessages"
        >
          清空
        </button>
        <button
          type="submit"
          class="ask-ai-chat__btn ask-ai-chat__btn-primary"
          :disabled="!canSubmit"
        >
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.ask-ai-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
}

.ask-ai-chat__messages {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ask-ai-chat__placeholder {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.ask-ai-message {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--vp-c-bg-soft);
}

.ask-ai-message.is-user {
  background: var(--vp-c-bg-elv);
}

.ask-ai-message__header {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
}

.ask-ai-message__content {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.ask-ai-message__sources {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ask-ai-message__sources li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
}

.ask-ai-source__file {
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ask-ai-source__score {
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.ask-ai-chat__error {
  margin: 0;
  color: var(--vp-c-danger-1);
  font-size: 12px;
}

.ask-ai-chat__form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ask-ai-chat__input {
  width: 100%;
  resize: vertical;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.ask-ai-chat__input:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.ask-ai-chat__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.ask-ai-chat__btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
}

.ask-ai-chat__btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ask-ai-chat__btn-primary {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ask-ai-chat__btn-muted {
  color: var(--vp-c-text-2);
}
</style>
