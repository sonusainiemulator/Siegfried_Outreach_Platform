import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { PromptAreaProps } from '@/types'
import { FileCode, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const PromptArea = ({
  title,
  onTitleChange,
  onClear,
  language,
  model,
}: Pick<PromptAreaProps, 'title' | 'onTitleChange' | 'onClear' | 'language' | 'model'>) => {
  const { t } = useTranslation()
  return (
    <div className="flex-1 sm:p-6 p-4 relative flex flex-col">
      <div className="space-y-6 flex flex-col flex-1">

        {/* Header Section - Prompt Interface & Resource Title */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-1">
              <Label className="text-xl font-medium text-title-color dark:text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" fill="currentColor" />
                {t('prompt_interface')}
              </Label>
              <h3 className="text-sm font-medium text-subtitle-color">{t('specify_your_requirements')}</h3>
            </div>

            <div className="flex gap-2">
              <span className="text-xs font-medium inner-card glass-dark-card px-3 py-1.5 rounded-[8px] border border-border/40">
                {language} : {model?.split('-')[0]}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder={t('resource_title_optional', { defaultValue: 'Resource Title (Optional)' })}
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="h-12 pl-12 rounded-[12px] inner-card glass-dark-card border-border/40 text-sm font-medium"
              />
              <FileCode className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              variant="outline"
              onClick={onClear}
              className="sm:h-12 h-10 px-6 border-none rounded-[12px] font-medium text-sm glass-card bg-light-gray text-light-text-color dark:text-white hover:bg-red-500/10! hover:text-red-500 transition-colors"
            >
              {t('clear')}
            </Button>
          </div>
        </div>

        {/* Middle Section - Ready to code? */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-title-color dark:text-white">{t('ready_to_code', { defaultValue: 'Ready to code?' })}</h2>
            <p className="text-subtitle-color max-w-sm mx-auto text-sm leading-relaxed">
              {t('ready_to_code_desc', { defaultValue: 'Describe your function, component, or logic requirements below to begin.' })}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PromptArea
