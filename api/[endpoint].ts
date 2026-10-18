// Vercel Function: production twin of the Vite dev proxy. Serves /api/currencies and /api/convert,
// adding the API key server-side (the API has no CORS, so the browser can't call it directly).
const ALLOWED = new Set(['currencies', 'convert'])

function fail(code: number, detail: string): Response {
  return Response.json({ meta: { code, error_detail: detail }, response: [] }, { status: code })
}

export async function GET(request: Request): Promise<Response> {
  const apiKey = process.env.CURRENCYBEACON_API_KEY
  if (!apiKey) return fail(500, 'Server is missing CURRENCYBEACON_API_KEY')

  const url = new URL(request.url)
  const endpoint = url.pathname.split('/').pop() ?? ''
  if (!ALLOWED.has(endpoint)) return fail(404, 'Not found')

  const upstream = new URL(`https://api.currencybeacon.com/v1/${endpoint}`)
  url.searchParams.forEach((value, name) => upstream.searchParams.set(name, value))
  upstream.searchParams.delete('endpoint') // Vercel may pass the [endpoint] segment as a query param
  upstream.searchParams.set('api_key', apiKey)

  const res = await fetch(upstream)
  return new Response(await res.text(), {
    status: res.status,
    headers: { 'content-type': 'application/json' },
  })
}
