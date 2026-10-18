export type Currency = {
  short_code: string
  name: string
  symbol: string
  symbol_first: boolean
  precision: number
}

// `date` is the rate's day ("2026-10-16"); `timestamp` (seconds) is when the API answered, not when the rate was set.
export type ConvertResult = { value: number; date: string; timestamp: number }

const API_BASE_URL = '/api'

async function request<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}/${path}?${new URLSearchParams(params)}`, { signal })
  } catch (err) {
    if (signal?.aborted) throw err
    throw new Error('Network error. Check your connection.')
  }

  // Errors look like { meta: { code, error_type, error_detail }, response: [] }, e.g. 401 "auth failed".
  const body = (await res.json().catch(() => null)) as { meta?: { code?: number; error_detail?: string }; response: T } | null
  if (!res.ok || body?.meta?.code !== 200) {
    throw new Error(body?.meta?.error_detail || `Request failed (HTTP ${res.status})`)
  }
  return body.response
}

export function fetchCurrencies(signal?: AbortSignal): Promise<Currency[]> {
  return request<Currency[]>('currencies', { type: 'fiat' }, signal)
}

export function convert(from: string, to: string, amount: number, signal?: AbortSignal): Promise<ConvertResult> {
  return request<ConvertResult>('convert', { from, to, amount: String(amount) }, signal)
}
