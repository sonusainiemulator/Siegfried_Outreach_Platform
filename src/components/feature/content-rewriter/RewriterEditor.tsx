import RichTextEditor from '@/components/shared/form-fields/RichTextEditor'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { rewriterLanguages } from '@/data/contentRewriter'
import { RewriterEditorProps } from '@/types'
import { Check, Copy, Download, Loader2, Pencil, RefreshCw, Save, Sparkles, Wand2 } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RewriterEditor: React.FC<RewriterEditorProps> = ({
  docTitle,
  setDocTitle,
  content,
  setContent,
  generatedContent,
  setGeneratedContent,
  mode,
  setMode,
  language,
  setLanguage,
  isRewriting,
  isSaving,
  isCopied,
  modes,
  modesLoading,
  handleGenerate,
  handleCopy,
  handleSave,
  handleDownload,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col min-h-full bg-zinc-50/30 dark:bg-transparent relative z-0">
      <div className="flex-1 flex flex-col pr-2 overflow-y-auto custom-scrollbar  space-y-6">
        {/* 1. Header with Title & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 group inner-card glass-dark-card rounded-border-radius px-5 py-3 transition-all">
              <div className="w-10 h-10 rounded-[8px] bg-primary/10 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Pencil className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-subtitle-color mb-0.5">
                  {t('document_title_label', { defaultValue: 'Document Title' })}
                </span>
                <Input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="bg-transparent font-bold text-base text-zinc-900 dark:text-zinc-100 focus:outline-none w-full truncate"
                  placeholder={t('writer_untitled_document')}
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          {generatedContent && (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="glass-card glass-dark-card bg-primary! text-white rounded-[8px] h-12 px-8 font-medium text-xs gap-2"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {t('writer_save', { defaultValue: 'Save' })}
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="glass-card glass-dark-card rounded-[8px] bg-primary! text-white shadow-none h-12 w-12 p-0 flex items-center justify-center shrink-0"
                title={t('writer_copy')}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="glass-card glass-dark-card rounded-[8px] bg-primary! text-white shadow-none h-12 w-12 p-0 flex items-center justify-center shrink-0"
                title={t('downloading_content', { defaultValue: 'Download' })}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* 2. Full-width Mode & Language Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode Selection */}
          <div className="inner-card glass-dark-card rounded-border-radius p-1.5 flex items-center">
            <div className="px-4 shrink-0 border-r border-zinc-100 dark:border-zinc-800 hidden sm:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t('rewriter_mode')}</span>
            </div>
            <Select value={mode} onValueChange={setMode} disabled={modesLoading}>
              <SelectTrigger className="border-none dark:bg-black bg-white shadow-none rounded-[8px] focus:ring-0 h-11 text-sm font-bold w-full">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white! dark:bg-popover!">
                {modesLoading ? (
                  <SelectItem value={mode} className="p-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </SelectItem>
                ) : (
                  modes.map((m: any) => (
                    <SelectItem key={m.id} value={m.id} className="rounded-lg p-3">
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-title-color/50 dark:text-white">{m.name}</span>
                        <span className="text-[10px] text-zinc-500 font-normal">{m.description}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Language Selection */}
          <div className="inner-card glass-dark-card rounded-border-radius p-1.5 flex items-center">
            <div className="px-4 shrink-0 border-r border-zinc-100 dark:border-zinc-800 hidden sm:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {t('rewriter_language')}
              </span>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="border-none bg-white dark:bg-black rounded-[8px] shadow-none focus:ring-0 h-11 text-title-color/50 dark:text-white text-sm font-bold w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-white! dark:bg-popover! max-h-60">
                {rewriterLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="rounded-lg font-medium">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 3. Editor Section */}
        <div className="flex flex-col xl:flex-row gap-6 min-h-0">
          {/* Source Content */}
          <div className="flex-1 flex flex-col glass-card glass-dark-card rounded-border-radius overflow-hidden relative group xl:h-[600px] h-auto">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent flex items-center justify-between">
              <span className="text-sm font-medium text-subtitle-color">
                {t('original_content', { defaultValue: 'Source Content' })}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {content?.replace(/<[^>]*>/g, '').length || 0} {t('characters')}
              </span>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder={t('rewriter_content_placeholder', {
                  defaultValue: 'Paste your content here to be rewritten...',
                })}
                minHeight="100%"
              />
            </div>
            {/* Generate Button inside Source Content */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
              <Button
                onClick={() => handleGenerate()}
                disabled={isRewriting || !content?.trim()}
                className="w-full sm:h-12 h-10 btn-color text-white rounded-[8px] font-medium text-base gap-3 transition-all active:scale-[0.98] group/btn"
              >
                {isRewriting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('rewriter_rewriting')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    <span>{t('rewriter_generate', { defaultValue: 'Rewrite Content' })}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Rewritten Results */}
          <div className="flex-1 flex flex-col glass-card glass-dark-card rounded-border-radius overflow-hidden xl:h-[600px] h-auto">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent flex items-center justify-between">
              <span className="text-sm font-medium text-subtitle-color">
                {t('rewritten_content', { defaultValue: 'Rewritten Content' })}
              </span>
              <div className="flex items-center gap-4">
                {isRewriting && (
                  <div className="flex items-center gap-2 text-indigo-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('rewriting')}</span>
                  </div>
                )}
                {generatedContent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleGenerate()}
                    className="h-8 w-8 rounded-full hover:bg-primary/10 dark:hover:bg-primary/10 text-primary"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRewriting ? 'animate-spin' : ''}`} />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden flex flex-col">
              {generatedContent ? (
                <RichTextEditor
                  value={generatedContent}
                  onChange={setGeneratedContent}
                  placeholder={t('rewriting_placeholder', { defaultValue: 'Rewritten content will appear here...' })}
                  minHeight="100%"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] h-full sm:p-6 p-4 text-center text-zinc-400">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                    <div className="w-24 h-24 rounded-[8px] bg-primary/10 flex items-center justify-center relative duration-700">
                      <Wand2 className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t('editor_ready')}</h3>
                  <p className="max-w-70 text-sm leading-relaxed text-zinc-500 font-medium">
                    {t('editor_ready_desc', {
                      defaultValue: 'Paste your content on the left and hit generate to see the magic.',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewriterEditor
