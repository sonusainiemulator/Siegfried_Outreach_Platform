'use client'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { OtpInputProps } from '@/types'
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useEffect, useRef } from 'react'

const OtpInput = ({ value, onChange, digits = 6, className }: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.slice(-1)
    if (!/^\d?$/.test(char)) return

    const newValue = [...value]
    newValue[index] = char
    onChange(newValue)

    if (char && index < digits - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        const newValue = [...value]
        newValue[index - 1] = ''
        onChange(newValue)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < digits - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digits)
    const newValue = [...value]

    data.split('').forEach((char, i) => {
      if (i < digits) newValue[i] = char
    })

    onChange(newValue)
    const nextIndex = Math.min(data.length, digits - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className={cn('flex justify-center gap-2 sm:gap-3', className)}>
      {Array.from({ length: digits }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-10 h-10 sm:w-14 sm:h-14 text-center sm:text-xl text-sm font-medium bg-accent/50 border-input focus:border-primary text-title-color dark:text-white focus:ring-primary/20 rounded-[8px] transition-all"
        />
      ))}
    </div>
  )
}

export default OtpInput
