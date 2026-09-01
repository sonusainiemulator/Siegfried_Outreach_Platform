'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useAppSelector } from '@/redux/hooks'
import { ActiveTab, CustomerDetailsSidebarProps } from '@/types'
import { formatDate } from '@/utils'
import { CheckCircle2, ChevronRight, Clock, Facebook, Globe, History, Mail, MessageCircle, Phone, Send, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CustomerDetailsSidebar = ({
  conversation,
  activeTab,
  historicalConversations,
  displayedConversationId,
  baseApiUrl,
  onTabChange,
  onViewHistory,
  isOpen,
  onClose,
}: CustomerDetailsSidebarProps) => {
  const { t } = useTranslation()
  const { direction } = useAppSelector((state) => state.layout)
  const isRtl = direction === 'rtl'

  const source = conversation.source?.toLowerCase() ?? ''
  const displayValue = conversation.displayId || conversation.id
  const isPhoneNumber = /^\d{7,}$/.test(displayValue ?? '')

  const contactIcon = source === 'whatsapp'
    ? <MessageCircle className="w-4 h-4 text-whatsapp" />
    : source === 'messenger'
    ? <Facebook className="w-4 h-4 text-messenger" />
    : source === 'telegram'
    ? <Send className="w-4 h-4 text-telegram-alt" />
    : isPhoneNumber
    ? <Phone className="w-4 h-4" />
    : <Globe className="w-4 h-4" />

  const detailRows = [
    { icon: contactIcon, label: t('id', { defaultValue: 'ID' }), value: displayValue },
    {
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: t('status', { defaultValue: 'Status' }),
      value: conversation.status || 'Active',
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: t('last_active', { defaultValue: 'Last Activity' }),
      value: formatDate(conversation.lastActivity),
    },
  ]

  return (
    <>
      <div
        className={cn(
          'absolute top-0 bottom-0 z-50 dark:bg-modal-bg-color',
          isRtl ? 'left-0 border-r' : 'right-0 border-l',
          'w-full max-w-[320px] md:w-80 lg:w-96 border-glass-border flex flex-col bg-white backdrop-blur-xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0 ' : (isRtl ? '-translate-x-full' : 'translate-x-full'),
          !isOpen && 'hidden',
        )}
      >
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-muted/50 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="sm:p-6 p-4 text-center border-b border-glass-border">
          <div className="relative inline-block mb-4">
            <Avatar className="h-15 w-15 sm:h-20 sm:w-20 rounded-border-radius ring-2 ring-primary/10 ">
              <AvatarImage src={conversation.userImage} />
              <AvatarFallback className={cn("text-2xl", getAvatarColorClass(conversation.userName))}>
                {conversation.userName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-green-500 text-white rounded-xl ring-4 ring-background">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h2 className="text-lg font-medium text-title-color dark:text-white">{conversation.userName}</h2>
          <p className="text-sm font-medium text-subtitle-color mt-1">
            {conversation.source || 'Direct Chat'}
          </p>
        </div>

        <div className="flex border-b border-glass-border">
          {(['details', 'history'] as ActiveTab[]).map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              onClick={() => onTabChange(tab)}
              className={cn(
                'flex-1 h-auto py-3 text-[14px] font-medium transition-all gap-2 flex items-center justify-center rounded-none hover:bg-transparent',
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary hover:text-primary'
                  : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground',
              )}
            >
              {tab === 'details' ? <Mail className="w-3 h-3" /> : <History className="w-3 h-3" />}
              {t(tab, { defaultValue: tab.charAt(0).toUpperCase() + tab.slice(1) })}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar">
          {activeTab === 'details' ? (
            <>
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-title-color dark:text-white">
                  {t('contact_info', { defaultValue: 'Details' })}
                </h3>
                <div className="space-y-4">
                  {detailRows.map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center gap-4 group">
                      <div className="h-9 w-9 rounded-[8px] bg-muted flex items-center justify-center group-hover:bg-primary/10 dark:bg-dark-gray-accent group-hover:text-primary transition-colors">
                        {icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground font-medium">
                          {label}
                        </p>
                        <p className="text-sm font-medium truncate text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {conversation.chatbot && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-title-color dark:text-white">
                    {t('assigned_chatbot', { defaultValue: 'Assigned Bot' })}
                  </h3>
                  <div className="p-4 rounded-border-radius bg-primary/5 border border-primary/10 flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-lg ring ring-primary/20">
                      <AvatarImage src={baseApiUrl + '/' + conversation.chatbot.avatar} />
                      <AvatarFallback className={cn("font-bold", getAvatarColorClass(conversation.chatbot.name))}>
                        {conversation.chatbot.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate text-foreground">
                        {conversation.chatbot.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium italic">
                        {t('handed_off_to_you')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => onTabChange('history')}
                variant="outline"
                className="w-full sm:h-12 h-10 text-white rounded-[8px] border-glass-border btn-color group text-xs py-5"
              >
                {t('view_full_history', { defaultValue: 'View History' })}
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-title-color dark:text-white">
                {t('chat_history', { defaultValue: 'Chat History' })}
              </h3>
              {historicalConversations.length === 0 ? (
                <div className="text-center py-12 text-subtitle-color bg-muted/20 rounded-border-radius border border-dashed border-glass-border animate-in fade-in duration-500">
                  <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-medium opacity-60">
                    {t('no_history_found', { defaultValue: 'No Chat History Found' })}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historicalConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => onViewHistory(conv.id)}
                      className={cn(
                        'p-4 rounded-border-radius border transition-all cursor-pointer group relative overflow-hidden shadow-sm',
                        displayedConversationId === conv.id
                          ? 'bg-primary/10 border-primary/20 ring-1 ring-primary/10'
                          : 'bg-background/50 border-glass-border hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5',
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-primary uppercase tracking-tighter bg-primary/10 px-1.5 py-0.5 rounded-md">
                          {conv.source || 'Session'}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground/60">
                          {formatDate(conv.lastActivity)}
                        </span>
                      </div>
                      <h4
                        className={cn(
                          'text-xs font-black truncate transition-colors',
                          displayedConversationId === conv.id
                            ? 'text-primary'
                            : 'text-foreground group-hover:text-primary',
                        )}
                      >
                        {conv.title || 'Previous Session'}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={cn(
                            'text-[8px] font-black uppercase px-2 py-0.5 rounded-full',
                            conv.status === 'active'
                              ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                              : 'bg-muted text-muted-foreground border border-glass-border',
                          )}
                        >
                          {conv.status}
                        </span>
                        <span className="text-[8px] font-bold text-muted-foreground/40 italic">
                          {t('id')}: {conv.id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CustomerDetailsSidebar
