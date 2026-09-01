'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { SupportChatInputProps } from '@/types/components/support'
import { CheckCircle2, Paperclip, Send } from 'lucide-react'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import FilePreviewStrip from './FilePreviewStrip'

const ChatInput = ({
  conversation,
  replyText,
  isReplying,
  canReply,
  attachedFiles,
  onReplyChange,
  onSendReply,
  onAttachedFilesChange,
  scrollToBottom,
  isDraggingOver,
  onDragOver,
  onDragLeave,
  onDrop,
  dropZoneRef,
}: SupportChatInputProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length > 0) {
      onAttachedFilesChange([...attachedFiles, ...selected])
    }
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    onAttachedFilesChange(attachedFiles.filter((_, i) => i !== index))
  }

  const canSend = (replyText.trim().length > 0 || attachedFiles.length > 0) && !isReplying && canReply

  if (conversation.status === 'resolved') {
    return (
      <div className="p-6 border-t border-glass-border bg-primary/5 backdrop-blur-md flex items-center justify-center">
        <div className="flex items-center gap-3 text-primary/60 font-medium text-base py-2 px-4 rounded-border-radius bg-primary/10 border border-primary/20">
          <CheckCircle2 className="w-4 h-4" />
          {t('conversation_resolved', { defaultValue: 'This conversation is resolved' })}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={dropZoneRef}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'border-t border-glass-border backdrop-blur-md transition-colors duration-200 ',
        isDraggingOver && 'bg-primary/5 border-primary/40',
      )}
    >
      {isDraggingOver && (
        <div className="px-4 py-3 flex items-center justify-center gap-2 text-primary text-sm font-semibold animate-in fade-in duration-200">
          <Paperclip className="w-4 h-4 animate-bounce" />
          {t('drop_files_here_to_attach')}
        </div>
      )}

      <FilePreviewStrip files={attachedFiles} onRemove={handleRemoveFile} />

      <div className="p-4 relative">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleFileSelect}
            disabled={!canReply}
            title="Attach files"
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-[8px] flex items-center justify-center transition-all bg-primary! text-white disabled:opacity-40 disabled:cursor-not-allowed',
              attachedFiles.length > 0 && 'text-white bg-primary/10',
            )}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.json,.zip,.rar"
          />

          <div className="relative flex-1 flex flex-col">
            <Textarea
              ref={inputRef as any}
              value={replyText}
              onChange={(e) => onReplyChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && canSend) {
                  e.preventDefault()
                  onSendReply()
                  setTimeout(scrollToBottom, 100)
                }
              }}
              placeholder={
                isDraggingOver
                  ? 'Drop files to attach...'
                  : t('type_reply', { defaultValue: 'Type your response...' })
              }
              disabled={isReplying || !canReply}
              className={cn(
                'w-full h-12! min-h-12 no-scrollbar py-3 px-4 outline-none rounded-[8px] text-sm transition-all resize-none shadow-sm',
                'bg-light-gray border-glass-border',
                'focus:ring-2 focus:ring-primary/20 glass-dark-card focus:border-primary/40',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'placeholder:text-muted-foreground/50 text-foreground',
                'overflow-y-auto custom-scrollbar',
              )}
              onInput={(e) => {
                const target = e.currentTarget as HTMLTextAreaElement;
                if (target.value === '') target.style.height = '44px';
                else {
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 250)}px`;
                }
              }}
            />
          </div>

          <Button
            onClick={() => {
              onSendReply()
              setTimeout(scrollToBottom, 100)
            }}
            disabled={!canSend}
            className="flex-shrink-0 h-11 w-11 rounded-[8px] bg-primary! hover:bg-primary/90 text-white transition-all active:scale-90 disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
