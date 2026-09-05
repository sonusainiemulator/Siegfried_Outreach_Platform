import { NextRequest, NextResponse } from 'next/server'
import { getTikTokCampaignsStore } from '../store'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const objective = searchParams.get('objective')

  let campaigns = getTikTokCampaignsStore()

  if (status && status !== 'ALL') {
    campaigns = campaigns.filter(c => c.status === status)
  }

  if (search) {
    const q = search.toLowerCase()
    campaigns = campaigns.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.campaignId.toLowerCase().includes(q) ||
      c.creative?.caption?.toLowerCase().includes(q)
    )
  }

  if (objective && objective !== 'ALL') {
    campaigns = campaigns.filter(c => c.objective === objective)
  }

  return NextResponse.json({
    success: true,
    data: campaigns
  })
}
