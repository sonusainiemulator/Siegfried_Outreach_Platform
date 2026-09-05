import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const accounts = [
    {
      id: 'rdt_acc_01',
      adAccountId: 't2_948201948',
      accountName: 'Siegfried Global (Reddit Ads)',
      currency: 'USD',
      timezone: 'America/New_York',
      balance: 6420.00,
      accountStatus: 'ACTIVE',
      isDefault: true,
      businessName: 'Siegfried Outreach Inc.'
    },
    {
      id: 'rdt_acc_02',
      adAccountId: 't2_948201949',
      accountName: 'Dev & Open-Source Community Ads',
      currency: 'USD',
      timezone: 'America/New_York',
      balance: 2100.00,
      accountStatus: 'ACTIVE',
      isDefault: false,
      businessName: 'Siegfried Outreach Inc.'
    }
  ]

  return NextResponse.json({
    success: true,
    data: accounts
  })
}
