import { NextRequest, NextResponse } from 'next/server'
import { updateRedditCampaignStatusInStore } from '../../../store'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const status = body?.status

    const updated = updateRedditCampaignStatusInStore(id, status)
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Campaign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error updating campaign status' },
      { status: 500 }
    )
  }
}
