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
      // Update Title if default or not set
      if (settings.app_name && (!document.title || document.title === 'Siegfried Outreach' || document.title === 'Create Next App' || document.title.includes('Siegfried Outreach'))) {
        document.title = settings.app_name
      }

      // Update Favicon and Site Icons dynamically
      const faviconTarget = settings?.favicon_url || settings?.sidebar_logo_url
      const faviconUrl = faviconTarget ? getMediaUrl(faviconTarget) : '/images/siegfried-outreach-square.png'
      
      if (faviconUrl) {
        const iconRels = ['icon', 'shortcut icon', 'apple-touch-icon']
        iconRels.forEach((rel) => {
          const links = document.querySelectorAll(`link[rel="${rel}"]`)
          if (links.length > 0) {
            links.forEach((l) => {
              (l as HTMLLinkElement).href = faviconUrl
            })
          } else {
            const newLink = document.createElement('link')
            newLink.rel = rel
            newLink.href = faviconUrl
            document.head.appendChild(newLink)
          }
        })
      }
    }
  }, [settings, direction, i18n.language])



  return null
}

export default DynamicMetadata
