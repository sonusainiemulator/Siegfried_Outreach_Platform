import { ImageLightbox } from '@/components/frontend/ai-chat/components/ImageLightbox'
import { Button } from '@/components/ui/button'
import { BACKEND_API_URL } from '@/constants'
import { ChatAreaProps } from '@/types'
import { AnimatePresence } from 'framer-motion'
import { Headset, Menu } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import PromptLibraryModal from './PromptLibraryModal'

const ChatArea = ({
  messages,
  isSending,
  chatbot,
  scrollRef,
  input,
  setInput,
  handleSend,
  handleKeyPress,
  selectedFiles,
  setSelectedFiles,
  showEscalationButton,
  onEscalate,
  canManageChat,
  canManagePrompts,
  onEdit,
  onToggleSidebar,
}: ChatAreaProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false)

  // Collect all image URLs from messages
  const imageUrls = useMemo(() => {
    return messages.filter((msg) => msg.text.startsWith('/uploads/')).map((msg) => BACKEND_API_URL + msg.text)
  }, [messages, BACKEND_API_URL])

  const handleImageClick = (imageUrl: string) => {
    const index = imageUrls.indexOf(imageUrl)
    if (index !== -1) {
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex-1 flex flex-col inner-card glass-dark-card rounded-border-radius overflow-hidden relative">
      {onToggleSidebar && (
        <Button
          onClick={onToggleSidebar}
          variant="outline"
          className="absolute top-4 start-4 z-40 h-10 w-10 min-w-[40px] rounded-full border-glass-border bg-white dark:bg-dark-muted shadow-md hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center p-0!"
          title={t('toggle_sidebar', { defaultValue: 'Toggle Sidebar' })}
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      <MessageList
        messages={messages}
        isSending={isSending}
        chatbot={chatbot}
        scrollRef={scrollRef}
        backendApiUrl={BACKEND_API_URL}
        onImageClick={handleImageClick}
        onEdit={onEdit}
      />

      {showEscalationButton && (
        <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2">
          <Button
            onClick={onEscalate}
            className="rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2"
          >
            <Headset className="h-4 w-4" />
            {t('talk_to_agent', { defaultValue: 'Talk to human agent' })}
          </Button>
        </div>
      )}

      <div className="p-4 pt-2 mt-auto max-w-5xl mx-auto w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleKeyPress={handleKeyPress}
          onFileSelect={handleFileSelect}
          fileInputRef={fileInputRef}
          onOpenPromptLibrary={() => setPromptLibraryOpen(true)}
          selectedFiles={selectedFiles}
          chatbot={chatbot}
          canManageChat={canManageChat}
          canManagePrompts={canManagePrompts}
          isSending={isSending}
        />
      </div>

      <AnimatePresence>
        {lightboxOpen && imageUrls.length > 0 && (
          <ImageLightbox images={imageUrls} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
        )}
      </AnimatePresence>

      <PromptLibraryModal
        isOpen={promptLibraryOpen}
        onClose={() => setPromptLibraryOpen(false)}
        onSelectPrompt={(prompt) => setInput(prompt)}
      />
    </div>
  )
}

export default ChatArea
