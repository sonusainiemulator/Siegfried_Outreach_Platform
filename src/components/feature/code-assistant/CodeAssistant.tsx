'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textArea'
import { getCodeModels, getCodeStyles, getLanguages } from '@/data/codeAssistant'
import { useGenerateCodeMutation } from '@/redux/api/aiContentApi'
import { ApiError } from '@/types'
import { downloadFile } from '@/utils/download'
import { isBrowser } from '@/utils/environment'
import { Loader2, Send } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import CodeHeader from './components/CodeHeader'
import CodeOutput from './components/CodeOutput'
import ConfigPanel from './components/ConfigPanel'
import LanguageSelector from './components/LanguageSelector'
import PromptArea from './components/PromptArea'

const CodeAssistant = () => {
  const { t } = useTranslation()
  const [generateCode, { isLoading }] = useGenerateCodeMutation()

  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [model, setModel] = useState('gemini-2.5-flash')
  const [codeStyle, setCodeStyle] = useState('clean-modern')
  const [includeComments, setIncludeComments] = useState(true)
  const [giveInstructions, setGiveInstructions] = useState(false)

  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)

  const outputRef = useRef<HTMLDivElement>(null)

  const languages = useMemo(() => getLanguages(), [])
  const models = useMemo(() => getCodeModels(), [])
  const styles = useMemo(() => getCodeStyles(), [])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(t('please_enter_prompt', { defaultValue: 'Please enter a prompt' }))
      return
    }
    try {
      const result = await generateCode({
        prompt,
        title: title || undefined,
        language,
        model,
        codeStyle,
        includeComments,
        giveInstructions,
      }).unwrap()

      setGeneratedCode(result.data.content)
      toast.success(result.message || t('code_generated_success', { defaultValue: 'Code generated successfully' }))

      if (isBrowser && window.innerWidth < 1280 && outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('generation_failed', { defaultValue: 'Failed to generate code' }))
    }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success(t('copied_to_clipboard', { defaultValue: 'Copied to clipboard' }))
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (code: string, lang: string) => {
    const getExtension = (l: string) => {
      switch (l) {
        case 'javascript': return 'js'
        case 'typescript': return 'ts'
        case 'python': return 'py'
        case 'c': return 'c'
        case 'csharp': return 'cs'
        default: return 'txt'
      }
    }
    const extension = getExtension(lang)
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    downloadFile(url, `generated_code.${extension}`)
  }

  return (
    <div className="min-h-full space-y-8 animate-fade-in max-w-[1600px] mx-auto">
      <CodeHeader models={models} selectedModel={model} onModelSelect={setModel} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        <div className="xl:col-span-12 2xl:col-span-7 space-y-8 flex flex-col">
          <LanguageSelector
            languages={languages}
            selectedLanguage={language}
            onLanguageSelect={setLanguage}
          />

          {/* Card: top row (Config + Prompt header) + full-width bottom textarea */}
          <Card className="rounded-[24px] border-border/40 bg-card/40 backdrop-blur-xl glass-dark-card overflow-hidden border-2 flex-1 flex flex-col">

            {/* TOP ROW: Config Panel + Prompt Header side by side */}
            <div className="flex flex-col md:flex-row flex-1">
              <ConfigPanel
                styles={styles}
                selectedStyle={codeStyle}
                onStyleSelect={setCodeStyle}
                includeComments={includeComments}
                onCommentsToggle={setIncludeComments}
                giveInstructions={giveInstructions}
                onInstructionsToggle={setGiveInstructions}
              />
              <PromptArea
                title={title}
                onTitleChange={setTitle}
                onClear={() => setPrompt('')}
                language={language}
                model={model}
              />
            </div>

            {/* BOTTOM ROW: Full-width prompt textarea spanning entire card */}
            <div className="border-t border-border/40 p-4 sm:p-6 space-y-3">
              <div className="relative group inner-card glass-dark-card rounded-[16px] border-2 border-border/40 focus-within:border-primary/40 transition-all p-2">
                <Textarea
                  placeholder={t('prompt_placeholder', { defaultValue: 'e.g. Build an optimized React hooks for managing local storage...' })}
                  value={prompt}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val.length <= 2000) setPrompt(val)
                  }}
                  maxLength={2000}
                  className="w-full p-4 bg-transparent border-none focus:ring-none focus-visible:ring-0 focus-visible:ring-transparent resize-none text-base font-medium placeholder:text-subtitle-color/60"
                />
                <div className="flex items-center justify-between px-4 pb-2">
                  <div className="flex items-center gap-4 justify-end ml-auto">
                    <span className="text-[10px] font-bold text-subtitle-color uppercase tracking-wider">
                      {prompt.length} / 2000
                    </span>
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || !prompt.trim()}
                      className="h-10 px-6 rounded-[10px] btn-color text-white gap-2 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {isLoading ? t('processing') : t('generate')}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-center text-subtitle-color opacity-60">
                {t('press_cmd_enter', { defaultValue: 'Press Cmd + Enter to generate code instantly' })}
              </p>
            </div>

          </Card>
        </div>

        <div className="xl:col-span-12 2xl:col-span-5 h-full">
          <CodeOutput
            ref={outputRef}
            isLoading={isLoading}
            generatedCode={generatedCode}
            language={language}
            model={model}
            onCopy={handleCopy}
            onDownload={handleDownload}
            copied={copied}
          />
        </div>
      </div>
    </div>
  )
}

export default CodeAssistant
