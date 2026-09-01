'use client'

import { cardConfigs, colorMap, routeMap } from '@/data/dashboard'
import { cn } from '@/lib/utils'
import { StatsCardProps } from '@/types'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export const StatsCards = ({ stats }: StatsCardProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  // Calculate the maximum value to normalize progress bar widths
  const statsValues = cardConfigs.map((config) => Number(stats[config.statKey]) || 0)
  const maxValue = Math.max(...statsValues, 1)

  return (
    <div className="grid md575:grid-cols-1! lg991:grid-cols-2! xl1570:grid-cols-3 xl:grid-cols-6 gap-6">
      {cardConfigs.map(
        (
          { labelKey, defaultLabel, statKey, icon: Icon, color, colSpan },
          index,
        ) => {
          const { text, iconBg, cardGradient } = colorMap[color as keyof typeof colorMap] || colorMap.blue
          const value = Number(stats[statKey]) || 0

          // Calculate dynamic width: relative to the max value, purely based on count
          const progressWidth = maxValue > 0 ? (value / maxValue) * 100 : 0

          return (
            <motion.div
              key={labelKey}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              className={cn('h-full', colSpan)}
            >
              <div
                onClick={() => {
                  const path = routeMap[statKey]
                  if (path) router.push(path)
                }}
                className={cn(
                  'group relative z-10 sm:p-6 p-4 h-full glass-dark-card rounded-border-radius glass-card border border-white/10 dark:hover:border-primary/40 dark:hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer',
                  cardGradient,
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-0" />
                <div className=" flex flex-row items-center mb-2 gap-4">
                  <div className="flex items-center justify-between">

                    <div
                      className={cn(
                        'p-3 rounded-[8px] transition-all duration-700 group-hover:scale-110  shadow-2xl relative overflow-hidden btn-color text-white!',
                        text,
                        iconBg,
                      )}
                    >
                      <div className="absolute inset-0 " />
                      <Icon className="w-5 h-5 elative z-10" />
                    </div>
                  </div>

                  <div>
                    <div className="text-3xl font-medium  mb-0 text-title-color group-hover:tracking-tight transition-all duration-700 dark:text-white">
                      {value.toLocaleString()}
                    </div>
                    <div className="space-y-1">
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-subtitle-color dark:text-slate-300 line-clamp-1">
                  {t(labelKey, { defaultValue: defaultLabel })}
                </h3>
                <div className="mt-3 h-1.5 w-full bg-stats-progress-bg dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: 'circOut' }}
                    className={cn('h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]')}
                  />
                </div>
              </div>
            </motion.div>
          )
        },
      )}
    </div>
  )
}
