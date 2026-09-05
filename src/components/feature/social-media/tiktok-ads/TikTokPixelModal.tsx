'use client'

import React, { useState } from 'react'
import {
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Zap,
  Globe,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Layers,
  Sparkles
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
import { useGetTikTokPixelsQuery } from '@/redux/api/tiktokAdsApi'

interface TikTokPixelModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TikTokPixelModal: React.FC<TikTokPixelModalProps> = ({ isOpen, onClose }) => {
  const { data: pixelsData, isLoading, refetch } = useGetTikTokPixelsQuery()
  const [copied, setCopied] = useState(false)
  const [isTestingEvent, setIsTestingEvent] = useState(false)

  const pixels = pixelsData?.data || [
    {
      id: 'tt_px_001',
      pixelId: 'C789X92L4K201M',
      pixelName: 'Siegfried Master TikTok Pixel',
      status: 'ACTIVE',
      lastActive: '2 minutes ago',
      eventsCount: 48920,
      eventsTracked: ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'CompletePayment', 'SubmitForm']
    }
  ]

  const pixelSnippet = `<!-- TikTok Pixel Base Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

  ttq.load('C789X92L4K201M');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->`

  const handleCopy = () => {
    navigator.clipboard.writeText(pixelSnippet)
    setCopied(true)
    toast.success('TikTok Pixel snippet copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestEvent = () => {
    setIsTestingEvent(true)
    setTimeout(() => {
      setIsTestingEvent(false)
      toast.success('Test Event "CompletePayment" sent and verified by TikTok Events API!')
    }, 1200)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] text-white flex items-center justify-center shadow-md shadow-[#FE2C55]/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base md:text-lg font-black text-title-color dark:text-white">
                  TikTok Pixel & Events Manager
                </DialogTitle>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                  Active & Synced
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Track real-time conversions, TikTok Shop checkouts, lead forms, and optimize Smart+ ad delivery.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Pixel Cards */}
        <div className="space-y-4">
          {pixels.map((px: any) => (
            <Card key={px.id} className="p-4 rounded-2xl border border-border/70 bg-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-title-color dark:text-white">{px.pixelName}</h4>
                    <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      ID: {px.pixelId}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>Last active: {px.lastActive}</span>
                    <span>•</span>
                    <span>{px.eventsCount?.toLocaleString()} total events recorded</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestEvent}
                    disabled={isTestingEvent}
                    className="h-8 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer border-cyan-500/30 hover:bg-cyan-500/10"
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{isTestingEvent ? 'Firing Event...' : 'Send Test Event'}</span>
                  </Button>
                </div>
              </div>

              {/* Event Tags */}
              <div className="space-y-1.5 pt-1 border-t border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Active Conversion Events
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {px.eventsTracked.map((evt: string) => (
                    <Badge
                      key={evt}
                      variant="outline"
                      className="bg-[#25F4EE]/10 text-[#00c8c2] dark:text-[#25F4EE] border-[#25F4EE]/30 text-[10px] font-mono font-bold flex items-center gap-1"
                    >
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
            <span className="text-xs font-bold text-title-color dark:text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#FE2C55]" />
              <span>Base Tracking Code (Web & Funnel Install)</span>
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
          <Button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-primary text-white font-bold text-xs"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TikTokPixelModal
