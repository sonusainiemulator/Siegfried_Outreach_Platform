import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { ChatInputSectionProps } from '@/types/aiChatFrontend'
import { FileText, Send, Sparkles, SquareMenu, TrendingUp, X, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const ChatInputSection = ({
  selectedFiles,
  setSelectedFiles,
  input,
  setInput,
  handleKey,
  selectedBot,
  setPromptLibOpen,
  handleSend,
  isSending,
  canManageChat,
}: ChatInputSectionProps) => {
  const { t } = useTranslation()
  return (
    <div className="p-6 md:p-8 pt-2">
      <div className="max-w-4xl mx-auto">
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFiles.map((f: File, i: number) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-xs font-bold text-primary animate-in zoom-in-50 duration-200">
                <FileText className="w-3.5 h-3.5" /> <span className="truncate max-w-[120px]">{f.name}</span>
                <Button onClick={() => setSelectedFiles(prev => prev.filter((_, j) => j !== i))} className="hover:text-destructive"><X className="w-3.5 h-3.5" /></Button>
              </div>
            ))}
          </div>
        )}

        <div className="relative group glass-card glass-dark-card bg-white dark:bg-dark-bg rounded-border-radius p-1 shadow-2xl shadow-black/5 focus-within:border-primary/50 focus-within:shadow-primary/5 transition-all duration-300">
          <div className="flex items-end gap-2 pr-1">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={selectedBot ? `Message ${selectedBot.name}...` : 'Select a bot to message...'}
              rows={1}
              className="flex-1 max-h-none! min-h-0! border-none outline-none focus:ring-0 scrollbar-hide bg-transparent p-3 sm:text-sm text-xs resize-none break-words no-scrollbar font-medium text-light-text-color dark:text-white placeholder:text-muted-foreground/60 focus-visible:ring-0"
            />

            <Button size="icon" variant="ghost" className="h-11 w-11 rounded-[8px] bg-primary/10 text-primary hover:bg-unset hover:text-unset transition-all shrink-0" onClick={() => setPromptLibOpen(true)}>
              <SquareMenu className="w-5 h-5" />
            </Button>

            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isSending || !canManageChat}
              className={cn(
                'h-11 w-11 rounded-[8px] shrink-0 transition-all duration-300 ',
                input.trim() ? 'bg-primary/10! text-primary hover:scale-105 active:scale-95' : 'bg-primary/10! text-primary opacity-unset!'
              )}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 sm:gap-6 text-xs font-medium text-subtitle-color flex-wrap">
          <div className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> {t('real_time_streaming')}</div>
          <div className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> {t('ai_enhanced_responses')}</div>
          <div className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> {t('low_latency')}</div>
        </div>
      </div>
    </div>
  )
}
