'use client'

import React, { useState } from 'react'
import {
  Search,
  Monitor,
  Smartphone,
  ExternalLink,
  Star
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { GoogleCampaign } from '@/redux/api/googleAdsApi'

interface GoogleAdPreviewModalProps {
  campaign: GoogleCampaign | null
  isOpen: boolean
  onClose: () => void
}

export const GoogleAdPreviewModal: React.FC<GoogleAdPreviewModalProps> = ({
  campaign,
  isOpen,
  onClose
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  if (!campaign) return null

  const creative = campaign.creative || {
    headlines: ['Siegfried Outreach Platform', 'Multi-Channel AI Automation'],
    descriptions: ['Automate outreach across WhatsApp, Telegram, Email & Socials with 99.4% delivery.'],
    finalUrl: 'https://siegfriedoutreach.com',
    displayPath1: 'platform',
    displayPath2: 'ai',
    businessName: 'Siegfried Outreach',
    sitelinks: [
      { text: 'Live Demo', description: 'See AI agents in action', url: 'https://siegfriedoutreach.com/demo' },
      { text: 'Pricing Plans', description: 'Transparent monthly tiers', url: 'https://siegfriedoutreach.com/pricing' }
    ],
    callouts: ['24/7 Priority Support', '99.4% Delivery', 'Official APIs']
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-6 bg-card rounded-3xl border-border/70 space-y-4">
        <DialogHeader className="pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              <span>Google Search SERP Ad Simulator</span>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDevice('desktop')}
                  className={cn('p-1 rounded-lg text-xs', device === 'desktop' ? 'bg-primary text-white' : 'text-muted-foreground')}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  className={cn('p-1 rounded-lg text-xs', device === 'mobile' ? 'bg-primary text-white' : 'text-muted-foreground')}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                QS: {campaign.qualityScore || 9}/10
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Google SERP Card Preview */}
        <div className={cn(
          'p-5 rounded-2xl border border-border/80 bg-white dark:bg-[#202124] text-neutral-900 dark:text-neutral-100 shadow-md space-y-2 font-sans select-none mx-auto',
          device === 'mobile' ? 'max-w-[340px]' : 'w-full'
        )}>
          {/* URL Header */}
          <div className="flex items-center gap-2 text-[11px] leading-tight">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              S
            </div>
            <div>
              <div className="flex items-center gap-1 font-bold text-xs text-neutral-800 dark:text-neutral-200">
                <span>{creative.businessName || 'Siegfried Outreach'}</span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Sponsored</span> • {creative.finalUrl} › {creative.displayPath1 || 'scale'}
              </div>
            </div>
          </div>

          {/* Clickable Blue Google Title */}
          <h3 className="text-base md:text-lg font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
            {creative.headlines.filter(Boolean).slice(0, 3).join(' | ')}
          </h3>

          {/* Description */}
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {creative.descriptions.filter(Boolean).join(' ')}
          </p>

          {/* Sitelinks */}
          {creative.sitelinks && creative.sitelinks.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
              {creative.sitelinks.slice(0, 4).map((sl, i) => (
                <div key={i} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <div className="text-xs font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer">
                    {sl.text}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                    {sl.description}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Callouts */}
          {creative.callouts && (
            <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              {creative.callouts.map((co, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span>•</span>
                  <span>{co}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" onClick={onClose} className="h-9 px-4 rounded-xl bg-primary text-white font-bold text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GoogleAdPreviewModal
