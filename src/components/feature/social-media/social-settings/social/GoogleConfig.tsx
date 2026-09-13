'use client'

import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { FormikProps } from '@/types'
import { Check, Copy, Store } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { platformSetupGuides } from '../../channels/components/platformSetupGuides'
import SetupGuideTooltip from './SetupGuideTooltip'

const GoogleConfig = ({ formik }: FormikProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const redirectUri = platformSetupGuides.google?.redirectUri

  const handleCopy = () => {
    if (!redirectUri) return
    navigator.clipboard.writeText(redirectUri)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-[8px] bg-emerald-600/10 text-emerald-600">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-[16px] text-title-color dark:text-white">
            {t('social_google_platform') || 'Google My Business Platform'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            These API credentials are also used for YouTube Channel integration.
          </p>
        </div>
        <SetupGuideTooltip
          title={platformSetupGuides.google.title}
          steps={platformSetupGuides.google.steps}
          links={platformSetupGuides.google.links}
          redirectUri={redirectUri}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 inner-card glass-dark-card rounded-border-radius!">
        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="google_client_id" className="text-sm font-medium text-foreground">
            {t('social_google_client_id') || 'Google Client ID'}
          </Label>
          <div className="relative">
            <PasswordInput
              id="google_client_id"
              placeholder={t('social_google_client_id_placeholder') || 'Enter Google Client ID'}
              {...formik.getFieldProps('google_client_id')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.google_client_id && formik.errors.google_client_id && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {String(formik.errors.google_client_id)}
            </p>
          )}
        </div>

        <div className="space-y-2 group/input flex flex-col">
          <Label htmlFor="google_client_secret" className="text-sm font-medium text-foreground">
            {t('social_google_client_secret') || 'Google Client Secret'}
          </Label>
          <div className="relative">
            <PasswordInput
              id="google_client_secret"
              placeholder="••••••••••••••••"
              {...formik.getFieldProps('google_client_secret')}
              className="h-10 rounded-[8px] border-glass-border focus:ring-primary/20 transition-all font-mono text-sm"
            />
          </div>
          {formik.touched.google_client_secret && formik.errors.google_client_secret && (
            <p className="text-[10px] font-bold text-destructive animate-bounce ml-1">
              {String(formik.errors.google_client_secret)}
            </p>
          )}
        </div>

        {redirectUri && (
          <div className="md:col-span-2 pt-3 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Google Business Authorized Redirect URI</label>
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

        <div className="md:col-span-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Required Google Cloud APIs for Business Locations
            </h4>
            <span className="text-[10px] font-semibold text-emerald-700/80 dark:text-emerald-400/80">Project 203941120936</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Google requires both APIs below to be enabled to automatically discover and import your verified storefront locations:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="https://console.developers.google.com/apis/api/mybusinessaccountmanagement.googleapis.com/overview?project=203941120936"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background border border-emerald-500/30 text-foreground font-medium transition-colors hover:text-emerald-600 shadow-sm"
            >
              <span>1. Enable Account Management API</span>
              <span className="text-xs">↗</span>
            </a>
            <a
              href="https://console.developers.google.com/apis/api/mybusinessbusinessinformation.googleapis.com/overview?project=203941120936"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background border border-emerald-500/30 text-foreground font-medium transition-colors hover:text-emerald-600 shadow-sm"
            >
              <span>2. Enable Business Information API</span>
              <span className="text-xs">↗</span>
            </a>
            <a
              href="https://business.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background/80 hover:bg-background border border-border text-muted-foreground font-medium transition-colors hover:text-foreground shadow-sm"
            >
              <span>Google Business Profile Manager</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleConfig

