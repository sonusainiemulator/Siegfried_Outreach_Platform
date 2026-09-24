'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { RecentPostCardProps } from '@/types/components/socialMedia'
import { formatDate, getUploadPreviewUrl } from '@/utils'
import { platformColors, platformIcons } from '@/data/socialMedia'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  ImageIcon,
  Play,
  Settings,
  X,
  XCircle,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const RecentPostCard = ({ post, onEdit, onDelete, canManage }: RecentPostCardProps) => {
  const { t } = useTranslation()
  const statusLower = post.status?.toLowerCase()
  const isScheduled = statusLower === 'scheduled'
  const isFailed = statusLower === 'failed'
  const isCancelled = statusLower === 'cancelled'
  const isPublished = statusLower === 'published' || statusLower === 'partial'

  const getPlatformUrl = (p: any) => {
    if (!p) return null
    // Never treat sandbox simulation or generic business root as a verified live post URL
    if (
      p.postId?.startsWith('gmb_sandbox_') ||
      p.postUrl === 'https://business.google.com/' ||
      p.url === 'https://business.google.com/'
    ) {
      return null
    }
    if (p.postUrl) return p.postUrl
    if (p.url) return p.url
    const plat = p.platform?.toLowerCase()
    if (plat === 'facebook' && p.postId) return `https://www.facebook.com/${p.postId}`
    if (plat === 'wordpress') return 'https://christophersiegfriedoutreach.com'
    if (plat === 'twitter' && p.postId) return `https://x.com/i/status/${p.postId}`
    if (plat === 'linkedin' && p.postId) return `https://www.linkedin.com/feed/update/${p.postId}`
    if (plat === 'reddit' && p.postId) return `https://reddit.com${p.postId}`
    if (plat === 'youtube' && p.postId) return `https://youtube.com/watch?v=${p.postId}`
    return null
  }

  // Extract direct platform URL (e.g. WordPress blog URL, Facebook, Twitter URL, YouTube link)
  const directLink =
    (post as any)?.postUrl ||
    (post as any)?.publishedUrl ||
    post.platforms?.map(getPlatformUrl).find(Boolean) ||
    null

  const isWordPress = post.platforms?.some(
    (p: any) => p.platform?.toLowerCase() === 'wordpress'
  )

  return (
    <Card
      key={post.id}
      className={cn(
        'rounded-2xl border-border/40 bg-card/50 backdrop-blur-md overflow-hidden transition-all duration-300 snap-start group/card hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between',
        isScheduled && 'hover:border-primary/50',
        isFailed && 'hover:border-destructive/50',
        isCancelled && 'hover:border-slate-500/50',
        isPublished && 'hover:border-emerald-500/40'
      )}
    >
      <div>
        <div className="relative aspect-video w-full bg-muted/20 overflow-hidden flex items-center justify-center">
          {post.mediaUrls?.[0] ? (
            Boolean(post.mediaUrls[0] && /\.(mp4|webm|mov|ogg|m4v|avi|mkv)$/i.test(post.mediaUrls[0])) ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  src={getUploadPreviewUrl(post.mediaUrls[0])}
                  className="w-full h-full object-cover opacity-80"
                  muted
                  preload="metadata"
                />
                <div className="absolute w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-none shadow-md">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
            ) : (
              <Image
                src={getUploadPreviewUrl(post.mediaUrls[0])}
                alt="Post preview"
                fill
                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                unoptimized
              />
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-20 bg-gradient-to-br from-primary/5 to-transparent">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex items-center justify-center gap-2.5">
            {isPublished && directLink && (
              <a
                href={directLink}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 shadow-2xl text-white font-bold text-xs transition-all hover:scale-105 flex items-center gap-1.5"
                title={isWordPress ? 'Open Live WordPress Blog Post' : 'Open Published Post in New Tab'}
                onClick={(e) => e.stopPropagation()}
              >
                <span>{isWordPress ? 'View Blog' : 'View Live'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {!isPublished && canManage && (
              <>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-lg bg-primary! shadow-2xl text-white! transition-all hover:scale-110 cursor-pointer"
                  onClick={(e) => onEdit(post.id, e)}
                  title="Edit post"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                {!isCancelled && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-10 w-10 rounded-lg shadow-2xl hover:scale-110 transition-all cursor-pointer"
                    onClick={(e) => onDelete(post.id, e)}
                    title="Delete post"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Header Row: Date & Platform Icons */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-subtitle-color flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary/60" />
              {formatDate(post.createdAt)}
            </span>
            <div className="flex gap-2 transition-all items-center">
              {post.platforms?.slice(0, 4).map((p: any, i: number) => {
                const platformKey = p.platform?.toLowerCase() || ''
                const Icon = platformIcons[platformKey] || Globe
                const iconColor = platformColors[platformKey] || 'text-primary'
                const itemUrl = getPlatformUrl(p)
                const isSuccess = p.status === 'published' || (!p.status && isPublished)

                return itemUrl && isSuccess ? (
                  <a
                    key={i}
                    href={itemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm border border-border/10',
                      'bg-white dark:bg-muted/40 hover:scale-110 relative group/icon cursor-pointer'
                    )}
                    title={`Click to open published ${p.platform ? p.platform.toUpperCase() : 'post'}: ${p.accountName || ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon className={cn('w-4 h-4', iconColor)} />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-background" />
                  </a>
                ) : (
                  <div
                    key={i}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm border border-border/10',
                      'bg-white dark:bg-muted/40 hover:scale-110',
                      p.status === 'failed' && 'opacity-60 border-destructive/30'
                    )}
                    title={`${p.platform ? p.platform.toUpperCase() : 'Social'}: ${p.accountName || ''}${p.status === 'failed' ? ' (Failed)' : ''}`}
                  >
                    <Icon className={cn('w-4 h-4', iconColor)} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Status Badge + Direct Link Access Button */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Badge
              className={cn(
                'text-xs font-medium px-3 h-6 flex items-center gap-1.5 leading-none transition-all border-none',
                isPublished && 'bg-emerald-500 text-white',
                isScheduled && 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
                isFailed && 'bg-destructive/10 text-destructive border border-border-destructive',
                isCancelled && 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
              )}
            >
              {isPublished ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : isFailed ? (
                <AlertCircle className="w-3 h-3" />
              ) : isCancelled ? (
                <XCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {isPublished ? (statusLower === 'partial' ? 'Published (Live)' : t('social_published')) : isFailed ? t('failed') : isCancelled ? t('cancelled') : t('social_scheduled')}
            </Badge>

            {/* Direct Published Link Button */}
            {isPublished && directLink && (
              <a
                href={directLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all shadow-xs"
                title={isWordPress ? 'Open Live WordPress Blog' : 'Open Live Link'}
                onClick={(e) => e.stopPropagation()}
              >
                <span>{isWordPress ? 'Open Blog' : 'Direct Link'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* GMB API Action Required Warning */}
          {post.platforms?.some((p: any) => p.platform === 'google' && p.status === 'failed') && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2 animate-fade-in text-left">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-destructive flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Google Business Profile Action Required (Project 203941120936)
                </span>
                <Link
                  href="/social-media/logs"
                  className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  Inspect Logs →
                </Link>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                If you already enabled the API in Google Cloud Console, you <strong>must reconnect</strong> your Google Account so your live storefront locations are fetched. Also verify both required Google APIs are enabled:
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <a
                  href="https://console.developers.google.com/apis/api/mybusinessaccountmanagement.googleapis.com/overview?project=203941120936"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline bg-background/80 px-2 py-1 rounded-md border border-border/40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>1. Account Management API</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href="https://console.developers.google.com/apis/api/mybusinessbusinessinformation.googleapis.com/overview?project=203941120936"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline bg-background/80 px-2 py-1 rounded-md border border-border/40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>2. Business Information API</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <Link
                  href="/social-media/channels"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>🔄 Reconnect in Channels</span>
                </Link>
              </div>
            </div>
          )}

          {/* Post Title & Excerpt */}
          <div className="space-y-1.5 min-w-0">
            <h4 className="font-medium text-lg mb-0 group-hover/card:text-primary transition-colors tracking-tight line-clamp-1">
              {post.title}
            </h4>
            <p className="text-sm text-subtitle-color font-medium line-clamp-2 leading-relaxed opacity-70">
              {post.content}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default RecentPostCard

