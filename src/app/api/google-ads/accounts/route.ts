import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const accounts = [
    {
      id: 'ggl_acc_01',
      customerId: '482-910-4819',
      accountName: 'Siegfried Global MCC (Google Ads)',
      currency: 'USD',
      timeZone: 'America/New_York',
      balance: 18500.00,
      accountStatus: 'ACTIVE',
      isDefault: true,
      managerAccountId: '910-293-8410'
    },
    {
      id: 'ggl_acc_02',
      customerId: '482-910-4820',
      accountName: 'High-Intent Search & Brand Campaigns',
      currency: 'USD',
      timeZone: 'America/New_York',
      balance: 7400.00,
      accountStatus: 'ACTIVE',
      isDefault: false
    }
  ]

  return NextResponse.json({
    success: true,
    data: accounts
  })
}
