'use client'

import { cn } from '@/lib/utils'
import { SpinnerProps } from '@/types'
import { Loader2 } from 'lucide-react'

const Spinner = ({ className, size = 'lg', text }: SpinnerProps) => {
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center h-full min-h-[200px] w-full gap-4', className)}>
      <Loader2 className={cn('animate-spin text-primary', spinnerSizes[size])} />
      {text && (
        <p className={cn('text-muted-foreground font-medium animate-pulse', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {text}
        </p>
      )}
    </div>
  )
}

export default Spinner
