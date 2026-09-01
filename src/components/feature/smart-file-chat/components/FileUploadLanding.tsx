import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { FileUploadLandingProps } from '@/types'
import { CheckCircle2, CloudUpload, FileText, Info, Loader2, Menu, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FileUploadLanding = ({ onFileUpload, isAnalyzing, canUpload, onToggleSidebar }: FileUploadLandingProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUpload) return
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (!canUpload) return
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (!canUpload) return
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg991:pt-20 glass-card glass-dark-card rounded-border-radius min-h-87.5 relative overflow-y-auto custom-scrollbar ">
      {onToggleSidebar && (
        <div className="absolute top-4 left-4 z-40">
          <Button
            onClick={onToggleSidebar}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-[8px] border-glass-border bg-white dark:bg-dark-muted shadow-sm hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center p-0!"
            title={t('toggle_sidebar', { defaultValue: 'Toggle Sidebar' })}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      )}
      <div className="w-full max-w-2xl py-8 flex flex-col items-center">

        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <div className="relative">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-mix-primary-2/10 border border-primary/20 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                <Loader2 className="h-10 w-10 md:h-12 md:w-12 text-primary animate-spin relative z-10" />
              </div>
              <div className="absolute -top-2 -inset-inline-end-2 md:-top-3 md:-inset-inline-end-3 h-8 w-8 md:h-10 md:w-10 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                {t('analyzing_document')}
              </h3>
              <p className="text-muted-foreground font-medium max-w-62.5 md:max-w-75 text-sm md:text-base">
                {t('please_wait_while_ai_processes')}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-8 md:space-y-12">
            <div className="text-center space-y-3 md:space-y-4">
              <h2 className="text-xl  font-medium text-title-color dark:text-white">
                {t('chat_with_any_file')} <br />
                <span className="text-primary text-lg mt-0.5 block ">
                  {t('in_seconds') || 'in seconds.'}
                </span>
              </h2>
              <p className="text-xs md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed font-medium mt-2">
                {t('file_chat_desc')}
              </p>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => canUpload && fileInputRef.current?.click()}
              className={cn(
                'relative group transition-all duration-700 w-full',
                canUpload ? 'cursor-pointer' : 'cursor-not-allowed grayscale opacity-70',
                'border-2 border-dashed glass-dark-card rounded-border-radius p-4 md:p-8',
                'flex flex-col items-center gap-3 md:gap-4 text-center',
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.01] shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]'
                  : 'border-white/5 bg-white/[0.01]',
              )}
            >

              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.xlsx,.txt"
              />

              <div
                className={cn(
                  'h-12 w-12 md:h-20 md:w-20 rounded-border-radius glass-dark-card flex items-center justify-center transition-all duration-700 relative',
                  'bg-primary/10 group-hover:bg-primary group-hover:border-primary group-hover:scale-110 group-hover:-rotate-6 shadow-xl',
                )}
              >
                <CloudUpload
                  className={cn(
                    'h-8 w-8 md:h-12 md:w-12 text-primary transition-all duration-700 relative z-10',
                    'group-hover:text-primary-foreground group-hover:scale-110',
                  )}
                />
              </div>

              <div className="space-y-2 md:space-y-3 relative z-10">
                <p className="text-lg font-medium text-title-color group-hover:text-primary transition-colors duration-500 dark:text-white">
                  {canUpload ? t('drop_document_here') : t('view_only_upload', { defaultValue: 'View only: No upload permission' })}{' '}
                  {canUpload && (
                    <span className="text-subtitle-color font-medium block md:inline text-sm">
                      {t('or_click_to_browse')}
                    </span>
                  )}
                </p>
                <p className="text-sm text-subtitle-color ">
                  {t('supported_pdf_formats', { defaultValue: 'Supported: PDF, DOCX, TXT' })}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-[9px] md:text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1 md:mt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 md:h-3 w-2.5 md:w-3 text-primary" /> {t('multi_format')}{' '}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 md:h-3 w-2.5 md:w-3 text-primary" /> {t('ai_powered')}{' '}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 md:h-3 w-2.5 md:w-3 text-primary" /> {t('real_time')}{' '}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 rounded-border-radius bg-muted/30 inner-card glass-dark-card border border-border flex items-center gap-3 md:gap-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold">{t('summarize_file')}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{t('get_quick_insights')}</p>
                </div>
              </div>
              <div className="p-3 md:p-4 rounded-border-radius inner-card glass-dark-card border border-border flex items-center gap-3 md:gap-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-mix-primary-2/10 flex items-center justify-center shrink-0">
                  <Info className="h-4 w-4 md:h-5 md:w-5 text-mix-primary-2" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold">{t('ask_questions')}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{t('deep_dive_into_details')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUploadLanding
