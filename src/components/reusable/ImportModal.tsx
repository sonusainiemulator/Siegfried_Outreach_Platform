'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ImportModalProps } from '@/types'
import {
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Info,
  Loader2,
  Upload
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Input from '../ui/input'

export const ImportModal = ({
  isOpen,
  onClose,
  onImport,
  onDownloadTemplate,
  isLoading = false,
  title,
}: ImportModalProps) => {
  const { t } = useTranslation()
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv') || file.name.endsWith('.xls'))) {
        setSelectedFile(file)
      } else {
        toast.error(t('valid_import_file_error', { defaultValue: 'Please upload a valid .xlsx or .csv file' }))
      }
    },
    [t],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    onImport(selectedFile)
    setSelectedFile(null)
  }

  const handleClose = () => {
    if (isLoading) return
    setSelectedFile(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl! p-0  border-none rounded-[28px] bg-light-body dark:bg-dark-muted gap-0 no-scrollbar overflow-auto">
        <DialogHeader className="pb-4 relative">
          {/* Background glow Decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex flex-col relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Upload size={20} className="text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-title-color dark:text-white">
                {title || t('import_data', { defaultValue: 'Import Data' })}
              </DialogTitle>
            </div>
            <p className="text-subtitle-color text-sm ml-13 font-medium opacity-80">
              {t('upload_instruction', { defaultValue: 'Bring your data into Siegfried Social Media Marketing Plateform with a few clicks.' })}
            </p>
          </div>
        </DialogHeader>

        <div className=" space-y-6">
          {onDownloadTemplate && (
            <div className="relative group overflow-hidden rounded-2xl border border-glass-border bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-md">
              {/* Accent stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-full" />

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Info size={18} />
                </div>
                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-title-color dark:text-white uppercase tracking-wider">
                      {t('setup_guide', { defaultValue: 'Setup Guide' })}
                    </h4>
                    <p className="text-xs text-subtitle-color font-medium leading-relaxed">
                      {t('setup_guide_desc', { defaultValue: 'To ensure successful import, please follow our template structure.' })}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-subtitle-color uppercase tracking-widest bg-black/5 dark:bg-white/5 py-1.5 px-3 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {t('xlsx_csv')}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-subtitle-color uppercase tracking-widest bg-black/5 dark:bg-white/5 py-1.5 px-3 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {t('standard_fields', { defaultValue: 'Standard Fields' })}
                    </div>
                  </div>

                  <Button
                    variant="link"
                    onClick={onDownloadTemplate}
                    className="p-0 h-auto text-primary font-bold tex(t-xs gap-1.5 hover:no-underline hover:opacity-80 transition-all flex justify-start cursor-pointer"
                  >
                    <Download size={14} />
                    {t('get_template', { defaultValue: 'Download sample template' })}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-10 cursor-pointer transition-all duration-500 overflow-hidden group",
              dragOver
                ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl shadow-primary/10"
                : "border-glass-border bg-black/[0.01] dark:bg-white/[0.01] hover:border-primary/40 hover:bg-primary/[0.02]",
              selectedFile && "border-primary bg-primary/[0.03]"
            )}
          >
            {/* Background elements */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 blur-3xl" />
            </div>

            {selectedFile ? (
              <div className="flex flex-col items-center gap-4 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border border-green-500/20 animate-pulse" />
                  <FileSpreadsheet size={36} className="text-green-500" />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-4 border-light-body dark:border-dark-muted">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-title-color dark:text-white max-w-[200px] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-subtitle-color mt-1 font-medium bg-black/5 dark:bg-white/5 py-1 px-3 rounded-full inline-block">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {t('change_file', { defaultValue: 'Change' })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5">
                <div className={cn(
                  "w-20 h-20 rounded-[28px] flex items-center justify-center transition-all duration-500 relative",
                  dragOver ? "bg-primary text-white rotate-12" : "bg-white dark:bg-input-color text-primary shadow-xl border border-glass-border"
                )}>
                  <Upload size={32} strokeWidth={2.5} />
                 
                </div>
                <div className="text-center space-y-1">
                  <p className="text-lg font-bold text-title-color dark:text-white">
                    {dragOver ? t('ready_to_drop', { defaultValue: 'Ready to drop!' }) : t('choose_a_file', { defaultValue: 'Choose a file to upload' })}
                  </p>
                  <p className="text-sm text-subtitle-color font-medium opacity-70">
                    {t('drag_drop_hint', { defaultValue: 'or drag and drop it here' })}
                  </p>
                </div>
              </div>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-glass-border flex items-center gap-4 bg-black/[0.01] dark:bg-white/[0.01]">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 h-12 rounded-[8px] cursor-pointer p-button-padding! bg-light-gray! border border-light-border-color! dark:border-none transition-all font-medium"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            className="flex-1 h-12 rounded-[8px] bg-primary! text-white! font-bold gap-3 cursor-pointer shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t('processing_data', { defaultValue: 'Processing...' })}
              </>
            ) : (
              <>
                <span>{t('start_import', { defaultValue: 'Start Import' })}</span>
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <ChevronRight size={14} />
                </div>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
