import { NextRequest, NextResponse } from 'next/server'
import { deleteRedditCampaignFromStore } from '../../store'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = deleteRedditCampaignFromStore(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Campaign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error deleting campaign' },
      { status: 500 }
    )
  }
}
