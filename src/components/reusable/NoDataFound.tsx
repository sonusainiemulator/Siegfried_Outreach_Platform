'use client'

import { cn } from '@/lib/utils'
import { NoDataFoundProps } from '@/types'
import { MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const NoDataFound = ({
  message,
  className,
  icon: Icon = MessageSquare,
  height = 'h-[250px]',
}: NoDataFoundProps) => {
  const { t } = useTranslation()

  return (
    <div className={cn('w-full flex items-center justify-center', height, className)}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center mb-4 border border-primary/10 border-dashed">
          <Icon className="w-8 h-8 text-primary/30" />
        </div>
        <p
          className="text-sm font-medium text-subtitle-color opacity-50 tracking-wide uppercase"
          suppressHydrationWarning
        >
          {message || t('no_data_found', { defaultValue: 'No Data Records Identified' })}
        </p>
      </div>
    </div>
  )
}
