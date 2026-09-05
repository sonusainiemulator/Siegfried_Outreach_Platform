import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const tags = [
    {
      id: 'ggl_tag_001',
      tagId: 'AW-948201948',
      tagName: 'Siegfried Global Google Tag (gtag.js)',
      status: 'ACTIVE',
      enhancedConversionsEnabled: true,
      lastPing: '1 minute ago',
      conversionActionsCount: 4,
      actions: [
        { name: 'Purchase / Checkout Completed', category: 'Purchase', conversionsCount: 412 },
        { name: 'Submit Lead Form', category: 'Lead', conversionsCount: 254 },
        { name: 'Sign Up / Free Trial', category: 'Sign-up', conversionsCount: 890 },
        { name: 'Book Interactive Demo', category: 'Book appointment', conversionsCount: 145 }
      ]
    }
  ]

  return NextResponse.json({
    success: true,
    data: tags
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      success: true,
      message: 'Google Tag Enhanced Conversion recorded successfully',
      data: {
        actionName: body?.actionName || 'Submit Lead Form',
        timestamp: new Date().toISOString(),
        status: 'MATCHED_AND_VERIFIED'
      }
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
      { status: 400 }
    )
  }
}
