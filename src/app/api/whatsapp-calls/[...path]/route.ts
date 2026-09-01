import { NextRequest, NextResponse } from 'next/server'

const WACALLS_INTERNAL_URL = process.env.WACALLS_URL || 'http://127.0.0.1:8088'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  const subPath = resolvedParams.path ? resolvedParams.path.join('/') : ''
  const search = request.nextUrl.search || ''
  const targetUrl = `${WACALLS_INTERNAL_URL}/api/${subPath}${search}`

  try {
    // Check if SSE stream is requested
    if (subPath === 'events') {
      const upstream = await fetch(targetUrl, {
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Client-Id': request.headers.get('x-client-id') || 'dashboard-client',
        },
      })

      if (!upstream.body) {
        return new NextResponse('No SSE body', { status: 502 })
      }

      return new NextResponse(upstream.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const clientId = request.headers.get('x-client-id') || request.nextUrl.searchParams.get('clientId') || 'dashboard'
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': clientId,
      },
    })

    if (res.status === 204 || res.status === 304) {
      return new NextResponse(null, { status: res.status })
    }

    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'WaCalls service error' }, { status: 502 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  const subPath = resolvedParams.path ? resolvedParams.path.join('/') : ''
  const targetUrl = `${WACALLS_INTERNAL_URL}/api/${subPath}`

  try {
    const bodyText = await request.text()
    const clientId = request.headers.get('x-client-id') || 'dashboard'

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': clientId,
      },
      body: bodyText || '{}',
    })

    if (res.status === 204 || res.status === 304) {
      return new NextResponse(null, { status: res.status })
    }

    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'WaCalls service error' }, { status: 502 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  const subPath = resolvedParams.path ? resolvedParams.path.join('/') : ''
  const targetUrl = `${WACALLS_INTERNAL_URL}/api/${subPath}`

  try {
    const clientId = request.headers.get('x-client-id') || 'dashboard'
    const res = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': clientId,
      },
    })

    if (res.status === 204 || res.status === 304) {
      return new NextResponse(null, { status: res.status })
    }

    const data = await res.text()
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'WaCalls service error' }, { status: 502 })
  }
}
