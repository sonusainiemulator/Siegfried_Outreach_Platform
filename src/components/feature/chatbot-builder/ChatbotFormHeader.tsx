'use client'

import { Button } from '@/components/ui/button'
import { ChatbotFormHeaderProps } from '@/types'
import { ArrowLeft, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const ChatbotFormHeader = ({
  name,
  isEditMode,
  isDirty,
  isSubmitting,
  canManage,
  onBack,
  onSave,
}: ChatbotFormHeaderProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="gap-2 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20 h-9 w-11  hover:text-primary rounded-[8px] transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold text-title-color line-clamp-1 leading-tight title-color">
            {name || t('unnamed_chatbot', { defaultValue: 'Unnamed Chatbot' })}
          </h1>
        </div>
      </div>

      {isEditMode && isDirty && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <Button
            onClick={onSave}
            disabled={isSubmitting || !canManage}
            className="rounded-[8px] px-8 font-medium gap-2 sm:h-12 h-10 transition-all btn-color text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting
              ? t('saving', { defaultValue: 'Saving...' })
              : t('save_and_exit', { defaultValue: 'Save & Exit' })}
          </Button>
        </div>
      )}
    </div>
  )
}
