'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { useAppDirection } from '@/hooks/useAppDirection'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import {
  useDeleteConversationsMutation,
  useGetArchivedConversationsQuery,
  useToggleArchiveConversationMutation,
  useTogglePinConversationMutation,
  useUpdateConversationTitleMutation,
} from '@/redux/api/chatApi'
import { ExtendedChatSidebarProps } from '@/types'
import { ApiError } from '@/types/api'
import { Conversation } from '@/types/chat'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ConversationList from './sidebar/ConversationList'
import SidebarFooter from './sidebar/SidebarFooter'
import SidebarHeader from './sidebar/SidebarHeader'

const ChatSidebar = ({
  chatbotId,
  sessionId,
  conversations,
  refetchConversations,
  onNewConversation,
  onSwitchConversation,
  isOpen,
  messages = [],
  chatbotName = 'Chat',
  onShare,
  onClose,
}: ExtendedChatSidebarProps) => {
  const { t } = useTranslation()
  const direction = useAppDirection()
  const { hasPermission } = usePermission()

  // Permissions
  const canManageChat = hasPermission('Manage Chat Conversations', 'write')
  const canManageArchived = hasPermission('Manage Archived Chat Conversations', 'write')

  // Mutations
  const [deleteConversations, { isLoading: isDeleting }] = useDeleteConversationsMutation()
  const [updateTitle] = useUpdateConversationTitleMutation()
  const [togglePinConversation] = useTogglePinConversationMutation()
  const [toggleArchive] = useToggleArchiveConversationMutation()

  // Queries
  const { data: archivedData, refetch: refetchArchived } = useGetArchivedConversationsQuery()
  const archivedConversations: Conversation[] = archivedData?.conversations || []

  // State
  const [activeTab, setActiveTab] = useState('history')
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [convToDelete, setConvToDelete] = useState<string[] | null>(null)

  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingId])

  // Handlers
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedConversations(new Set())
  }

  const toggleConversationSelection = (convId: string) => {
    const newSelected = new Set(selectedConversations)
    if (newSelected.has(convId)) {
      newSelected.delete(convId)
    } else {
      newSelected.add(convId)
    }
    setSelectedConversations(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    const currentList = activeTab === 'history' ? conversations : archivedConversations
    if (checked) {
      const allIds = new Set<string>(currentList.map((c: Conversation) => c.id))
      setSelectedConversations(allIds)
    } else {
      setSelectedConversations(new Set())
    }
  }

  const openDeleteModal = (convIds: string[] | string) => {
    setConvToDelete(Array.isArray(convIds) ? convIds : [convIds])
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!convToDelete || convToDelete.length === 0) return

    try {
      const res = await deleteConversations({
        chatbotId,
        conversationIds: convToDelete,
      }).unwrap()

      toast.success(res.message || t('conversations_deleted'))

      const currentSessionDeleted = conversations.some(
        (c) => c.sessionId === sessionId && convToDelete.includes(c.id)
      )

      setIsDeleteModalOpen(false)
      setConvToDelete(null)
      setIsSelectionMode(false)
      setSelectedConversations(new Set())
      refetchConversations()
      refetchArchived()

      if (currentSessionDeleted) {
        onNewConversation()
      }
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete'))
    }
  }

  const handleStartEdit = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation()
    setEditingId(conv.id)
    setEditTitle(conv.title)
  }

  const handleSaveTitle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!editingId || !editTitle.trim()) {
      setEditingId(null)
      return
    }

    try {
      const res = await updateTitle({
        chatbotId,
        conversationId: editingId,
        title: editTitle.trim(),
      }).unwrap()

      toast.success(res.message || t('title_updated', { defaultValue: 'Title updated' }))
      setEditingId(null)
      refetchConversations()
      refetchArchived()
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update', { defaultValue: 'Failed to update title' }))
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const handleTogglePin = async (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation()
    try {
      const res = await togglePinConversation({ chatbotId, conversationId: conv.id }).unwrap()
      toast.success(res.message || (conv.isPinned ? t('conversation_unpinned') : t('conversation_pinned')))
      refetchConversations()
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_pin'))
    }
  }

  const handleToggleArchive = async (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation()
    const isActive = conv.sessionId === sessionId
    try {
      const res = await toggleArchive({ chatbotId, conversationId: conv.id }).unwrap()
      const isArchiving = !conv.isArchived

      toast.success(
        res.message ||
        (isArchiving
          ? t('conversation_archived', { defaultValue: 'Conversation archived' })
          : t('conversation_unarchived', { defaultValue: 'Conversation unarchived' }))
      )

      refetchConversations()
      refetchArchived()

      if (isArchiving && isActive) {
        onNewConversation()
      }
    } catch (error) {
       const apiError = error as ApiError
      toast.error(
        apiError?.data?.message || t('failed_to_update_archive', { defaultValue: 'Failed to update archive status' })
      )
    }
  }

  // Memoized sorted lists
  const sortedHistory = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    })
  }, [conversations])

  const sortedArchived = useMemo(() => {
    return [...archivedConversations].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    })
  }, [archivedConversations])

  const currentList = activeTab === 'history' ? sortedHistory : sortedArchived

  return (
    <div
      className={cn(
        'flex flex-col w-75 glass-card glass-dark-card backdrop-blur-xl border border-glass-border rounded-border-radius p-4 overflow-hidden shrink-0 transition-all duration-300',
        !isOpen && 'w-0 p-0 border-none opacity-0 invisible overflow-hidden lg991:w-0',
        isOpen &&
        '[@media(max-width:991px)]:!flex [@media(max-width:991px)]:absolute [@media(max-width:991px)]:top-0 [@media(max-width:991px)]:inset-inline-start-0 [@media(max-width:991px)]:h-full [@media(max-width:991px)]:z-50 [@media(max-width:991px)]:w-[300px] [@media(max-width:991px)]:rounded-border-radius [@media(max-width:991px)]:shadow-2xl lg991:bg-light-body'
      )}
    >
      <SidebarHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSelectionMode={isSelectionMode}
        toggleSelectionMode={toggleSelectionMode}
        selectedCount={selectedConversations.size}
        totalItems={currentList.length}
        onSelectAll={handleSelectAll}
        onBulkDelete={() => openDeleteModal(Array.from(selectedConversations))}
        canManageChat={canManageChat}
        canManageArchived={canManageArchived}
        hasItems={currentList.length > 0}
        onClose={onClose}
      />

      <ConversationList
        conversations={currentList}
        activeTab={activeTab}
        sessionId={sessionId}
        isSelectionMode={isSelectionMode}
        selectedConversations={selectedConversations}
        editingId={editingId}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        onSwitchConversation={onSwitchConversation}
        toggleConversationSelection={toggleConversationSelection}
        onStartEdit={handleStartEdit}
        onSaveTitle={handleSaveTitle}
        onCancelEdit={handleCancelEdit}
        onTogglePin={handleTogglePin}
        onToggleArchive={handleToggleArchive}
        onDelete={openDeleteModal}
        editInputRef={editInputRef}
        canManageChat={canManageChat}
        canManageArchived={canManageArchived}
        direction={direction}
      />

      <SidebarFooter
        messages={messages}
        chatbotName={chatbotName}
        onShare={onShare}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={
          convToDelete && convToDelete.length > 1
            ? t('delete_multiple_conversations')
            : t('delete_conversation')
        }
        description={
          convToDelete && convToDelete.length > 1
            ? t('confirm_delete_multiple', {
              count: convToDelete.length,
              defaultValue: `Are you sure you want to delete ${convToDelete.length} conversations? This action cannot be undone.`,
            })
            : t('confirm_delete_single', {
              defaultValue:
                'Are you sure you want to delete this conversation? This action cannot be undone.',
            })
        }
      />
    </div>
  )
}

export default ChatSidebar
