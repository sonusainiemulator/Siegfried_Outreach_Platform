import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirectUri = searchParams.get('redirect_uri') || ''
  const state = searchParams.get('state') || ''
  const clientName = searchParams.get('client_name') || searchParams.get('client_id') || 'AI Agent'
  const scope = searchParams.get('scope') || 'mcp:read mcp:write mcp:social_publishing'

  // If redirect_uri is provided, redirect to mcp-studio with oauth authorization query params so user can approve in 1 click
  const targetUrl = new URL('/mcp-studio', request.url)
  targetUrl.searchParams.set('tab', 'keys')
  targetUrl.searchParams.set('oauth_action', 'authorize')
  if (redirectUri) targetUrl.searchParams.set('redirect_uri', redirectUri)
  if (state) targetUrl.searchParams.set('state', state)
  if (clientName) targetUrl.searchParams.set('client_name', clientName)
  if (scope) targetUrl.searchParams.set('scope', scope)

  return NextResponse.redirect(targetUrl)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const code = 'mcp_auth_code_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    return NextResponse.json({
      success: true,
      code,
      state: body.state || '',
      redirect_uri: body.redirect_uri || '',
      message: 'MCP OAuth 2.1 Authorization Code issued successfully.',
    })
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }
}
