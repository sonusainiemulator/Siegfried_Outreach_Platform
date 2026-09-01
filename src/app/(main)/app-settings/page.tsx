'use client'

import CreditSettings from '@/components/feature/app-settings/CreditSettings'
import GeneralSettings from '@/components/feature/app-settings/GeneralSettings'
import LogoSettings from '@/components/feature/app-settings/LogoSettings'
import { PusherConfig } from '@/components/feature/app-settings/PusherConfig'
import UserSkillsList from '@/components/hermes-skills/UserSkillsList'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { ArrowLeft, Bell, Coins, Globe, Layout, Sparkles, Zap } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const SettingsPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tab || 'general')
  const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const tabsRef = useRef<Map<string, HTMLButtonElement | null>>(new Map())
  const direction = useAppDirection()

  useEffect(() => {
    const updateBubble = () => {
      const activeTrigger = tabsRef.current.get(activeTab)
      if (activeTrigger) {
        setBubbleStyle({
          left: activeTrigger.offsetLeft,
          width: activeTrigger.offsetWidth,
          opacity: 1,
        })
      }
    }

    updateBubble()
    window.addEventListener('resize', updateBubble)
    return () => window.removeEventListener('resize', updateBubble)
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Button>
          <div className="flex items-start flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-title-color dark:text-white title-color leading-[1.1]">
              {t('settings_title')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 glass-dark-card  rounded-[8px] bg-accent/5 border border-input-border-color">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium pr-3">{t('control_center')}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir={direction}>
        <div className="z-20 py-2 -mx-2 px-2 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex-1 flex justify-start sm:justify-center overflow-hidden w-full">
            <TabsList className="h-14 w-fit mx-auto overflow-x-auto overflow-y-hidden flex no-scrollbar group relative p-1.5 border-none! rounded-border-radius bg-unset">
              <div
                className="absolute h-[calc(100%-12px)] top-1.5 bg-primary text-white! rounded-[calc(var(--border-radius)-4px)] transition-all duration-500 "
                style={{
                  left: bubbleStyle.left,
                  width: bubbleStyle.width,
                  opacity: bubbleStyle.opacity,
                }}
              />
              <TabsTrigger
                value="general"
                ref={(el) => {
                  tabsRef.current.set('general', el)
                }}
                className={cn(
                  'px-4 sm:px-8 flex gap-2 items-center rounded-[calc(var(--border-radius)-4px)] bg-transparent! shadow-none! transition-all duration-300 font-bold text-xs relative z-10 h-full whitespace-nowrap cursor-pointer',
                  activeTab === 'general' ? 'text-white!' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Globe className="w-4 h-4" />
                {t('general')}
              </TabsTrigger>
              <TabsTrigger
                value="push"
                ref={(el) => {
                  tabsRef.current.set('push', el)
                }}
                className={cn(
                  'cursor-pointer px-4 sm:px-8 flex gap-2 items-center rounded-[calc(var(--border-radius)-4px)] transition-all bg-transparent! shadow-none! duration-300 font-bold text-xs relative z-10 h-full whitespace-nowrap',
                  activeTab === 'push' ? 'text-white!' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                {t('push_notifications', { defaultValue: 'Push Notifications' })}
              </TabsTrigger>
              <TabsTrigger
                value="credits"
                ref={(el) => {
                  tabsRef.current.set('credits', el)
                }}
                className={cn(
                  'cursor-pointer px-4 sm:px-8 flex gap-2 items-center rounded-[calc(var(--border-radius)-4px)] transition-all bg-transparent! shadow-none! duration-300 font-bold text-xs relative z-10 h-full whitespace-nowrap',
                  activeTab === 'credits' ? 'text-white!' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Coins className="w-4 h-4" />
                {t('credits', { defaultValue: 'Credits' })}
              </TabsTrigger>
              <TabsTrigger
                value="logos"
                ref={(el) => {
                  tabsRef.current.set('logos', el)
                }}
                className={cn(
                  'cursor-pointer px-4 sm:px-8 flex gap-2 items-center rounded-[calc(var(--border-radius)-4px)] transition-all bg-transparent! shadow-none! duration-300 font-bold text-xs relative z-10 h-full whitespace-nowrap',
                  activeTab === 'logos' ? 'text-white!' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Layout className="w-4 h-4" />
                {t('branding', { defaultValue: 'Branding' })}
              </TabsTrigger>
              <TabsTrigger
                value="ai-skills"
                ref={(el) => {
                  tabsRef.current.set('ai-skills', el)
                }}
                className={cn(
                  'relative px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300',
                  activeTab === 'ai-skills'
                    ? 'text-white drop-shadow-md'
                    : 'text-white/60 hover:text-white/80'
                )}
                onClick={() => setActiveTab('ai-skills')}
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI Agent Skills
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="general" className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="push" className="animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
          <PusherConfig />
        </TabsContent>
        <TabsContent value="credits" className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <CreditSettings />
        </TabsContent>
        <TabsContent value="logos" className="animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
          <LogoSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage
