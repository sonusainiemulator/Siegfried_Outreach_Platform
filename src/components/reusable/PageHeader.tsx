'use client'

import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PageHeaderProps } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const PageHeader = ({
  title,
  showBackButton = true,
  onBack,
  primaryAction,
  endContent,
}: PageHeaderProps) => {
  const router = useRouter()

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-11 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all shrink-0"
            onClick={onBack || (() => router.back())}
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Button>
        )}
        <div className="flex items-start flex-col">
          <h1 className="text-3xl font-bold text-title-color dark:text-white line-clamp-1 leading-[1.1] title-color">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            size="lg"
            className={cn(
              'rounded-[8px] h-10 sm:h-12 px-6 p-button-padding! text-white! btn-color font-medium gap-1 w-full sm:w-auto',
              primaryAction.className,
            )}
          >
            {primaryAction.icon}
            {primaryAction.label}
          </Button>
        )}

        {endContent && endContent}
        <CreditLimitPill />
      </div>
    </div>
  )
}
