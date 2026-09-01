'use client'

import { Card } from '@/components/ui/card'
import { DashboardPlatformCardsProps } from '@/types/components/socialMedia'
import { useTranslation } from 'react-i18next'

const DashboardPlatformCards = ({ platforms }: DashboardPlatformCardsProps) => {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-4 sm:gap-5 mb-6">
      {platforms.map((platform) => (
        <Card
          key={platform.id}
          className="group relative rounded-border-radius border-border/40 p-4 sm:p-5 overflow-hidden hover:border-primary/40 transition-all duration-500 cursor-pointer hover:-translate-y-1"
        >
          {/* Subtle Shine Animation */}
          <div className="absolute -inset-[100%] group-hover:inset-0 opacity-0 group-hover:opacity-10 transition-all duration-1000 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" />

          <div
            className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 transition-colors duration-500`}
          />

          <div className="flex items-center gap-4 relative z-10">
            <div className={`p-3.5 rounded-[8px] ${platform.bgColor} border border-white/5 bg-opacity-20 transition-transform duration-500 group-hover:scale-110 shrink-0`}>
              <platform.icon className={`w-5 h-5 ${platform.color}`} />
            </div>
            <div className="relative z-10 min-w-0 flex-1">
              <p className="text-sm font-medium text-subtitle-color dark:text-white group-hover:text-primary transition-colors duration-300 truncate mb-0.5">{platform.name}</p>
              <div className="flex gap-1.5 items-center flex-wrap">
                <h4 className="text-xl font-medium text-foreground tracking-tighter">
                  {platform.followers >= 1000 ? `${(platform.followers / 1000).toFixed(1)}K` : platform.followers}
                </h4>
                <div className="flex items-center gap-1">
                  <p className="text-[11px] font-medium text-muted-foreground opacity-60">
                    {platform.id === 'whatsapp'
                      ? t('social_contacts', { defaultValue: 'Contacts' })
                      : platform.id === 'google'
                        ? t('social_locations', { defaultValue: 'Locations' })
                        : platform.id === 'reddit'
                          ? t('social_karma', { defaultValue: 'Karma' })
                          : platform.id === 'wordpress'
                            ? t('social_articles', { defaultValue: 'Blogs / Posts' })
                            : t('social_followers')}
                  </p>
                </div>
              </div>

              {/* WordPress published & draft post count detail */}
              {platform.id === 'wordpress' && (platform.publishedCount !== undefined || platform.draftCount !== undefined) && (
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-semibold">
                  <span className="text-emerald-500">{platform.publishedCount || 0} Pub</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-amber-500">{platform.draftCount || 0} Draft</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default DashboardPlatformCards

