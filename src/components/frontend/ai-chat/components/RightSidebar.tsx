import { Button } from '@/components/ui/button'
import { rightSidebarData } from '@/data/sidebarData'
import { cn } from '@/lib/utils'
import { RightSidebarProps } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Settings, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BotAvatar } from './BotAvatar'

export const RightSidebar = ({
  rightPanelOpen,
  setRightPanelOpen,
  selectedBot,
  messages,
}: RightSidebarProps) => {
  const {t} = useTranslation()
  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRightPanelOpen(false)}
            className="fixed inset-0 bg-black/10 dark:bg-black/40 z-40 xl:hidden"
          />
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={cn(
              'flex flex-col h-full border-l border-border/30 glass-card glass-dark-card xl:bg-white/80 xl:dark:bg-landing-bg-dark/80 backdrop-blur-xl shrink-0 overflow-hidden z-50',
              'fixed inset-y-0 right-0 xl:static xl:z-20 shadow-2xl xl:shadow-none',
            )}
          >
            <div className="p-5 border-b border-border/20">
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-medium text-title-color dark:text-white">{t('chatbot_insight')}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 xl:hidden rounded-xl"
                  onClick={() => setRightPanelOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {selectedBot ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <BotAvatar bot={selectedBot} size="sm" />
                    <div className="min-w-0 pr-4">
                      <h3 className="text-sm font-medium truncate text-light-text-color dark:text-white">{selectedBot.name}</h3>
                      <p className="text-xs text-primary font-medium ">{selectedBot.provider}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedBot.description ||
                      'Dedicated AI assistant tuned for optimal performance and intelligent reasoning.'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBot.isActive && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t('active')}
                      </div>
                    )}
                    <div className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                      {selectedBot.interactionType === 'ai_only' ? 'Autonomous AI' : 'Hybrid Modality'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center opacity-40">
                  <Bot className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-xs font-bold">{t('no_bot_selected')}</p>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6 pt-0">
              <div className="space-y-4">
                <p className="text-base font-medium text-title-color dark:text-white">{t('session_performance')}</p>
                {rightSidebarData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground">
                      <item.icon className="w-3.5 h-3.5 text-primary" /> {item.label}
                    </div>
                    <div className="text-xs font-medium text-subtitle-color dark:text-white">
                      {item.label === 'Chat Volume' ? messages.length : item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-base font-medium text-title-color dark:text-muted-foreground">{t('quick_modifiers')}</p>
                <Button className="flex items-center justify-between w-full p-4 rounded-2xl bg-muted/10 border border-primary transition-all text-left">
                  <div className="space-y-1">
                    <div className="text-xs font-medium tracking-widest text-muted-foreground">
                      {t('temperature')}
                    </div>
                    <div className="text-sm font-black text-primary">{selectedBot?.config?.temperature || '0.7'}</div>
                  </div>
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
