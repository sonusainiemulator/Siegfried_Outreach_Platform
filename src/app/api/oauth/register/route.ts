import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    let body: any = {}
    try {
      body = await request.json()
    } catch {
      // Empty or non-json body fallback
    }

    const clientId = 'gemini_client_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    const clientSecret = 'gemini_sec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    return NextResponse.json(
      {
        client_id: clientId,
        client_secret: clientSecret,
        client_id_issued_at: Math.floor(Date.now() / 1000),
        client_secret_expires_at: 0,
        client_name: body.client_name || 'Google Gemini Connected App',
        redirect_uris: body.redirect_uris || [
          'https://vertexaisearch.cloud.google.com/oauth-redirect',
          'https://gemini.google.com'
        ],
        grant_types: body.grant_types || ['authorization_code', 'refresh_token', 'client_credentials'],
        response_types: body.response_types || ['code'],
        token_endpoint_auth_method: body.token_endpoint_auth_method || 'client_secret_post',
        scope: body.scope || 'mcp:read mcp:write mcp:social_publishing mcp:analytics'
      },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  } catch (err: any) {
    return NextResponse.json({ error: 'invalid_client_metadata', error_description: err?.message }, { status: 400 })
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
