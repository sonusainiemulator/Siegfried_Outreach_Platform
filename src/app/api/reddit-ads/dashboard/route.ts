import { NextRequest, NextResponse } from 'next/server'
import { getRedditCampaignsStore } from '../store'

export async function GET(request: NextRequest) {
  const campaigns = getRedditCampaignsStore()
  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE')

  const totalSpend = campaigns.reduce((acc, c) => acc + (c.insights?.spend || 0), 0)
  const totalImpressions = campaigns.reduce((acc, c) => acc + (c.insights?.impressions || 0), 0)
  const totalUpvotes = campaigns.reduce((acc, c) => acc + (c.insights?.upvotes || 0), 0)
  const totalComments = campaigns.reduce((acc, c) => acc + (c.insights?.comments || 0), 0)
  const totalClicks = campaigns.reduce((acc, c) => acc + (c.insights?.clicks || 0), 0)
  const totalConversions = campaigns.reduce((acc, c) => acc + (c.insights?.conversions || 0), 0)

  const avgCtr = totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(2)) : 3.15
  const avgCpc = totalClicks > 0 ? Number((totalSpend / totalClicks).toFixed(2)) : 0.10
  const avgCpm = totalImpressions > 0 ? Number(((totalSpend / totalImpressions) * 1000).toFixed(2)) : 3.25
  const avgCpa = totalConversions > 0 ? Number((totalSpend / totalConversions).toFixed(2)) : 4.45
  const avgRoas = 4.12

  const now = Date.now()
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const chartTimeline = days.map((day, idx) => {
    const d = new Date(now - (6 - idx) * 24 * 60 * 60 * 1000)
    const formatted = `${d.getMonth() + 1}/${d.getDate()}`
    const factor = 0.8 + (idx * 0.07) + (Math.sin(idx) * 0.1)
    return {
      date: formatted,
      spend: Math.round(380 * factor),
      clicks: Math.round(3450 * factor),
      upvotes: Math.round(460 * factor),
      conversions: Math.round(85 * factor),
      roas: Number((3.5 + (idx * 0.14)).toFixed(2))
    }
  })

  const subredditBreakdown = [
    { name: 'r/SaaS', percentage: 38, subscribers: '480k members', ctr: 3.9 },
    { name: 'r/webdev', percentage: 26, subscribers: '2.1M members', ctr: 3.4 },
    { name: 'r/startups', percentage: 20, subscribers: '1.4M members', ctr: 3.1 },
    { name: 'r/entrepreneur', percentage: 16, subscribers: '3.2M members', ctr: 2.8 }
  ]

  const placementBreakdown = [
    { name: 'Reddit Home & Popular Feed', percentage: 62, icon: '📰' },
    { name: 'Conversation Page (Comments Section)', percentage: 24, icon: '💬' },
    { name: 'Subreddit Top Search Results', percentage: 14, icon: '🔍' }
  ]

  return NextResponse.json({
    success: true,
    data: {
      kpis: {
        totalSpend,
        totalImpressions,
        totalUpvotes,
        totalComments,
        totalClicks,
        totalConversions,
        avgCtr,
        avgCpc,
        avgCpm,
        avgCpa,
        avgRoas,
        activeCampaigns: activeCampaigns.length,
        totalCampaigns: campaigns.length
      },
      chartTimeline,
      subredditBreakdown,
      placementBreakdown
    }
  })
}
