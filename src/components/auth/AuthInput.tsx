'use client'

import { cn } from '@/lib/utils'
import { AuthInputProps } from '@/types'
import { Label } from '@radix-ui/react-label'
import { useField } from 'formik'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import Input from '../ui/input'

const AuthInput = ({ name, label, icon: Icon, className, type, ...props }: AuthInputProps) => {
  const [field, meta] = useField(name)
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  const hasError = meta.touched && !!meta.error

  return (
    <div className="w-full space-y-2 flex flex-col">
      <Label className='dark:text-white' htmlFor={name}>{label}</Label>
      <div className="relative group">
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-1 w-10 h-12 flex items-center justify-center text-primary/60 dark:text-gray-500 group-focus-within:scale-105 transition-all duration-500 z-10">
              <Icon size={16} strokeWidth={2} />
            </div>
          )}
          <Input
            {...field}
            {...props}
            type={inputType}
            className={cn(
              'w-full h-12 rounded-[8px] border-none outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-white/5 transition-all duration-500',
              'bg-gray-50/50 dark:bg-title-color backdrop-blur-2xl border border-gray-100 dark:border-white/5 shadow-sm',
              'placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white text-[15px] font-medium tracking-wide',
              Icon ? 'pl-11' : 'pl-4',
              isPassword ? 'pr-12' : 'pr-4',
              hasError && 'border-red-500/40 ring-2 ring-red-500/5',
              className,
            )}
          />
          {isPassword && (
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 w-8 h-8 flex items-center justify-center rounded-full bg-unset! text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white transition-all duration-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          )}
        </div>
      </div>
      {hasError && <p className="text-[12px] text-red-400 font-medium ">{meta.error}</p>}
    </div>
  )
}

export default AuthInput
