'use client'

import { Button } from '@/components/ui/button'
import { ChatExportButtonsProps } from '@/types'
import { exportToPDF, exportToText, exportToWord } from '@/utils/exportChat'
import { useTranslation } from 'react-i18next'

const ChatExportButtons = ({ messages, chatbotName }: ChatExportButtonsProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center bg-light-gray rounded-xl p-0.5 border border-light-border-color">
      <Button
        variant="ghost"
        className="h-7 px-3 rounded-lg text-[12px] font-medium  transition-all active:scale-95"
        onClick={() => exportToPDF(messages, chatbotName)}
      >
        {t('export_pdf')}
      </Button>
      <div className="w-px h-3 bg-primary/20" />
      <Button
        variant="ghost"
        className="h-7 px-3 rounded-lg text-[12px] font-medium  transition-all active:scale-95"
        onClick={() => exportToWord(messages, chatbotName)}
      >
        {t('export_word')}
      </Button>
      <div className="w-px h-3 bg-primary/20" />
      <Button
        variant="ghost"
        className="h-7 px-3 rounded-lg text-[12px] font-medium  transition-all active:scale-95"
        onClick={() => exportToText(messages, chatbotName)}
      >
        {t('export_text')}
      </Button>
    </div>
  )
}

export default ChatExportButtons
