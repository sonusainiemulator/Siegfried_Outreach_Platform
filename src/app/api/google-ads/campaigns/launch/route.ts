import { NextRequest, NextResponse } from 'next/server'
import { addGoogleCampaignToStore, GoogleCampaignRecord } from '../../store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      campaignName,
      channelType = 'SEARCH',
      objective = 'LEADS',
      dailyBudget = 75,
      biddingStrategy = 'MAXIMIZE_CONVERSIONS',
      targetCpa,
      targetRoas,
      targetLocations = ['United States', 'United Kingdom'],
      targetKeywords = [],
      negativeKeywords = [],
      creative
    } = body

    if (!campaignName || !creative?.headlines || creative.headlines.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Campaign name and at least 1 headline are required.' },
        { status: 400 }
      )
    }

    const newId = `ggl_camp_${Date.now().toString(36)}`
    const newCampaignId = `9840${Math.floor(10000000 + Math.random() * 90000000)}`

    const simulatedImpressions = Math.floor(dailyBudget * 1400)
    const simulatedClicks = Math.floor(simulatedImpressions * 0.082)
    const simulatedConversions = Math.floor(simulatedClicks * 0.064)

    const newCampaign: GoogleCampaignRecord = {
      id: newId,
      campaignId: newCampaignId,
      name: campaignName,
      channelType: channelType as any,
      objective: objective as any,
      status: 'ACTIVE',
      dailyBudget,
      biddingStrategy: biddingStrategy as any,
      targetCpa: targetCpa ? Number(targetCpa) : undefined,
      targetRoas: targetRoas ? Number(targetRoas) : undefined,
      qualityScore: 9,
      searchImpressionShare: 88.5,
      creative: {
        headlines: creative.headlines,
        descriptions: creative.descriptions || ['Scale your customer growth with AI automation.'],
        finalUrl: creative.finalUrl || 'https://siegfriedoutreach.com',
        displayPath1: creative.displayPath1 || 'scale',
        displayPath2: creative.displayPath2 || 'ai',
        sitelinks: creative.sitelinks || [
          { text: 'Live Demo', description: 'See AI agents in action', url: 'https://siegfriedoutreach.com/demo' },
          { text: 'Pricing & Plans', description: 'Transparent monthly tiers', url: 'https://siegfriedoutreach.com/pricing' }
        ],
        callouts: creative.callouts || ['24/7 Priority Support', '99.4% Inbox Rate', 'Official APIs Only'],
        businessName: creative.businessName || 'Siegfried Outreach'
      },
      targetKeywords: targetKeywords.length > 0 ? targetKeywords : [
        { keyword: 'ai outreach platform', matchType: 'EXACT' },
        { keyword: 'b2b lead generation software', matchType: 'PHRASE' }
      ],
      negativeKeywords,
      targetLocations,
      insights: {
        spend: Number((dailyBudget * 0.4).toFixed(2)),
        impressions: simulatedImpressions,
        clicks: simulatedClicks,
        cpc: Number((dailyBudget / Math.max(simulatedClicks, 1)).toFixed(2)),
        cpm: 24.5,
        ctr: 8.2,
        conversions: simulatedConversions,
        cpa: Number((dailyBudget / Math.max(simulatedConversions, 1)).toFixed(2)),
        conversionRate: 6.4,
        roas: 4.9,
        lastSyncedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    }

    addGoogleCampaignToStore(newCampaign)

    return NextResponse.json({
      success: true,
      message: 'Google Campaign launched successfully!',
      data: newCampaign
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to launch Google campaign' },
      { status: 500 }
    )
  }
}
