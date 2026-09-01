'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { AutoReplyConfig, AutoReplyOptionsProps } from '@/types'
import { Facebook, Hash, Info, Instagram, MessageSquareReply, Sparkles, X, Youtube } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const AutoReplyOptions = ({ config, onConfigChange, disabled, selectedAccounts = [] }: AutoReplyOptionsProps) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')

  const selectedPlatformsList = selectedAccounts.map((a) => a.platform.toLowerCase())
  const hasYoutube = selectedPlatformsList.includes('youtube')
  const hasInstagram = selectedPlatformsList.includes('instagram')
  const hasFacebook = selectedPlatformsList.includes('facebook')
  const hasMeta = hasInstagram || hasFacebook

  const handleChange = (field: keyof AutoReplyConfig, value: any) => {
    onConfigChange({ ...config, [field]: value })
  }

  const addKeyword = (keywordToAdd?: string) => {
    const target = keywordToAdd || inputValue
    const trimmed = target.trim().toUpperCase()
    if (trimmed && !config.triggerKeyword.includes(trimmed)) {
      handleChange('triggerKeyword', [...config.triggerKeyword, trimmed])
      if (!keywordToAdd) setInputValue('')
    }
  }

  const removeKeyword = (kw: string) => {
    handleChange(
      'triggerKeyword',
      config.triggerKeyword.filter((k: string) => k !== kw),
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <div className="space-y-6 border-t border-border/10 pt-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
            <MessageSquareReply className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-medium text-title-color dark:text-white truncate">
                {t('social_engagement_automation', 'Auto-Reply Automation')}
              </h3>
              <div className="flex items-center gap-1">
                {hasInstagram && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                    <Instagram className="w-3 h-3" /> IG
                  </span>
                )}
                {hasFacebook && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <Facebook className="w-3 h-3" /> FB
                  </span>
                )}
                {hasYoutube && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    <Youtube className="w-3 h-3 text-red-500" /> YouTube
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs md:text-sm font-medium text-subtitle-color">
              {hasYoutube && hasMeta
                ? t('social_all_autoreply_hub', 'Automated public comment replies for YouTube & Meta, plus DMs for Instagram & Facebook.')
                : hasYoutube
                ? t('social_youtube_autoreply_hub', 'Automated comment reply sequence for YouTube Videos and Shorts comments.')
                : t('social_ig_autoreply_hub', 'Automated comment replies & instant DM sequence for Instagram and Facebook.')}
            </p>
          </div>
        </div>
        <Switch
          checked={config.isEnabled}
          onCheckedChange={(checked) => handleChange('isEnabled', checked)}
          disabled={disabled}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className={cn('space-y-6 transition-all duration-500', !config.isEnabled && 'opacity-60 pointer-events-none')}>
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1 flex-wrap gap-2">
            <Label className="text-sm font-medium text-subtitle-color flex items-center gap-2">
              {t('social_neural_trigger_cluster', 'Trigger Keywords')}
              <Info className="w-3 h-3 text-muted-foreground" />
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-light-text-color">
                {config.triggerKeyword.length} {t('social_active_nodes', 'Active Keywords')}
              </span>
            </div>
          </div>

          {/* Preset keywords suggestion chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] text-muted-foreground font-medium me-1">{t('suggested', 'Suggested:')}</span>
            {['LINK', 'INFO', 'MORE', 'GUIDE', 'DM', 'DETAILS'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => addKeyword(preset)}
                disabled={!config.isEnabled || disabled || config.triggerKeyword.includes(preset)}
                className={cn(
                  'px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer',
                  config.triggerKeyword.includes(preset)
                    ? 'opacity-40 border-border/20 cursor-default'
                    : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/15',
                )}
              >
                + {preset}
              </button>
            ))}
          </div>

          <div
            className={cn(
              'flex flex-wrap gap-2 p-3 rounded-[8px] glass-button bg-card-color border border-border/40 min-h-14 items-center transition-all duration-300 focus-within:border-primary',
            )}
          >
            {config.triggerKeyword.map((kw: string) => (
              <div
                key={kw}
                className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase rounded-[8px] group relative overflow-hidden animate-in fade-in zoom-in-95 duration-300"
              >
                <Hash className="w-3 h-3 opacity-60" />
                {kw}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeKeyword(kw)}
                  className="h-auto w-auto p-0 hover:bg-transparent hover:scale-110 active:scale-95 transition-transform text-primary/70 hover:text-primary"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <div className="flex-1 flex items-center min-w-30">
              <Input
                placeholder={config.triggerKeyword.length === 0 ? t('social_define_trigger_seq', 'Type keyword and press Enter (e.g. LINK)') : t('social_add_node', '+ Add keyword')}
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addKeyword()}
                disabled={disabled}
                className="w-full bg-transparent border-none outline-none text-xs font-bold font-mono px-2 placeholder:text-muted-foreground/40 text-primary h-auto shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-title-color dark:text-white flex items-center gap-1.5">
              {hasYoutube ? (
                <>
                  <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{t('youtube_public_reply', 'Public Comment Reply (YouTube & Social)')}</span>
                </>
              ) : (
                t('social_public_acknowledgement', 'Public Comment Reply')
              )}
            </Label>
            <Input
              placeholder={hasYoutube ? 'e.g., Thanks for watching! Check out our link or reply below for more details 🚀' : t('social_operational_response')}
              value={config.publicMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('publicMessage', e.target.value)}
              disabled={!config.isEnabled || disabled}
              className="h-10 rounded-[8px] bg-card-color border-border/40 focus:ring-primary/20 text-[11px] md:text-xs font-bold"
            />
            <p className="text-[11px] text-muted-foreground">
              {hasYoutube
                ? 'Posted publicly under YouTube video/Shorts comments or Meta post comments matching your trigger keywords.'
                : 'Posted publicly as a comment response on Meta posts.'}
            </p>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-title-color flex items-center justify-between dark:text-white">
              <span>{t('social_secure_dm_transmission', 'Private Direct Message (DM)')}</span>
              <span className="text-xs font-medium text-subtitle-color">Instagram & FB</span>
            </Label>
            <Textarea
              placeholder={t('social_secure_packet_relay', 'Enter private message sent directly via DM...')}
              value={config.privateMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('privateMessage', e.target.value)}
              disabled={!config.isEnabled || disabled}
              className="min-h-10 rounded-[8px] bg-input-color border-border/40 focus:ring-primary/20 text-[11px] md:text-xs leading-relaxed p-3 md:p-4 resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              {hasYoutube && !hasMeta
                ? 'Note: YouTube does not support DMs. Auto-reply on YouTube uses the Public Comment Reply on the left.'
                : 'Sent directly to the user\'s inbox on Instagram and Facebook.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-border-radius bg-primary/5 border border-primary/10 flex items-start gap-3 relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5 relative z-10" />
          <p className="text-xs font-semibold text-muted-foreground leading-relaxed relative z-10 transition-colors group-hover:text-foreground/80">
            {t('social_neural_cluster_sync', 'Auto-Reply is active for keywords:')}{' '}
            <span className="text-primary font-black">
              {config.triggerKeyword.length > 0 ? config.triggerKeyword.join(', ') : t('social_any_defined_seq', 'All defined keywords')}
            </span>
            .{' '}
            {hasYoutube
              ? 'When comments matching trigger keywords are detected on your YouTube videos, Shorts, or Meta posts, automated responses will execute.'
              : t('social_system_execute_ack', 'When matching comments are detected, public and private responses will execute automatically.')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AutoReplyOptions
