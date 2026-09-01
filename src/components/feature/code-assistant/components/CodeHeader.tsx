import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CodeHeaderProps } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const CodeHeader = ({ models, selectedModel, onModelSelect }: CodeHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Button>
          <div className="flex items-start flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-title-color title-color dark:text-white leading-[1.1]">
              {t('ai_codex', { defaultValue: 'AI Codex' })} 
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mx-2">
          {models.map((m) => (
            <Button
              key={m.value}
              variant="ghost"
              onClick={() => onModelSelect(m.value)}
              className={cn(
                'relative h-auto flex-1 min-w-45 p-3 rounded-[8px] border transition-all duration-500 text-left group overflow-hidden  hover:bg-transparent',
                selectedModel === m.value
                  ? 'border-primary bg-primary/10 scale-[1.02] hover:bg-light-primary'
                  : 'border-light-primary glass-dark-card',
              )}
            >
              <div className="space-y-1 relative z-10 flex gap-2 items-center justify-center">
                <h4
                  className={cn(
                    'font-bold text-sm transition-colors mb-0',
                    selectedModel === m.value ? 'text-primary' : 'text-primary',
                  )}
                >
                  {m.label.split(' ')[0]}
                </h4>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest transition-colors">
                  {m.label.split(' ').slice(1).join(' ')}
                </p>
              </div>
              {selectedModel === m.value && (
                <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-primary/20 rounded-full blur-xl animate-pulse" />
              )}
            </Button>
          ))}
          <CreditLimitPill />
        </div>
      </div>
    </div>
  )
}

export default CodeHeader
