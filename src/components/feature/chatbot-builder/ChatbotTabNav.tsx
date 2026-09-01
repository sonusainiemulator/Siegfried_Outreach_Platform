'use client'

import { Button } from '@/components/ui/button'
import { ChatbotTabNavProps } from '@/types'

/**
 * Pill-style horizontal tab navigation bar.
 */
export const ChatbotTabNav = ({ tabs, activeTab, onTabChange }: ChatbotTabNavProps) => (
  <div className="glass-card glass-dark-card p-2 rounded-border-radius border border-border/20 flex flex-wrap gap-1">
    {tabs.map((tab) => {
      const Icon = tab.icon
      const isActive = activeTab === tab.id
      return (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 min-w-[120px] md:min-w-[150px] flex items-center justify-center gap-2 px-3 py-2.5 md:px-4 md:py-3 rounded-[8px] transition-all duration-300 font-bold text-xs md:text-sm h-auto ${
            isActive
              ? 'bg-light-gray glass-card glass-dark-card text-light-text-color dark:text-white border-none!'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
          {tab.label}
        </Button>
      )
    })}
  </div>
)
