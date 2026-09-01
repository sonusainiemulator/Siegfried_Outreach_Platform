import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { tabs } from '@/data/aiAnalysis'
import useSettings from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { LeftSidebarProps } from '@/types/aiChatFrontend'
import { formatDate, getMediaUrl } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, MessageSquare, Pin, Plus, Search, Trash2, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PROMPT_SUGGESTIONS } from './constants'

export const LeftSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  historySearch,
  setHistorySearch,
  filteredHistory,
  sessionId,
  handleNewChat,
  handleSwitchSession,
  handleTogglePin,
  handleDeleteSession,
  setInput,
  setPromptLibOpen,
}: LeftSidebarProps) => {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light'

  // Brand Logo 1: Expanded (Main Brand Logo)
  const expandedLogoLight = settings?.logo_light_url ? getMediaUrl(settings.logo_light_url) : '/images/dark-logo2.png'
  const expandedLogoDark = settings?.logo_dark_url ? getMediaUrl(settings.logo_dark_url) : '/images/light-logo2.png'
  const expandedLogoUrl = currentTheme === 'dark' ? expandedLogoDark : expandedLogoLight

  const appName = settings?.app_name || 'Siegfried Outreach'

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/10 dark:bg-black/40 z-40 xl:hidden"
          />
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={cn(
              'flex flex-col h-full border-r border-border/30 glass-card glass-dark-card xl:dark:bg-landing-bg-dark/80 backdrop-blur-xl shrink-0 overflow-hidden z-50',
              'fixed inset-y-0 left-0 xl:static xl:z-20 shadow-2xl xl:shadow-none',
            )}
          >
            <div className="p-4 border-b border-border/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 h-14 overflow-hidden">
                <Image src={expandedLogoUrl as string} alt={appName} width={260} height={60} unoptimized className="w-auto h-12 sm:h-13 max-h-13 max-w-[220px] object-contain" />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-lg bg-primary! text-white"
                  onClick={handleNewChat}
                  title="New Chat"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 xl:hidden rounded-lg"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex px-3 py-2 shrink-0">
              <div className="flex w-full bg-muted/20 glass-dark-card p-1 rounded-border-radius">
                {tabs.map((tab: string) => (
                  <Button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      'flex-1 py-1.5 gap-1 text-sm  font-medium rounded-lg transition-all',
                      activeTab === tab
                        ? 'bg-primary! dark:bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab === 'history' ? '⏱ Activity' : '⚡ Library'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
              {activeTab === 'history' ? (
                <>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="Search chats..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/30 border border-border/10 text-xs font-medium outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    {filteredHistory.map((c: any) => (
                      <div
                        key={c.id}
                        onClick={() => handleSwitchSession(c.sessionId)}
                        className={cn(
                          'group relative flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer',
                          c.sessionId === sessionId
                            ? 'bg-primary/10 border-primary/30'
                            : 'border-transparent glass-dark glass-dark-card! hover:bg-muted/30',
                        )}
                      >
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-1.5 shrink-0',
                            c.sessionId === sessionId ? 'bg-primary' : 'bg-muted-foreground/30',
                          )}
                        />
                        <div className="flex-1 min-w-0 pr-16">
                          <div className="flex items-center gap-1.5">
                            {c.isPinned && <Pin className="w-2.5 h-2.5 fill-primary text-primary shrink-0" />}
                            <div className="text-xs font-bold truncate">{c.title || 'Untitled Conversation'}</div>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {formatDate(c.lastActivity)}
                          </div>
                        </div>

                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-lg  hover:text-unset hover:bg-unset"
                            onClick={(e) => handleTogglePin(c.id, e)}
                            title={c.isPinned ? 'Unpin' : 'Pin'}
                          >
                            <Pin className={cn('w-3 h-3', c.isPinned && 'fill-primary text-primary')} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-lg text-destructive hover:text-unset hover:bg-unset"
                            onClick={(e) => handleDeleteSession(c.id, e)}
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredHistory.length === 0 && (
                      <div className="text-center py-10 opacity-40 flex flex-col items-center gap-2">
                        <MessageSquare className="w-8 h-8" />
                        <p className="text-xs font-medium">{t('no_conversations_found')}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {PROMPT_SUGGESTIONS.slice(0, 8).map((p: string, i: number) => (
                    <Button
                      key={i}
                      onClick={() => setInput(p)}
                      className="text-left p-1! rounded-border-radius border border-border/20 bg-card/40! hover:border-primary/40 hover:bg-primary/5 transition-all justify-start text-sm font-medium group"
                    >
                      <div className="text-muted-foreground group-hover:text-foreground text-wrap line-clamp-2">
                        {p}
                      </div>
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full bg-card/40 text-sm font-medium text-primary mt-2"
                    onClick={() => setPromptLibOpen(true)}
                  >
                    {t('open_full_library')}
                  </Button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
