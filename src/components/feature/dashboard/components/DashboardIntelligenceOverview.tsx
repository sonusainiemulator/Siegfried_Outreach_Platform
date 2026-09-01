'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { dashboardColors, dashboardItemVariants } from '@/data/dashboard'
import { IntelligenceOverviewProps } from '@/types/components/campaignHub'
import { motion } from 'framer-motion'
import { PieChart as PieChartIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const DashboardIntelligenceOverview = ({ generatedContentChart }: IntelligenceOverviewProps) => {
  const { t } = useTranslation()

  return (
    <motion.div variants={dashboardItemVariants} className="lg:col-span-12 xl:col-span-5 relative group">
      <Card className="rounded-border-radius glass-dark-card border border-white/10 overflow-hidden h-full relative">
        <div className="sm:p-6 p-4 rounded-border-radius h-full flex flex-col justify-between">
          <div className="space-y-4 mb-6">
            <h3 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-3 mb-0">{t('intelligence_overview')}</h3>
            <p className="text-sm font-medium text-subtitle-color dark:text-slate-300 opacity-90">{t('asset_creation_flow')}</p>
          </div>

          <div className="space-y-6 flex-1">
            {Object.entries(generatedContentChart.percentages || {}).length > 0 ? (
              Object.entries(generatedContentChart.percentages || {}).map(([key, value], i) => (
                <div key={key} className="space-y-2.5 group/bar">
                  <div className="flex justify-between items-center transition-all duration-500">
                    <div className="flex items-center gap-2">
                      <span className="text-md font-medium text-light-text-color dark:text-white tracking-tight">
                        {key}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-subtitle-color dark:text-slate-300 opacity-90">{value}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full absolute inset-y-0 start-0 bg-blue-highlight"
                      style={{
                        backgroundColor: dashboardColors[i % dashboardColors.length],
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-30" />
                    </motion.div>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound icon={PieChartIcon} height="h-[200px]" />
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
