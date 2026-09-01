'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textArea'
import { ArrowRight, Check, ChevronDown, Globe, Layers, Layout as LayoutIcon, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AdvancedSelect from '../AdvancedSelect'
import Popover from '../Popover'

const PromptSection = ({
  prompt,
  setPrompt,
  isGenerating,
  handleGenerate,
  language,
  setLanguage,
  languages,
  theme,
  setThemeModalOpen,
  slidesCount,
  setSlidesCount,
  slidesCounts,
  size,
  setSize,
  sizeOptions,
  advancedOptions,
  advancedOpts,
  langRef,
  slidesRef,
  sizeRef,
  langOpen,
  setLangOpen,
  slidesOpen,
  setSlidesOpen,
  sizeOpen,
  setSizeOpen,
}: any) => {
  const { t } = useTranslation()

  return (
    <div className="p-4 sm:p-8 pt-0">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Spread Options */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-8">
          {/* Language Popover */}
          <div className="relative">
            <Badge
              ref={langRef}
              onClick={() => setLangOpen(!langOpen)}
              variant="outline"
              className="px-4 py-2 rounded-[8px] cursor-pointer text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              {language}
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </Badge>
            <Popover anchor={langRef} open={langOpen} onClose={() => setLangOpen(false)} width="180px">
              <div className="max-h-56 overflow-y-auto custom-scrollbar py-2 px-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[10px]">
                {languages.map((lang: string) => (
                  <Button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang)
                      setLangOpen(false)
                    }}
                    variant="ghost"
                    className={`w-full text-left px-4 py-2 text-sm font-medium rounded-[8px] transition-colors flex items-center justify-between ${language === lang ? 'text-primary bg-primary/10' : 'text-zinc-700 dark:text-zinc-300'}`}
                  >
                    {lang}
                    {language === lang && <Check className="w-3.5 h-3.5" />}
                  </Button>
                ))}
              </div>
            </Popover>
          </div>

          {/* Theme Badge */}
          <Badge
            onClick={() => setThemeModalOpen(true)}
            variant="outline"
            className="px-4 py-2 rounded-[8px] cursor-pointer  text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <LayoutIcon className="w-3.5 h-3.5 text-primary" />
            {theme}
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </Badge>

          {/* Slides Count Popover */}
          <div className="relative">
            <Badge
              ref={slidesRef}
              onClick={() => setSlidesOpen(!slidesOpen)}
              variant="outline"
              className="px-4 py-2 rounded-[10px] cursor-pointer text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-primary" />
              {advancedOpts?.slidesCount?.choices?.find((c: any) => c.value === slidesCount)?.label || slidesCount}
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </Badge>
            <Popover anchor={slidesRef} open={slidesOpen} onClose={() => setSlidesOpen(false)} width="160px">
              <div className="p-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[10px] shadow-xl">
                {slidesCounts.map((n: string) => (
                  <Button
                    key={n}
                    onClick={() => {
                      setSlidesCount(n)
                      setSlidesOpen(false)
                    }}
                    variant="ghost"
                    className={`w-full text-left px-4 py-2 text-sm font-medium rounded-[10px] transition-colors flex items-center justify-between ${slidesCount === n ? 'text-primary bg-primary/10' : 'text-zinc-700 dark:text-zinc-300'}`}
                  >
                    {advancedOpts?.slidesCount?.choices?.find((c: any) => c.value === n)?.label || n}
                    {slidesCount === n && <Check className="w-3.5 h-3.5" />}
                  </Button>
                ))}
              </div>
            </Popover>
          </div>

          {/* Size Popover */}
          <div className="relative">
            <Badge
              ref={sizeRef}
              onClick={() => setSizeOpen(!sizeOpen)}
              variant="outline"
              className="px-4 py-2 rounded-[8px] cursor-pointer text-xs font-semibold flex items-center gap-2 transition-all"
            >
              {sizeOptions.find((opt: any) => opt.value === size)?.label || size}
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </Badge>
            <Popover anchor={sizeRef} open={sizeOpen} onClose={() => setSizeOpen(false)} width="160px">
              <div className="p-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[10px] shadow-xl">
                {sizeOptions.map((opt: { label: string; value: string }) => (
                  <Button
                    key={opt.value}
                    onClick={() => {
                      setSize(opt.value)
                      setSizeOpen(false)
                    }}
                    variant="ghost"
                    className={`w-full text-left px-4 py-2 text-sm font-medium rounded-[10px] transition-colors flex items-center justify-between ${size === opt.value ? 'text-primary bg-primary/10' : 'text-zinc-700 dark:text-zinc-300'}`}
                  >
                    {opt.label}
                    {size === opt.value && <Check className="w-3.5 h-3.5" />}
                  </Button>
                ))}
              </div>
            </Popover>
          </div>

          {/* Advanced Options spread out */}
          {advancedOptions.map((opt: any, i: any) => (
            <AdvancedSelect key={i} label={opt.label} value={opt.value} opts={opt.opts} onChange={opt.set} />
          ))}
        </div>

        {/* Input Area */}
        <div className="rounded-2xl p-3 sm:p-4 inner-card glass-dark-card focus-within:ring-1 focus-within:ring-primary transition-all relative">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">

            <Textarea
              className="w-full border-none outline-none resize-none text-base p-2 font-medium text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600 min-h-[60px] shadow-none focus-visible:ring-0"
              placeholder={t('describe_your_presentation_topic', {
                defaultValue: 'Describe your presentation topic...',
              })}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="rounded-xl h-11 px-6 sm:px-8 btn-color text-white font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 w-full sm:w-auto border-none"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('generating')}...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {t('generate')}
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptSection
