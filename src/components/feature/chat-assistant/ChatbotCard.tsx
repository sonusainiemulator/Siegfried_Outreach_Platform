'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useIconDominantColor } from '@/hooks/useIconDominantColor'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { CardChatbotProps } from '@/types'
import { getMediaUrl } from '@/utils'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ChatbotCard = ({ bot, isFavorite, onToggleFavorite }: CardChatbotProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  const avatarUrl = getMediaUrl(bot?.avatar)
  const { bgStyle } = useIconDominantColor(avatarUrl)

  // Use extracted gradient when available, fall back to class-based gradient
  const hasExtractedColor = Object.keys(bgStyle).length > 0
  const iconContainerClass = `w-14 h-14 rounded-[8px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ${hasExtractedColor ? '' : getAvatarColorClass(bot?.category)
    }`

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: 'easeOut',
          },
        },
      }}
      whileHover={{ y: -5 }}
      onClick={() => router.push(`${ROUTES.CHAT_ASSISTANT.LIST}/${bot.id}`)}
      className="group relative h-full cursor-pointer"
    >
      <div className="h-full flex flex-col sm:p-6 p-4 rounded-border-radius glass-card glass-dark-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
        {/* Top Section: Avatar and Favorite */}
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div
              className={iconContainerClass}
              style={hasExtractedColor ? bgStyle : undefined}
            >
              {bot?.avatar ? (
                <Image
                  src={getMediaUrl(bot?.avatar) || ''}
                  className="object-cover rounded-[8px] "
                  unoptimized
                  alt={bot?.name || 'chatbot'}
                  width={28}
                  height={28}
                />
              ) : (
                <Bot className="w-8 h-8" />
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e: React.MouseEvent) => onToggleFavorite(e, bot.id)}
            className={cn(
              'h-9 w-9 rounded-full transition-all hover:text-yellow-500! duration-300',
              isFavorite
                ? 'bg-unset text-yellow-500 hover:bg-yellow-400/20'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Star className={cn('w-4.5 h-4.5', isFavorite && 'fill-current')} />
          </Button>
        </div>

        {/* Middle Section: Meta and Text content */}
        <div className="flex-grow space-y-3">
          <h3 className="text-xl font-medium text-title-color dark:text-white leading-tight truncate transition-colors mb-2">
            {bot.name}
          </h3>

          <p className="text-sm text-subtitle-color line-clamp-2 leading-relaxed font-medium">
            {bot.description ||
              'Specialized AI assistant ready to provide efficient support and intelligent interactions.'}
          </p>
        </div>

        {/* Bottom Section: Action indicator */}
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between transition-colors">
          <span className="text-sm font-medium text-subtitle-color transition-colors">{bot.category}</span>
          <div className='flex gap-1 font-semibold items-center text-primary'>
            {t('start')}
            <ArrowRight className="w-4 h-4 text-primary font-semibold transition-colors group-hover:translate-x-0.5" />
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default ChatbotCard
