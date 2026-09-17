'use client'

import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Info,
  CheckCircle2,
  ShieldCheck,
  Video,
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  Zap
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SocialAccount } from '@/types/components/socialMedia'

export interface AILabelOptionsProps {
  isAiGenerated: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  selectedAccounts?: SocialAccount[]
  postTypes?: Record<string, string>
}

// Official Instagram Gradient Vector Icon
const InstagramGradientIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" className={className} fill="none">
    <defs>
      <linearGradient id="ig-grad-ai" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="30%" stopColor="#e6683c" />
        <stop offset="60%" stopColor="#dc2743" />
        <stop offset="80%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path
      fill="url(#ig-grad-ai)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
)

export const AILabelOptions: React.FC<AILabelOptionsProps> = ({
  isAiGenerated,
  onChange,
  disabled = false,
  selectedAccounts = [],
  postTypes = {},
}) => {
  const { t } = useTranslation()

  const hasInstagram = selectedAccounts.some(
    (a) => a.platform.toLowerCase() === 'instagram'
  )
  const isReelSelected = selectedAccounts.some(
    (a) => postTypes[a.id] === 'reel' || postTypes[a.id] === 'shorts'
  )

  return (
    <div
      className={cn(
        'relative rounded-2xl border transition-all duration-300 overflow-hidden',
        isAiGenerated
          ? 'border-purple-500/40 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-background/50 shadow-md shadow-purple-500/5'
          : 'border-border/30 bg-background/30 hover:border-border/60'
      )}
    >
      {/* Subtle top gradient accent */}
      <div
        className={cn(
          'h-1 w-full transition-colors',
          isAiGenerated
            ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600'
            : 'bg-border/20'
        )}
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Header with Switch */}
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xs',
                isAiGenerated
                  ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-purple-500/20'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {hasInstagram ? (
                <InstagramGradientIcon className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-semibold text-title-color dark:text-white flex items-center gap-1.5">
                  <span>{t('ai_label_content', { defaultValue: 'AI-Generated Content Label' })}</span>
                  {hasInstagram && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/30">
                      Instagram & Meta
                    </span>
                  )}
                </h4>

                {isAiGenerated ? (
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('ai_label_enabled', { defaultValue: 'AI Label ON' })}</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground text-[11px] px-2 py-0.5">
                    {t('ai_label_disabled', { defaultValue: 'Label Disabled' })}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-0.5">
                {t(
                  'ai_label_description',
                  {
                    defaultValue:
                      'Applies the official "Made with AI" disclosure badge on Instagram Posts, Reels & Carousels.',
                  }
                )}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <Button
              type="button"
              variant={isAiGenerated ? 'outline' : 'ghost'}
              size="sm"
              disabled={disabled}
              onClick={() => onChange(!isAiGenerated)}
              className={cn(
                'h-8 px-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                isAiGenerated
                  ? 'border-purple-500/40 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isAiGenerated ? t('turn_off', { defaultValue: 'Disable' }) : t('turn_on', { defaultValue: 'Enable AI Label' })}
            </Button>

            <Switch
              checked={isAiGenerated}
              onCheckedChange={onChange}
              disabled={disabled}
              aria-label="Toggle Instagram AI Label"
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-purple-600"
            />
          </div>
        </div>

        {/* Dynamic Context Badge Banner */}
        {isAiGenerated && (
          <div className="rounded-xl p-3 bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/20 text-xs space-y-2 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Meta & Instagram Graph API AI Label Active (`is_ai_generated: true`)</span>
              </div>

              {/* Miniature Instagram Tag Preview */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-700 shadow-2xs text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                <Sparkles className="w-3 h-3 text-purple-500 animate-spin" />
                <span className="font-semibold">AI info</span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">• Made with AI</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t(
                'ai_label_meta_policy_notice',
                {
                  defaultValue:
                    'Your content will be published with the official Instagram "AI info" tag. Instagram shows this tag on your Reel or post header to maintain transparency and comply with Meta Community Standards.',
                }
              )}
            </p>
          </div>
        )}

        {/* Quick Help & Automation Explanation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-muted-foreground pt-1">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-background/50 border border-border/20">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Auto-Enabled for AI Postings:</span>{' '}
              When AI generates reels, copy, or carousels (AI Social Manager or AI Writer), this button turns on automatically.
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-lg bg-background/50 border border-border/20">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Manual Override Anytime:</span>{' '}
              You can toggle this button on or off whenever you create or edit posts from this page.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AILabelOptions
