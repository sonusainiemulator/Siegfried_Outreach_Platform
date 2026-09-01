'use client'

import { useAppDirection } from '@/hooks/useAppDirection'
import useSettings from '@/hooks/useSettings'
import { getMediaUrl } from '@/utils'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const DynamicMetadata = () => {
  const { settings } = useSettings()
  const { i18n } = useTranslation()
  const direction = useAppDirection()

  useEffect(() => {
    // Update HTML lang and dir attributes
    if (i18n.language) {
      document.documentElement.lang = i18n.language
    }

    document.documentElement.dir = direction

    if (settings) {

      // Update Title
      if (settings.app_name) {
        document.title = settings.app_name
      }

      // Update Favicon
      const faviconUrl = settings?.favicon_url ? getMediaUrl(settings.favicon_url) : '/images/logo.png'
      
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")

      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.getElementsByTagName('head')[0].appendChild(link)
      }

      if (faviconUrl) {
        link.href = faviconUrl
      }
    }
  }, [settings, direction, i18n.language])



  return null
}

export default DynamicMetadata
