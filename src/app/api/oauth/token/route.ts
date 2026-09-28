import { NextRequest, NextResponse } from 'next/server'

const BACKEND_TOKEN_URL = 'http://127.0.0.1:3001/api/oauth/token'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || 'application/json'
    const rawBody = await request.text()

    // Forward to backend token exchange endpoint which creates valid signed JWT and McpApiKey entry
    const response = await fetch(BACKEND_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: rawBody,
    })

    const data = await response.json()
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'invalid_grant', error_description: err?.message }, { status: 400 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
