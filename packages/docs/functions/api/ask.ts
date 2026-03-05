interface AiSearchOptions {
  query: string
  rewrite_query?: boolean
  max_num_results?: number
  reranking?: {
    enabled: boolean
  }
}

interface AiSearchInput extends AiSearchOptions {
  stream?: boolean
}

interface AiSearchResult {
  response?: string | ReadableStream<Uint8Array>
  body?: ReadableStream<Uint8Array>
}

interface AiBinding {
  autorag: (ragId: string) => {
    aiSearch: (input: AiSearchInput) => Promise<AiSearchResult>
  }
}

interface Env {
  AI: AiBinding
  RAG_ID: string
  AI_SEARCH_TIMEOUT_MS?: string
}

interface RequestContext {
  request: Request
  env: Env
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error)
    return error.message
  return 'Unknown server error'
}

function createErrorResponse(error: unknown) {
  const errorMessage = toErrorMessage(error)
  const normalizedMessage = errorMessage.toLowerCase()

  if (normalizedMessage.includes('timed out')) {
    return {
      status: 504,
      message: 'AI Search request timed out. Check network/proxy settings or increase AI_SEARCH_TIMEOUT_MS.',
    }
  }

  if (normalizedMessage.includes('fetch failed')) {
    return {
      status: 502,
      message: 'Failed to reach Cloudflare AI Search endpoint (workers-binding.ai). Check proxy/network and Wrangler login.',
    }
  }

  return {
    status: 500,
    message: errorMessage,
  }
}

function resolveAiSearchTimeout(env: Env) {
  const rawTimeout = typeof env.AI_SEARCH_TIMEOUT_MS === 'string'
    ? Number.parseInt(env.AI_SEARCH_TIMEOUT_MS, 10)
    : Number.NaN

  if (Number.isFinite(rawTimeout) && rawTimeout >= 1000 && rawTimeout <= 120000)
    return rawTimeout

  return 15000
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`AI Search request timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  }
  finally {
    if (timeoutId != null)
      clearTimeout(timeoutId)
  }
}

function isReadableStream(value: unknown): value is ReadableStream<Uint8Array> {
  return typeof value === 'object'
    && value !== null
    && 'getReader' in value
    && typeof value.getReader === 'function'
}

function resolveStream(result: AiSearchResult) {
  if (isReadableStream(result))
    return result
  if (isReadableStream(result.response))
    return result.response
  if (isReadableStream(result.body))
    return result.body
  return null
}

function createSSEHeaders() {
  return {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache, no-transform',
    'x-content-type-options': 'nosniff',
  }
}

function createSSEFromText(text: string) {
  const encoder = new TextEncoder()
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ response: text })}\n\n`))
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
}

function createAiSearchOptions(query: string): AiSearchOptions {
  return {
    query,
    rewrite_query: true,
    max_num_results: 8,
    reranking: { enabled: true },
  }
}

export async function onRequestPost({ request, env }: RequestContext) {
  try {
    const ragId = typeof env.RAG_ID === 'string' ? env.RAG_ID.trim() : ''
    if (!ragId)
      throw new Error('Missing env.RAG_ID configuration')

    const payload = await request.json() as { query?: unknown, stream?: unknown }
    const query = typeof payload.query === 'string' ? payload.query.trim() : ''
    const shouldStream = payload.stream === true
    if (!query)
      return Response.json({ error: 'Query is required' }, { status: 400 })

    const autorag = env.AI.autorag(ragId)
    const aiSearchOptions = createAiSearchOptions(query)
    const timeoutMs = resolveAiSearchTimeout(env)

    const result = await withTimeout(autorag.aiSearch({
      ...aiSearchOptions,
      stream: shouldStream,
    }), timeoutMs)

    if (shouldStream) {
      const stream = resolveStream(result)
      if (stream) {
        return new Response(stream, {
          headers: createSSEHeaders(),
        })
      }

      const fallbackText = typeof result.response === 'string' ? result.response : ''
      return new Response(createSSEFromText(fallbackText), {
        headers: createSSEHeaders(),
      })
    }

    return Response.json({
      answer: result.response ?? '',
    })
  }
  catch (error) {
    const { status, message } = createErrorResponse(error)
    return Response.json(
      { error: message },
      { status },
    )
  }
}
