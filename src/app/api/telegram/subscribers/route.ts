import { apiHandler } from '@/utils/apiHandler'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return apiHandler(request, '/telegram/subscribers')
}

export async function DELETE(request: NextRequest) {
  return apiHandler(request, '/telegram/subscribers/bulk-delete')
}
