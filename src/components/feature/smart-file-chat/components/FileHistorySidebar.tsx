import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { cn } from '@/lib/utils'
import {
  useArchiveConversationMutation,
  useDeleteConversationMutation,
  useGetFileHistoryQuery,
  useTogglePinFileConversationMutation,
} from '@/redux/api/fileAnalyzerApi'
import { ApiError, FileHistorySidebarProps } from '@/types'
import { Archive, History, MoreVertical, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import FileHistoryList from './sidebar/FileHistoryList'

import { useAppDirection } from '@/hooks/useAppDirection'

const FileHistorySidebar = ({
  activeSessionId,
  onSessionSelect,
  onNewChat,
  refetchHistory,
  isModal = false,
  canManage,
  canManageArchived,
  onClose,
}: FileHistorySidebarProps) => {
  const { t } = useTranslation()
  const direction = useAppDirection()

  const [searchQuery,] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTab, setActiveTab] = useState('history')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data: activeHistory,
    isFetching: isActiveLoading,
    refetch: refetchActive,
  } = useGetFileHistoryQuery({ isArchived: false, search: debouncedSearch })

  const {
    data: archivedHistory,
    isFetching: isArchivedLoading,
    refetch: refetchArchived,
  } = useGetFileHistoryQuery({ isArchived: true, search: debouncedSearch })

  const [deleteConversation, { isLoading: isDeleting }] = useDeleteConversationMutation()
  const [archiveConversation] = useArchiveConversationMutation()
  const [togglePin] = useTogglePinFileConversationMutation()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [convToDelete, setConvToDelete] = useState<string[] | null>(null)

  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set())

  const currentList = activeTab === 'history' ? activeHistory || [] : archivedHistory || []
  const filteredList = currentList

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedConversations(new Set())
  }

  const toggleConversationSelection = (id: string) => {
    const newSelected = new Set(selectedConversations)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedConversations(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set<string>(filteredList.map((c: any) => c.id))
      setSelectedConversations(allIds)
    } else {
      setSelectedConversations(new Set())
    }
  }

  const handleDelete = async () => {
    if (!convToDelete || convToDelete.length === 0) return
    try {
      const res = await deleteConversation(convToDelete).unwrap()

      toast.success(res.message || t('conversations_deleted'))
      if (convToDelete.includes(activeSessionId || '')) {
        onNewChat()
      }
      setIsDeleteModalOpen(false)
      setConvToDelete(null)
      setIsSelectionMode(false)
      setSelectedConversations(new Set())
      refetchActive()
      refetchArchived()
      refetchHistory()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete'))
    }
  }

  const handleArchive = async (e: React.MouseEvent, id: string, isArchiving: boolean) => {
    e.stopPropagation()
    try {
      const res = await archiveConversation(id).unwrap()
      toast.success(res.message || (isArchiving ? t('conversation_archived') : t('conversation_unarchived')))
      if (id === activeSessionId && isArchiving) {
        onNewChat()
      }
      refetchActive()
      refetchArchived()
      refetchHistory()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update'))
    }
  }

  const handleTogglePin = async (e: React.MouseEvent, chat: any) => {
    e.stopPropagation()
    try {
      const res = await togglePin(chat.id).unwrap()
      toast.success(res.message || (chat.isPinned ? t('unpinned') : t('pinned')))
      refetchActive()
      refetchArchived()
      refetchHistory()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update'))
    }
  }

  return (
    <div className="flex flex-col w-full h-full  lg991:bg-white dark:lg991:bg-modal-bg-color  glass-card glass-dark-card backdrop-blur-2xl md:backdrop-blur-xl border border-glass-border rounded-border-radius shadow-sm p-4 overflow-hidden shrink-0">
      <div className={cn('flex items-center justify-between mb-4 h-10 shrink-0', isModal && 'relative')}>
        {isSelectionMode ? (
          <div className="flex items-center gap-2 w-full bg-primary/5 p-2 rounded-xl border border-primary/20">
            <Checkbox
              checked={selectedConversations.size === filteredList.length && filteredList.length > 0}
              onChange={(checked: boolean) => handleSelectAll(checked)}
              className="rounded-lg border-primary/20"
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {selectedConversations.size} {t('selected', { defaultValue: 'Selected' })}
            </span>

            <div className="ms-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all active:scale-95"
                onClick={() => {
                  if (!canManage) return
                  setConvToDelete(Array.from(selectedConversations))
                  setIsDeleteModalOpen(true)
                }}
                disabled={selectedConversations.size === 0 || !canManage}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-accent/50 transition-all active:scale-95"
                onClick={toggleSelectionMode}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-title-color dark:text-white tracking-tight">
                {activeTab === 'history' 
                  ? t('recent_history', { defaultValue: 'Recent History' }) 
                  : t('archived_history', { defaultValue: 'Archived History' })}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl hover:bg-accent/50 transition-all active:scale-95 [@media(min-width:992px)]:hidden"
                  onClick={onClose}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
              {(canManage || canManageArchived) && (
                <DropdownMenu dir={direction}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl hover:bg-accent/50 transition-all active:scale-95"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-[10px] p-1.5 backdrop-blur-xl border-glass-border">
                    <DropdownMenuItem
                      onClick={() => setActiveTab(activeTab === 'history' ? 'archive' : 'history')}
                      className="rounded-[8px] flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-all text-xs font-medium"
                    >
                      <div className="p-1.5 rounded-md bg-primary/5 text-primary">
                        {activeTab === 'history' ? <Archive className="w-3.5 h-3.5" /> : <History className="w-3.5 h-3.5" />}
                      </div>
                      <span>
                        {activeTab === 'history' 
                          ? t('archived_history', { defaultValue: 'Archived History' }) 
                          : t('recent_history', { defaultValue: 'Recent History' })}
                      </span>
                    </DropdownMenuItem>

                    {filteredList.length > 0 && (
                      <DropdownMenuItem
                        onClick={toggleSelectionMode}
                        className="rounded-[8px] flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-all text-xs font-medium"
                      >
                        <div className="p-1.5 rounded-md bg-destructive/5 text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </div>
                        <span >{t('bulk_delete', { defaultValue: 'Bulk Delete' })}</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-hidden min-w-0">
        <FileHistoryList
          currentList={activeTab === 'history' ? activeHistory || [] : archivedHistory || []}
          isCurrentlyLoading={activeTab === 'history' ? isActiveLoading : isArchivedLoading}
          searchQuery={searchQuery}
          activeTab={activeTab as any}
          activeSessionId={activeSessionId}
          selectedConversations={selectedConversations}
          isSelectionMode={isSelectionMode}
          toggleConversationSelection={toggleConversationSelection}
          onSessionSelect={onSessionSelect}
          handleTogglePin={handleTogglePin}
          handleArchive={handleArchive}
          setConvToDelete={(ids) => setConvToDelete(ids)}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          canManage={canManage}
          canManageArchived={canManageArchived}
          t={t}
        />
      </div>

      <div className="mt-auto pt-6 border-t border-glass-border/50 shrink-0">
        <Button
          className="w-full rounded-[8px] sm:h-12 h-10 font-medium btn-color text-sm text-white"
          onClick={onNewChat}
          disabled={!canManage}
        >
          <span className="text-lg">+</span>
          {t('new_conversations', { defaultValue: 'New Conversation' })}
        </Button>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={convToDelete && convToDelete.length > 1 ? t('delete_multiple_conversations') : t('delete_conversation')}
        description={
          convToDelete && convToDelete.length > 1
            ? t('confirm_delete_multiple', { count: convToDelete.length })
            : t('confirm_delete_single')
        }
      />
    </div>
  )
}

export default FileHistorySidebar
