'use client'

import PlatformConnection from '@/components/feature/social-media/channels/PlatformConnection'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const Page = () => {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <Suspense fallback={<div>{t('loading')}</div>}>
        <PlatformConnection />
      </Suspense>
    </div>
  )
}

export default Page
