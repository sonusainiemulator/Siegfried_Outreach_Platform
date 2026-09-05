import { NextRequest, NextResponse } from 'next/server'
import { getGoogleCampaignsStore } from '../store'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const channelType = searchParams.get('channelType')

  let campaigns = getGoogleCampaignsStore()

  if (status && status !== 'ALL') {
    campaigns = campaigns.filter(c => c.status === status)
  }

  if (search) {
    const q = search.toLowerCase()
    campaigns = campaigns.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.campaignId.toLowerCase().includes(q) ||
      c.creative?.headlines?.some(h => h.toLowerCase().includes(q)) ||
      c.targetKeywords?.some(k => k.keyword.toLowerCase().includes(q))
    )
  }

  if (channelType && channelType !== 'ALL') {
    campaigns = campaigns.filter(c => c.channelType === channelType)
  }

  return NextResponse.json({
    success: true,
    data: campaigns
  })
}
