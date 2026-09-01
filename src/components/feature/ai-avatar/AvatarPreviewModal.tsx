'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AvatarItem } from '@/redux/api/avatarApi'
import { Download, Copy, Check, Play, Pause, Volume2, Sparkles, Video as VideoIcon, Calendar, User } from 'lucide-react'
import { toast } from 'sonner'

interface AvatarPreviewModalProps {
  item: AvatarItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUseInVideo?: (item: AvatarItem) => void
}

export const AvatarPreviewModal: React.FC<AvatarPreviewModalProps> = ({
  item,
  open,
  onOpenChange,
  onUseInVideo,
}) => {
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speakingProgress, setSpeakingProgress] = useState(0)

  useEffect(() => {
    if (!open) {
      window.speechSynthesis?.cancel()
      setIsPlaying(false)
      setSpeakingProgress(0)
    }
  }, [open])

  if (!item) return null

  const isVideo = item.type === 'avatar_video'
  const mediaUrl = item.content?.startsWith('http') || item.content?.startsWith('/') 
    ? item.content 
    : item.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mediaUrl)
    setCopied(true)
    toast.success('Media URL copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = mediaUrl
    a.download = `${item.title || 'ai-avatar'}.${isVideo ? 'mp4' : 'png'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Download started')
  }

  const handlePlaySpeech = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Speech synthesis not supported on this browser')
      return
    }

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setSpeakingProgress(0)
      return
    }

    const scriptText = item.metadata?.script || item.prompt
    if (!scriptText) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(scriptText)
    
    if (item.metadata?.speechRate) utterance.rate = item.metadata.speechRate
    if (item.metadata?.speechPitch) utterance.pitch = item.metadata.speechPitch

    const voices = window.speechSynthesis.getVoices()
    if (item.metadata?.voice?.language) {
      const match = voices.find(v => v.lang.toLowerCase().includes(item.metadata?.voice?.language?.slice(0, 2).toLowerCase() || ''))
      if (match) utterance.voice = match
    }

    setIsPlaying(true)
    utterance.onend = () => {
      setIsPlaying(false)
      setSpeakingProgress(0)
    }
    utterance.onerror = () => {
      setIsPlaying(false)
      setSpeakingProgress(0)
    }

    window.speechSynthesis.speak(utterance)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border border-border shadow-2xl rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-2 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                {isVideo ? <VideoIcon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold truncate max-w-md">
                  {item.title || 'AI Avatar Preview'}
                </DialogTitle>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  {item.metadata?.style && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground font-medium uppercase text-[10px] tracking-wider">
                      {item.metadata.style}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Media Preview Stage */}
          <div className="md:col-span-7 bg-black/90 p-6 flex flex-col items-center justify-center min-h-[380px] relative group overflow-hidden">
            <div 
              className={`relative max-w-full max-h-[420px] rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-300 ${
                isPlaying ? 'scale-[1.02] shadow-primary/30' : ''
              }`}
              style={{
                backgroundColor: item.metadata?.background?.color || '#000',
              }}
            >
              <img
                src={mediaUrl}
                alt={item.title}
                className={`max-h-[400px] w-auto object-contain transition-all duration-300 ${
                  isPlaying ? 'brightness-105 contrast-105 animate-pulse' : ''
                }`}
              />

              {/* Talking Lip-Sync Animation Overlay Indicator */}
              {isPlaying && (
                <div className="absolute inset-0 bg-linear-to-t from-primary/30 via-transparent to-transparent flex flex-col items-center justify-end pb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-primary/40 text-primary text-xs font-semibold animate-bounce">
                    <Volume2 className="w-3.5 h-3.5 animate-spin" />
                    Speaking Script...
                  </div>
                </div>
              )}
            </div>

            {/* Video / Speech Controls Overlay */}
            {isVideo && (
              <div className="mt-4 flex items-center gap-3">
                <Button
                  onClick={handlePlaySpeech}
                  size="sm"
                  className={`rounded-full px-4 gap-2 shadow-lg transition-all ${
                    isPlaying ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  {isPlaying ? 'Pause Voice' : 'Play Talking Preview'}
                </Button>
              </div>
            )}
          </div>

          {/* Details & Action Panel */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-card">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {isVideo ? 'Speech Script' : 'Prompt Description'}
                </h4>
                <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 text-sm text-foreground leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
                  {item.metadata?.script || item.prompt}
                </div>
              </div>

              {/* Metadata Tags */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {item.metadata?.aspectRatio && (
                  <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/40">
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Aspect Ratio</span>
                    <span className="font-semibold text-foreground">{item.metadata.aspectRatio}</span>
                  </div>
                )}
                {item.metadata?.voice?.name && (
                  <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/40">
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Voice Model</span>
                    <span className="font-semibold text-foreground truncate block">{item.metadata.voice.name}</span>
                  </div>
                )}
                {item.metadata?.expression && (
                  <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/40">
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Expression</span>
                    <span className="font-semibold text-foreground capitalize">{item.metadata.expression}</span>
                  </div>
                )}
                {item.metadata?.lighting && (
                  <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/40">
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Lighting</span>
                    <span className="font-semibold text-foreground capitalize">{item.metadata.lighting}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-border/60">
              {!isVideo && onUseInVideo && (
                <Button
                  onClick={() => {
                    onUseInVideo(item)
                    onOpenChange(false)
                  }}
                  className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white font-semibold rounded-xl gap-2 shadow-md cursor-pointer"
                >
                  <VideoIcon className="w-4 h-4" />
                  Make this Avatar Talk
                </Button>
              )}

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 rounded-xl gap-2 border-border hover:bg-secondary cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="flex-1 rounded-xl gap-2 border-border hover:bg-secondary cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
