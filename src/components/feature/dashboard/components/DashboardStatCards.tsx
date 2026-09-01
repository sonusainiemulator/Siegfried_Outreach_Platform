'use client'

import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { dashboardItemVariants, sparklesConfig, userDashboardCardsConfig } from '@/data/dashboard'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/redux/hooks'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export const DashboardStatCards = ({ stats }: { stats: any }) => {
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const userCardRoutes: Record<string, string> = {
    credits: ROUTES.PLANS,
    totalChatbots: ROUTES.CHATBOT_BUILDER,
    totalArticles: ROUTES.CONTENT_WRITER,
  }

  return (
    <>
      {userDashboardCardsConfig.map((card, index) => {
        const cardValue =
          card.statKey === 'credits'
            ? user?.total_credits
            : stats.cardsCount[card.statKey as keyof typeof stats.cardsCount]

        return (
          <motion.div variants={dashboardItemVariants} key={index} className="col-span-1">
            <div className="group h-full block">
              <Card
                onClick={() => {
                  const path = userCardRoutes[card.statKey]
                  if (path) router.push(path)
                }}
                className={cn(
                  'h-full glass-dark-card border border-white/10 rounded-border-radius transition-all duration-700 hover:border-white/20 relative overflow-hidden group/card cursor-pointer',
                  card.shadow,
                )}
              >
                {/* Background Glow */}
                <div
                  className={cn(
                    'absolute -top-12 end-[-3rem] w-40 h-40 blur-[70px] opacity-40 transition-opacity duration-700 group-hover/card:opacity-60',
                    card.glow,
                  )}
                />

                {/* Decorative Elements */}
                {sparklesConfig.map((sparkle, i) => (
                  <div key={i} className={sparkle.wrapperClass}>
                    <Sparkles className={cn(sparkle.iconClass, card.color)} />
                  </div>
                ))}

                {/* Content */}
                <div className="relative z-10 sm:p-6 p-4 flex flex-col h-full space-y-8">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={cn(
                        'p-3 rounded-[8px] transition-transform duration-700 group-hover/card:scale-110 ring-1 ring-white/10 shadow-none!',
                        card.color,
                        card.bgColor,
                      )}
                    >
                      <card.icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4 mt-auto">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-title-color dark:text-white mb-0 tracking-tight">
                        {t(card.labelKey)}
                      </h3>
                      <p className="text-sm text-subtitle-color dark:text-slate-300 font-medium leading-relaxed line-clamp-2 opacity-90">
                        {card.statKey === 'credits'
                          ? `${t('used')}: ${user?.used_credits}/${user?.total_credits}`
                          : t(card.descKey)}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-medium text-title-color dark:text-white tabular-nums tracking-tighter">
                        {card.statKey === 'credits' ? user?.remaining_credits : cardValue || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Gradient Overlay from Right */}
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-700 pointer-events-none z-0" />
              </Card>
            </div>
          </motion.div>
        )
      })}
    </>
  )
}
