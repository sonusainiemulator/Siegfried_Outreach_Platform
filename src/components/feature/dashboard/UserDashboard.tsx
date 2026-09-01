'use client'

import { dashboardParentVariants } from '@/data/dashboard'
import { UserDashboardProps } from '@/types/components/dashboard'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FavoriteChatbots } from './FavoriteChatbots'
import { DashboardArticlesLibrary } from './components/DashboardArticlesLibrary'
import { DashboardIntelligenceOverview } from './components/DashboardIntelligenceOverview'
import { DashboardPlanCard } from './components/DashboardPlanCard'
import { DashboardStatCards } from './components/DashboardStatCards'
import { DashboardWelcome } from './components/DashboardWelcome'

export const UserDashboard = ({ stats }: UserDashboardProps) => {
  const { t } = useTranslation()

  return (
    <motion.div variants={dashboardParentVariants} initial="hidden" animate="show" className="space-y-16 relative">
      <div className="grid md575:grid-cols-1! xl1570:grid-cols-2 xl:grid-cols-6 gap-6 lg:gap-8 mb-6 lg:mb-8">
        <DashboardWelcome />
        <DashboardStatCards stats={stats} />
        <DashboardPlanCard currentPurchasePlan={stats.currentPurchasePlan} t={t} />
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 lg:mb-8 mb-6">
        <DashboardIntelligenceOverview generatedContentChart={stats.generatedContentChart} />
        <motion.div className="lg:col-span-12 xl:col-span-7">
          <FavoriteChatbots chatbots={stats.favoriteChatbots || []} isUser={true} />
        </motion.div>
      </div>

      <DashboardArticlesLibrary recentArticles={stats.recentArticles} />
    </motion.div>
  )
}
