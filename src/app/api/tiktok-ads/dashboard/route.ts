import { NextRequest, NextResponse } from 'next/server'
import { getTikTokCampaignsStore } from '../store'

export async function GET(request: NextRequest) {
  const campaigns = getTikTokCampaignsStore()

  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE')

  const totalSpend = campaigns.reduce((acc, c) => acc + (c.insights?.spend || 0), 0)
  const totalVideoViews = campaigns.reduce((acc, c) => acc + (c.insights?.videoViews || 0), 0)
  const totalViews2s = campaigns.reduce((acc, c) => acc + (c.insights?.videoViews2s || 0), 0)
  const totalViews6s = campaigns.reduce((acc, c) => acc + (c.insights?.videoViews6s || 0), 0)
  const totalConversions = campaigns.reduce((acc, c) => acc + (c.insights?.conversions || 0), 0)
  const totalClicks = campaigns.reduce((acc, c) => acc + (c.insights?.clicks || 0), 0)
  const totalImpressions = campaigns.reduce((acc, c) => acc + (c.insights?.impressions || 0), 0)
  const totalLikes = campaigns.reduce((acc, c) => acc + (c.insights?.likes || 0), 0)
  const totalShares = campaigns.reduce((acc, c) => acc + (c.insights?.shares || 0), 0)

  const avgCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 3.12
  const avgCpc = totalClicks > 0 ? Number((totalSpend / totalClicks).toFixed(2)) : 0.12
  const avgCpm = totalImpressions > 0 ? Number(((totalSpend / totalImpressions) * 1000).toFixed(2)) : 3.85
  const avgCpa = totalConversions > 0 ? Number((totalSpend / totalConversions).toFixed(2)) : 4.25
  const avgRoas = 4.15

  // Generate 7-day timeline
  const now = Date.now()
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const chartTimeline = days.map((day, idx) => {
    const d = new Date(now - (6 - idx) * 24 * 60 * 60 * 1000)
    const formatted = `${d.getMonth() + 1}/${d.getDate()}`
    const factor = 0.75 + (idx * 0.08) + (Math.sin(idx) * 0.15)
    return {
      date: formatted,
      spend: Math.round(520 * factor),
      videoViews: Math.round(112000 * factor),
      clicks: Math.round(3850 * factor),
      conversions: Math.round(110 * factor),
      roas: Number((3.6 + (idx * 0.12)).toFixed(2))
    }
  })

  const placementBreakdown = [
    { name: 'TikTok For You Feed', percentage: 68, icon: '📱' },
    { name: 'TikTok Spark Ads (Creator Auth)', percentage: 18, icon: '🎵' },
    { name: 'TikTok Search Ads', percentage: 9, icon: '🔍' },
    { name: 'Pangle Premium Global Network', percentage: 5, icon: '🌐' }
  ]

  const demographics = [
    { ageGroup: '18-24 yrs', percentage: 42, ctr: 4.8 },
    { ageGroup: '25-34 yrs', percentage: 36, ctr: 3.9 },
    { ageGroup: '35-44 yrs', percentage: 14, ctr: 2.7 },
    { ageGroup: '45+ yrs', percentage: 8, ctr: 1.9 }
  ]

  const topCreatives = [
    {
      id: 'cr_1',
      name: 'Viral Gadget Unboxing 9:16',
      views: 412500,
      ctr: 4.12,
      roas: 5.2,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'cr_2',
      name: 'SaaS Agency Automation Screen Walkthrough',
      views: 248000,
      ctr: 3.45,
      roas: 4.1,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'cr_3',
      name: 'Creator Reaction & Review Mashup',
      views: 355000,
      ctr: 2.95,
      roas: 3.4,
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    }
  ]

  return NextResponse.json({
    success: true,
    data: {
      kpis: {
        totalSpend,
        totalVideoViews,
        totalViews2s,
        totalViews6s,
        totalConversions,
        totalClicks,
        totalImpressions,
        avgCtr,
        avgCpc,
        avgCpm,
        avgCpa,
        avgRoas,
        totalLikes,
        totalShares,
        activeCampaigns: activeCampaigns.length,
        totalCampaigns: campaigns.length
      },
      chartTimeline,
      placementBreakdown,
      demographics,
      topCreatives
    }
  })
}
