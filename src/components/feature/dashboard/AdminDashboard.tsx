'use client'

import { AdminDashboardProps } from '@/types'
import { motion, Variants } from 'framer-motion'
import { DashboardCharts } from './DashboardCharts'
import { RecentActivity } from './RecentActivity'
import { StatsCards } from './StatsCards'

export const AdminDashboard = ({ stats }: AdminDashboardProps) => {
  const parentVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  return (
    <motion.div variants={parentVariants} initial="hidden" animate="show" className="space-y-12 relative px-0 ">
      <motion.section variants={itemVariants} className="flex flex-col xl:flex-row gap-8 items-stretch mb-6">
        <div className="w-full xl:flex-1">
          <StatsCards stats={stats.cardsCount} />
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-8 mb-6">
        <div className=" p-px   relative overflow-hidden group/charts">
          <div className="absolute  bg-card/10  -z-10 group-hover/charts:bg-card/20 transition-colors duration-1000" />
          <DashboardCharts
            contentData={stats.generatedContentChart.percentages}
            subscriptionData={stats.subscriptionChart}
            rolesData={stats.rolesChart}
            socialData={stats.socialAccountsChart}
            chatbots={stats.favoriteChatbots || []}
            revenueData={stats.revenueGraph}
            moduleCreditsData={stats.moduleCreditsChart}
          />
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <RecentActivity
          recentUsers={stats.recentUsers}
          recentArticles={stats.recentArticles}
          recentPosts={stats.recentPosts}
        />
      </motion.section>
    </motion.div>
  )
}
