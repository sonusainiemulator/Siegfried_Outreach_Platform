'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { useGetNotificationsQuery, useMarkAsReadMutation } from '@/redux/api/notificationApi'
import { useAppSelector } from '@/redux/hooks'
import { formatDate } from '@/utils'
import { formatDistanceToNow } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Bell, CheckCircle2, Info, Loader2, Mail, MessageSquare } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const NotificationDropdown = () => {
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)
  const { data, isLoading, refetch } = useGetNotificationsQuery(undefined, {
    pollingInterval: 60000,
  })
  const [markAsRead] = useMarkAsReadMutation()
  const direction = useAppDirection()

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0

  useEffect(() => {
    if (!user?.id) return
    refetch()
  }, [user?.id, refetch])

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap()
    } catch (_error) {
      console.error('Failed to mark notification as read')
    }
  }

  // Helper to get relative time safely
  const getRelativeTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    } catch {
      return formatDate(dateStr)
    }
  }

  // Helper to get icon based on notification content/type
  const getNotificationIcon = (title: string, message: string) => {
    const text = (title + ' ' + message).toLowerCase()
    if (text.includes('error') || text.includes('failed') || text.includes('alert'))
      return <AlertCircle className="w-4 h-4 text-red-500" />
    if (text.includes('success') || text.includes('completed') || text.includes('done'))
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    if (text.includes('message') || text.includes('chat')) return <MessageSquare className="w-4 h-4 text-blue-500" />
    if (text.includes('mail')) return <Mail className="w-4 h-4 text-amber-500" />
    return <Info className="w-4 h-4 text-primary" />
  }

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative glass-header-card glass-button transition-all duration-500 h-9 w-9 sm:h-11 sm:w-11 group',
            unreadCount > 0 ? 'hover:scale-105 active:scale-95' : '',
          )}
        >
          <motion.div
            animate={
              unreadCount > 0
                ? {
                  rotate: [0, 15, -15, 15, 0],
                }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatDelay: 3,
            }}
          >
            <Bell className="w-[18px]! h-[18px]! text-subtitle-color dark:text-white/70 group-hover:text-primary transition-colors duration-300" />
          </motion.div>

          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center "
              >
                <span className="absolute inline-flex bottom-5 left-5 h-4 w-4 animate-ping rounded-full bg-primary/40 opacity-75"></span>
                <span className="absolute bottom-5 left-5 flex items-center justify-center h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[320px] sm:w-[380px] p-0 overflow-hidden bg-white/95 dark:bg-dark-void/95 backdrop-blur-3xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-[100]"
        sideOffset={8}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DropdownMenuLabel className="p-0 text-base font-bold text-title-color dark:text-white leading-none mb-1">
                {t('notifications')}
              </DropdownMenuLabel>
              <p className="text-[14px] text-subtitle-color font-medium">
                {unreadCount} {unreadCount === 1 ? 'New Message' : 'New Messages'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead('all')}
                className="h-8 px-3 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                {t('clear_all')}
              </Button>
            )}
          </div>
        </div>

        {/* List Section */}
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
              <p className="text-xs text-muted-foreground animate-pulse">{t('syncing_updates')}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="inline-flex p-4 bg-gray-50 dark:bg-white/[0.03] rounded-full mb-4">
                <Bell className="w-6 h-6 text-muted-foreground/30" />
              </div>
              <h4 className="text-sm font-bold text-title-color dark:text-white mb-1">{t('stay_updated')}</h4>
              <p className="text-xs text-muted-foreground">
                {t('stay_updated_desc')}
              </p>
            </div>
          ) : (
            <div className="space-y-1 max-h-60 custom-scrollbar overflow-auto">
              <AnimatePresence initial={false}>
                {notifications.slice(0, 10).map((notification: any, index: number) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownMenuItem
                      className={cn(
                        'group px-4! flex items-start gap-2 rounded-border-radius cursor-pointer transition-all duration-300',
                        !notification.is_read
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'hover:bg-gray-50 dark:hover:bg-white/[0.1] ',
                      )}
                      onClick={() => {
                        if (!notification.is_read) {
                          handleMarkAsRead(notification._id)
                        }
                      }}
                    >
                      <div
                        className={cn(
                          'mt-1 p-2 rounded-xl transition-colors duration-300 flex-shrink-0',
                          !notification.is_read
                            ? 'bg-white dark:bg-title-color shadow-sm text-primary'
                            : 'bg-gray-50 dark:bg-white/[0.02] text-muted-foreground',
                        )}
                      >
                        {getNotificationIcon(notification.title, notification.message)}
                      </div>

                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0">
                          <span
                            className={cn(
                              'text-base transition-colors duration-300 line-clamp-1',
                              !notification.is_read
                                ? 'font-bold text-title-color dark:text-white'
                                : 'font-medium text-title-color dark:text-white',
                            )}
                          >
                            {notification.title}
                          </span>
                          <span className="text-xs whitespace-nowrap text-subtitle-color font-medium">
                            {getRelativeTime(notification.created_at)}
                          </span>
                        </div>
                        <p
                          className={cn(
                            'text-sm leading-relaxed text-left transition-colors duration-300 line-clamp-2',
                            !notification.is_read ? 'text-subtitle-color font-medium' : 'text-muted-foreground',
                          )}
                        >
                          {notification.message}
                        </p>
                      </div>

                      {!notification.is_read && (
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-sm" />
                        </div>
                      )}
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
