import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { WebsiteTrainingProps } from '@/types'
import { useScrapeWebsiteMutation } from '@/redux/api/trainingApi'
import { Globe, Loader2, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const WebsiteTraining = ({ textContent, setTextContent }: WebsiteTrainingProps) => {
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [scrapeWebsite, { isLoading }] = useScrapeWebsiteMutation()

  const handleFetch = async () => {
    const trimmed = url.trim()
    if (!trimmed) {
      toast.error(t('enter_website_url', { defaultValue: 'Please enter a website URL first.' }))
      return
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      toast.error(t('invalid_website_url', { defaultValue: 'Please enter a valid URL starting with http:// or https://' }))
      return
    }

    try {
      const res = await scrapeWebsite({ url: trimmed }).unwrap()
      if (!res.content || !res.content.trim()) {
        toast.error(t('no_website_content', { defaultValue: 'No readable content found on this page.' }))
        return
      }
      const title = res.title || trimmed
      setTextContent([...textContent, { title, content: res.content.trim() }])
      setUrl('')
      toast.success(t('website_content_added', { defaultValue: 'Website content added to the knowledge base.' }))
    } catch (err: any) {
      toast.error(err?.data?.message || t('website_fetch_failed', { defaultValue: 'Failed to fetch the website. Please try again.' }))
    }
  }

  const removeItem = (index: number) => {
    setTextContent(textContent.filter((_, i) => i !== index))
  }

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

      {/* URL input + Crawl button */}
      <div className="sm:p-6 p-4 rounded-border-radius glass-card glass-dark-card bg-muted/5 border border-border/20">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="websiteUrl" className="text-sm font-medium text-foreground">
              {t('website_url', { defaultValue: 'Website URL' })}
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="websiteUrl"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') handleFetch()
                }}
                placeholder="https://example.com"
                className="flex-1 rounded-[8px] glass-card glass-dark-card h-12 border-border/40 bg-card"
              />
              <Button
                onClick={handleFetch}
                disabled={isLoading}
                variant="secondary"
                className="h-12 px-6 gap-2 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('fetching', { defaultValue: 'Fetching...' })}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {t('crawl_fetch', { defaultValue: 'Crawl / Fetch' })}
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-subtitle-color font-medium">
              <Sparkles className="h-3 w-3 text-primary" />
              {t('website_url_hint', { defaultValue: 'We will crawl this URL for training data' })}
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge base list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-foreground">
            {t('knowledge_base', { defaultValue: 'Knowledge Base' })}
          </Label>
          <span className="text-xs text-subtitle-color">({textContent.length})</span>
        </div>

        {textContent.length === 0 ? (
          <div className="border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center sm:p-6 p-4 glass-card glass-dark-card bg-muted/5">
            <div className="h-16 w-16 rounded-border-radius bg-emerald-500/10 flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {t('no_website_crawled', { defaultValue: 'No website content added yet' })}
            </p>
            <p className="text-xs text-subtitle-color mt-1">
              {t('no_website_crawled_hint', { defaultValue: 'Paste a URL above and click Crawl / Fetch to train your bot.' })}
            </p>
          </div>
        ) : (
          textContent.map((item, index) => (
            <div
              key={index}
              className="relative group sm:p-5 p-4 rounded-border-radius glass-card glass-dark-card bg-muted/10 border border-border/20 transition-all hover:bg-muted/20 hover:border-emerald-500/20"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <span className="text-sm font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                    {t('source', { defaultValue: 'Source' })} #{index + 1}
                  </span>
                  <h4 className="font-semibold text-foreground mt-2 break-words">{item.title}</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-40 overflow-y-auto custom-scrollbar text-sm text-subtitle-color whitespace-pre-wrap break-words pr-1">
                {item.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default WebsiteTraining
