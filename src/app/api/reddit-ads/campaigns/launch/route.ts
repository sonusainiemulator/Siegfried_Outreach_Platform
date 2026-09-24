import { NextRequest, NextResponse } from 'next/server'
import { addRedditCampaignToStore, RedditCampaignRecord } from '../../store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      campaignName,
      objective = 'CONVERSIONS',
      budgetMode = 'DAILY',
      dailyBudget = 40,
      targetSubreddits = ['r/SaaS', 'r/startups'],
      targetInterests = ['Software & Technology'],
      targetCountries = ['US', 'GB'],
      creative
    } = body

    if (!campaignName || !creative?.title) {
      return NextResponse.json(
        { success: false, message: 'Campaign name and Reddit Post Title are required.' },
        { status: 400 }
      )
    }

    const newId = `rdt_camp_${Date.now().toString(36)}`
    const newCampaignId = `t3_${Math.floor(100000000 + Math.random() * 900000000)}`

    const simulatedImpressions = Math.floor(dailyBudget * 4200)
    const simulatedClicks = Math.floor(simulatedImpressions * 0.034)
    const simulatedConversions = Math.floor(simulatedClicks * 0.048)

    const newCampaign: RedditCampaignRecord = {
      id: newId,
      campaignId: newCampaignId,
      name: campaignName,
      objective: objective as any,
      status: 'ACTIVE',
      budgetMode,
      dailyBudget,
      targetSubreddits,
      targetInterests,
      creative: {
        title: creative.title,
        bodyMarkdown: creative.bodyMarkdown || '',
        callToAction: creative.callToAction || 'LEARN_MORE',
        destinationUrl: creative.destinationUrl || 'https://siegfriedoutreach.com',
        thumbnailUrl: creative.thumbnailUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        authorHandle: creative.authorHandle || '',
        flairText: creative.flairText || '🛠️ Discussion & Tool',
        format: creative.format || 'FREEFORM_POST'
      },
      insights: {
        spend: Number((dailyBudget * 0.5).toFixed(2)),
        impressions: simulatedImpressions,
        upvotes: Math.floor(simulatedClicks * 0.16),
        comments: Math.floor(simulatedClicks * 0.03),
        shares: Math.floor(simulatedClicks * 0.01),
        clicks: simulatedClicks,
        cpc: Number((dailyBudget / Math.max(simulatedClicks, 1)).toFixed(2)),
        cpm: 3.2,
        ctr: 3.4,
        conversions: simulatedConversions,
        cpa: Number((dailyBudget / Math.max(simulatedConversions, 1)).toFixed(2)),
        roas: 4.15,
        lastSyncedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    }

    addRedditCampaignToStore(newCampaign)

    return NextResponse.json({
      success: true,
      message: 'Reddit Campaign launched successfully!',
      data: newCampaign
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to launch Reddit campaign' },
      { status: 500 }
    )
  }
}
