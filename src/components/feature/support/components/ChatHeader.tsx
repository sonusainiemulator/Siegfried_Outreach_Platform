'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { SupportChatHeaderProps } from '@/types/components/support'
import { CheckCircle2, ChevronDown, Menu, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const isNumeric = (str: string) => /^\d+$/.test(str)

const formatDisplayName = (name: string) => {
  if (!name) return name
  if (isNumeric(name)) return `+${name}`
  return name
}

const ChatHeader = ({
  conversation,
  canManageAgents,
  agents,
  role,
  userId,
  isCampaign,
  canReply,
  onToggleList,
  onToggleDetails,
  onAssignAgent,
  onResolve,
}: SupportChatHeaderProps) => {
  const { t } = useTranslation()
  const direction = useAppDirection()

  return (
    <div className="sm:px-6 px-4 py-4 border-b border-glass-border flex items-center justify-between backdrop-blur-md sticky top-0 z-20 flex-wrap gap-2">
      <div className="flex items-center gap-3">
        {onToggleList && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleList}
            className="lg991:flex hidden h-9 w-9 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div
          onClick={onToggleDetails}
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-10 w-10 rounded-xl ring-1 ring-primary/20">
            <AvatarImage src={conversation.userImage} />
            <AvatarFallback className={cn("font-bold", getAvatarColorClass(conversation.userName))}>
               {isNumeric(conversation.userName) ? <User className="w-5 h-5" /> : (conversation.userName?.charAt(0) || 'U')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
              {formatDisplayName(conversation.userName)}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {canManageAgents && (
          <DropdownMenu dir={direction}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 rounded-[8px] bg-primary/10 border-glass-border flex items-center gap-2 px-3 transition-all"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold truncate max-w-25 text-foreground">
                  {conversation.assignedAgent?.name || t('unassigned', { defaultValue: 'Unassigned' })}
                </span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white/95 backdrop-blur-xl dark:bg-modal-bg-color border-glass-border rounded-border-radius p-2 space-y-1"
            >
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <DropdownMenuItem
                    key={agent.id}
                    onClick={() => onAssignAgent(agent.id)}
                    className={cn(
                      'rounded-xl flex items-center gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary py-2.5',
                      conversation.assignedAgent?.id === agent.id && 'bg-primary/5 text-primary',
                    )}
                  >
                    <Avatar className="h-8 w-8 rounded-lg ring-1 ring-primary/10">
                      <AvatarImage src={agent.avatar} />
                      <AvatarFallback className={cn("text-[10px]", getAvatarColorClass(agent.name))}>
                        {agent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-xs flex items-center gap-1.5 truncate">
                          {agent.name}
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              agent.isOnline ? 'bg-green-500' : 'bg-gray-300',
                            )}
                          />
                        </span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md ml-2 whitespace-nowrap">
                          {agent.activeConversations} {t('tasks')}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-medium truncate text-left">
                        {agent.email}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem key="no-agents" disabled>
                  {t('no_agents_available')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!canManageAgents && conversation.assignedAgent && (
          <div className="flex items-center gap-2 p-button-padding! sm:h-12 h-10 rounded-[8px] bg-light-gray  text-light-text-color dark:text-white">
            <User className="w-3.5 h-3.5" />
            <span className="text-md font-medium">
              {conversation.assignedAgent.id === userId
                ? 'Assigned to Me'
                : `Assigned: ${conversation.assignedAgent.name}`}
            </span>
          </div>
        )}

        {(role === 'super_admin' || (conversation.assignedAgent?.id === userId && canReply)) &&
          !isCampaign &&
          conversation.status !== 'resolved' && (
            <Button
              onClick={onResolve}
              className="btn-color text-white p-button-padding! font-medium rounded-[8px] px-4 sm:h-12 h-10 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t('resolve', { defaultValue: 'Mark Resolved' })}
            </Button>
          )}
      </div>
    </div>
  )
}

export default ChatHeader
