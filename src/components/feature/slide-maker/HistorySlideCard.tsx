'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getTheme } from '@/data/slideMaker'
import { SimpleHistoryCardProps } from '@/types/presentation'
import { formatDistanceToNow } from 'date-fns'
import { useTranslation } from 'react-i18next'
import SlideRenderer from './SlideRenderer'

const HistorySlideCard = ({ item, onClick }: SimpleHistoryCardProps) => {
  const { t } = useTranslation()
  const presentation = item?.data || item
  const presentationData = presentation?.metadata?.presentationData || presentation?.data || {}
  
  const slides = presentationData?.slides || presentation?.slides || presentation?.presentation?.slides || []
  
  // synthetic title slide if available
  const firstSlide = presentationData?.title 
    ? { type: 'title', title: presentationData.title, subtitle: presentationData.subtitle, image: presentationData.image }
    : slides[0]

  const themeName = presentation?.metadata?.options?.theme || presentation?.theme || 'Executive Light'
  const theme = getTheme(themeName)
  const totalSlides = slides.length + (presentationData?.title ? 1 : 0)

  return (
    <Card
      onClick={() => onClick(item)}
      className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-light-gray hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all cursor-pointer pr-3 group shadow-sm hover:shadow-md animate-in fade-in slide-in-from-right-4 duration-300"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {firstSlide ? (
          <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-105">
            <SlideRenderer slide={firstSlide} theme={theme} index={0} isThumbnail={true} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
             <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-green-success text-white text-[10px] font-bold px-2 py-0.5 rounded-sm border-none">
          {t('generated')}
        </Badge>
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-slate-800 dark:text-white text-sm truncate leading-tight">
          {item.title || item.prompt || 'Untitled Presentation'}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <span>{item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : 'Recently'}</span>
          <span>•</span>
          <span>{totalSlides} {totalSlides === 1 ? 'slide' : 'slides'}</span>
        </div>
      </div>
    </Card>
  )
}

export default HistorySlideCard
