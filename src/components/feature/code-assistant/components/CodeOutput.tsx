import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CodeOutputProps } from '@/types'
import { Check, Code, Copy, Download, RefreshCcw } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

const CodeOutput = React.forwardRef<HTMLDivElement, CodeOutputProps>(
  ({ isLoading, generatedCode, language, model, onCopy, onDownload, copied }, ref) => {
    const { t } = useTranslation()
    const getExtension = (lang: string) => {
      switch (lang) {
        case 'javascript':
          return 'js'
        case 'typescript':
          return 'ts'
        case 'python':
          return 'py'
        case 'c':
          return 'c'
        case 'csharp':
          return 'cs'
        default:
          return 'txt'
      }
    }

    return (
      <div ref={ref} id="code-output" className="h-full space-y-6">
        <Card className="border-border/40 rounded-border-radius overflow-hidden sticky top-8 h-full max-h-[calc(100vh-140px)] glass-card glass-dark-card flex flex-col group/terminal">
          {/* Terminal Header */}
          <div className="flex items-center flex-wrap gap-3 justify-between px-8 py-5 border-b border-white/5 dark:border-glass-border backdrop-blur-3xl">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full border border-red-400/40 bg-red-400 transition-colors" />
                <div className="w-3 h-3 rounded-full border border-yellow-400/40 bg-yellow-400 transition-colors" />
                <div className="w-3 h-3 rounded-full border border-green-400/40 bg-green-400 transition-colors" />
              </div>
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="p-1 px-2 rounded-[8px] bg-primary/20 text-primary text-xs font-medium capitalize shadow-sm border border-primary/20">
                  {language}
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold tracking-tight">
                  output.{getExtension(language)}
                </span>
              </div>
            </div>

            {generatedCode && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDownload(generatedCode, language)}
                  className="h-9 w-9 rounded-[8px] text-black/60 dark:text-white hover:text-black/60 bg-subtitle-color/20 hover:bg-subtitle-color/20 border border-white/5"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onCopy(generatedCode)}
                  className="h-9 px-4 rounded-[8px] gap-2 text-[10px] dark:text-white font-black uppercase tracking-widest text-black/60 hover:text-black/60 bg-subtitle-color/20 hover:bg-subtitle-color/20 border border-white/5"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 relative flex flex-col overflow-hidden bg-black">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse rounded-full" />
                  <div className="h-32 w-32 rounded-full border-[10px] border-primary/5 border-t-primary animate-spin shadow-2xl" />
                  <RefreshCcw className="h-12 w-12 text-primary absolute inset-0 m-auto" />
                </div>
                <div className="text-center space-y-3 relative z-10">
                  <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    {t('processing_logic')}
                  </div>
                  <h3 className="text-2xl font-black text-slate-100 tracking-tight">{t('constructing_module')}</h3>
                  <p className="text-sm text-subtitle-color font-medium max-w-sm">
                    {t('analyzing_complexity', { language, model })}
                  </p>
                </div>
              </div>
            ) : generatedCode ? (
              <div className="flex-1 overflow-auto custom-scrollbar p-8">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center text-[10px] font-mono text-slate-600 select-none border-r border-white/5 pt-1">
                    {generatedCode.split('\n').map((_, i) => (
                      <div key={i} className="leading-6 h-6">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <pre className="font-mono text-[13px] text-blue-100/90 leading-6 selection:bg-primary/40 pl-12 whitespace-pre-wrap break-words">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center sm:p-6 p-4 space-y-10 group/ready">
                <div className="relative">
                  <div className="h-20 w-20 rounded-[8px] bg-white/2 border border-white/5 flex items-center justify-center rotate-3 group-hover/ready:rotate-0 transition-transform duration-700 shadow-2xl overflow-hidden relative">
                    <div className="h-10 w-10 rounded-[8px] bg-primary/10 flex items-center justify-center transform group-hover/ready:scale-110 transition-transform duration-500">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-xl font-medium text-white">{t('system_idle')}</h3>
                  <p className="text-subtitle-color font-medium max-w-70 text-sm mx-auto">
                    {t('initialize_engine')}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <div className="h-1.5 w-10 rounded-full bg-primary/20" />
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                  </div>
                </div>
              </div>
            )}

            <div className="px-8 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-medium  text-white">{t('system_ready')}</span>
              </div>
              <div className="text-xs font-mono text-subtitle-color font-medium uppercase">{t('version')}</div>
            </div>
          </div>
        </Card>
      </div>
    )
  },
)

CodeOutput.displayName = 'CodeOutput'

export default CodeOutput
