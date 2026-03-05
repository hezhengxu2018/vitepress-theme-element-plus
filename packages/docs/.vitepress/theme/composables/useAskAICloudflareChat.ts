import type { HookFetchPlugin, HookFetchRequest } from 'hook-fetch'
import hookFetch from 'hook-fetch'
import { sseTextDecoderPlugin } from 'hook-fetch/plugins'
import { computed, onBeforeUnmount, ref } from 'vue'
import { extractErrorFromResponse, extractTextFromPayload, resolveErrorMessage } from '../utils/ask-ai'

interface UseAskAICloudflareChatOptions {
  endpoint?: string
  doneSymbol?: string
  emptyAnswerFallback?: string
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
}

function createAskClient(doneSymbol: string) {
  const streamTransformPlugin: HookFetchPlugin = {
    name: 'ask-ai-stream-transform',
    transformStreamChunk(chunk) {
      if (!chunk.error)
        chunk.result = extractTextFromPayload(chunk.result)
      return chunk
    },
  }

  const errorTransformPlugin: HookFetchPlugin = {
    name: 'ask-ai-error-transform',
    async onError(error) {
      if (error.response instanceof Response) {
        const payloadError = await extractErrorFromResponse(error.response)
        if (payloadError)
          return new Error(payloadError)
      }

      if (typeof error.status === 'number')
        return new Error(`Request failed (${error.status})`)

      return error
    },
  }

  return hookFetch.create({
    headers: {
      'content-type': 'application/json',
    },
    withCredentials: true,
    plugins: [
      sseTextDecoderPlugin({
        prefix: 'data:',
        json: true,
        doneSymbol,
      }),
      streamTransformPlugin,
      errorTransformPlugin,
    ],
  })
}

export function useAskAICloudflareChat(options: UseAskAICloudflareChatOptions = {}) {
  const endpoint = options.endpoint || import.meta.env.VITE_ASK_AI_ENDPOINT || '/api/ask'
  const doneSymbol = options.doneSymbol || '[DONE]'
  const emptyAnswerFallback = options.emptyAnswerFallback || '未返回答案，请检查 AI Search 索引或模型配置。'
  const askClient = createAskClient(doneSymbol)

  const messages = ref<ChatMessage[]>([])
  const input = ref('')
  const isLoading = ref(false)
  const errorMessage = ref('')
  const activeAssistantId = ref<number | null>(null)
  const canSubmit = computed(() => input.value.trim().length > 0 && !isLoading.value)

  let messageId = 0
  let currentRequest: HookFetchRequest<unknown, unknown> | null = null

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

      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('text/event-stream')) {
        for await (const chunk of request.stream<string>()) {
          if (chunk.error)
            throw chunk.error
          if (chunk.result)
            appendAssistantChunk(assistantId, chunk.result)
        }
      }
      else {
        let payload: unknown = null
        try {
          payload = await response.clone().json()
        }
        catch {
          payload = null
        }
        const text = extractTextFromPayload(payload)
        appendAssistantChunk(assistantId, text)
      }

      const assistantMessage = getMessageById(assistantId)
      if (assistantMessage && !assistantMessage.content.trim())
        assistantMessage.content = emptyAnswerFallback
    }
    catch (error) {
      const message = await resolveErrorMessage(error)
      errorMessage.value = message
      const assistantMessage = getMessageById(assistantId)
      if (assistantMessage)
        assistantMessage.content = `请求失败：${message}`
    }
    finally {
      currentRequest = null
      isLoading.value = false
      activeAssistantId.value = null
    }
  }

  onBeforeUnmount(() => {
    currentRequest?.abort()
  })

  return {
    messages,
    input,
    isLoading,
    errorMessage,
    activeAssistantId,
    canSubmit,
    clearMessages,
    sendMessage,
  }
}
