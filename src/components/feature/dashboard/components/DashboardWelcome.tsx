'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { dashboardItemVariants } from '@/data/dashboard'
import { useAppSelector } from '@/redux/hooks'
import { motion } from 'framer-motion'
import { Sparkles, Video, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'

export const DashboardWelcome = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('good_morning', { defaultValue: 'Good Morning' })
    if (hour < 17) return t('good_afternoon', { defaultValue: 'Good Afternoon' })
    if (hour < 21) return t('good_evening', { defaultValue: 'Good Evening' })
    return t('good_night', { defaultValue: 'Good Night' })
  }

  return (
    <motion.section className="col-span-1 xl:col-span-2" variants={dashboardItemVariants}>
      <Card className="relative h-full overflow-hidden rounded-border-radius glass-dark-card p-5 flex flex-col justify-between gap-4 group/hero border border-white/10 hover:border-white/20 transition-all duration-700">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{t('ai_power_enabled', { defaultValue: 'Neural Active' })}</span>
            </div>

            {/* Quick Launch Button for AI Avatar */}
            <Button
              size="sm"
              onClick={() => router.push(ROUTES.AI_AVATAR)}
              className="h-7 text-[11px] rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1 px-3 cursor-pointer shadow-md"
            >
              <Video className="w-3 h-3" />
              AI Avatar Studio
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
              <span className="inline-block" dir="auto">{getGreeting()},</span>
              <span className="text-mix-primary block decoration-clone bg-clip-text" dir="auto">{user?.name}!</span>
            </h2>
            <p className="text-sm text-subtitle-color dark:text-slate-300 font-medium opacity-90 line-clamp-2 leading-relaxed" dir="auto">
              {t('user_dashboard_promo_unique', {
                defaultValue: 'Manage your AI agents, create talking videos, and generate world-class content.',
              })}
            </p>
          </div>
        </div>
      </Card>
    </motion.section>
  )
}
