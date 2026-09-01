'use client'

import { ConversationListsProps } from '@/types'
import { useTranslation } from 'react-i18next'
import ConversationItem from './ConversationItem'

const ConversationList = ({
  conversations,
  activeTab,
  sessionId,
  isSelectionMode,
  selectedConversations,
  editingId,
  editTitle,
  setEditTitle,
  onSwitchConversation,
  toggleConversationSelection,
  onStartEdit,
  onSaveTitle,
  onCancelEdit,
  onTogglePin,
  onToggleArchive,
  onDelete,
  editInputRef,
  canManageChat,
  canManageArchived,
  direction,
}: ConversationListsProps) => {
  const { t } = useTranslation()

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 opacity-40">
        <p className="text-xs font-medium">
          {activeTab === 'history'
            ? t('no_conversations', { defaultValue: 'No conversations yet' })
            : t('no_archived_conversations', { defaultValue: 'No archived conversations' })}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pt-1 mt-0">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conv={conv}
          isActive={conv.sessionId === sessionId}
          isSelected={selectedConversations.has(conv.id)}
          isEditing={editingId === conv.id}
          isSelectionMode={isSelectionMode}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          onSelect={(id) => {
            if (isSelectionMode) {
              toggleConversationSelection(conv.id)
            } else if (editingId !== conv.id) {
              onSwitchConversation(id)
            }
          }}
          onEdit={onStartEdit}
          onSaveTitle={onSaveTitle}
          onCancelEdit={onCancelEdit}
          onTogglePin={onTogglePin}
          onToggleArchive={onToggleArchive}
          onDelete={onDelete}
          editInputRef={editInputRef}
          canManageChat={canManageChat}
          canManageArchived={canManageArchived}
          activeTab={activeTab}
          direction={direction}
        />
      ))}
    </div>
  )
}

export default ConversationList
