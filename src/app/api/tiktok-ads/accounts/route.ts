import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const accounts = [
    {
      id: 'tt_acc_01',
      adAccountId: 'adv_84920491823',
      accountName: 'Siegfried Global Marketing (TikTok Business)',
      currency: 'USD',
      timezone: 'UTC-05:00 (Eastern Time)',
      balance: 14850.00,
      accountStatus: 'ACTIVE',
      isDefault: true,
      advertiserId: '70291048192039'
    },
    {
      id: 'tt_acc_02',
      adAccountId: 'adv_84920491824',
      accountName: 'E-Commerce Spark Ads & TikTok Shop',
      currency: 'USD',
      timezone: 'UTC-05:00 (Eastern Time)',
      balance: 5200.00,
      accountStatus: 'ACTIVE',
      isDefault: false,
      advertiserId: '70291048192040'
    }
  ]

  return NextResponse.json({
    success: true,
    data: accounts
  })
}
