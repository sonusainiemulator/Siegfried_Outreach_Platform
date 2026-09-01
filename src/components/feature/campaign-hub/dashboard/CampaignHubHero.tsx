'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const CampaignHubHero = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="relative group/hero overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[300px] shadow-2xl">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left">
        <div className="flex -space-x-6 shrink-0 relative">
          <motion.div
            initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
            animate={{ rotate: -10, scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)] ring-4 ring-background transform z-10"
          >
            <Send className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-1" />
          </motion.div>
          <motion.div
            initial={{ rotate: 15, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 10, scale: 1.1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-whatsapp flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(37,211,102,0.5)] ring-4 ring-background transform"
          >
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
          </motion.div>
          <div className="absolute -top-4 -right-4">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-title-color dark:text-white leading-tight">
            {t('campaign_hub_hero_title')}
          </h2>
          <p className="text-subtitle-color text-base sm:text-lg font-medium opacity-80 leading-relaxed">
            {t('campaign_hub_hero_desc')}
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-auto flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => router.push(ROUTES.CAMPAIGN_HUB.SETTINGS.BOT_PREFERENCES)}
          className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
        >
          <SettingsIcon className="w-5 h-5 group-hover/hero:rotate-90 transition-transform duration-700" />
          {t('manage_settings')}
        </Button>
      </div>
    </div>
  )
}

export default CampaignHubHero
