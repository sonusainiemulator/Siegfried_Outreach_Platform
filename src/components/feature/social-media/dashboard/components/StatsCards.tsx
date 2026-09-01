'use client'

import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { StatsCardsProps } from '@/types/components/socialMedia'
import { AlertCircle, Clock, Send, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const StatsCards = ({ stats, totalFollowers }: StatsCardsProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {/* Total Reach */}
      <Card
        onClick={() => router.push(ROUTES.SOCIAL_MEDIA.CHANNELS)}
        className="group relative rounded-border-radius border-border/40 glass-card p-4 sm:p-6 overflow-hidden hover:border-primary/40 transition-all duration-500 cursor-pointer hover:-translate-y-1"
      >
        <div className="absolute -inset-[100%] group-hover:inset-0 opacity-0 group-hover:opacity-10 transition-all duration-1000 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" />
        <div className="flex flex-row items-center gap-4 relative z-10 h-full">
          <div className="flex items-center justify-between">
            <div className="p-4 rounded-[8px] bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-base font-medium text-subtitle-color group-hover:text-primary transition-colors duration-300">
              {t('social_total_reach')}
            </p>
            <h4 className="text-xl font-medium text-foreground tracking-tighter mt-1">
              {totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : totalFollowers}
            </h4>
          </div>
        </div>
      </Card>

      {/* Scheduled */}
      <Card
        onClick={() => router.push(ROUTES.SOCIAL_MEDIA.CALENDAR)}
        className="group relative rounded-border-radius border-border/40 glass-card p-4 sm:p-6 overflow-hidden hover:border-amber-500/40 transition-all duration-500 cursor-pointer hover:-translate-y-1"
      >
        <div className="absolute -inset-[100%] group-hover:inset-0 opacity-0 group-hover:opacity-10 transition-all duration-1000 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" />
        <div className="flex flex-row items-center gap-4 relative z-10 h-full">
          <div className="flex items-center justify-between">
            <div className="p-4 rounded-[8px] bg-amber-500/10 text-amber-500 transition-transform duration-500 group-hover:scale-110">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-base font-medium text-subtitle-color group-hover:text-primary transition-colors duration-300">
              {t('social_scheduled')}
            </p>
            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
              <h4 className="text-2xl font-medium text-foreground tracking-tighter">
                {stats?.posts?.scheduled || 0}
              </h4>
              {stats?.posts?.wordpress?.scheduled !== undefined && stats?.posts?.wordpress?.scheduled > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {stats.posts.wordpress.scheduled} WP Drafts
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Published */}
      <Card
        onClick={() => router.push(ROUTES.SOCIAL_MEDIA.CALENDAR)}
        className="group relative rounded-border-radius border-border/40 glass-card p-4 sm:p-6 overflow-hidden hover:border-blue-500/40 transition-all duration-500 cursor-pointer hover:-translate-y-1"
      >
        <div className="absolute -inset-[100%] group-hover:inset-0 opacity-0 group-hover:opacity-10 transition-all duration-1000 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" />
        <div className="flex flex-row items-center gap-4 relative z-10 h-full">
          <div className="flex items-center justify-between">
            <div className="p-4 rounded-[8px] bg-blue-500/10 text-blue-500 transition-transform duration-500 group-hover:scale-110">
              <Send className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-base font-medium text-subtitle-color group-hover:text-primary transition-colors duration-300">
              {t('social_published')}
            </p>
            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
              <h4 className="text-2xl font-medium text-foreground tracking-tighter">
                {stats?.posts?.published || 0}
              </h4>
              {stats?.posts?.wordpress?.published !== undefined && stats?.posts?.wordpress?.published > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {stats.posts.wordpress.published} WP Published
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Failed Posts */}
      <Card
        onClick={() => router.push(ROUTES.SOCIAL_MEDIA.CALENDAR)}
        className="group relative rounded-border-radius border-border/40 glass-card p-4 sm:p-6 overflow-hidden hover:border-destructive/40 transition-all duration-500 cursor-pointer hover:-translate-y-1"
      >
        <div className="absolute -inset-[100%] group-hover:inset-0 opacity-0 group-hover:opacity-10 transition-all duration-1000 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" />
        <div className="flex flex-row items-center gap-4 relative z-10 h-full">
          <div className="flex items-center justify-between">
            <div className="p-4 rounded-[8px] bg-destructive/10 text-destructive transition-transform duration-500 group-hover:scale-110">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-base font-medium text-subtitle-color group-hover:text-primary transition-colors duration-300">
              {t('social_failed')}
            </p>
            <h4 className="text-2xl font-medium text-foreground tracking-tighter mt-1">{stats?.posts?.failed || 0}</h4>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StatsCards
