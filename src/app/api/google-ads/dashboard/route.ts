import { NextRequest, NextResponse } from 'next/server'
import { getGoogleCampaignsStore } from '../store'

export async function GET(request: NextRequest) {
  const campaigns = getGoogleCampaignsStore()
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE')

  const totalSpend = campaigns.reduce((acc, c) => acc + (c.insights?.spend || 0), 0)
  const totalImpressions = campaigns.reduce((acc, c) => acc + (c.insights?.impressions || 0), 0)
  const totalClicks = campaigns.reduce((acc, c) => acc + (c.insights?.clicks || 0), 0)
  const totalConversions = campaigns.reduce((acc, c) => acc + (c.insights?.conversions || 0), 0)

  const avgCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 4.35
  const avgCpc = totalClicks > 0 ? Number((totalSpend / totalClicks).toFixed(2)) : 0.58
  const avgCpm = totalImpressions > 0 ? Number(((totalSpend / totalImpressions) * 1000).toFixed(2)) : 25.40
  const avgCpa = totalConversions > 0 ? Number((totalSpend / totalConversions).toFixed(2)) : 12.50
  const avgRoas = 4.85
  const avgQualityScore = 9.2
  const searchImpressionShare = 87.5

  const now = Date.now()
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const chartTimeline = days.map((day, idx) => {
    const d = new Date(now - (6 - idx) * 24 * 60 * 60 * 1000)
    const formatted = `${d.getMonth() + 1}/${d.getDate()}`
    const factor = 0.85 + (idx * 0.06) + (Math.sin(idx) * 0.12)
    return {
      date: formatted,
      spend: Math.round(920 * factor),
      clicks: Math.round(1850 * factor),
      conversions: Math.round(98 * factor),
      roas: Number((4.1 + (idx * 0.15)).toFixed(2))
    }
  })

  const channelBreakdown = [
    { channel: 'SEARCH', name: 'Google Search Ads', percentage: 56, spend: 5200, roas: 5.2, icon: '🔍' },
    { channel: 'PERFORMANCE_MAX', name: 'Performance Max (PMax)', percentage: 28, spend: 2600, roas: 4.85, icon: '⚡' },
    { channel: 'DISPLAY', name: 'Google Display Network (GDN)', percentage: 10, spend: 950, roas: 3.4, icon: '🖼️' },
    { channel: 'YOUTUBE_VIDEO', name: 'YouTube Video In-Stream', percentage: 6, spend: 540, roas: 3.2, icon: '📺' }
  ]

  const topKeywords = [
    { keyword: 'ai outreach platform', matchType: '[Exact]', clicks: 1840, ctr: 9.8, cpc: 0.88, conversions: 142, qualityScore: 10 },
    { keyword: 'b2b lead generation software', matchType: '"Phrase"', clicks: 1210, ctr: 8.4, cpc: 0.95, conversions: 96, qualityScore: 9 },
    { keyword: 'automated whatsapp marketing tool', matchType: '"Phrase"', clicks: 940, ctr: 7.6, cpc: 0.72, conversions: 68, qualityScore: 9 },
    { keyword: 'multi channel crm broadcasts', matchType: 'Broad', clicks: 620, ctr: 5.2, cpc: 0.64, conversions: 38, qualityScore: 8 }
  ]

  return NextResponse.json({
    success: true,
    data: {
      kpis: {
        totalSpend,
        totalImpressions,
        totalClicks,
        totalConversions,
        avgCtr,
        avgCpc,
        avgCpm,
        avgCpa,
        avgRoas,
        avgQualityScore,
        searchImpressionShare,
        activeCampaigns: activeCampaigns.length,
        totalCampaigns: campaigns.length
      },
      chartTimeline,
      channelBreakdown,
      topKeywords
    }
  })
}
