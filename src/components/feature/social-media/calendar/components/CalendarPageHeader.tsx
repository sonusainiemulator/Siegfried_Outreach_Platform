'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { CalendarPageHeaderProps } from '@/types'
import { ArrowLeft, CalendarDays, Plus, Sparkles, StickyNote } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

interface ExtendedCalendarHeaderProps extends CalendarPageHeaderProps {
  onOpenBatchModal?: () => void
  onOpenNewNote?: () => void
}

const CalendarPageHeader = ({
  onGoToToday,
  onOpenBatchModal,
  onOpenNewNote,
}: ExtendedCalendarHeaderProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <div className="relative group overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20 hover:text-primary rounded-[8px] transition-all w-11 h-9"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
            <div className="flex items-start flex-col">
              <h1 className="text-3xl font-bold title-color flex items-center justify-center md:justify-start gap-2 md:gap-4">
                {t('content_timeline')}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3 w-full md:w-auto">
          {onOpenNewNote && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenNewNote}
              className="sm:h-11 h-10 flex-1 md:flex-none rounded-border-radius p-button-padding! font-semibold text-sm gap-2 border-primary/40 text-primary hover:bg-primary/10 transition-all cursor-pointer"
            >
              <StickyNote className="w-4 h-4 text-primary" />
              <span>+ Add Note</span>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => router.push('/ai-social/indian-festivals')}
            className="sm:h-11 h-10 flex-1 md:flex-none rounded-border-radius p-button-padding! font-bold text-sm gap-2 border-none text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
          >
            <span>🇮🇳 Festivals Auto-Pilot</span>
          </Button>

          {onOpenBatchModal && (
            <Button
              type="button"
              size="sm"
              onClick={onOpenBatchModal}
              className="sm:h-11 h-10 flex-1 md:flex-none rounded-border-radius p-button-padding! font-bold text-sm gap-2 border-none text-white bg-gradient-to-r from-primary via-purple-600 to-rose-500 hover:opacity-95 shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span>AI Auto-Queue</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onGoToToday}
            className="sm:h-11 h-10 inner-crad glass-dark-card flex-1 md:flex-none rounded-border-radius p-button-padding! border-border/40 font-medium text-sm gap-2 text-light-text-color transition-all"
          >
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            {t('today')}
          </Button>

          <Button
            size="sm"
            className="sm:h-11 h-10 flex-1 md:flex-none rounded-border-radius p-button-padding! font-medium text-sm gap-2 border-none text-white btn-color"
            asChild
          >
            <Link href={ROUTES.SOCIAL_MEDIA.CREATE_POST}>
              <Plus className="w-4 h-4" />
              {t('schedule')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CalendarPageHeader
