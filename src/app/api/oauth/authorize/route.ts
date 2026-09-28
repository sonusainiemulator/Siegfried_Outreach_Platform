import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirectUri = searchParams.get('redirect_uri') || ''
  const state = searchParams.get('state') || ''
  const clientName = searchParams.get('client_name') || searchParams.get('client_id') || 'Google Gemini'
  const clientId = searchParams.get('client_id') || ''
  const scope = searchParams.get('scope') || 'mcp:read mcp:write mcp:social_publishing mcp:analytics'
  const responseType = searchParams.get('response_type') || 'code'
  const codeChallenge = searchParams.get('code_challenge') || ''
  const codeChallengeMethod = searchParams.get('code_challenge_method') || ''
  const autoApprove = searchParams.get('auto_approve') === 'true' || searchParams.get('prompt') === 'none'

  // If auto-approved, redirect directly back with auth code
  if (autoApprove && redirectUri) {
    const code = 'mcp_auth_code_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
    const callbackUrl = new URL(redirectUri)
    callbackUrl.searchParams.set('code', code)
    if (state) callbackUrl.searchParams.set('state', state)
    return NextResponse.redirect(callbackUrl)
  }

  // Redirect to mcp-studio with oauth authorization query params so user can approve
  const targetUrl = new URL('/mcp-studio', request.url)
  targetUrl.searchParams.set('tab', 'keys')
  targetUrl.searchParams.set('oauth_action', 'authorize')
  if (redirectUri) targetUrl.searchParams.set('redirect_uri', redirectUri)
  if (state) targetUrl.searchParams.set('state', state)
  if (clientName) targetUrl.searchParams.set('client_name', clientName)
  if (clientId) targetUrl.searchParams.set('client_id', clientId)
  if (scope) targetUrl.searchParams.set('scope', scope)
  if (responseType) targetUrl.searchParams.set('response_type', responseType)
  if (codeChallenge) targetUrl.searchParams.set('code_challenge', codeChallenge)
  if (codeChallengeMethod) targetUrl.searchParams.set('code_challenge_method', codeChallengeMethod)

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
