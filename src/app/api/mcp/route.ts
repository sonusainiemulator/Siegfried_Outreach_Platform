import { NextRequest, NextResponse } from 'next/server'

const BACKEND_MCP_URL = process.env.BACKEND_MCP_URL || 'http://127.0.0.1:3001/mcp'

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    }

    // Forward relevant protocol and auth headers
    const forwardedHeaders = [
      'authorization',
      'mcp-protocol-version',
      'mcp-method',
      'mcp-name',
      'mcp-session-id',
      'siegfried-api-key',
      'blotato-api-key',
      'x-api-key',
      'api-key',
      'accept',
    ]

    for (const h of forwardedHeaders) {
      const val = request.headers.get(h)
      if (val) headers[h] = val
    }

    const response = await fetch(BACKEND_MCP_URL, {
      method: 'POST',
      headers,
      body: rawBody,
    })

    const protocolVersion = response.headers.get('mcp-protocol-version') || '2026-07-28'

    // If 202 Accepted (notification), return empty body per Streamable HTTP spec
    if (response.status === 202) {
      return new NextResponse(null, {
        status: 202,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Mcp-Session-Id, siegfried-api-key, blotato-api-key, x-api-key, api-key, Accept',
          'Access-Control-Expose-Headers': 'MCP-Protocol-Version, Mcp-Session-Id, Content-Type',
          'MCP-Protocol-Version': protocolVersion,
        },
      })
    }

    const data = await response.text()
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Mcp-Session-Id, siegfried-api-key, blotato-api-key, x-api-key, api-key, Accept',
        'Access-Control-Expose-Headers': 'MCP-Protocol-Version, Mcp-Session-Id, Content-Type',
        'MCP-Protocol-Version': protocolVersion,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32603, message: error?.message || 'MCP Proxy Error' },
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const accept = request.headers.get('accept') || ''
    const response = await fetch(BACKEND_MCP_URL, {
      method: 'GET',
      headers: {
        accept,
      },
    })

    const data = await response.text()
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'MCP-Protocol-Version, Mcp-Session-Id, Content-Type',
        'MCP-Protocol-Version': response.headers.get('mcp-protocol-version') || '2026-07-28',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'MCP Proxy Error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Mcp-Session-Id, siegfried-api-key, blotato-api-key, x-api-key, api-key, Accept',
      'Access-Control-Expose-Headers': 'MCP-Protocol-Version, Mcp-Session-Id, Content-Type',
    },
  })
}
