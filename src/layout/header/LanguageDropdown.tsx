'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { useGetActiveLanguagesQuery } from '@/redux/api/languageApi'
import { Language } from '@/types/language'
import { Check, Globe } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageDropdown = () => {
  const { i18n, t } = useTranslation()
  const { data: languagesData, isLoading } = useGetActiveLanguagesQuery({})
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null)
  const [lastDefaultLocale, setLastDefaultLocale] = useState<string | null>(null)
  const direction = useAppDirection()

  const activeLanguages = useMemo(() => languagesData?.data?.pages || [], [languagesData])

  useEffect(() => {
    if (activeLanguages.length > 0) {
      activeLanguages.forEach((lang) => {
        if (lang.translation_json) {
          i18n.addResourceBundle(lang.locale, 'translation', lang.translation_json, true, true)
        }
      })

      const defaultLang = activeLanguages.find((l) => l.is_default) || activeLanguages[0]

      // If the default language has changed (or it's the first load), update the site language
      if (defaultLang && defaultLang.locale !== lastDefaultLocale) {
        i18n.changeLanguage(defaultLang.locale)
        setTimeout(() => {
          setCurrentLanguage(defaultLang)
          setLastDefaultLocale(defaultLang.locale)
        }, 100)
      } else if (!currentLanguage) {
        const current = activeLanguages.find((l) => l.locale === i18n.language) || defaultLang
        setTimeout(() => {
          setCurrentLanguage(current)
        }, 100)
      }
    }
  }, [activeLanguages, i18n, lastDefaultLocale, currentLanguage])

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en'
  }, [i18n.language])

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang.locale)
    setCurrentLanguage(lang)
  }

  const getLanguageIcon = (lang: Language) => {
    if (lang.flag) {
      const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || ''
      const flagUrl = lang.flag.startsWith('http')
        ? lang.flag
        : `${storageUrl.replace(/\/$/, '')}/${lang.flag.replace(/^\//, '')}`
      return (
        <Image
          src={flagUrl}
          alt={lang.name}
          width={24}
          height={24}
          unoptimized
          className="w-5 h-4 object-cover inline-block"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )
    }
    return lang.emoji || '🌐'
  }

  if (isLoading || activeLanguages.length === 0) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-[8px]  cursor-not-allowed glass-header-card h-9 w-9 sm:h-11 sm:w-11 glass-button"
      >
        <Globe className="h-7 w-7 opacity-50" />
      </Button>
    )
  }

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center p-0! gap-1.5 h-9 w-9 sm:h-11 sm:w-11 rounded-[8px] glass-button glass-header-card transition-all duration-300 group"
        >
          <div className="flex items-center justify-center text-primary transition-transform duration-200">
            <span className="text-[16px] leading-none">
              {currentLanguage ? getLanguageIcon(currentLanguage) : <Globe className="h-4 w-4" />}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-2 mt-2 border border-border bg-light-body! rounded-border-radius! glass-dark-card shadow-2xl animate-in fade-in zoom-in duration-200 z-50"
      >
        <div className="px-2 py-1.5 mb-1.5">
          <p className="text-sm font-medium text-subtitle-color">{t('quick_select_language')}</p>
        </div>
        <div className="space-y-1 custom-scrollbar max-h-47.5 overflow-auto">
          {activeLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.id}
              onClick={() => handleLanguageChange(lang)}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 glass-card glass-dark-card   rounded-[8px] cursor-pointer transition-all duration-200',
                i18n.language === lang.locale ? 'bg-primary/10 text-primary' : 'hover:bg-accent',
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl leading-none grayscale-[0.2] group-hover:grayscale-0">
                  {getLanguageIcon(lang)}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight dark:text-white">{lang.name}</span>
                  <span className="text-xs text-subtitle-color text-left rtl:text-right">{lang.locale}</span>
                </div>
              </div>
              {i18n.language === lang.locale && <Check className="h-4 w-4 stroke-[3px]" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageDropdown
