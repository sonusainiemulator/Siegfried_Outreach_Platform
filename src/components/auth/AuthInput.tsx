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
      <Label className="text-[13.5px] font-semibold text-gray-700 dark:text-zinc-300 select-none" htmlFor={name}>
        {label}
      </Label>
      <div className="relative group">
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-1 w-10 h-12 flex items-center justify-center text-gray-400 dark:text-zinc-500 group-focus-within:text-primary transition-colors duration-200 z-10 pointer-events-none">
              <Icon size={17} strokeWidth={1.8} />
            </div>
          )}
          <Input
            {...field}
            {...props}
            type={inputType}
            className={cn(
              'w-full h-12 rounded-2xl border border-gray-200 dark:border-zinc-800/90 outline-none transition-all duration-200',
              'bg-gray-50/50 dark:bg-zinc-900/50 shadow-2xs',
              'hover:border-gray-300 dark:hover:border-zinc-700 focus:border-primary dark:focus:border-primary/70 focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/10',
              'placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-gray-900 dark:text-white text-[14.5px] font-normal',
              Icon ? 'pl-11' : 'pl-4',
              isPassword ? 'pr-12' : 'pr-4',
              hasError && 'border-red-500/60 ring-4 ring-red-500/10',
              className,
            )}
          />
          {isPassword && (
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 w-8 h-8 flex items-center justify-center rounded-full bg-transparent! text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </Button>
          )}
        </div>
      </div>
      {hasError && <p className="text-[12px] text-red-500 font-medium pl-1">{meta.error}</p>}
    </div>
  )
}

export default AuthInput
