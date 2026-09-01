'use client'

import IndiaFestivalAutoPilotPage from '@/components/feature/ai-social/IndiaFestivalAutoPilotPage'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const Page = () => {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <Suspense fallback={<div>{t('loading', 'Loading Indian Festivals Engine...')}</div>}>
        <IndiaFestivalAutoPilotPage />
      </Suspense>
    </div>
  )
}

export default Page
