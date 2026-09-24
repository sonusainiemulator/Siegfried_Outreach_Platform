import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const accessToken = 'mcp_oauth_at_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    const refreshToken = 'mcp_oauth_rt_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)

    return NextResponse.json(
      {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 31536000, // 1 year token for seamless AI agent access
        refresh_token: refreshToken,
        scope: 'mcp:read mcp:write mcp:social_publishing mcp:analytics',
        server_url: 'https://api.siegfriedoutreach.com/mcp',
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'invalid_grant' }, { status: 400 })
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
