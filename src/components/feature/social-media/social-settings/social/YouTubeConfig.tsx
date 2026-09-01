'use client'

import { FormikProps } from '@/types'
import { Check, Copy, Youtube } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const YouTubeConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  void formik

  const redirectUri = platformSetupGuides.youtube?.redirectUri

  const handleCopy = () => {
    if (!redirectUri) return
    navigator.clipboard.writeText(redirectUri)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px] bg-red-600/10 text-red-600">
          <Youtube className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-[16px] text-title-color dark:text-white">
            {t('social_youtube_platform', { defaultValue: 'YouTube Platform' })}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('social_youtube_desc', { defaultValue: 'Publish video content directly to your YouTube Channel.' })}
          </p>
        </div>
        <SetupGuideTooltip
          title={platformSetupGuides.youtube.title}
          steps={platformSetupGuides.youtube.steps}
          links={platformSetupGuides.youtube.links}
          redirectUri={redirectUri}
        />
      </div>

      <div className="p-5 inner-card glass-dark-card rounded-border-radius! space-y-4">
        <div>
          <p className="text-sm font-medium text-title-color dark:text-white">
            {t('social_youtube_shared_credentials', { defaultValue: 'Shared Google Credentials' })}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            {t('social_youtube_shared_credentials_desc', {
              defaultValue:
                'YouTube uses the same Google Client ID and Client Secret configured in the Google My Business section above. Make sure your Google Cloud project has the YouTube Data API v3 enabled and the OAuth consent screen includes the required YouTube scopes.',
            })}
          </p>
        </div>

        {redirectUri && (
          <div className="pt-3 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">YouTube Authorized Redirect URI</label>
              <span className="text-[10px] text-muted-foreground">Add to Google Cloud Console</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/60 border border-border/50 font-mono text-xs">
              <input
                type="text"
                readOnly
                value={redirectUri}
                className="bg-transparent border-none outline-none text-foreground truncate w-full select-all font-mono text-xs"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium transition-colors shrink-0 cursor-pointer hover:bg-primary/90"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default YouTubeConfig

