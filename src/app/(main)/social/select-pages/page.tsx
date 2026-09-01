'use client'

import SelectPages from '@/components/feature/social-media/channels/SelectPages'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

const Page = () => {
  return (
    <div className="space-y-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <SelectPages />
      </Suspense>
    </div>
  )
}

export default Page
