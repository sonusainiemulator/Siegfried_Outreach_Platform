import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'js', 'chatbot-widget.js')
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse('// Chatbot widget file not found', {
        status: 404,
        headers: {
          'Content-Type': 'application/javascript',
        },
      })
    }

    const scriptContent = fs.readFileSync(filePath, 'utf-8')

    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    })
  } catch (error) {
    console.error('Error serving chatbot-widget.js:', error)
    return new NextResponse('// Error loading chatbot widget', {
      status: 500,
      headers: {
        'Content-Type': 'application/javascript',
      },
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
}
