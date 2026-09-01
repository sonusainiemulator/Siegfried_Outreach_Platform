import { BACKEND_API_URL } from '@/constants'
import { cn } from '@/lib/utils'
import { Chatbot } from '@/types'
import { Bot } from 'lucide-react'
import Image from 'next/image'

export const BotAvatar = ({ bot, size = 'sm' }: { bot: Chatbot | null; size?: 'xs' | 'sm' | 'md' | 'lg' }) => {
  const dims = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }
  return (
    <div className={cn('rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden', dims[size])}>
      {bot?.avatar ? (
        <Image
          src={`${BACKEND_API_URL}/${bot.avatar}`}
          alt={bot?.name || 'Bot'}
          width={96}
          height={96}
          className="object-cover"
          unoptimized
        />
      ) : (
        <Bot className={cn('text-primary', size === 'lg' ? 'w-12 h-12' : 'w-1/2 h-1/2')} />
      )}
    </div>
  )
}
