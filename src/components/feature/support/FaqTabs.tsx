'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FaqTabsProps } from '@/types'
import { FileText, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const FaqTabs = ({ activeTab, setActiveTab, activePages }: FaqTabsProps) => {
  const { t } = useTranslation()

  return (
    <div className="w-full flex py-2">
      <div className="text-muted-foreground flex items-center gap-1 flex-wrap">
        <Button
          variant="ghost"
          onClick={() => setActiveTab('faqs')}
          className={cn(
            'px-5 py-2 h-9 rounded-[8px] text-xs font-medium transition-all duration-300 flex items-center gap-2 border-0 shrink-0',
            activeTab === 'faqs'
              ? 'bg-light-gray! text-light-text-color dark:text-white'
              : 'text-muted-foreground/70 hover:bg-white/5 hover:text-foreground',
          )}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          {t('faq')}
        </Button>

        {activePages.map((page) => (
          <Button
            key={page.id}
            variant="ghost"
            onClick={() => setActiveTab(page.slug)}
            className={cn(
              'px-5 py-2 h-9 rounded-[8px] text-xs font-medium transition-all duration-300 flex items-center gap-2 border-0 shrink-0',
              activeTab === page.slug
                ? 'bg-light-gray! text-light-text-color dark:text-white'
                : 'text-muted-foreground/70 hover:bg-white/5 hover:text-foreground',
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            {page.title}
          </Button>
        ))}
      </div>
    </div>
  )
}
