'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { BACKEND_API_URL } from '@/constants'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { ChatHeaderProps } from '@/types/aiChatFrontend'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  ChevronDown,
  Cpu,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Sun,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { BotAvatar } from './BotAvatar'

export const ChatHeader = ({
  setSidebarOpen,
  rightPanelOpen,
  setRightPanelOpen,
  botDropRef,
  botDropOpen,
  setBotDropOpen,
  botSearch,
  setBotSearch,
  filteredBots,
  selectedBot,
  setSelectedBot,
  modelDropRef,
  modelDropOpen,
  setModelDropOpen,
  currentProviderModels,
  dark,
  setDark,
  userMenuRef,
  userMenuOpen,
  setUserMenuOpen,
  authUser,
  handleLogout,
}: ChatHeaderProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <header className="h-16 border-b border-border/30 px-3 sm:px-6 flex items-center justify-between shrink-0 bg-white/50 dark:bg-dark-void/50 backdrop-blur-md z-[40]">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </Button>

        <div className="relative" ref={botDropRef as any}>
          <Button
            onClick={() => setBotDropOpen((v) => !v)}
            className="flex items-center gap-1.5 sm:gap-3 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-border/40 bg-muted/10 hover:border-primary/50 transition-all"
          >
            <BotAvatar bot={selectedBot} size="xs" />
            <span className="hidden sm:block text-sm font-medium text-light-text-color dark:text-white">
              {selectedBot?.name || 'Select Bot'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
          <AnimatePresence>
            {botDropOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full left-0 mt-3 w-72 bg-white dark:bg-modal-bg-color border border-border/50 rounded-3xl shadow-2xl overflow-hidden p-2 z-50"
              >
                <div className="px-2 pt-2 pb-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={botSearch}
                      onChange={(e) => setBotSearch(e.target.value)}
                      placeholder="Search chatbots..."
                      className="w-full pl-9 pr-3 py-2 rounded-[8px] bg-muted/30 border-none text-xs"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto no-scrollbar py-1">
                  {filteredBots.map((b: any) => (
                    <Button
                      key={b.id}
                      onClick={() => {
                        setSelectedBot(b)
                        setBotDropOpen(false)
                      }}
                      className={cn(
                        'flex items-center gap-3 w-full p-1! rounded-2xl transition-colors text-left bg-unset!',
                        b.id === selectedBot?.id ? 'bg-unset! border border-primary' : 'hover:bg-muted/20',
                      )}
                    >
                      <BotAvatar bot={b} size="sm" />
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="text-sm font-medium truncate dark:text-muted-foreground">{b.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{b.category || 'AI Assistant'}</div>
                      </div>
                      {b.id === selectedBot?.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </Button>
                  ))}
                </div>
                <div className="border-t border-border/20">
                  <Button
                    variant="ghost"
                    className="w-full text-xs font-medium text-primary"
                    onClick={() => router.push(ROUTES.CHAT_ASSISTANT.LIST)}
                  >
                    {t('view_all_chatbots')}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="relative" ref={modelDropRef as any}>
          <Button
            onClick={() => setModelDropOpen((v) => !v)}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-border/40 bg-muted/10 hover:border-primary/50 transition-all"
          >
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-tight dark:text-white">
              {selectedBot?.config?.model || 'gpt-3.5-turbo'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
          <AnimatePresence>
            {modelDropOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-modal-bg-color border border-border/50 rounded-3xl shadow-2xl overflow-hidden p-2 z-50"
              >
                <div className="p-3 border-b border-border/20">
                  <p className="text-base font-medium tracking text-muted-foreground dark:text-white ">{t('available_modal')}</p>
                </div>
                <div className="max-h-60 overflow-y-auto no-scrollbar">
                  {currentProviderModels.map((m: any) => (
                    <Button
                      key={m.value}
                      className={cn(
                        'flex items-center justify-between bg-unset! w-full p-2! rounded-2xl transition-colors text-left',
                        m.value === selectedBot?.config?.model ? 'bg-primary/5' : 'hover:bg-muted/20',
                      )}
                    >
                      <span className="text-xs font-medium dark:text-muted-foreground">{m.label}</span>
                      {m.value === selectedBot?.config?.model && <Check className="w-3.5 h-3.5 text-primary" />}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-6 w-px bg-border/40 hidden sm:block mx-1" />

        <Button
          size="icon"
          variant="ghost"
          className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun className="w-3.5 h-3.5 sm:w-4 h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 h-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 h-4" />
        </Button>

        <div className="relative" ref={userMenuRef as any}>
          <Button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1 sm:pr-2 sm:py-1 rounded-xl sm:rounded-2xl hover:bg-muted/20 transition-all border border-transparent hover:border-border/30"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
              {authUser?.avatar ? (
                <Image
                  src={`${BACKEND_API_URL}/${authUser.avatar}`}
                  alt={authUser.name || 'User'}
                  width={32}
                  height={32}
                  unoptimized
                />
              ) : (
                <span className="text-xs font-black text-primary">
                  {(authUser?.name || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </Button>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-modal-bg-color border border-border/50 rounded-3xl shadow-2xl overflow-hidden p-2 z-50 text-xs font-bold"
              >
                <div className="p-3 border-b border-border/20 mb-1">
                  <div className="font-black text-base">{authUser?.name || 'Pixel User'}</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {authUser?.email || 'user@pixelai.com'}
                  </div>
                </div>
                <Link
                  href={ROUTES.DASHBOARD}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 hover:text-primary transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary" /> {t('dashboard')}
                </Link>
                <Link
                  href={ROUTES.PROFILE}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 hover:text-primary transition-all"
                >
                  <Settings className="w-4 h-4 text-primary" /> {t('settings_title')}
                </Link>
                <div className="h-px bg-border/20 my-1" />
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-all"
                >
                  <LogOut className="w-4 h-4" /> {t('sign_out')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
