'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PostQueueSummaryProps } from '@/types/components/socialMedia'
import { format } from 'date-fns'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const PostQueueSummary = ({ postsCount, nextPost, timeLeft }: PostQueueSummaryProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1100px] m-auto">
      {/* Card 1: Total Pending */}
      <Card className="xl:col-span-4 rounded-border-radius border-border/40 glass-card p-6 flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
        <div className="space-y-6">
          <p className="text-xs font-bold text-subtitle-color/60">{t('TOTAL PENDING')}</p>
          <div className="flex items-end gap-3 translate-y-1">
            <span className="text-5xl font-bold text-primary tracking-tighter leading-none">{postsCount}</span>
            <span className="text-lg font-medium text-subtitle-color/60 mb-1.5">
              {postsCount === 1 ? t('scheduled post') : t('scheduled posts')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-primary font-bold text-sm w-fit py-2 rounded-[8px]">
          <Sparkles className="w-4 h-4" />
          <span>{t('Healthy Queue Status')}</span>
        </div>
      </Card>

      {/* Card 2: Next Release */}
      <Card className="xl:col-span-8 rounded-border-radius border-border/40 bg-primary text-white overflow-hidden relative shadow-lg shadow-primary/10 transition-all duration-500 hover:shadow-primary/20">
        <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col justify-between h-full">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <Badge className="bg-black/20 hover:bg-black/30 text-white border-none uppercase tracking-[2px] text-[10px] font-bold px-3 py-1 mb-3 rounded-full backdrop-blur-md">
                {t('next_release')}
              </Badge>
              <h2 className="text-2xl font-medium tracking-tight text-white">
                {nextPost ? nextPost.title : t('No post scheduled')}
              </h2>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-[10px] text-white bg-white/20 shrink-0">
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-2xl font-bold font-mono">{timeLeft.h}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest">{t('hrs')}</span>
              </div>
              <div className="text-xl font-bold opacity-30">:</div>
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-2xl font-bold font-mono">{timeLeft.m}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest">{t('mins')}</span>
              </div>
              <div className="text-xl font-bold opacity-30">:</div>
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-2xl font-bold font-mono">{timeLeft.s}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest">{t('secs')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-4">
            <p className="text-sm font-medium max-w-md">
              {nextPost ? (
                <>
                  {t('social_peak_window')}{' '}
                  <span className="font-bold underline decoration-white/30 underline-offset-4">
                    {format(new Date(nextPost.scheduledDateTime!), 'hh:mm a')}
                  </span>{' '}
                  {t('local_time') || 'local time.'}
                </>
              ) : (
                t('social_no_scheduled_desc')
              )}
            </p>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
