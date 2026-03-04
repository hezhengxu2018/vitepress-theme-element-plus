interface AiSearchInput {
  query: string
  rewrite_query?: boolean
  max_num_results?: number
  reranking?: {
    enabled: boolean
  }
  stream?: boolean
}

interface AiSearchResultItem {
  filename?: string
  score?: number
}

interface AiSearchResult {
  response?: string
  data?: AiSearchResultItem[]
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

export async function onRequestPost({ request, env }: RequestContext) {
  try {
    const ragId = typeof env.RAG_ID === 'string' ? env.RAG_ID.trim() : ''
    console.warn('[ask-api] env-check', {
      url: request.url,
      method: request.method,
      hasAI: Boolean(env.AI),
      hasRagId: Boolean(ragId),
      ragIdLength: ragId.length,
    })

    if (!ragId)
      throw new Error('Missing env.RAG_ID configuration')

    const payload = await request.json() as { query?: unknown }
    const query = typeof payload.query === 'string' ? payload.query.trim() : ''
    if (!query)
      return Response.json({ error: 'Query is required' }, { status: 400 })

    const result = await env.AI.autorag(ragId).aiSearch({
      query,
      rewrite_query: true,
      max_num_results: 8,
      reranking: { enabled: true },
      stream: false,
    })

    const sources = (result.data ?? []).map(item => ({
      file: item.filename ?? 'unknown',
      score: typeof item.score === 'number' ? item.score : null,
    }))

    return Response.json({
      answer: result.response ?? '',
      sources,
    })
  }
  catch (error) {
    return Response.json(
      { error: toErrorMessage(error) },
      { status: 500 },
    )
  }
}
