import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textArea'
import { rewriterLanguages } from '@/data/contentRewriter'
import { RewriterSidebarProps } from '@/types/components/contentRewriter'
import { Loader2, Settings, X } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RewriterSidebar: React.FC<RewriterSidebarProps> = ({
  content,
  setContent,
  mode,
  setMode,
  language,
  setLanguage,
  isSidebarOpen,
  setIsSidebarOpen,
  handleGenerate,
  isRewriting,
  modes,
  modesLoading,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={`
            absolute lg:relative top-0 left-0 w-full sm:w-[400px] lg:w-[450px] xl:w-[500px] h-full
            bg-white dark:bg-dark-ink lg:bg-transparent lg:dark:bg-transparent
            border-r border-zinc-200 dark:border-zinc-800 z-[100] flex flex-col
            transition-transform duration-300 ease-in-out shrink-0 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            shadow-2xl lg:shadow-none
        `}
    >
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-ink sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-light-primary flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-medium text-title-color dark:text-white">
            {t('settings', { defaultValue: 'Settings' })}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(false)}
          className="text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[8px] h-11 w-11 transition-all active:scale-95"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto sm:p-6 p-4 custom-scrollbar glass-card glass-dark-card rounded-border-radius rounded-tr-none rounded-br-none shadow-none">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-3 flex flex-col">
            <Label className="text-sm font-medium text-foreground">{t('rewriter_content_label')}</Label>
            <Textarea
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              placeholder={t('rewriter_content_placeholder')}
              className="min-h-[180px] glass-card text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 rounded-[8px] resize-none p-4 custom-scrollbar focus-visible:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-3 flex flex-col">
            <Label className="text-sm font-medium text-foreground">{t('rewriter_mode')}</Label>
            <Select value={mode} onValueChange={setMode} disabled={modesLoading}>
              <SelectTrigger className="glass-card text-title-color dark:text-white glass-dark-card rounded-[8px] h-auto min-h-14 py-2 px-4 font-bold focus:ring-glass-border text-left [&>span]:w-full [&>span]:block [&>span]:text-left [&>span]:line-clamp-none">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-[8px] p-2">
                {modesLoading ? (
                  <SelectItem value={mode} className="rounded-xl focus:bg-transparent cursor-default p-3">
                    <div className="flex items-center gap-2 text-zinc-500 font-normal">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('loading_modes', { defaultValue: 'Loading modes...' })}</span>
                    </div>
                  </SelectItem>
                ) : (
                  modes.map((m) => (
                    <SelectItem
                      key={m.id}
                      value={m.id}
                      className="rounded-xl focus:bg-zinc-50 focus:dark:bg-zinc-800 cursor-pointer p-3"
                    >
                      <div className="flex flex-col items-start text-left w-full gap-0.5">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{m.name}</span>
                        <span className="text-xs text-zinc-500 font-normal">{m.description}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 flex flex-col">
            <Label className="text-sm font-medium text-foreground">{t('rewriter_language')}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="glass-card glass-dark-card text-title-color dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 rounded-[8px] h-auto min-h-[56px] py-2 px-4 font-bold focus:ring-glass-border text-left [&>span]:w-full [&>span]:block [&>span]:text-left [&>span]:line-clamp-none">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-[8px] p-2 max-h-60 overflow-y-auto custom-scrollbar">
                {rewriterLanguages.map((lang) => (
                  <SelectItem
                    key={lang}
                    value={lang}
                    className="rounded-xl focus:bg-zinc-50 focus:dark:bg-zinc-800 cursor-pointer font-medium"
                  >
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isRewriting || !content.trim()}
            className="w-full h-14 rounded-[8px] bg-light-gray hover:bg-primary! hover:text-white text-light-text-color  dark:text-white font-medium text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isRewriting ? (
              <React.Fragment>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('rewriter_rewriting')}
              </React.Fragment>
            ) : (
              t('rewriter_generate')
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default RewriterSidebar
