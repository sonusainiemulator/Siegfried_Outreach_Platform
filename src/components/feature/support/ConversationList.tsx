'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import Spinner from '@/components/reusable/Spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import Input from '@/components/ui/input'
import { agentFilterStatus } from '@/data/liveAgent'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useDeleteCampaignConversationMutation } from '@/redux/api/campaignInboxApi'
import { useAppSelector } from '@/redux/hooks'
import { ApiError } from '@/types'
import { ConversationListProps } from '@/types/components/support'
import { formatDate } from '@/utils'
import { format } from 'date-fns'
import {
  CheckCircle2,
  ChevronDown,
  Facebook,
  Globe,
  History,
  Mail,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  Trash2,
  User,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const getChannelIcon = (source: string) => {
  switch (source?.toLowerCase()) {
    case 'messenger':
      return <Facebook className="w-4 h-4 text-messenger" />
    case 'whatsapp':
      return <MessageCircle className="w-4 h-4 text-whatsapp" />
    case 'telegram':
      return <Send className="w-4 h-4 text-telegram-alt" />
    default:
      return <MessageCircle className="w-4 h-4 text-muted-foreground" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'assigned':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'resolved':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const formatTime12Hour = (dateString: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'h:mm a')
}

const isNumeric = (str: string) => /^\d+$/.test(str)

const formatDisplayName = (name: string) => {
  if (!name) return name
  if (isNumeric(name)) return `+${name}`
  return name
}

const ConversationList = ({
  conversations,
  isLoading,
  selectedId,
  role,
  channelFilter,
  statusFilter = 'all',
  agentFilter,
  searchQuery,
  campaignHub,
  onSelect,
  onChannelFilter,
  onStatusFilter,
  onAgentFilter,
  onSearch,
  onClose,
  className,
}: ConversationListProps) => {
  const { t } = useTranslation()
  const { direction } = useAppSelector((state) => state.layout)
  const isRtl = direction === 'rtl'
  const [deleteConversation, { isLoading: isDeleting }] = useDeleteCampaignConversationMutation()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [convToDelete, setConvToDelete] = useState<string | null>(null)

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setConvToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!convToDelete) return
    try {
      await deleteConversation({ ids: [convToDelete] }).unwrap()
      toast.success(t('conversation_deleted_success', { defaultValue: 'Conversation deleted successfully' }))
      setIsDeleteModalOpen(false)
      setConvToDelete(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(
        apiError?.data?.message || t('failed_to_delete_conversation', { defaultValue: 'Failed to delete conversation' }),
      )
    }
  }

  return (
    <div
      className={cn(
        'w-full h-full border-r border-glass-border flex rtl:border-l rtl:border-r-none flex-col backdrop-blur-sm ',
        className,
      )}
    >
      <div className="border-b border-glass-border">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              {t('inbox', { defaultValue: 'Inbox' })}
              <span className="text-xs font-normal bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">
                {conversations.length}
              </span>
            </h2>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg991:flex hidden h-8 w-8 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="relative group">
            <Search
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors',
                isRtl ? 'right-3' : 'left-3',
              )}
            />
            <Input
              placeholder={t('search_conversations', { defaultValue: 'Search chats...' })}
              className={cn('border-glass-border glass-dark-card focus-visible:ring-primary/20 rounded-[8px]', isRtl ? 'pr-9' : 'pl-9')}
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {(campaignHub
                ? ['All Platforms', 'Email', 'WhatsApp', 'Telegram']
                : ['All Platforms', 'Messenger', 'WhatsApp', 'Telegram']
              ).map((ch) => {
                const isActive = channelFilter === ch
                return (
                  <Button
                    key={ch}
                    onClick={() => onChannelFilter(ch)}
                    variant="ghost"
                    className={cn(
                      'h-10 px-3 rounded-xl flex items-center gap-2 transition-all border border-transparent shadow-sm w-full group/filter justify-start',
                      isActive
                        ? 'bg-primary text-white hover:bg-primary hover:text-white shadow-primary/20 border-primary/20'
                        : 'bg-white/50 dark:bg-black/20 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/10 border-glass-border',
                    )}
                  >
                    <div
                      className={cn(
                        'p-1.5 rounded-lg transition-colors shrink-0',
                        isActive ? 'bg-white/20' : 'bg-primary/10 group-hover/filter:bg-primary/20',
                      )}
                    >
                      {ch === 'All Platforms' && <Globe className="w-3.5 h-3.5" />}
                      {ch === 'Email' && <Mail className="w-3.5 h-3.5" />}
                      {ch === 'WhatsApp' && <MessageCircle className="w-3.5 h-3.5" />}
                      {ch === 'Telegram' && <Send className="w-3.5 h-3.5" />}
                      {ch === 'Messenger' && <Facebook className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-bold truncate">{ch === 'All Platforms' ? 'All' : ch}</span>
                  </Button>
                )
              })}
            </div>

            {!campaignHub && (
              <DropdownMenu dir={direction}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-10 inner-card glass-dark-card justify-between text-sm font-medium text-subtitle-color hover:bg-primary/5 hover:text-primary px-2"
                  >
                    {agentFilterStatus.find((s) => s.value === statusFilter)?.label ?? 'All'}
                    <ChevronDown className="w-3 h-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-90 bg-white/80 glass-dark-card dark:bg-modal-bg-color backdrop-blur-xl border-glass-border rounded-[8px] shadow-xl">
                  {agentFilterStatus.map(({ value, label }) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => onStatusFilter(value)}
                      className={statusFilter === value ? 'text-primary font-semibold' : ''}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-px">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Spinner />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="bg-primary/5 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-primary/40" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              {t('no_transferred_chats', { defaultValue: 'All caught up!' })}
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'p-4 cursor-pointer transition-all duration-300 group flex gap-3 border-b border-glass-border last:border-b-0',
                selectedId === conv.id
                  ? 'bg-light-gray'
                  : 'bg-transparent hover:bg-muted/10',
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarImage src={conv.userImage} />
                  <AvatarFallback className={cn('font-bold', getAvatarColorClass(conv.userName))}>
                    {isNumeric(conv.userName) ? <User className="w-5 h-5" /> : conv.userName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'absolute bottom-1 w-3 h-3 rounded-full',
                    isRtl ? '-left-1' : '-right-0',
                    conv.isUserOnline ? 'bg-green-500' : 'bg-gray-400',
                  )}
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3
                      className={cn(
                        'font-bold text-base truncate transition-colors',
                        selectedId === conv.id ? 'text-primary' : 'text-foreground group-hover:text-primary',
                      )}
                    >
                      {formatDisplayName(conv.userName)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getChannelIcon(conv.source || '')}
                      {!campaignHub && (
                        <span
                          className={cn(
                            'text-[10px] font-medium px-1.5 py-0.5 rounded dark:bg-light-primary dark:border-primary dark:text-primary border',
                            getStatusBadge(conv.status || ''),
                          )}
                        >
                          {conv.status || 'pending'}
                        </span>
                      )}
                    </div>
                    {role === 'super_admin' && (
                      <DropdownMenu dir={direction}>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 hover:bg-white/20"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white/80 dark:bg-modal-bg-color backdrop-blur-xl border-glass-border"
                        >
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
                            onClick={(e) => handleDeleteClick(e, conv.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t('delete', { defaultValue: 'Delete' })}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate leading-relaxed">
                  {formatDate(conv.lastActivity)}
                  <span className="text-[12px] font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
                    {conv.lastActivity ? formatTime12Hour(conv.lastActivity) : ''}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={t('delete_conversation', { defaultValue: 'Delete Conversation' })}
        description={t('confirm_delete_single', {
          defaultValue: 'Are you sure you want to delete this conversation? This action cannot be undone.',
        })}
      />
    </div>
  )
}

export default ConversationList
