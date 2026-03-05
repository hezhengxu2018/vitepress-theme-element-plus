export interface AskResponse {
  answer?: string
  error?: string
}

export function extractTextFromPayload(payload: unknown, depth = 0): string {
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

export async function extractErrorFromResponse(response: Response) {
  try {
    const payload = await response.clone().json() as AskResponse
    if (typeof payload?.error === 'string' && payload.error)
      return payload.error
  }
  catch {
    // Ignore parse error and fallback to generic message.
  }

  return ''
}

export async function resolveErrorMessage(error: unknown) {
  if (error && typeof error === 'object') {
    const errorObject = error as {
      message?: unknown
      response?: unknown
      status?: unknown
    }

    if (typeof errorObject.message === 'string' && errorObject.message)
      return errorObject.message

    if (errorObject.response instanceof Response) {
      const payloadError = await extractErrorFromResponse(errorObject.response)
      if (payloadError)
        return payloadError

      if (typeof errorObject.status === 'number')
        return `Request failed (${errorObject.status})`
    }
  }

  if (error instanceof Error && error.message)
    return error.message

  return '请求失败，请稍后重试。'
}
