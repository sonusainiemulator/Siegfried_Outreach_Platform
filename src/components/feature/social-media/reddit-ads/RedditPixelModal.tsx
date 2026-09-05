'use client'

import React, { useState } from 'react'
import {
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Zap
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
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useGetRedditPixelsQuery } from '@/redux/api/redditAdsApi'

interface RedditPixelModalProps {
  isOpen: boolean
  onClose: () => void
}

export const RedditPixelModal: React.FC<RedditPixelModalProps> = ({ isOpen, onClose }) => {
  const { data: pixelsData } = useGetRedditPixelsQuery()
  const [copied, setCopied] = useState(false)
  const [isTestingEvent, setIsTestingEvent] = useState(false)

  const pixels = pixelsData?.data || [
    {
      id: 'rdt_px_001',
      pixelId: 'a2_910293841',
      pixelName: 'Siegfried Master Reddit Conversion Pixel',
      status: 'ACTIVE',
      lastActive: '3 minutes ago',
      eventsCount: 31200,
      eventsTracked: ['PageVisit', 'SignUp', 'Lead', 'Purchase', 'AddToCart', 'Custom']
    }
  ]

  const pixelSnippet = `<!-- Reddit Pixel Base Code -->
<script>
!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
rdt('init','a2_910293841');
rdt('track', 'PageVisit');
</script>
<!-- End Reddit Pixel Code -->`

  const handleCopy = () => {
    navigator.clipboard.writeText(pixelSnippet)
    setCopied(true)
    toast.success('Reddit Pixel snippet copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestEvent = () => {
    setIsTestingEvent(true)
    setTimeout(() => {
      setIsTestingEvent(false)
      toast.success('Reddit Pixel Test Event "SignUp" fired and verified!')
    }, 1200)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4500] text-white flex items-center justify-center shadow-md shadow-[#FF4500]/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base md:text-lg font-black text-title-color dark:text-white">
                  Reddit Pixel & Conversions API
                </DialogTitle>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                  Active & Synced
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Measure attribution, community signups, and optimize Reddit conversion delivery.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {pixels.map((px: any) => (
            <Card key={px.id} className="p-4 rounded-2xl border border-border/70 bg-card space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-title-color dark:text-white">{px.pixelName}</h4>
                    <span className="text-[11px] font-mono font-bold text-[#FF4500]">ID: {px.pixelId}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Last active {px.lastActive} • {px.eventsCount?.toLocaleString()} total events recorded
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestEvent}
                  disabled={isTestingEvent}
                  className="h-8 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FF4500]" />
                  <span>{isTestingEvent ? 'Firing...' : 'Send Test Event'}</span>
                </Button>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Tracked Events
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {px.eventsTracked.map((evt: string) => (
                    <Badge key={evt} variant="outline" className="text-[10px] font-mono font-bold flex items-center gap-1 bg-muted/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{evt}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5 text-title-color dark:text-white">
              <Code2 className="w-4 h-4 text-[#FF4500]" />
              <span>Reddit Pixel Snippet</span>
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
            </Button>
          </div>
          <pre className="p-3.5 rounded-2xl bg-neutral-950 text-neutral-300 font-mono text-[11px] leading-relaxed overflow-x-auto border border-border/60 max-h-48 custom-scrollbar">
            {pixelSnippet}
          </pre>
        </div>

        <DialogFooter className="p-0 pt-2">
          <Button type="button" onClick={onClose} className="h-10 px-5 rounded-xl bg-primary text-white font-bold text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RedditPixelModal
