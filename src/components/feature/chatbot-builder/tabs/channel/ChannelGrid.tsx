'use client'

import { Card } from '@/components/ui/card'
import { channelTypes } from '@/data/aiChatbot'
import { cn } from '@/lib/utils'
import { ChannelGridProps, ChatbotFormData } from '@/types'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ChannelGrid = ({ formData, onChannelClick }: ChannelGridProps) => {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {channelTypes.map((channel) => {
        const Icon = channel.icon
        const isEnabled = (formData[channel.id as keyof ChatbotFormData] as any)?.enabled

        return (
          <Card
            key={channel.id}
            onClick={() => onChannelClick(channel.id)}
            className={cn(
              'sm:p-6 p-4 cursor-pointer hover:border-primary/50 transition-all duration-300 glass-dark-card group flex flex-col items-center gap-4 text-center border-glass-border backdrop-blur-sm',
              isEnabled && 'border-primary bg-primary/5 ring-1 ring-primary/20',
            )}
          >
            <div
              className={cn('p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300', channel.bgColor)}
            >
              <Icon className={cn('h-8 w-8', channel.color)} />
            </div>
            <h3 className="font-medium text-title-color dark:text-white text-lg">{channel.label}</h3>
            {isEnabled && (
              <div className="flex items-center gap-1 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                <CheckCircle2 className="h-3 w-3" />
                {t('connected')}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export default ChannelGrid
