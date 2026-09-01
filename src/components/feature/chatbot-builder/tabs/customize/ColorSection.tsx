'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { presetColors } from '@/data/aiChatbot'
import { cn } from '@/lib/utils'
import { ColorSectionProps } from '@/types'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const ColorSection = ({ formData, updateFormField }: ColorSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4 bg-muted/5 glass-card glass-dark-card sm:p-6 p-4 rounded-border-radius flex flex-col border border-border/20">
      <Label className="text-xs font-medium text-foreground">
        {t('accent_color', { defaultValue: 'Accent Color' })}
      </Label>
      <div className="flex flex-wrap gap-3">
        {presetColors.map((color) => (
          <Button
            key={color}
            variant="ghost"
            onClick={() => {
              updateFormField('primaryColor', color)
              updateFormField('buttonColor', color)
            }}
            className={cn(
              'w-10 h-10 rounded-[8px] relative transition-all duration-200 hover:scale-110 shadow-sm border border-white/20 p-0!',
              formData.primaryColor === color && 'ring-2 ring-primary ring-offset-2',
            )}
            style={{ backgroundColor: color }}
          >
            {formData.primaryColor === color && <Check className="h-5 w-5 text-white absolute inset-0 m-auto" />}
          </Button>
        ))}
        <div className="relative group">
          <Input
            type="color"
            value={formData.primaryColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateFormField('primaryColor', e.target.value)
              updateFormField('buttonColor', e.target.value)
            }}
            className="px-0.5 py-0.5 w-10 h-10 rounded-xl cursor-pointer border-2 border-dashed border-muted-foreground/30 bg-transparent"
          />
        </div>
      </div>
    </div>
  )
}
