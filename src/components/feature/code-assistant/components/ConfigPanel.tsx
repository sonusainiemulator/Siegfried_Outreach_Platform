import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { ConfigPanelProps } from '@/types'
import { Check, MessageSquare, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ConfigPanel = ({
  styles,
  selectedStyle,
  onStyleSelect,
  includeComments,
  onCommentsToggle,
  giveInstructions,
  onInstructionsToggle,
}: ConfigPanelProps) => {
  const { t } = useTranslation()
  return (
    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border/40 sm:p-6 p-4 space-y-8 ">
      <div className="space-y-6">
        <div className="space-y-2 flex flex-col">
          <Label className="text-[16px] font-medium text-title-color dark:text-white pl-1">
            {t('configuration')}
          </Label>
          <div className="space-y-3">
            {styles.map((s) => {
              const Icon = s.icon
              const isActive = selectedStyle === s.value
              return (
                <Button
                  key={s.value}
                  variant="ghost"
                  onClick={() => onStyleSelect(s.value)}
                  className={cn(
                    'w-full h-auto flex items-center justify-between p-3.5 rounded-[8px] border transition-all text-sm font-bold hover:bg-transparent',
                    isActive
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-sm hover:bg-primary/10'
                      : ' border-border/40 glass-dark-card text-muted-foreground hover:border-border/60',
                  )}
                >
                  <div className="flex items-center gap-3 text-base">
                    <Icon className="h-6 w-6 opacity-70" />
                    {s.label}
                  </div>
                  {isActive && <Check className="h-6 w-6" />}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        <Label className="text-[16px] font-medium text-title-color dark:text-white pl-1">
          {t('features')}
        </Label>
        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-border-radius inner-card glass-dark-card bg-card/40 border border-border/40 group hover:border-primary/40 transition-all cursor-pointer"
            onClick={() => onCommentsToggle(!includeComments)}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-base font-medium text-title-color dark:text-white">{t('comments')}</span>
              </div>
              <p className="text-xs text-subtitle-color">{t('inline_documentation')}</p>
            </div>
            <Switch checked={includeComments} onCheckedChange={onCommentsToggle} />
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-border-radius inner-card glass-dark-card bg-card/40 border border-border/40 group hover:border-blue-500/40 transition-all cursor-pointer"
            onClick={() => onInstructionsToggle(!giveInstructions)}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-base font-medium text-title-color dark:text-white">{t('setup_help')}</span>
              </div>
              <p className="text-xs text-subtitle-color">{t('usage_instructions')}</p>
            </div>
            <Switch checked={giveInstructions} onCheckedChange={onInstructionsToggle} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigPanel
