import { cn } from '@/lib/utils'
import * as React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-[8px] border border-input-border-color dark:border-none px-3 py-2 text-base transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm inner-card glass-dark-card dark:text-white',
          className,
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input };
export default Input;
