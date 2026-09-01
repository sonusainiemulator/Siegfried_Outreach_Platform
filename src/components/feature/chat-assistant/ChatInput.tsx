import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ChatInputProps } from '@/types'
import { Paperclip, Send, SquareMenu } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const ChatInput = ({
  input,
  setInput,
  handleSend,
  handleKeyPress,
  onFileSelect,
  fileInputRef,
  onOpenPromptLibrary,
  selectedFiles,
  canManageChat,
  canManagePrompts,
  isSending,
}: ChatInputProps) => {
  const { t } = useTranslation()

  return (
    <div className="relative group  rounded-[20px] inner-card glass-dark-card focus-within:border-primary/50 transition-all duration-300 p-1.5 px-3">
      <div className="flex items-center gap-2 min-h-[50px]">
        {onFileSelect && (
          <>
            <Input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" multiple />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 min-w-[40px] rounded-[10px] bg-primary/10 text-primary hover:text-primary hover:bg-primary/10 transition-all shrink-0"
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          </>
        )}

        <Input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            canManageChat
              ? `Message Siegfried Social Media Marketing Plateform...`
              : t('view_only_chat', { defaultValue: 'View only mode' })
          }
          disabled={!canManageChat || isSending}
          className="flex-1 min-w-0 bg-transparent border-none! rounded-[10px] outline-none text-sm font-medium placeholder:text-muted-foreground/60 h-10 focus-visible:ring-0 break-words text-wrap focus:border-none focus:outline-none shadow-none"
        />

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-[8px] bg-primary/10 text-primary hover:text-primary hover:bg-primary/10 transition-all shrink-0"
            onClick={onOpenPromptLibrary}
            disabled={!canManagePrompts || isSending}
            title={t('prompt_library', { defaultValue: 'Prompt Library' })}
          >
            <SquareMenu className="w-5 h-5" />
          </Button>

          <Button
            className={cn(
              'h-10 w-10 rounded-full shrink-0 bg-primary! text-white shadow-lg shadow-primary/30 transition-all active:scale-90 hover:scale-105',
              ((input.trim() || selectedFiles.length > 0) && canManageChat && !isSending) ? 'opacity-100' : 'opacity-40',
            )}
            onClick={() => handleSend()}
            disabled={(!input.trim() && selectedFiles.length === 0) || !canManageChat || isSending}
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
