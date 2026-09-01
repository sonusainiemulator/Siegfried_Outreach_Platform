'use client'

import { cn } from '@/lib/utils'
import { PasswordInputProps } from '@/types/shared'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import Input from './input'

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, icon: Icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const toggleVisibility = () => setShowPassword((prev) => !prev)

    return (
      <div className="relative w-full group/field">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/field:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <Input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={cn(className, Icon && 'pl-10', 'pr-10')}
          ref={ref}
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleVisibility}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
