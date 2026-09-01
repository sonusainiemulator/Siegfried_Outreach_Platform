'use client'

import StatusPage from '@/components/reusable/StatusPage'
import useInternetConnection from '@/hooks/useInternetConnection'
import useSettings from '@/hooks/useSettings'
import { InternetConnectionWrapperProps } from '@/types'
import { getMediaUrl } from '@/utils'
import { WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const InternetConnectionWrapper = ({ children }: InternetConnectionWrapperProps) => {
  const { isOnline, isChecking, retry } = useInternetConnection()
  const { t } = useTranslation()
  const { settings } = useSettings()

  if (!isOnline && !isChecking) {
    return (
      <StatusPage
        title={settings?.no_internet_title || t('offline_title')}
        description={settings?.no_internet_content || t('offline_desc')}
        image={getMediaUrl(settings?.no_internet_image_url)}
        icon={WifiOff}
        showHome={false}
        showRetry={true}
        onRetry={retry}
        isRetrying={isChecking}
      />
    )
  }

  return <>{children}</>
}

export default InternetConnectionWrapper
