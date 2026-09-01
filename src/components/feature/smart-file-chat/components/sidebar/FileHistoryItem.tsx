import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdownMenu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { FileHistoryItemProps } from '@/types'
import { formatDate } from '@/utils'
import { Archive, ArchiveRestore, FileText, MoreVertical, Pin, PinOff, Trash2 } from 'lucide-react'

const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-primary/20 text-primary font-bold rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  )
}

const FileHistoryItem = ({
  chat,
  activeSessionId,
  selectedConversations,
  isSelectionMode,
  toggleConversationSelection,
  onSessionSelect,
  searchQuery,
  activeTab,
  handleTogglePin,
  handleArchive,
  setConvToDelete,
  setIsDeleteModalOpen,
  canManage,
  canManageArchived,
  t,
}: FileHistoryItemProps) => {
  const isActive = chat.id === activeSessionId
  const isSelected = selectedConversations.has(chat.id)
  const displayName = chat.fileName || chat.title || t('untitled_chat')
  const direction = useAppDirection()

  return (
    <div
      onClick={() => {
        if (isSelectionMode) {
          toggleConversationSelection(chat.id)
        } else {
          onSessionSelect(chat.id)
        }
      }}
      className={cn(
        'relative p-4 border rounded-border-radius group cursor-pointer transition-all duration-300 select-none overflow-hidden mb-3',
        isActive && !isSelectionMode
          ? 'bg-primary/10 border-primary/30 shadow-sm'
          : 'bg-light-gray border-border/10 hover:border-glass-border/50 opacity-100',
        isSelected && isSelectionMode && 'bg-primary/20 border-primary/40 opacity-100 ',
        searchQuery &&
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !isActive &&
        'ring-1 ring-primary/30 bg-primary/5',
        'w-full min-w-0',
      )}
    >
      <div className="grid grid-cols-[auto_1fr] gap-3 min-w-0 w-full">
        {isSelectionMode ? (
          <Checkbox
            checked={isSelected}
            onChange={() => toggleConversationSelection(chat.id)}
            className="shrink-0 rounded-lg border-primary/20 mt-2"
          />
        ) : (
          <div
            className={cn(
              'shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-colors',
              isActive ? 'bg-primary/20' : 'bg-primary/5 border border-primary/10',
            )}
          >
            <FileText className={cn('w-5 h-5 transition-colors', isActive ? 'text-primary' : 'text-primary/60')} />
          </div>
        )}

        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-1 gap-2 min-w-0">
            {isActive && !isSelectionMode ? (
              <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                <span className="text-sm font-medium text-primary truncate">{t('active')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                {chat.isPinned && <Pin className="w-2.5 h-2.5 text-primary fill-primary shrink-0" />}
                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider truncate">
                  {formatDate(chat.lastActivity || chat.created_at)}
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-foreground/80 font-semibold tracking-tight truncate w-full block">
            {searchQuery ? highlightMatch(displayName, searchQuery) : displayName}
          </p>
        </div>
      </div>

      {!isSelectionMode && (canManage || (activeTab === 'archive' && canManageArchived)) && (
        <div className="absolute right-2 top-12 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0 z-10">
          <DropdownMenu dir={direction}>
            <DropdownMenuTrigger asChild onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}>
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
              className="w-48 rounded-border-radius p-1 dark:bg-modal-bg-color bg-white backdrop-blur-xl border border-glass-border animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200 shadow-xl overflow-hidden ring-1 ring-black/5"
            >
              <DropdownMenuLabel className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">
                {t('chat_actions', { defaultValue: 'Actions' })}
              </DropdownMenuLabel>

              <div className="space-y-0.5 mt-0.5">
                {activeTab === 'history' && canManage && (
                  <>
                    <DropdownMenuItem
                      onClick={(e: any) => handleTogglePin(e as any, chat)}
                      className="rounded-lg flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-all text-xs font-medium group/item bg-transparent border-none! shadow-none!"
                    >
                      <div
                        className={cn(
                          'p-1.5 rounded-md transition-colors',
                          chat.isPinned
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500'
                            : 'bg-primary/5 group-hover/item:bg-primary/20 text-primary',
                        )}
                      >
                        {chat.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                      </div>
                      <span className="flex-1 text-start">{chat.isPinned ? t('unpin') : t('pin')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e: any) => handleArchive(e as any, chat.id, true)}
                      className="rounded-lg flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-amber-500/10 hover:text-amber-600 transition-all text-xs font-medium group/item bg-transparent border-none! shadow-none!"
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
                    onClick={(e: any) => handleArchive(e as any, chat.id, false)}
                    className="rounded-lg flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-600 transition-all text-xs font-medium group/item bg-transparent border-none! shadow-none!"
                  >
                    <div className="p-1.5 rounded-md bg-emerald-500/5 group-hover/item:bg-emerald-500/20 text-emerald-500">
                      <ArchiveRestore className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-start">{t('unarchive', { defaultValue: 'Unarchive' })}</span>
                  </DropdownMenuItem>
                )}


                <DropdownMenuItem
                  onClick={(e: { stopPropagation: () => void }) => {
                    e.stopPropagation()
                    if (!canManage) return
                    setConvToDelete([chat.id])
                    setIsDeleteModalOpen(true)
                  }}
                  className="rounded-lg flex items-center gap-2.5 px-2 py-1.5 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-all text-xs font-semibold text-destructive group/item bg-transparent border-none! shadow-none!"
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

export default FileHistoryItem
