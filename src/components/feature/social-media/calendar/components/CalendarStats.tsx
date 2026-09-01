'use client'

import { Card } from '@/components/ui/card'
import { CalendarStatsProps } from '@/types'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CalendarStats = ({ stats, onMetricClick }: CalendarStatsProps) => {
  const {t} = useTranslation()
  return (
    <Card className="rounded-border-radius glass-dark-card border-border/40 bg-card/40 sm:p-6 p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-medium dark:text-white  text-title-color">{t('calendar_metrics')}</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
        <div 
          onClick={() => onMetricClick?.('thisMonth')}
          className="text-center p-2 md:p-4 rounded-border-radius bg-primary/5 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors"
        >
          <p className="text-lg md:text-2xl font-medium text-foreground">{stats.thisMonth}</p>
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">{t('this_month')}</p>
        </div>
        <div 
          onClick={() => onMetricClick?.('scheduled')}
          className="text-center p-2 md:p-4 rounded-border-radius bg-amber-500/5 border border-amber-500/10 cursor-pointer hover:bg-amber-500/10 transition-colors"
        >
          <p className="text-lg md:text-2xl font-medium text-amber-500">{stats.scheduled}</p>
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">{t('scheduled')}</p>
        </div>
        <div 
          onClick={() => onMetricClick?.('published')}
          className="text-center p-2 md:p-4 rounded-border-radius bg-emerald-500/5 border border-emerald-500/10 cursor-pointer hover:bg-emerald-500/10 transition-colors"
        >
          <p className="text-lg md:text-2xl font-medium text-emerald-500">{stats.published}</p>
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">{t('published')}</p>
        </div>
        <div 
          onClick={() => onMetricClick?.('failed')}
          className="text-center p-2 md:p-4 rounded-border-radius bg-destructive/5 border border-destructive/10 cursor-pointer hover:bg-destructive/10 transition-colors"
        >
          <p className="text-lg md:text-2xl font-medium text-destructive">{stats.failed}</p>
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">{t('failed')}</p>
        </div>
      </div>
    </Card>
  )
}

export default CalendarStats

