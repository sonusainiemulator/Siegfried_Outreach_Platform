'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { HistorySidebarProps } from '@/types/presentation'
import { MonitorPlay } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import HistorySlideCard from '../HistorySlideCard'

const HistorySidebar = ({
  historyData,
  historyLoading,
  searchTerm,
  setSearchTerm,
  onView,
}: HistorySidebarProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const filtered = historyData?.data?.filter((item: any) =>
    (item.title || item.prompt || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="w-full xl:w-[400px] flex flex-col">
      <div className="p-4 sm:p-6 space-y-6 inner-card glass-dark-card rounded-border-radius">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {t('my_ai_presentations', { defaultValue: 'My AI Presentations' })}
              <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-slate-500 rounded-sm text-[10px] px-1.5 py-0">
                {historyData?.data?.length || 0} {t('total', { defaultValue: 'Total' })}
              </Badge>
            </h3>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder={t('search_prompts', { defaultValue: 'Search prompts...' })}
              className="pl-9 pr-4 py-2 rounded-[8px] inner-card glass-dark-card text-sm w-full focus:ring-1 focus:ring-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className=' overflow-y-auto h-[450px] no-scrollbar'>
          <div className="space-y-6">
            {historyLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              ))
            ) : filtered.length > 0 ? (
              <div className="space-y-6">
                {filtered.slice(0, 4).map((item: any, index: number) => (
                  <HistorySlideCard
                    key={item._id || `pres-${index}`}
                    item={item}
                    onClick={onView}
                  />
                ))}
              </div>
            ) : searchTerm ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-800 dark:text-white font-bold">{t('no_results_found')}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-300">
                  <MonitorPlay className="w-8 h-8" />
                </div>
                <p className="text-slate-400 font-medium">
                  {t('ai_presentation_no_projects')}
                </p>
              </div>
            )}
          </div>

        </div>

        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.SLIDE_MAKER_HISTORY)}
          className="w-full h-12 rounded-xl bg-primary text-white font-medium hover:bg-primary  "
        >
          {t('view_all_archives', { defaultValue: 'View All Archives' })}
        </Button>
      </div>
    </div>
  )
}

export default HistorySidebar
