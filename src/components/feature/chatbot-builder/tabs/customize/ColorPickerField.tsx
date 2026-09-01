'use client'

import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { ColorPickerFieldProps } from '@/types'

export const ColorPickerField = ({ id, label, value, onChange, placeholder = 'var(--white)' }: ColorPickerFieldProps) => {
  return (
    <div className="space-y-2 flex flex-col">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          id={id}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          className="rounded-[8px] glass-card glass-dark-card border-border/40 bg-muted/20 text-xs font-mono"
        />
        <Input
          type="color"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className="w-10 h-10 rounded-[8px] cursor-pointer border-none p-0 bg-transparent overflow-hidden"
        />
      </div>
    </div>
  )
}
