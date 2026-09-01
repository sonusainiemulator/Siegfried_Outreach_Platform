import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { WriterEditorHeaderProps } from '@/types/components/smartWriter'
import { Check, Copy, Download, Loader2, Menu, Pencil, Save } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const WriterEditorHeader: React.FC<WriterEditorHeaderProps> = ({
  docTitle,
  setDocTitle,
  generatedContent,
  isCopied,
  isSaving,
  handleCopy,
  handleSave,
  handleDownload,
  onToggleSidebar,
}) => {
  const { t } = useTranslation()

  return (
    <div className="p-4 flex flex-col sm:flex-row items-center border-b border-zinc-100/50 dark:border-zinc-800/50 bg-white dark:bg-black/40 backdrop-blur-3xl z-10 gap-4">
      <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1 shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSidebar}
          className="min-[1400px]:hidden h-10 w-10 shadow-none rounded-[8px] glass-dark-card bg-light-primary hover:bg-primary text-primary border-zinc-200 dark:border-zinc-800"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex  w-full ">
        <div className="flex items-center gap-3 w-full  group  glass-dark-card border border-zinc-200/50 dark:border-zinc-800/50 rounded-[8px] px-3 py-2 transition-all hover:border-primary">
          <div className="w-10 h-10 rounded-[8px] bg-primary/10 flex items-center justify-center shrink-0 transition-transform group-focus-within:scale-105">
            <Pencil className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col w-full flex-1 min-w-0">
            <Label className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-0.5 select-none">
              {t('document_title_label', { defaultValue: 'Document Title' })}
            </Label>
            <Input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className=" bg-transparent font-bold text-base text-zinc-900 dark:text-zinc-100 focus:outline-none w-full truncate"
              placeholder={t('writer_untitled_document')}
              maxLength={100}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto sm:flex-1">
        {generatedContent && (
          <>
          <Button
            variant="outline"
            size="sm"
            disabled={!generatedContent}
            onClick={handleCopy}
            className="h-10 sm:h-10 w-10 sm:w-auto rounded-[8px] font-medium text-sm px-0 sm:px-5 gap-2 glass-dark-card bg-primary text-white border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0"
            title={t('writer_copy')}
          >
            {isCopied ? <Check className="w-4 h-4 sm:w-3.5 h-3.5" /> : <Copy className="w-4 h-4 sm:w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{t('writer_copy')}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!generatedContent || isSaving}
            onClick={handleSave}
            className="h-10 sm:h-10 w-10 sm:w-auto rounded-[8px] font-bold text-[11px] px-0 sm:px-5 gap-2 glass-dark-card bg-primary text-white border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0"
            title={t('writer_save', { defaultValue: 'Save' })}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 sm:w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-4 h-4 sm:w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{t('writer_save', { defaultValue: 'Save' })}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!generatedContent}
            onClick={handleDownload}
            className="h-10 w-10 p-0 flex items-center justify-center rounded-[8px] glass-dark-card bg-primary text-white border-zinc-200 dark:border-zinc-800 shrink-0"
            title={t('downloading_content', { defaultValue: 'Download' })}
          >
            <Download className="w-4 h-4" />
          </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default WriterEditorHeader
