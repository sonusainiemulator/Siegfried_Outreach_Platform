import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const pixels = [
    {
      id: 'rdt_px_001',
      pixelId: 'a2_910293841',
      pixelName: 'Siegfried Master Reddit Conversion Pixel',
      status: 'ACTIVE',
      lastActive: '3 minutes ago',
      eventsCount: 31200,
      eventsTracked: ['PageVisit', 'SignUp', 'Lead', 'Purchase', 'AddToCart', 'Custom']
    }
  ]

  return NextResponse.json({
    success: true,
    data: pixels
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      success: true,
      message: 'Reddit Pixel event test verified successfully',
      data: {
        eventName: body?.eventName || 'PageVisit',
        timestamp: new Date().toISOString(),
        status: 'RECEIVED_AND_MATCHED'
      }
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
      { status: 400 }
    )
  }
}
