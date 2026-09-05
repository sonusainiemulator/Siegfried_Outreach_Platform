import { NextRequest, NextResponse } from 'next/server'
import { addTikTokCampaignToStore, TikTokCampaignRecord } from '../../store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      campaignName,
      objective,
      budgetMode = 'BUDGET_MODE_DAY',
      budget = 50,
      bidType = 'BID_TYPE_NO_BID',
      targetCpa,
      isSmartPlus = true,
      isSparkAd = false,
      sparkAdAuthCode,
      targetCountries = ['US', 'GB'],
      ageMin = 18,
      ageMax = 55,
      genders = 'ALL',
      interests = [],
      hashtags = [],
      placements = ['TikTok Feed'],
      creative
    } = body

    if (!campaignName || !creative?.caption || !creative?.hook) {
      return NextResponse.json(
        { success: false, message: 'Campaign name, Hook, and Caption are required.' },
        { status: 400 }
      )
    }

    const newId = `tt_camp_${Date.now().toString(36)}`
    const newCampaignId = `7398${Math.floor(1000000000 + Math.random() * 9000000000)}`

    const simulatedImpressions = Math.floor(budget * 4800)
    const simulatedViews = Math.floor(simulatedImpressions * 0.82)
    const simulatedClicks = Math.floor(simulatedImpressions * 0.038)
    const simulatedConversions = Math.floor(simulatedClicks * 0.065)

    const newCampaign: TikTokCampaignRecord = {
      id: newId,
      campaignId: newCampaignId,
      name: campaignName,
      objective: objective as any,
      status: 'ACTIVE',
      budgetMode,
      budget,
      bidType,
      targetCpa: targetCpa ? Number(targetCpa) : undefined,
      isSmartPlus,
      isSparkAd,
      sparkAdAuthCode,
      creative: {
        hook: creative.hook,
        caption: creative.caption,
        callToAction: creative.callToAction || 'LEARN_MORE',
        videoUrl: creative.videoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        soundTitle: creative.soundTitle || 'Trending Sound - Viral TikTok Audio',
        hashtags: creative.hashtags && creative.hashtags.length > 0 ? creative.hashtags : ['#TikTokMadeMeBuyIt', '#FYP', '#Viral'],
        brandHandle: creative.brandHandle || '@siegfried_outreach',
        landingPageUrl: creative.landingPageUrl || 'https://siegfriedoutreach.com'
      },
      insights: {
        spend: Number((budget * 0.45).toFixed(2)),
        impressions: simulatedImpressions,
        videoViews: simulatedViews,
        videoViews2s: Math.floor(simulatedViews * 0.85),
        videoViews6s: Math.floor(simulatedViews * 0.58),
        videoCompletionRate: 51.4,
        clicks: simulatedClicks,
        cpc: Number((budget / Math.max(simulatedClicks, 1)).toFixed(2)),
        cpm: 3.45,
        ctr: 3.8,
        conversions: simulatedConversions,
        cpa: Number((budget / Math.max(simulatedConversions, 1)).toFixed(2)),
        roas: 4.35,
        likes: Math.floor(simulatedViews * 0.09),
        shares: Math.floor(simulatedViews * 0.012),
        comments: Math.floor(simulatedViews * 0.0035),
        lastSyncedAt: new Date().toISOString()
      },
      targetAudience: {
        countries: targetCountries,
        ageMin,
        ageMax,
        genders,
        interests,
        hashtags,
        placements
      },
      createdAt: new Date().toISOString()
    }

    addTikTokCampaignToStore(newCampaign)

    return NextResponse.json({
      success: true,
      message: 'TikTok Campaign launched successfully!',
      data: newCampaign
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to launch TikTok campaign.' },
      { status: 500 }
    )
  }
}
