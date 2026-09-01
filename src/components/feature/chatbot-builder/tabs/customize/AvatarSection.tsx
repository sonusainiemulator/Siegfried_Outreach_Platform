'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { BACKEND_API_URL } from '@/constants'
import { AvatarSectionProps } from '@/types'
import { Bot, Camera } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

export const AvatarSection = ({ formData, updateFormField }: AvatarSectionProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      updateFormField('avatar', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        updateFormField('avatarUrl', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getAvatarPreview = () => {
    if (!formData.avatarUrl) return undefined
    if (
      formData.avatarUrl.startsWith('data:') ||
      formData.avatarUrl.startsWith('blob:') ||
      formData.avatarUrl.startsWith('http')
    ) {
      return formData.avatarUrl
    }
    return BACKEND_API_URL  + formData.avatarUrl
  }

  const previewImage = getAvatarPreview()

  return (
    <div className="space-y-4 bg-muted/5 glass-card glass-dark-card sm:p-6 p-4 rounded-border-radius border border-border/20">
      <Label className="text-sm font-medium  text-subtitle-color">
        {t('chatbot_avatar', { defaultValue: 'Chatbot Avatar' })}
      </Label>
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-primary/10 rounded-full">
            <AvatarImage src={previewImage} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              <Bot className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
          >
            <Camera size={20} />
          </Button>
        </div>
        <Input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        <span className="text-xs text-subtitle-color text-center">
          {t('upload_avatar_desc', { defaultValue: 'Click to upload chatbot avatar' })}
        </span>
      </div>
    </div>
  )
}
