import { NextResponse } from 'next/server'

interface OpenRouterRawModel {
  id: string
  name: string
  description?: string
  context_length?: number
  created?: number
  pricing?: {
    prompt?: string
    completion?: string
  }
}

interface FormattedModel {
  value: string
  label: string
  isFree: boolean
  provider: string
  contextLength?: number
  description?: string
}

// In-memory cache for 5 minutes to avoid rate-limiting
let cachedResponse: {
  timestamp: number
  data: {
    freeModels: FormattedModel[]
    latestModels: FormattedModel[]
    allModels: FormattedModel[]
    totalCount: number
    freeCount: number
  }
} | null = null

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'

    const now = Date.now()
    if (!forceRefresh && cachedResponse && now - cachedResponse.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        cached: true,
        ...cachedResponse.data,
      })
    }

    // Optional API key forwarded from headers or query
    const authHeader = request.headers.get('authorization')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers,
      next: { revalidate: 300 }, // 5 min Next.js fetch cache
    })

    if (!res.ok) {
      throw new Error(`OpenRouter API error: ${res.status} ${res.statusText}`)
    }

    const json = await res.json()
    const rawModels: OpenRouterRawModel[] = json.data || []

    const formatted: FormattedModel[] = rawModels.map((m) => {
      const isFree =
        m.id.endsWith(':free') ||
        (m.pricing?.prompt === '0' && m.pricing?.completion === '0')

      const provider = m.id.split('/')[0] || 'other'

      return {
        value: m.id,
        label: m.name || m.id,
        isFree: Boolean(isFree),
        provider,
        contextLength: m.context_length,
        description: m.description,
      }
    })

    // Separate free models and sort by name
    const freeModels = formatted
      .filter((m) => m.isFree)
      .sort((a, b) => a.label.localeCompare(b.label))

    // Notable latest models (DeepSeek, Claude, GPT, Gemini, Llama, Mistral, Grok)
    const notableProviders = ['deepseek', 'anthropic', 'openai', 'google', 'meta-llama', 'mistralai', 'x-ai', 'qwen']
    const latestModels = formatted
      .filter((m) => !m.isFree && notableProviders.includes(m.provider.toLowerCase()))
      .sort((a, b) => a.provider.localeCompare(b.provider) || a.label.localeCompare(b.label))

    // All models with free models placed FIRST, followed by latest models, followed by remaining
    const remainingModels = formatted
      .filter((m) => !m.isFree && !notableProviders.includes(m.provider.toLowerCase()))
      .sort((a, b) => a.label.localeCompare(b.label))

    const allModels = [...freeModels, ...latestModels, ...remainingModels]

    const resultData = {
      freeModels,
      latestModels,
      allModels,
      totalCount: formatted.length,
      freeCount: freeModels.length,
    }

    cachedResponse = {
      timestamp: now,
      data: resultData,
    }

    return NextResponse.json({
      success: true,
      cached: false,
      ...resultData,
    })
  } catch (error: any) {
    console.error('Failed to fetch OpenRouter models:', error)
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to fetch OpenRouter models',
      },
      { status: 500 },
    )
  }
}
