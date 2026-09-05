import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productOrService = '', objective = 'PRODUCT_SALES', tone = 'viral_hype', targetAudience = '' } = body

    const cleanDesc = productOrService.trim() || 'AI Multi-Channel Growth Platform'

    const hookTemplates = [
      `Stop scrolling! If you care about ${cleanDesc.split(' ')[0] || 'growth'}, you need to see this right now...`,
      `I tested this viral ${cleanDesc} for 7 days and here is what happened!`,
      `The #1 secret ${targetAudience ? targetAudience : 'creators & brands'} aren't telling you about ${cleanDesc}!`,
      `TikTok made me buy this: Why is everyone raving about ${cleanDesc}?`,
      `Don't buy any other tool until you watch this 10-second breakdown...`
    ]

    const selectedHook = hookTemplates[Math.floor(Math.random() * hookTemplates.length)]

    const captionTemplates = [
      `The game-changer you've been searching for ⚡ Try ${cleanDesc} today with instant access. Tap the link below before the promo ends! 👇`,
      `Why is this selling out so fast? 🔥 Tap Shop Now to claim yours with free worldwide priority shipping!`,
      `Level up your workflow with 1 click 🚀 Join 10,000+ top users scaling with ${cleanDesc}. Tap Sign Up now!`,
      `Tag someone who needs this! ✨ Drop a comment or tap below to check it out now.`
    ]

    const selectedCaption = captionTemplates[Math.floor(Math.random() * captionTemplates.length)]

    const hashtags = [
      '#TikTokMadeMeBuyIt',
      '#ViralProduct',
      '#TechTok',
      '#LifeHack',
      '#MustHave',
      '#FYP',
      '#Trending'
    ]

    const campaignName = `🔥 AI Spark Campaign: ${cleanDesc.slice(0, 32)}`

    const callToAction = objective === 'PRODUCT_SALES' ? 'SHOP_NOW' :
      objective === 'LEAD_GENERATION' ? 'SIGN_UP' :
      objective === 'APP_INSTALLS' ? 'INSTALL_NOW' : 'LEARN_MORE'

    const scriptBreakdown = {
      second0to3: `[Visual: Sudden fast zoom on the product in action] Voiceover: "${selectedHook}"`,
      second3to15: `[Visual: Fast-paced B-roll showing before vs after, satisfying usage clip] Voiceover: "We eliminated the headache and made ${cleanDesc} effortless in under 60 seconds."`,
      second15to30: `[Visual: Pointing to the interactive TikTok sticker button & glowing countdown] Voiceover: "Tap the button below right now to unlock the limited-time discount before stock runs out!"`
    }

    const suggestedInterests = [
      'E-Commerce & Online Shopping',
      'Tech & Electronics',
      'Mobile Apps',
      'Marketing & Business',
      'Creative & DIY'
    ]

    return NextResponse.json({
      success: true,
      data: {
        campaignName,
        hook: selectedHook,
        caption: selectedCaption,
        callToAction,
        hashtags,
        scriptBreakdown,
        suggestedInterests,
        sparkAdTip: '💡 Pro-Tip: Running this as a TikTok Spark Ad using a native creator post increases CTR by 134% and reduces CPA by 37%.'
      }
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to generate AI copy' },
      { status: 500 }
    )
  }
}
