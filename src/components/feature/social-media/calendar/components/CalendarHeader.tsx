'use client'

import { Button } from '@/components/ui/button'
import { CalendarHeaderProps } from '@/types'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight, StickyNote } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CalendarHeader = ({
  currentMonth,
  onNavigatePrevious,
  onNavigateNext,
  notesCount = 0,
}: CalendarHeaderProps) => {
  const { t } = useTranslation()
  return (
    <div className="p-4 sm:p-6 border-b border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 md:gap-4 order-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNavigatePrevious}
          className="h-10 w-10 md:h-12 md:w-12 rounded-2xl hover:bg-background/60 dark:text-white"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        <h2 className="text-base md:text-2xl font-medium dark:text-white text-center truncate">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNavigateNext}
          className="h-10 w-10 md:h-12 md:w-12 rounded-2xl hover:bg-background/60 dark:text-white"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
      <div className="flex items-center gap-3 md:gap-5 order-2">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] md:text-xs font-medium text-subtitle-color">{t('published')}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-500" />
          <span className="text-[10px] md:text-xs font-medium text-subtitle-color">{t('scheduled')}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-500" />
          <span className="text-[10px] md:text-xs font-medium text-subtitle-color flex items-center gap-1">
            Notes ({notesCount})
          </span>
        </div>
      </div>
    </div>
  )
}

export default CalendarHeader
