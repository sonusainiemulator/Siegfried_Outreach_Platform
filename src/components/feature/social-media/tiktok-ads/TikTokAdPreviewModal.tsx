'use client'

import React from 'react'
import {
  Smartphone,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TikTokCampaign } from '@/redux/api/tiktokAdsApi'

interface TikTokAdPreviewModalProps {
  campaign: TikTokCampaign | null
  isOpen: boolean
  onClose: () => void
}

export const TikTokAdPreviewModal: React.FC<TikTokAdPreviewModalProps> = ({
  campaign,
  isOpen,
  onClose
}) => {
  if (!campaign) return null

  const creative = campaign.creative || {
    hook: 'Stop scrolling! Viral demo in action...',
    caption: 'Discover the next generation platform ⚡',
    callToAction: 'SHOP_NOW',
    soundTitle: 'Original Sound - Siegfried Beats',
    hashtags: ['#TikTokMadeMeBuyIt', '#Viral'],
    brandHandle: '@siegfried_outreach',
    videoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  }

  const ctaLabel =
    creative.callToAction === 'SHOP_NOW'
      ? 'Shop Now 🛍️'
      : creative.callToAction === 'SIGN_UP'
        ? 'Sign Up ✍️'
        : creative.callToAction === 'INSTALL_NOW'
          ? 'Download App 📲'
          : 'Learn More ⚡'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-card rounded-3xl border-border/70 flex flex-col items-center">
        <DialogHeader className="w-full flex flex-row items-center justify-between pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#FE2C55]" />
            <DialogTitle className="text-sm font-bold text-title-color dark:text-white">
              TikTok Live Ad Simulator
            </DialogTitle>
          </div>
          {campaign.isSparkAd && (
            <Badge variant="outline" className="bg-[#25F4EE]/10 text-[#00c8c2] dark:text-[#25F4EE] border-[#25F4EE]/40 text-[9px] font-black">
              🎵 Spark Ad
            </Badge>
          )}
        </DialogHeader>

        {/* Device Frame */}
        <div className="w-[300px] h-[560px] rounded-[36px] bg-[#000000] border-4 border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none my-2">
          {/* Background Media */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage: `url(${creative.videoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          </div>

          {/* Top Bar */}
          <div className="relative z-10 pt-3 px-4 flex items-center justify-between text-white text-[11px] font-bold">
            <span className="text-[10px] text-white/70 font-mono">LIVE 🔴</span>
            <div className="flex items-center gap-3">
              <span className="text-white/60">Following</span>
              <span className="text-white border-b-2 border-white pb-0.5 font-extrabold">For You</span>
            </div>
            <span className="text-[10px] text-white/70 font-mono">🔍</span>
          </div>

          {/* Viral Hook Banner */}
          <div className="relative z-10 px-4 mt-6">
            <div className="bg-black/75 backdrop-blur-md text-white font-black text-xs p-2.5 rounded-xl border border-white/20 shadow-lg text-center leading-tight">
              {creative.hook || '🔥 Viral TikTok Hook in Action'}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right Floating Actions */}
          <div className="absolute right-2.5 bottom-20 z-10 flex flex-col items-center gap-3.5 text-white">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] p-[2px] shadow-md">
                <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-black">
                  SO
                </div>
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FE2C55] text-white flex items-center justify-center text-[11px] font-bold">
                +
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <span className="text-[9px] font-bold mt-0.5">
                {(campaign.insights?.likes || 42800).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[9px] font-bold mt-0.5">
                {(campaign.insights?.comments || 1120).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-amber-400">
                <Bookmark className="w-5 h-5 fill-amber-400" />
              </div>
              <span className="text-[9px] font-bold mt-0.5">5.2k</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold mt-0.5">
                {(campaign.insights?.shares || 2400).toLocaleString()}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
              <div className="w-3 h-3 rounded-full bg-[#FE2C55]" />
            </div>
          </div>

          {/* Bottom Info & Pulsing CTA */}
          <div className="relative z-10 p-3.5 pt-0 space-y-2 text-white">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs tracking-tight">
                {creative.brandHandle || '@siegfried_outreach'}
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#25F4EE] text-black flex items-center justify-center text-[9px] font-black">
                ✓
              </span>
              <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 bg-white/20 text-white border-none font-bold">
                Sponsored
              </Badge>
            </div>

            <p className="text-[10px] text-white/90 line-clamp-2 leading-tight">
              {creative.caption}
            </p>

            <div className="flex items-center gap-1 text-[9px] text-[#25F4EE] font-bold font-mono">
              <span>{(creative.hashtags || ['#TikTokMadeMeBuyIt']).slice(0, 3).join(' ')}</span>
            </div>

            {/* Glowing CTA Button */}
            <div className="pt-1">
              <button
                type="button"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#FE2C55] via-[#ff3b68] to-[#25F4EE] text-white font-black text-xs shadow-lg shadow-[#FE2C55]/40 flex items-center justify-center gap-1.5 transition-transform animate-pulse"
              >
                <span>{ctaLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-white/70 pt-0.5 truncate">
              <Music2 className="w-3 h-3 text-[#25F4EE] shrink-0" />
              <span className="truncate">{creative.soundTitle || 'Trending Sound'}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="w-full flex items-center justify-between pt-2">
          <span className="text-[11px] text-muted-foreground font-mono">
            ID: {campaign.campaignId}
          </span>
          <Button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl bg-primary text-white font-bold text-xs"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TikTokAdPreviewModal
