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

    const result = await autorag.aiSearch({
      ...aiSearchOptions,
      stream: shouldStream,
    })

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
    return Response.json(
      { error: toErrorMessage(error) },
      { status: 500 },
    )
  }
}
