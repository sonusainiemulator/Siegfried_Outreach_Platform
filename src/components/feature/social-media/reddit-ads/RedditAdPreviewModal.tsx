'use client'

import React from 'react'
import {
  ExternalLink,
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark
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
import { RedditCampaign } from '@/redux/api/redditAdsApi'

interface RedditAdPreviewModalProps {
  campaign: RedditCampaign | null
  isOpen: boolean
  onClose: () => void
}

export const RedditAdPreviewModal: React.FC<RedditAdPreviewModalProps> = ({
  campaign,
  isOpen,
  onClose
}) => {
  if (!campaign) return null

  const creative = campaign.creative || {
    title: 'Siegfried Outreach Platform Demo',
    bodyMarkdown: 'Multi-channel automation for founders & developers.',
    callToAction: 'TRY_FREE',
    destinationUrl: 'https://siegfriedoutreach.com',
    authorHandle: 'u/you',
    flairText: '🛠️ Case Study',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-6 bg-card rounded-3xl border-border/70 space-y-4">
        <DialogHeader className="pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-bold text-title-color dark:text-white flex items-center gap-2">
              <span>Reddit Feed Post Simulator</span>
            </DialogTitle>
            <Badge variant="outline" className="text-[10px] font-mono">
              ID: {campaign.campaignId}
            </Badge>
          </div>
        </DialogHeader>

        {/* Reddit Post Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-md">
          {/* Subreddit Header */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FF4500] text-white flex items-center justify-center font-bold text-xs">
                r/
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-title-color dark:text-white font-mono">{campaign.targetSubreddits?.[0] || 'r/SaaS'}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">• Promoted by {creative.authorHandle}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">4 hours ago</span>
              </div>
            </div>
            <Badge variant="outline" className="text-[9px] bg-muted/60 font-mono">
              Promoted
            </Badge>
          </div>

          {/* Flair & Title */}
          <div className="space-y-1.5">
            {creative.flairText && (
              <Badge variant="outline" className="text-[9px] bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/30 font-semibold">
                {creative.flairText}
              </Badge>
            )}
            <h3 className="text-sm font-bold text-title-color dark:text-white leading-snug">
              {creative.title}
            </h3>
          </div>

          {/* Body text */}
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
            {creative.bodyMarkdown}
          </p>

          {/* Media Thumbnail */}
          {creative.thumbnailUrl && (
            <div className="rounded-xl overflow-hidden border border-border/60 max-h-48">
              <img src={creative.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Action Banner */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground truncate">
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#FF4500]" />
              <span className="truncate">{creative.destinationUrl.replace('https://', '')}</span>
            </div>
            <button
              type="button"
              className="px-4 py-1.5 rounded-full bg-[#FF4500] hover:bg-[#D93A00] text-white font-bold text-xs shadow-sm cursor-pointer shrink-0"
            >
              {creative.callToAction.replace('_', ' ')} ↗
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 pt-1 border-t border-border/30 text-xs text-muted-foreground font-semibold">
            <div className="flex items-center bg-muted/50 rounded-full px-2.5 py-1 gap-1.5">
              <ArrowBigUp className="w-4 h-4 text-[#FF4500] fill-[#FF4500]" />
              <span className="font-mono font-bold text-title-color dark:text-white">
                {(campaign.insights?.upvotes || 1840).toLocaleString()}
              </span>
              <ArrowBigDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center bg-muted/50 rounded-full px-2.5 py-1 gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{(campaign.insights?.comments || 294).toLocaleString()} Comments</span>
            </div>
            <div className="flex items-center bg-muted/50 rounded-full px-2.5 py-1 gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </div>
          </div>
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

export default RedditAdPreviewModal
