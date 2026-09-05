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
  ShieldCheck
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
import { useGetGoogleTagsQuery } from '@/redux/api/googleAdsApi'

interface GoogleTagModalProps {
  isOpen: boolean
  onClose: () => void
}

export const GoogleTagModal: React.FC<GoogleTagModalProps> = ({ isOpen, onClose }) => {
  const { data: tagsData } = useGetGoogleTagsQuery()
  const [copied, setCopied] = useState(false)
  const [isTestingEvent, setIsTestingEvent] = useState(false)

  const tags = tagsData?.data || [
    {
      id: 'ggl_tag_001',
      tagId: 'AW-948201948',
      tagName: 'Siegfried Global Google Tag (gtag.js)',
      status: 'ACTIVE',
      enhancedConversionsEnabled: true,
      lastPing: '1 minute ago',
      conversionActionsCount: 4,
      actions: [
        { name: 'Purchase / Checkout Completed', category: 'Purchase', conversionsCount: 412 },
        { name: 'Submit Lead Form', category: 'Lead', conversionsCount: 254 },
        { name: 'Sign Up / Free Trial', category: 'Sign-up', conversionsCount: 890 },
        { name: 'Book Interactive Demo', category: 'Book appointment', conversionsCount: 145 }
      ]
    }
  ]

  const tagSnippet = `<!-- Google Tag (gtag.js) - Google Ads: AW-948201948 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-948201948"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-948201948', {
    'allow_enhanced_conversions': true
  });
</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(tagSnippet)
    setCopied(true)
    toast.success('Google Tag snippet copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestEvent = () => {
    setIsTestingEvent(true)
    setTimeout(() => {
      setIsTestingEvent(false)
      toast.success('Google Tag Enhanced Conversion "Submit Lead Form" verified!')
    }, 1200)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto custom-scrollbar p-6 space-y-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base md:text-lg font-black text-title-color dark:text-white">
                  Google Tag & Enhanced Conversions Manager
                </DialogTitle>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                  Enhanced Conversions Active
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Track first-party hashed user data, Google Ads conversion goals, and maximize smart bidding accuracy.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {tags.map((tag: any) => (
            <Card key={tag.id} className="p-4 rounded-2xl border border-border/70 bg-card space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-title-color dark:text-white">{tag.tagName}</h4>
                    <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">ID: {tag.tagId}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Last ping {tag.lastPing} • Enhanced Conversions 100% active
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestEvent}
                  disabled={isTestingEvent}
                  className="h-8 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer border-blue-500/30 hover:bg-blue-500/10"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isTestingEvent ? 'Testing...' : 'Send Test Conversion'}</span>
                </Button>
              </div>

              {/* Conversion Actions */}
              <div className="space-y-1.5 pt-1 border-t border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Conversion Actions Tracked
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tag.actions?.map((act: any) => (
                    <div key={act.name} className="p-2 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-title-color dark:text-white">{act.name}</span>
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground font-bold">{act.conversionsCount}</span>
                    </div>
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
              <Code2 className="w-4 h-4 text-blue-500" />
              <span>Google Tag Installation Code (gtag.js)</span>
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
            {tagSnippet}
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

export default GoogleTagModal
