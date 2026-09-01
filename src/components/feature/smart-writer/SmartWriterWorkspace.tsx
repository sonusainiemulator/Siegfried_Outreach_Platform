import { ConfirmationModal } from '@/components/reusable/ConfirmationModal'
import RichTextEditor from '@/components/shared/form-fields/RichTextEditor'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SmartWriterWorkspaceProps } from '@/types'
import { motion } from 'framer-motion'
import { Settings2, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GenerationForm from './GenerationForm'
import WriterCanvasState from './WriterCanvasState'
import WriterEditorHeader from './WriterEditorHeader'

const SmartWriterWorkspace: React.FC<SmartWriterWorkspaceProps> = ({
  selectedTemplate,
  setSelectedTemplate,
  showOptions,
  setShowOptions,
  docTitle,
  setDocTitle,
  generatedContent,
  setGeneratedContent,
  isCopied,
  isGenerating,
  isSaving,
  handleGenerate,
  handleCopy,
  handleSave,
  handleDownload,
}) => {
  const { t } = useTranslation()
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)

  const handleCloseClick = () => {
    if (generatedContent) {
      setIsCloseModalOpen(true)
    } else {
      setSelectedTemplate(null)
    }
  }

  const handleConfirmClose = () => {
    setIsCloseModalOpen(false)
    setSelectedTemplate(null)
  }

  return (
    <motion.div
      key="canvas-studio"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="max-w-[1500px] mx-auto w-full relative"
    >
      {/* EXIT ACTION */}

      <div className="absolute -top-5 -right-4 z-[90]">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCloseClick}
          className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-zinc-400 hover:text-red-500 hover:scale-110 transition-all"
        >
          <X className="w-8 h-8" />
        </Button>
      </div>

      <ConfirmationModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleConfirmClose}
        title={t('close_workspace_title', { defaultValue: 'Close Workspace' })}
        description={t('close_workspace_desc', {
          defaultValue: 'Are you sure you want to close? Your unsaved changes will be lost.',
        })}
        confirmText={t('close', { defaultValue: 'Close' })}
        variant="destructive"
      />

      <div
        className={cn(
          'flex flex-col glass-card glass-dark-card rounded-border-radius overflow-hidden transition-all duration-700',
        )}
      >
        {/* TIER 1 - INTEGRATED CONTROL HEADER */}
        <div className="sm:px-10 sm:py-8 px-5 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/10 flex flex-col lg:flex-row xl:items-center justify-between gap-8 shrink-0">
          <div className="flex items-center gap-3 sm:flex-row flex-col">
            <div className="w-14 h-14 rounded-[8px] bg-primary text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 fill-current" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="font-medium text-3xl title-color dark:text-white capitalize tracking-tighter leading-[1.3]">
                  {selectedTemplate.title}
                </h2>
                <span className="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-medium capitalize border border-zinc-200 dark:border-zinc-700">
                  {selectedTemplate.category}
                </span>
              </div>
              <p className="text-sm font-medium text-subtitle-color capitalize">{selectedTemplate.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowOptions(!showOptions)}
              className={cn(
                'rounded-[8px] gap-3 font-medium text-base transition-all px-8 h-12',
                showOptions
                  ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-[1.02]'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 border-2 border-zinc-200 dark:border-zinc-800 hover:border-primary/50',
              )}
            >
              <Settings2 className="w-5 h-5" />
              {showOptions ? `${t('hide_options')}` : `${t('open_options')}`}
            </Button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: showOptions ? 'auto' : 0,
            opacity: showOptions ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'bg-white dark:bg-zinc-900/10 border-b-2 border-zinc-50 dark:border-zinc-900 shrink-0 overflow-hidden',
          )}
        >
          <div className="sm:p-6 p-4">
            <GenerationForm
              key={selectedTemplate.slug}
              template={selectedTemplate}
              onSubmit={handleGenerate}
              isLoading={isGenerating}
              onBack={() => setSelectedTemplate(null)}
              layout="horizontal"
            />
          </div>
        </motion.div>

        {/* TIER 3 - EDITOR CANVAS */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <main className="flex-1 flex flex-col relative overflow-hidden">
            <div className="shrink-0 bg-white/50 dark:bg-zinc-900/10 border-b border-zinc-50 dark:border-zinc-900 sticky top-0 z-10 backdrop-blur-sm">
              <WriterEditorHeader
                docTitle={docTitle}
                setDocTitle={setDocTitle}
                generatedContent={generatedContent}
                isCopied={isCopied}
                isSaving={isSaving}
                handleCopy={handleCopy}
                handleSave={handleSave}
                handleDownload={handleDownload}
                onToggleSidebar={() => {}}
                isSidebarOpen={true}
              />
            </div>

            <div className="flex-1 overflow-y-auto px-10 pb-12 custom-scrollbar">
              <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-border-radius border-2 border-dashed border-zinc-200 dark:border-zinc-800 mt-8">
                {generatedContent ? (
                  <div className="studio-canvas-editor p-4">
                    <RichTextEditor
                      value={generatedContent}
                      onChange={setGeneratedContent}
                      placeholder={t('start_typing_placeholder')}
                    />
                  </div>
                ) : (
                  <div className="h-full min-h-[500px] flex items-center justify-center p-12">
                    <WriterCanvasState isGenerating={isGenerating} />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  )
}

export default SmartWriterWorkspace
