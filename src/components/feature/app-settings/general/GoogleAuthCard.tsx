'use client'

import TextInput from '@/components/shared/form-fields/TextInput'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const GoogleAuthCard = () => {
  const { t } = useTranslation()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success(t('copied_to_clipboard', { defaultValue: 'Copied to clipboard' }))
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const origins = ['https://ttai.in', 'https://www.ttai.in']
  const redirectUris = ['https://ttai.in', 'https://ttai.in/login']

  return (
    <Card className="border-input-border-color glass-dark-card rounded-border-radius overflow-hidden group transition-all duration-500 lg:col-span-1">
      <CardHeader className="pb-2! sm:p-6 p-4 border-b border-glass-border/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="text-primary">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <CardTitle className="text-xl font-medium text-title-color dark:text-white">
              {t('google_sso_settings', { defaultValue: 'Google OAuth & SSO Settings' })}
            </CardTitle>
          </div>
          <div>
            <CardDescription className="text-sm font-medium text-subtitle-color">
              {t('configure_google_login_desc', { defaultValue: 'Configure Google Sign-In for seamless user login and registration' })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 sm:p-6 p-4 pt-4!">
        <div className="grid grid-cols-1 gap-4">
          <TextInput
            name="google_client_id"
            label={t('google_client_id', { defaultValue: 'Google Client ID' })}
            placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
            className="transition-all duration-300"
          />
          <TextInput
            name="google_client_secret"
            label={t('google_client_secret', { defaultValue: 'Google Client Secret' })}
            placeholder="GOCSPX-..."
            type="password"
            className="transition-all duration-300"
          />
        </div>

        {/* OAuth Callback & Origins Help Card */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {t('google_console_config', { defaultValue: 'Google Cloud Console Setup' })}
            </span>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>{t('open_console', { defaultValue: 'Open Console' })}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <span className="text-gray-500 dark:text-gray-400 font-medium block mb-1">
              {t('authorized_js_origins', { defaultValue: 'Authorized JavaScript Origins:' })}
            </span>
            <div className="space-y-1">
              {origins.map((origin) => (
                <div key={origin} className="flex items-center justify-between bg-white dark:bg-black/40 rounded px-2.5 py-1 border border-gray-200/50 dark:border-white/10 font-mono text-[11px]">
                  <span>{origin}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(origin, `origin-${origin}`)}
                    className="p-1 hover:text-primary transition-colors cursor-pointer"
                    title="Copy"
                  >
                    {copiedKey === `origin-${origin}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-gray-500 dark:text-gray-400 font-medium block mb-1">
              {t('authorized_redirect_uris', { defaultValue: 'Authorized Redirect URIs:' })}
            </span>
            <div className="space-y-1">
              {redirectUris.map((uri) => (
                <div key={uri} className="flex items-center justify-between bg-white dark:bg-black/40 rounded px-2.5 py-1 border border-gray-200/50 dark:border-white/10 font-mono text-[11px]">
                  <span>{uri}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(uri, `uri-${uri}`)}
                    className="p-1 hover:text-primary transition-colors cursor-pointer"
                    title="Copy"
                  >
                    {copiedKey === `uri-${uri}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GoogleAuthCard
