import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const pixels = [
    {
      id: 'tt_px_001',
      pixelId: 'C789X92L4K201M',
      pixelName: 'Siegfried Master TikTok Pixel',
      status: 'ACTIVE',
      lastActive: '2 minutes ago',
      eventsCount: 48920,
      eventsTracked: ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'CompletePayment', 'SubmitForm']
    },
    {
      id: 'tt_px_002',
      pixelId: 'C789X92L4K202N',
      pixelName: 'Lead Generation & Webinar Funnel Pixel',
      status: 'ACTIVE',
      lastActive: '14 minutes ago',
      eventsCount: 12450,
      eventsTracked: ['PageView', 'SubmitForm', 'Contact', 'Subscribe']
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
      message: 'TikTok Pixel event test recorded successfully',
      data: {
        eventName: body?.eventName || 'PageView',
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
