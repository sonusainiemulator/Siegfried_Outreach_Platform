import { FileHistoryListProps } from '@/types'
import { Archive, Search } from 'lucide-react'
import FileHistoryItem from './FileHistoryItem'

const FileHistoryList = ({
  currentList,
  isCurrentlyLoading,
  searchQuery,
  activeTab,
  activeSessionId,
  selectedConversations,
  isSelectionMode,
  toggleConversationSelection,
  onSessionSelect,
  handleTogglePin,
  handleArchive,
  setConvToDelete,
  setIsDeleteModalOpen,
  canManage,
  canManageArchived,
  t,
}: FileHistoryListProps) => {
  return (
    <div className="flex-1 h-full min-w-0 px-2 overflow-y-auto custom-scrollbar">
      <div className="pr-1 pb-4">
        {isCurrentlyLoading && currentList.length === 0 ? (
          Array(5).fill(0).map((_, i) => <div key={i} className="h-20 rounded-[2rem] bg-muted/20 animate-pulse mb-3" />)
        ) : currentList?.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="bg-primary/5 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/10">
              {activeTab === 'history' ? (
                <Search className="w-6 h-6 text-primary/40" />
              ) : (
                <Archive className="w-6 h-6 text-primary/40" />
              )}
            </div>
            <p className="text-xs font-bold text-foreground/60 mb-1">
              {searchQuery
                ? t('no_search_results', { defaultValue: 'No results found' })
                : activeTab === 'history'
                  ? t('no_conversations', { defaultValue: 'No history found' })
                  : t('no_archived_conversations', { defaultValue: 'No archived conversations' })}
            </p>
            <p className="text-[10px] text-muted-foreground/50">
              {searchQuery
                ? t('try_different_keywords', { defaultValue: 'Try searching with different keywords' })
                : activeTab === 'history'
                  ? t('start_new_chat_desc', { defaultValue: 'Upload a file to start a conversation' })
                  : t('archive_empty_desc', { defaultValue: 'Archived chats will appear here' })}
            </p>
          </div>
        ) : (
          currentList.map((chat: any) => (
            <FileHistoryItem
              key={chat.id}
              chat={chat}
              activeSessionId={activeSessionId}
              selectedConversations={selectedConversations}
              isSelectionMode={isSelectionMode}
              toggleConversationSelection={toggleConversationSelection}
              onSessionSelect={onSessionSelect}
              searchQuery={searchQuery}
              activeTab={activeTab}
              handleTogglePin={handleTogglePin}
              handleArchive={handleArchive}
              setConvToDelete={setConvToDelete}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              canManage={canManage}
              canManageArchived={canManageArchived}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default FileHistoryList
