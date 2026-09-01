import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Globe, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const WebsiteTraining = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
          <Globe className="h-5 w-5" />
        </div>
        <Label className="text-lg font-medium text-foreground">
          {t('website_training', { defaultValue: 'Website Training' })}
        </Label>
      </div>

      <div className="sm:p-6 p-4 rounded-border-radius glass-card glass-dark-card bg-muted/5 border border-border/20">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="websiteUrl" className="text-sm font-medium text-foreground">
              {t('website_url', { defaultValue: 'Website URL' })}
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="websiteUrl"
                placeholder="https://example.com"
                className="flex-1 rounded-[8px] glass-card glass-dark-card h-12 border-border/40 bg-card"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-subtitle-color font-medium ">
              <Sparkles className="h-3 w-3 text-primary" />
              {t('website_url_hint', { defaultValue: 'We will crawl this URL for training data' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebsiteTraining
