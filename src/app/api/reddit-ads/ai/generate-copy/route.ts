import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productOrService = '', targetSubreddits = [], objective = 'CONVERSIONS' } = body

    const cleanDesc = productOrService.trim() || 'AI Multi-Channel Growth Platform'

    const headlineTemplates = [
      `How our dev team automated multi-channel sequences without getting banned or flagged (Open Architecture Breakdown)`,
      `I spent 3 months benchmarking ${cleanDesc} vs legacy tools. Here are the brutal numbers:`,
      `We built an alternative to bloated enterprise software specifically for technical founders & growth teams`,
      `Show Reddit: We made ${cleanDesc} effortless. What features should we build next?`,
      `The transparent case study of scaling to 10k users with multi-channel automation`
    ]

    const selectedHeadline = headlineTemplates[Math.floor(Math.random() * headlineTemplates.length)]

    const bodyMarkdown = `Hey Reddit! 

Most tools in the ${cleanDesc} space charge an arm and a leg while locking you into opaque black boxes. 

We built **Siegfried Outreach** from the ground up to solve 3 core pain points:
- **100% Official APIs**: Clean delivery rates, zero fragile headless scrapers.
- **Unified Multi-Channel**: Manage WhatsApp, Telegram, Email & Socials in one place.
- **Developer-First**: Webhooks, REST APIs, and instant 1-click workflows.

We'd love constructive feedback from the community! Feel free to roast our landing page or ask questions in the comments below. 👇`

    const callToAction = objective === 'CONVERSIONS' ? 'TRY_FREE' :
      objective === 'TRAFFIC' ? 'LEARN_MORE' :
      objective === 'LEAD_GENERATION' ? 'SIGN_UP' : 'GET_STARTED'

    const suggestedSubreddits = [
      'r/SaaS',
      'r/startups',
      'r/entrepreneur',
      'r/webdev',
      'r/marketing',
      'r/sideproject',
      'r/programming'
    ]

    return NextResponse.json({
      success: true,
      data: {
        campaignName: `🚀 Reddit Community Scale: ${cleanDesc.slice(0, 30)}`,
        headline: selectedHeadline,
        bodyMarkdown,
        callToAction,
        flairText: '🛠️ Tool & Discussion',
        suggestedSubreddits,
        redditCommunityAdvice: '💡 Reddit Rule: Speak honestly as a fellow builder, keep formatting clean, avoid spammy clickbait, and answer every comment promptly to gain massive upvotes.'
      }
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to generate Reddit copy' },
      { status: 500 }
    )
  }
}
