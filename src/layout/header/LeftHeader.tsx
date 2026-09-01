'use client'

import { Button } from '@/components/ui/button'
import { LeftHeaderProps } from '@/types/layout'
import { Menu, Search, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommandPalette from '@/components/feature/command-palette/CommandPalette'

const LeftHeader = ({ onMenuToggle }: LeftHeaderProps) => {
  const { t } = useTranslation()
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)

  // Detect OS for shortcut symbol (⌘ on Mac, Ctrl on others)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.userAgent.toUpperCase().indexOf('MAC') >= 0)
    }
  }, [])

  // Global keyboard shortcut listener (Cmd+K / Ctrl+K / slash)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandOpen((prev) => !prev)
        return
      }

      // Quick open with '/' when not inside an input/textarea/contenteditable
      if (e.key === '/' && !isCommandOpen) {
        const target = e.target as HTMLElement
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('.ck-editor')
        if (!isInput) {
          e.preventDefault()
          setIsCommandOpen(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandOpen])

  return (
    <>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          suppressHydrationWarning
          className="p-2 min-[992px]:hidden text-muted-foreground hover:text-foreground hover:bg-unset glass-card glass-dark-card rounded-[8px] transition-colors h-9 w-9 sm:h-11 sm:w-11 shrink-0"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Mobile search trigger button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCommandOpen(true)}
          className="sm:hidden text-muted-foreground hover:text-foreground hover:bg-unset glass-card glass-dark-card rounded-[8px] transition-colors h-9 w-9 sm:h-11 sm:w-11 shrink-0 cursor-pointer"
          title="Search AI Tools & Commands (⌘K)"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Desktop Command Palette Search Bar Trigger */}
        <div
          onClick={() => setIsCommandOpen(true)}
          className="hidden sm:flex search-lining group flex-1 max-w-xl relative cursor-pointer"
        >
          <div className="search-lining-content relative w-full flex items-center justify-between glass-header-card ps-4 pe-3 rounded-[8px]! glass-button py-2.5 h-11 border border-border/60 hover:border-primary/40 transition-all shadow-xs group-hover:shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors truncate">
                {t('search_placeholder', { defaultValue: 'Search AI tools, templates, actions...' })}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <kbd className="hidden md:inline-flex items-center gap-0.5 font-mono text-[10px] font-bold text-muted-foreground/90 bg-muted/60 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700/80 shadow-2xs group-hover:border-primary/30 transition-colors">
                <span>{isMac ? '⌘' : 'Ctrl'}</span>
                <span>K</span>
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Global Command Palette Floating Spotlight Modal */}
      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
      />
    </>
  )
}

export default LeftHeader

