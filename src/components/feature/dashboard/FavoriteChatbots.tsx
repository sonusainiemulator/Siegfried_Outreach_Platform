'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { useIconDominantColor } from '@/hooks/useIconDominantColor'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { FavoriteChatbotsProps } from '@/types'
import { getMediaUrl } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Bot, ChevronRight, TriangleAlert } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'


const FavoriteChatbotItem = ({ bot, index }: { bot: any; index: number }) => {
  const router = useRouter()
  const avatarUrl = getMediaUrl(bot?.avatar)
  const { bgStyle } = useIconDominantColor(avatarUrl)
  const hasExtractedColor = Object.keys(bgStyle).length > 0

  return (
    <motion.div
      layout
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      className="group/bot"
    >
      <div
        onClick={() => router.push(`${ROUTES.CHAT_ASSISTANT.LIST}/${bot.id}`)}
        className="relative p-px inner-card glass-dark-card rounded-border-radius transition-all duration-500 hover:-translate-y-1 shadow-none! hover:shadow-sm hover:shadow-primary/5 hover:border-primary/20 border border-transparent cursor-pointer"
      >
        <div className="flex flex-col items-center text-center p-3 rounded-border-radius relative ">
          <div className="relative w-full">
            <div className="relative rounded-full flex items-center gap-3">
              <div
                className={cn(
                  'w-12 h-12 rounded-[8px] flex items-center justify-center transition-transform duration-500 group-hover/bot:scale-105',
                  !hasExtractedColor && getAvatarColorClass(bot.name),
                )}
                style={hasExtractedColor ? bgStyle : undefined}
              >
                {bot?.avatar ? (
                  <Image
                    src={avatarUrl || ''}
                    width={24}
                    height={24}
                    unoptimized
                    alt={bot.name}
                    className="object-cover rounded-sm"
                  />
                ) : (
                  <Bot className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 flex flex-col items-start justify-center gap-1">
                <Badge className="text-[10px] w-fit font-medium bg-unset capitalize text-subtitle-color dark:text-white border-light-border-color rounded-sm! px-2 transition-colors">
                  {bot.provider?.split('/')[0] || 'AI'}
                </Badge>
                <div className="space-y-3 w-full relative z-10 text-sm font-semibold text-light-text-color line-clamp-1 dark:text-white text-left rtl:text-right w-full transition-colors duration-300 group-hover/bot:text-primary">
                  {bot.name}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between transition-colors opacity-0 group-hover/bot:opacity-100">
              <div className="absolute cursor-pointer -top-5 -right-4 rtl:right-auto rtl:-left-4 p-1! bg-primary/20! h-fit! rounded-full! flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-primary transition-colors rtl:-scale-x-100 -rotate-35 rtl:rotate-25" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const FavoriteChatbots = ({ chatbots = [], isUser }: FavoriteChatbotsProps) => {
  const { t } = useTranslation()

  return (
    <Card className="rounded-border-radius glass-dark-card border border-white/10 group/favs animate-in fade-in duration-1000 relative">
      <div className="p-4 sm:p-6 relative h-full">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-3 relative z-10">
          <div className="flex gap-2">
            <div className="space-y-1">
              <h3 className="text-xl mb-0 font-medium text-title-color dark:text-white flex items-center gap-2">
                {t('favorite_neural_units', { defaultValue: 'Favorite AI Assistants' })}
              </h3>
              <p className="text-base font-medium text-subtitle-color dark:text-slate-300 opacity-90">
                {t('your_preferred_nodes', { defaultValue: 'Your most used AI models and assistants' })}
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.CHAT_ASSISTANT.LIST}
            className="sm:h-12 h-10 px-5 sm:px-8 whitespace-nowrap rounded-[8px] font-medium text-sm sm:text-base btn-color text-white inline-flex items-center leading-none justify-center gap-1 group/btn"
          >
            {t('view_all_assistants')}
            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 rtl:-scale-x-100 transition-transform" />
          </Link>
        </div>

        {chatbots.length > 0 ? (
          <div
            className={`grid p-0! pt-8! gap-6 md575:grid-cols-1! xl1570:grid-cols-2 xl:grid-cols-3 py-5 px-5 no-scrollbar overflow-x-hidden pr-2! rtl:pl-2! rtl:pr-0! max-h-[310px] ${isUser ? '' : ''
              }  pe-1 relative z-10`}
          >
            <AnimatePresence mode="popLayout">
              {chatbots.map((bot, index) => (
                <FavoriteChatbotItem key={bot.id || index} bot={bot} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoDataFound icon={TriangleAlert} message={t('no_favorite_assistants')} />
        )}
      </div>
    </Card>
  )
}
