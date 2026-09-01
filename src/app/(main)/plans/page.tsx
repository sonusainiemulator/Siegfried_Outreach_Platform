'use client'

export const dynamic = 'force-dynamic'

import PlansRouter from '@/components/feature/plans/PlansRouter'

export default function Page() {
  return (
    <div className="space-y-6">
      <PlansRouter />
    </div>
  )
}
