'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import ShadcnInput from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ConversationItemProps } from '@/types'
import { formatDate } from '@/utils'
import { Archive, ArchiveRestore, Check, Edit2, History, MoreVertical, Pin, PinOff, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ConversationItem = ({
  conv,
  isActive,
  isSelected,
  isEditing,
  isSelectionMode,
  editTitle,
  setEditTitle,
  onSelect,
  onEdit,
  onSaveTitle,
  onCancelEdit,
  onTogglePin,
  onToggleArchive,
  onDelete,
  editInputRef,
  canManageChat,
  canManageArchived,
  activeTab,
  direction,
}: ConversationItemProps) => {
  const { t } = useTranslation()
  const timeAgo = formatDate(conv.lastActivity)

  return (
    <div
      onClick={() => onSelect(conv.sessionId)}
      className={cn(
        'relative p-4 border rounded-[16px] group cursor-pointer transition-all duration-300 select-none overflow-hidden mb-3',
        isActive && !isSelectionMode
          ? 'bg-primary/5 border-primary/20 shadow-md scale-[1.02]'
          : 'inner-card glass-dark-card border hover:border-primary/60! hover:scale-[1.01]',
        isSelected && isSelectionMode && 'bg-primary/10 border-primary/30 ring-2 ring-primary/20 opacity-100',
      )}
    >
      <div className="flex items-start gap-3">
        {isSelectionMode && (
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(conv.id)}
            className="shrink-0 rounded-lg border-primary/20"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 transition-colors',
                isActive ? 'bg-primary text-white' : 'bg-primary/5 dark:bg-primary/20 text-primary group-hover:bg-primary/10',
              )}
            >
              <History className="w-4 h-4" />
            </div>
            <p
              className={cn(
                'text-sm truncate block w-full font-bold tracking-tight',
                isActive ? 'text-primary' : 'text-foreground',
              )}
            >
              {conv.title}
            </p>
          </div>

          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onSaveTitle(e)
              }}
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ShadcnInput
                ref={editInputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => setTimeout(onCancelEdit, 200)}
                className="w-full h-9 bg-muted border-none! rounded-xl px-3 py-1 text-sm outline-none font-bold"
              />
              <Button
                variant="ghost"
                size="icon"
                type="submit"
                className="h-9 w-9 text-primary hover:scale-110 transition-transform bg-primary/10 rounded-full"
              >
                <Check className="w-5 h-5" />
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              {isActive && !isSelectionMode && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[12px] font-medium text-primary ">{t('active')}</span>
                </div>
              )}
              {!isActive && !isSelectionMode && (
                <div className="flex items-center gap-1.5">
                  {conv.isPinned && <Pin className="w-2.5 h-2.5 text-primary fill-primary" />}
                  <span className="text-xs font-medium text-subtitle-color">
                    {conv.messageCount} {t('msgs')}
                  </span>
                </div>
              )}
              <span className="text-[12px] font-medium text-muted-foreground ms-auto">{timeAgo}</span>
            </div>
          )}
        </div>
      </div>

      {!isSelectionMode && !isEditing && (canManageChat || (activeTab === 'archive' && canManageArchived)) && (
        <div className="absolute right-2 top-15 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0 z-10">
          <DropdownMenu dir={direction}>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl bg-white/90 dark:bg-dark-muted/90 hover:bg-primary hover:text-white transition-all duration-300 active:scale-90 backdrop-blur-md border border-glass-border shadow-xl ring-1 ring-black/5"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-48 rounded-[10px] p-1 dark:bg-modal-bg-color bg-white backdrop-blur-xl border border-glass-border animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 shadow-xl overflow-hidden ring-1 ring-black/5"
            >
              <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-bold  tracking-wider text-muted-foreground/50">
                {t('chat_actions', { defaultValue: 'Actions' })}
              </DropdownMenuLabel>

              <div className="space-y-0.5 mt-0.5">
                {activeTab === 'history' && canManageChat && (
                  <>
                    <DropdownMenuItem
                      onClick={(e) => onTogglePin(e as any, conv)}
                      className="rounded-[10px] flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-primary/10! hover:text-primary! transition-all text-xs font-medium group/item bg-transparent border-none! shadow-none!"
                    >
                      <div
                        className={cn(
                          'p-1.5 rounded-md transition-colors',
                          conv.isPinned
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500'
                            : 'bg-primary/5 group-hover/item:bg-primary/20 text-primary',
                        )}
                      >
                        {conv.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                      </div>
                      <span className="flex-1 text-start">{conv.isPinned ? t('unpin') : t('pin')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => onEdit(e as any, conv)}
                      className="rounded-[10px] flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-primary/10! hover:text-primary! transition-all text-xs font-medium group/item bg-transparent border-none! shadow-none!"
                    >
                      <div className="p-1.5 rounded-md bg-primary/5 group-hover/item:bg-primary/20 text-primary">
                        <Edit2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="flex-1 text-start">{t('rename', { defaultValue: 'Rename' })}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => onToggleArchive(e as any, conv)}
                      className="rounded-[10px] flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-amber-500/10! hover:text-amber-600! transition-all text-xs font-medium group/item bg-transparent border-none! shadow-none!"
                    >
                      <div className="p-1.5 rounded-md bg-amber-500/5 group-hover/item:bg-amber-500/20 text-amber-500">
                        <Archive className="w-3.5 h-3.5" />
                      </div>
                      <span className="flex-1 text-start">{t('archive')}</span>
                    </DropdownMenuItem>
                  </>
                )}

                {activeTab === 'archive' && canManageArchived && (
                  <DropdownMenuItem
                    onClick={(e) => onToggleArchive(e as any, conv)}
                    className="rounded-[10px] flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-emerald-500/10! hover:text-emerald-600! transition-all text-xs font-medium group/item bg-transparent border-none! shadow-none!"
                  >
                    <div className="p-1.5 rounded-md bg-emerald-500/5 group-hover/item:bg-emerald-500/20 text-emerald-500">
                      <ArchiveRestore className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-start">{t('unarchive', { defaultValue: 'Unarchive' })}</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="my-1 opacity-50" />

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(conv.id)
                  }}
                  className="rounded-[10px] flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-destructive/10! hover:text-destructive! transition-all text-xs font-semibold text-destructive group/item bg-transparent border-none! shadow-none!"
                >
                  <div className="p-1.5 rounded-md bg-destructive/5 group-hover/item:bg-destructive/20 group-hover/item:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1 text-start">{t('delete')}</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export default ConversationItem
