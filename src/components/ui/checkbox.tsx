'use client'

import { cn } from '@/lib/utils'
import { CheckboxProps } from '@/types/shared'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import React from 'react'
import Input from './input'

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, onCheckedChange, indeterminate, disabled, ...props }, ref) => {
    const isChecked = !!checked

    const handleClick = () => {
      if (disabled) return
      const newValue = !isChecked
      onChange?.(newValue)
      onCheckedChange?.(newValue)
    }

    return (
      <div
        className={cn(
          'relative flex items-center justify-center cursor-pointer select-none group shrink-0',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={handleClick}
      >
        <Input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          disabled={disabled}
          readOnly
          ref={ref}
          {...props}
        />

        {/* Checkbox Box */}
        <motion.div
          animate={{
            backgroundColor: (isChecked || indeterminate) ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.05)',
            borderColor: (isChecked || indeterminate) ? 'var(--primary)' : 'var(--glass-border)',
            scale: (isChecked || indeterminate) ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'h-4 w-4 rounded-[4px] border flex items-center justify-center transition-shadow',
            'shadow-sm group-hover:shadow-md group-hover:border-primary/50',
            !(isChecked || indeterminate) && 'glass-card'
          )}
        >
          <AnimatePresence mode="wait">
            {isChecked && !indeterminate ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 45 }}
                transition={{
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }}
                className="flex items-center justify-center w-full h-full"
              >
                <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[4px]" />
              </motion.div>
            ) : indeterminate ? (
              <motion.div
                key="indeterminate"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                transition={{ duration: 0.2 }}
                className="w-1.5 h-0.5 bg-primary-foreground"
              />
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* Bouncy Hover Effect Background */}
        <motion.div
          className="absolute inset-0 bg-primary/10 -z-10 scale-0 origin-center"
          whileHover={{ scale: 1.5 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
