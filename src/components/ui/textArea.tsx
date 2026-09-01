import { cn } from '@/lib/utils'
import { TextareaProps } from '@/types/shared'
import * as React from 'react'

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-[8px] dark:border-gray-600 border border-input-border-color px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all glass-dark-card',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
