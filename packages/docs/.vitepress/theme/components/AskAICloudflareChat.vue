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
  messages.value.push({
    id: ++messageId,
    ...message,
  })
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

async function sendMessage() {
  const query = input.value.trim()
  if (!query || isLoading.value)
    return

  errorMessage.value = ''
  appendMessage({
    role: 'user',
    content: query,
  })
  input.value = ''
  isLoading.value = true

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    let payload: AskResponse | undefined
    try {
      payload = await response.json() as AskResponse
    }
    catch {
      payload = undefined
    }

    if (!response.ok) {
      throw new Error(payload?.error || `Request failed (${response.status})`)
    }

    const answer = payload?.answer?.trim() || '未返回答案，请检查 AI Search 索引或模型配置。'
    appendMessage({
      role: 'assistant',
      content: answer,
      sources: payload?.sources || [],
    })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '请求失败，请稍后重试。'
    errorMessage.value = message
    appendMessage({
      role: 'assistant',
      content: `请求失败：${message}`,
    })
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
