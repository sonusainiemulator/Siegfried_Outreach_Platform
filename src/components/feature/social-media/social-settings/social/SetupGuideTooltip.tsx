'use client'

import { Check, Copy, ExternalLink, Info, X, Link2, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ReactMarkdown from 'react-markdown'

type SetupGuideLink = {
  label: string
  url: string
}

type SetupGuideTooltipProps = {
  title: string
  steps: string[]
  links: SetupGuideLink[]
  redirectUri?: string
  onOpenChange?: (open: boolean) => void
}

const getRedirectHelpText = (title: string) => {
  const t = title.toLowerCase()
  if (t.includes('facebook') || t.includes('instagram')) {
    return 'Copy and paste this into your Meta Developer App (Facebook Login ➔ Settings ➔ Valid OAuth Redirect URIs).'
  }
  if (t.includes('linkedin')) {
    return 'Copy and paste this into your LinkedIn Developer App (Auth ➔ Authorized redirect URLs for your app).'
  }
  if (t.includes('twitter') || t.includes('x ')) {
    return 'Copy and paste this into your X Developer App (User authentication settings ➔ Callback URL).'
  }
  if (t.includes('google') || t.includes('youtube')) {
    return 'Copy and paste this into your Google Cloud Console (Credentials ➔ Authorized redirect URIs).'
  }
  if (t.includes('tiktok')) {
    return 'Copy and paste this into your TikTok Developer App (Redirect Domain / Callback URL).'
  }
  if (t.includes('reddit')) {
    return 'Copy and paste this into your Reddit App Preferences (redirect uri).'
  }
  if (t.includes('threads')) {
    return 'Copy and paste this into your Threads App (Valid OAuth Redirect URIs).'
  }
  return 'Copy and paste this redirect URL into your developer application settings.'
}

const SetupGuideTooltip = ({ title, steps, links, redirectUri, onOpenChange }: SetupGuideTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!redirectUri) return
    navigator.clipboard.writeText(redirectUri)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Open ${title} setup guide`}
          title={`View ${title} Setup Guide`}
          className="h-7 w-7 inline-flex items-center justify-center rounded-[8px] border border-primary/30 bg-primary/10 text-primary transition-all hover:bg-primary/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer shadow-xs shrink-0"
        >
          <Info className="w-4 h-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={10}
        className="z-[99999] w-[400px] max-w-[calc(100vw-32px)] rounded-2xl border border-border/80 bg-white dark:bg-[#18181b] text-foreground p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-4 max-h-[85vh] overflow-y-auto text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold text-title-color dark:text-white">
              {title}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps List (Clean custom badges, no double numbers) */}
        <div className="space-y-2.5">
          {steps.map((step, idx) => {
            // Strip existing leading number if present
            const cleanStep = step.replace(/^\d+\.\s*/, '')
            return (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                  {idx + 1}
                </span>
                <span className="flex-1 text-gray-700 dark:text-gray-300 font-medium">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <>{children}</>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-bold"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {cleanStep}
                  </ReactMarkdown>
                </span>
              </div>
            )
          })}
        </div>

        {/* OAuth Callback / Redirect URL Box */}
        {redirectUri && (
          <div className="pt-3 border-t border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-primary" />
                <span>OAuth Redirect URL</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Callback URL
              </span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-zinc-800/90 border border-border font-mono text-[11px] shadow-xs">
              <input
                type="text"
                readOnly
                value={redirectUri}
                className="bg-transparent border-none outline-none text-foreground truncate w-full select-all font-mono text-[11px] font-semibold"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-sans font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                title="Copy Redirect URL"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground leading-normal">
              {getRedirectHelpText(title)}
            </p>
          </div>
        )}

        {/* Documentation Quick Links */}
        {links && links.length > 0 && (
          <div className="pt-2.5 border-t border-border/60 flex flex-wrap gap-1.5">
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default SetupGuideTooltip

