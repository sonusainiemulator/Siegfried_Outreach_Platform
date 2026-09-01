'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetEmbedCodeQuery } from '@/redux/api/chatbotApi'
import { EmbedTabProps } from '@/types'
import { ArrowUpRight, Box, Check, Code, Command, Copy, Globe } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const EmbedTab = ({ chatbotId }: EmbedTabProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const { data, isLoading } = useGetEmbedCodeQuery(chatbotId!, {
    skip: !chatbotId,
  })

  const handleCopy = () => {
    if (data?.embedCode) {
      navigator.clipboard.writeText(data.embedCode)
      setCopied(true)
      toast.success(t('code_copied'))
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!chatbotId) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border/40 rounded-3xl bg-muted/5">
        <div className="h-20 w-20 rounded-2xl bg-muted/20 flex items-center justify-center mb-6">
          <Code className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t('create_chatbot_first')}</h3>
        <p className="text-muted-foreground max-w-sm">{t('must_save_chatbot_to_get_embed_code')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Embed Code Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Code className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-title-color dark:text-white">
              {t('installation', { defaultValue: 'Installation' })}
            </h4>
          </div>

          <Card className="bg-input-background glass-card glass-dark-card border-border/40 overflow-hidden  rounded-border-radius">
            <div className="flex flex-wrap gap-3 items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <span className="text-xs font-mono text-muted-foreground ml-2">{t('embed_js', { defaultValue: 'embed.js' })}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-2 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/10"
                onClick={handleCopy}
                disabled={isLoading}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? (
                  <span className="text-emerald-400">{t('copied', { defaultValue: 'Copied' })}</span>
                ) : (
                  t('copy_snippet', { defaultValue: 'Copy Snippet' })
                )}
              </Button>
            </div>

            <CardContent className="p-0">
              <div className="relative">
                <pre className="p-6 font-mono text-xs overflow-x-auto bg-black text-white leading-relaxed selection:bg-purple-500/30 min-h-40 custom-scrollbar">
                  {isLoading ? (
                    <Spinner
                      className="min-h-[160px]"
                      size="sm"
                      text={t('generating_snippet', { defaultValue: 'Generating snippet' })}
                    />
                  ) : (
                    <code>{data?.embedCode}</code>
                  )}
                </pre>
                {!isLoading && data?.embedCode && (
                  <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-transparent to-input-background/20" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 p-4 rounded-border-radius bg-purple-500/5 border border-purple-500/10 items-center">
            <div className="p-2 rounded-full bg-purple-500/20 text-purple-600 mt-0.5">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-medium text-foreground">{t('quick_tip', { defaultValue: 'Quick Tip' })}</p>
              <p className="text-sm text-muted-foreground ">
                {t('embed_hint', {
                  defaultValue: 'Paste this snippet just before the closing </body> tag of your website HTML.',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Integration Options */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Box className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium  text-title-color dark:text-white">
              {t('integrations', { defaultValue: 'Integrations' })}
            </h4>
          </div>

          <div className="grid gap-4">
            <Button
              variant="ghost"
              disabled
              className="flex items-center gap-4 p-4 rounded-border-radius  glass-card glass-dark-card border border-border/40 hover:border-primary/40 hover:bg-muted/50 transition-all group text-left w-full disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              <div className="h-10 w-10 rounded-[8px] bg-subtitle-color/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-title-color dark:text-white">{t('wordpress')}</h5>
                <p className="text-xs text-subtitle-color mt-0.5">
                  {t('one_click_install', { defaultValue: 'One-click Install' })}
                </p>
              </div>
              <div className="ml-auto text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {t('soon', { defaultValue: 'Soon' })}
              </div>
            </Button>

            <Button
              variant="ghost"
              disabled
              className="flex items-center gap-4 p-4 rounded-border-radius glass-card glass-dark-card border border-border/40 bg-card hover:border-green-500/40 hover:bg-muted/50 transition-all group text-left w-full disabled:opacity-50 disabled:cursor-not-allowed h-auto"
            >
              <div className="h-10 w-10 rounded-[8px] bg-subtitle-color/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Command className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h5 className="font-medium text-sm text-title-color dark:text-white">{t('shopify')}</h5>
                <p className="text-xs text-subtitle-color mt-0.5">
                  {t('store_integration', { defaultValue: 'Store Integration' })}
                </p>
              </div>
              <div className="ml-auto text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {t('soon', { defaultValue: 'Soon' })}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmbedTab
