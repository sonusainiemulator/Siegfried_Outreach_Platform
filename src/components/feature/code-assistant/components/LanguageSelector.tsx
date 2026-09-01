import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { CodeLanguageSelectorProps } from '@/types'
import { HistoryIcon, Terminal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const LanguageSelector = ({
  languages,
  selectedLanguage,
  onLanguageSelect,
}: CodeLanguageSelectorProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px] bg-primary/10 text-primary">
          <Terminal className="h-5 w-5" />
        </div>
        <div>
          <span className="text-sm font-semibold text-subtitle-color dark:text-white block">{t('select_language')}</span>
          <p className="text-xs text-subtitle-color">{t('choose_target_lang', { defaultValue: 'Choose target language for generation' })}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
            <SelectTrigger className="w-full h-11 inner-card glass-dark-card rounded-[10px] shadow-none focus:ring-primary/20 bg-sidebar-color/50">
              <div className="flex items-center gap-3">
                <SelectValue placeholder={t('select_language')} />
              </div>
            </SelectTrigger>
            <SelectContent className="inner-card glass-dark-card border-border/40 rounded-[12px] max-h-[300px]">
              {languages.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className="hover:bg-primary/10 focus:bg-primary/10 rounded-[6px] transition-colors cursor-pointer py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <lang.icon className={cn("h-4 w-4", selectedLanguage === lang.value ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{lang.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.CODE_ASSISTANT_HISTORY)}
          className="h-11 px-5 border-none rounded-[10px] btn-color text-white transition-all gap-2 font-medium text-sm whitespace-nowrap shrink-0"
        >
          <HistoryIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{t('writer_history')}</span>
        </Button>
      </div>
    </div>
  )
}

export default LanguageSelector
