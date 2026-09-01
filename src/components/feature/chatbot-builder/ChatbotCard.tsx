'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { BACKEND_API_URL } from '@/constants'
import { channelTypes } from '@/data/aiChatbot'
import { useAppDirection } from '@/hooks/useAppDirection'
import { useIconDominantColor } from '@/hooks/useIconDominantColor'
import { getAvatarColorClass } from '@/lib/utils'
import { ChatbotCardProps } from '@/types'
import { formatDate } from '@/utils'
import { MoreHorizontal, Pencil, Power, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const ChatbotCard = ({ chatbot, onEdit, onDelete, onToggleStatus, canManage }: ChatbotCardProps) => {
  const { t } = useTranslation()
  const direction = useAppDirection()

  const avatarUrl = chatbot?.avatar ? BACKEND_API_URL + '/' + chatbot.avatar : null
  const { bgStyle } = useIconDominantColor(avatarUrl)
  const hasExtractedColor = Object.keys(bgStyle).length > 0

  return (
    <div className="group relative h-full">
      <Card className="relative h-full overflow-hidden glass-card glass-dark-card rounded-border-radius transition-all duration-300 hover:border-white/20">
        <CardContent className="p-6 h-full flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            {/* Header section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 ">
                {chatbot?.avatar ? (
                  <div
                    className={`w-14 h-14 rounded-[8px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ${hasExtractedColor ? '' : getAvatarColorClass(chatbot?.name)}`}
                    style={hasExtractedColor ? bgStyle : undefined}
                  >
                    <Image
                      src={BACKEND_API_URL + '/' + chatbot?.avatar}
                      width={28}
                      height={28}
                      unoptimized
                      alt={chatbot.name || 'chatbot'}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-14 h-14 rounded-[8px] shrink-0 flex items-center justify-center font-bold text-lg ${getAvatarColorClass(chatbot?.name)}`}
                  >
                    {chatbot.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="font-medium text-title-color dark:text-white text-sm truncate max-w-[140px]">
                    {chatbot.name}
                  </h3>
                  <span className="text-subtitle-color font-semibold">{chatbot.provider}</span>
                </div>
              </div>

              <DropdownMenu dir={direction}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-full text-title-color dark:text-white transition-colors"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 p-2 backdrop-blur-xl glass-card rounded-border-radius! bg-white dark:bg-modal-bg-color"
                >
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-subtitle-color ">
                    {t('actions', { defaultValue: 'Actions' })}
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={onEdit}
                    className="rounded-lg  focus:bg-white/5 gap-2 cursor-pointer text-title-color dark:text-white"
                  >
                    <Pencil className="h-4 w-4 text-primary" />
                    <span>{canManage ? t('edit', { defaultValue: 'Edit' }) : t('view', { defaultValue: 'View' })}</span>
                  </DropdownMenuItem>
                  {canManage && (
                    <>
                      <DropdownMenuItem
                        onClick={onToggleStatus}
                        className="rounded-lg  focus:bg-white/5 gap-2 cursor-pointer text-title-color dark:text-white"
                      >
                        <Power className={`h-4 w-4 ${chatbot.isActive ? 'text-destructive' : 'text-emerald-500'}`} />
                        <span>
                          {chatbot.isActive
                            ? t('deactivate', { defaultValue: 'Deactivate' })
                            : t('activate', { defaultValue: 'Activate' })}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem
                        onClick={onDelete}
                        className="text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 rounded-lg gap-2 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{t('delete', { defaultValue: 'Delete' })}</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Info details */}
            <div className="space-y-4 px-1">
              <div className="flex justify-end items-center text-sm">
                <div className="flex items-center gap-3">
                  {channelTypes.map((channel) => {
                    const isEnabled = (chatbot as any)[channel.id]?.enabled
                    if (!isEnabled) return null
                    const Icon = channel.icon
                    return <Icon key={channel.id} className={`h-4 w-4 ${channel.color}`} strokeWidth={1.5} />
                  })}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-title-color dark:text-white font-medium">
                  {t('created', { defaultValue: 'Created' })}
                </span>
                <span className="text-subtitle-color font-semibold text-right">{formatDate(chatbot.created_at)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-title-color dark:text-white font-medium">
                  {t('status', { defaultValue: 'Status' })}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${chatbot.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}
                  ></div>
                  <span className={` ${chatbot.isActive ? 'text-emerald-500 font-semibold' : 'text-destructive font-semibold'}`}>
                    {chatbot.isActive
                      ? t('active', { defaultValue: 'Active' })
                      : t('inactive', { defaultValue: 'Inactive' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-6 mt-auto">
            <Button
              variant="outline"
              onClick={onEdit}
              className="w-full sm:h-12 h-10 inner-card glass-dark-card font-medium transition-all duration-300 text-sm group-hover:bg-primary group-hover:text-white"
            >
              {canManage
                ? t('manage_chatbot', { defaultValue: 'Manage Chatbot' })
                : t('view_chatbot', { defaultValue: 'View Chatbot' })}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChatbotCard
