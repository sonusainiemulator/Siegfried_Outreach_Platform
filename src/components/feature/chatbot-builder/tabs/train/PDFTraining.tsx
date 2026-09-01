import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { CloudUpload, FileText } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const PDFTraining = () => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
          <FileText className="h-5 w-5" />
        </div>
        <Label className="text-lg font-medium text-foreground">
          {t('pdf_training', { defaultValue: 'PDF Training' })}
        </Label>
      </div>

      <div
        className="group relative sm:p-6 p-4 glass-card glass-dark-card border border-dashed border-border/40 rounded-border-radius flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all duration-500"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
          <CloudUpload className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-medium text-title-color dark:text-white mb-2">
          {t('upload_pdf_files', { defaultValue: 'Upload PDF Files' })}
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
          {t('upload_pdf_hint', { defaultValue: 'Drag & drop or click to upload PDF files' })}
        </p>
        <Input type="file" accept=".pdf" className="hidden" ref={fileInputRef} />
        <Button
          variant="outline"
          className="rounded-[8px] h-12 px-10 font-medium bg-light-primary border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
        >
          {t('select_files', { defaultValue: 'Select Files' })}
        </Button>

      </div>
    </div>
  )
}

export default PDFTraining
