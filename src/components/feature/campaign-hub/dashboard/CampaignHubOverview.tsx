'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cardRoutes, getOverviewCards } from '@/data/campaignHub'
import { cn } from '@/lib/utils'
import { CampaignHubOverviewProps } from '@/types'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const CampaignHubOverview = ({ cardsData }: CampaignHubOverviewProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const overviewCards = getOverviewCards(t, cardsData)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {overviewCards.map((card: any, index) => (
          <Card
            key={index}
            onClick={() => router.push(cardRoutes[index])}
            className="group relative hover:border-primary/40 transition-all duration-500 rounded-3xl border-input-border-color overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03] pointer-events-none" />

            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col h-full justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'p-4 rounded-[8px] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ',
                      card.bgColor,
                      card.color,
                    )}
                  >
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className='relative z-10'>
                    <p className="text-[calc(14px+(16-14)*((100vw-320px)/(1920-320)))] font-medium text-subtitle-color opacity-70 mb-0 group-hover:text-primary transition-colors duration-300 lg:line-clamp-1 xl:line-clamp-2">
                      {card.title}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-medium mt-1 tracking-tight text-title-color dark:text-white group-hover:scale-105 origin-left transition-transform duration-500 leading-none mb-0">
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CampaignHubOverview
