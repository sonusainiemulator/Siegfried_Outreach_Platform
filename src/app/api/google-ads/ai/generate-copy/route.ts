import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productOrService = '', objective = 'LEADS' } = body

    const cleanDesc = productOrService.trim() || 'AI Multi-Channel Growth Platform'

    const headlines = [
      `Official ${cleanDesc.slice(0, 16)} Platform`,
      'Scale Sales & Leads 10x Fast',
      '99.4% Multi-Channel Delivery',
      'WhatsApp & Email Automation',
      'Start Free Trial Today'
    ]

    const descriptions = [
      `Automate your multi-channel sales pipeline across WhatsApp, Telegram, and Email with ${cleanDesc}.`,
      'Connect CRM in 2 minutes. 100% official APIs, transparent reporting, and dedicated support.'
    ]

    const suggestedKeywords = [
      { keyword: `${cleanDesc.toLowerCase()} platform`, matchType: 'EXACT' as const },
      { keyword: `b2b ${cleanDesc.toLowerCase()} software`, matchType: 'PHRASE' as const },
      { keyword: `automated outreach tool`, matchType: 'PHRASE' as const },
      { keyword: `multi channel lead generation`, matchType: 'BROAD' as const }
    ]

    const negativeKeywords = ['free download', 'torrent', 'crack', 'jobs', 'internship', 'wikipedia']

    const sitelinks = [
      { text: 'Live Interactive Demo', description: 'Experience the AI agent in real-time', url: 'https://siegfriedoutreach.com/demo' },
      { text: 'Transparent Pricing', description: 'Affordable monthly plans for teams', url: 'https://siegfriedoutreach.com/pricing' },
      { text: 'Integrations & APIs', description: 'Connect WhatsApp, Telegram, CRM', url: 'https://siegfriedoutreach.com/integrations' },
      { text: 'Client Success Stories', description: 'Read verified 4.8x ROI case studies', url: 'https://siegfriedoutreach.com/cases' }
    ]

    const callouts = [
      '24/7 Dedicated Support',
      'No Credit Card Required',
      '100% Compliant Official APIs',
      'Instant Setup in 2 Minutes'
    ]

    return NextResponse.json({
      success: true,
      data: {
        campaignName: `🔍 Google High-Intent Search: ${cleanDesc.slice(0, 28)}`,
        headlines,
        descriptions,
        suggestedKeywords,
        negativeKeywords,
        sitelinks,
        callouts,
        pMaxOptimizationTip: '💡 Google PMax Pro-Tip: Adding high-resolution 1.91:1 landscape and 1:1 square image assets increases asset group strength from Good to Excellent and drops CPC by 22%.'
      }
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to generate Google Ads copy' },
      { status: 500 }
    )
  }
}
