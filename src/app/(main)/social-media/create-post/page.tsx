'use client'

import PostComposer from '@/components/feature/social-media/posts/PostComposer'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

const Page = () => {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <Suspense fallback={<div>{t('loading')}</div>}>
        <PostComposer />
      </Suspense>
    </div>
  )
}

export default Page
