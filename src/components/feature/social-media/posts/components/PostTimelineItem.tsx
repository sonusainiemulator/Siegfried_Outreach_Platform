'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { platformColors, platformIcons } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { PostTimelineItemProps } from '@/types/components/socialMedia'
import { formatDate, getUploadPreviewUrl } from '@/utils'
import { format } from 'date-fns'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  ExternalLink,
  Globe,
  ImageIcon,
  RotateCcw,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRetrySocialPostMutation } from '@/redux/api/socialMediaApi'
import { toast } from 'sonner'

export const PostTimelineItem = ({
  post,
  onEdit,
  onDelete,
  onRetry,
  isRetrying: externalIsRetrying
}: PostTimelineItemProps) => {
  const { t } = useTranslation()
  const [retrySocialPostMutation, { isLoading: isMutationRetrying }] = useRetrySocialPostMutation()
  const [retryingTarget, setRetryingTarget] = useState<string | null>(null)

  const isRetrying = externalIsRetrying || isMutationRetrying

  const handleExecuteRetry = async (postId: string, socialAccountId?: string) => {
    const targetKey = socialAccountId || 'all'
    setRetryingTarget(targetKey)
    try {
      if (onRetry) {
        await onRetry(postId, socialAccountId)
      } else {
        const res = await retrySocialPostMutation({ id: postId, socialAccountId }).unwrap()
        toast.success(res?.message || 'Publishing retry initiated!')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to retry publishing.')
    } finally {
      setRetryingTarget(null)
    }
  }

  const statusLower = post.status?.toLowerCase() || 'published'
  const isPublished = statusLower === 'published' || statusLower === 'partial'
  const isScheduled = statusLower === 'scheduled'
  const isFailed = statusLower === 'failed'
  const isCancelled = statusLower === 'cancelled'

  // Resolve direct platform live link
  const getPlatformLiveUrl = (p: any) => {
    if (!p) return null
    if (p.postUrl) return p.postUrl
    if (p.url) return p.url
    const plat = p.platform?.toLowerCase()
    if (plat === 'facebook' && p.postId) return `https://www.facebook.com/${p.postId}`
    if (plat === 'wordpress') return 'https://christophersiegfried.com'
    if (plat === 'twitter' && p.postId) return `https://x.com/i/status/${p.postId}`
    if (plat === 'linkedin' && p.postId) return `https://www.linkedin.com/feed/update/${p.postId}`
    if (plat === 'reddit' && p.postId) return `https://reddit.com${p.postId}`
    if (plat === 'youtube' && p.postId) return `https://youtube.com/watch?v=${p.postId}`
    return null
  }

  const primaryLiveUrl =
    (post as any)?.postUrl ||
    (post as any)?.publishedUrl ||
    post.platforms?.map(getPlatformLiveUrl).find(Boolean) ||
    null

  // Robust date fallback for immediate/published posts
  const rawDate = post.scheduledDateTime || (post as any)?.publishedAt || post.createdAt
  const dateObj = rawDate ? new Date(rawDate) : new Date()
  const isValidDate = !isNaN(dateObj.getTime())
  const timeFormatted = isValidDate ? format(dateObj, 'hh:mm a') : '--:--'
  const dateFormatted = isValidDate ? formatDate(dateObj.toISOString()) : formatDate(new Date().toISOString())

  const mediaUrl = post.mediaUrls?.[0]

  return (
    <Card className="group relative rounded-2xl border-border/40 bg-card/60 backdrop-blur-md hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Media / Visual Area */}
          <div className="relative shrink-0 mx-auto lg:mx-0 w-full lg:w-44 h-44 lg:h-32 rounded-xl bg-muted/20 overflow-hidden border border-border/10 flex items-center justify-center">
            {mediaUrl ? (
              <Image
                src={getUploadPreviewUrl(mediaUrl)}
                alt={post.title || 'Post preview'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-muted/20 to-transparent p-4 text-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground/30 mb-1" />
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                  Text Post
                </span>
              </div>
            )}

            {/* Platform indicator badge on thumbnail */}
            {post.platforms?.[0] && (() => {
              const platformKey = post.platforms[0].platform?.toLowerCase() || ''
              const Icon = platformIcons[platformKey] || Globe
              const iconColor = platformColors[platformKey] || 'text-primary'

              return (
                <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-card/90 backdrop-blur-md shadow-md border border-border/20 z-10">
                  <Icon className={cn('w-3.5 h-3.5', iconColor)} />
                </div>
              )
            })()}
          </div>

          {/* Content & Actions */}
          <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
            {/* Top Bar: Badges + Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status Badge */}
                <Badge
                  className={cn(
                    'text-xs font-semibold px-2.5 py-0.5 rounded-md border-none flex items-center gap-1.5',
                    isPublished && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                    isScheduled && 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                    isFailed && 'bg-destructive/15 text-destructive',
                    isCancelled && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isPublished ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isScheduled ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : isFailed ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  )}
                  <span className="capitalize">
                    {isPublished
                      ? statusLower === 'partial'
                        ? 'Published (Live)'
                        : 'Published'
                      : post.status}
                  </span>
                </Badge>

                {/* Date & Time */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Calendar className="w-3.5 h-3.5 text-primary/60" />
                  <span>{dateFormatted}</span>
                  <span className="opacity-40">•</span>
                  <Clock className="w-3.5 h-3.5 text-primary/60" />
                  <span className="font-mono">{timeFormatted}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Direct Live Link Button */}
                {isPublished && primaryLiveUrl && (
                  <a
                    href={primaryLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
                    title="Open live post in new tab"
                  >
                    <span>View Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {(isFailed || statusLower === 'partial' || post.platforms?.some((p: any) => p.status === 'failed')) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 hover:text-amber-500 transition-all text-xs font-semibold gap-1.5 shadow-xs"
                    onClick={() => handleExecuteRetry(post.id)}
                    disabled={isRetrying}
                    title="Retry publishing failed post"
                  >
                    <RotateCcw className={cn('w-3.5 h-3.5', isRetrying && retryingTarget === 'all' && 'animate-spin')} />
                    <span>Retry</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg border border-border/20 hover:bg-primary/10 hover:text-primary transition-all"
                  asChild
                  title="Edit post"
                >
                  <Link href={`${ROUTES.SOCIAL_MEDIA.CREATE_POST}?edit=${post.id}`}>
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg border border-border/20 hover:bg-destructive/10 hover:text-destructive transition-all"
                  onClick={() => onDelete(post.id)}
                  title="Delete post"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Title & Body */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-title-color dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-1">
                {post.title}
              </h3>
              <p className="text-sm text-subtitle-color font-normal opacity-75 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Failure Error Alert if present */}
            {(isFailed || statusLower === 'partial') && post.platforms?.some((p: any) => p.error) && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
                <div className="min-w-0 space-y-0.5">
                  {post.platforms.filter((p: any) => p.error).map((p: any, i: number) => (
                    <p key={i} className="line-clamp-2 text-xs">
                      <span className="font-semibold capitalize">{p.platform || p.accountName}:</span> {p.error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Platforms & Live Links Footer Row */}
            {post.platforms && post.platforms.length > 0 && (
              <div className="pt-2 border-t border-border/10 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Channels:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {post.platforms.map((platformItem, idx) => {
                    const platformKey = platformItem.platform?.toLowerCase() || ''
                    const Icon = platformIcons[platformKey] || Globe
                    const iconColor = platformColors[platformKey] || 'text-primary'
                    const liveUrl = getPlatformLiveUrl(platformItem)
                    const pStatus = platformItem.status?.toLowerCase() || ''
                    const isSuccess = pStatus === 'published' || (!pStatus && isPublished)
                    const channelAccountId = platformItem.id || (platformItem as any).socialAccountId
                    const isRetryingThisChannel = isRetrying && retryingTarget === channelAccountId

                    return liveUrl && isSuccess ? (
                      <a
                        key={idx}
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted/40 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-border/20 transition-all hover:scale-105"
                        title={`Open live post on ${platformItem.platform}: ${platformItem.accountName || ''}`}
                      >
                        <Icon className={cn('w-3.5 h-3.5', iconColor)} />
                        <span className="capitalize">{platformItem.platform}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      <div
                        key={idx}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border',
                          pStatus === 'failed'
                            ? 'bg-destructive/10 text-destructive border-destructive/25'
                            : 'bg-muted/30 text-muted-foreground border-border/10'
                        )}
                        title={
                          platformItem.error
                            ? `Failed: ${platformItem.error}`
                            : `${platformItem.platform}: ${platformItem.accountName || ''}`
                        }
                      >
                        <Icon className={cn('w-3.5 h-3.5', pStatus === 'failed' ? 'text-destructive' : iconColor)} />
                        <span className="capitalize">{platformItem.platform}</span>
                        {pStatus === 'failed' && (
                          <div className="flex items-center gap-1 ml-0.5">
                            <span className="text-[10px] text-destructive font-mono font-bold">Failed</span>
                            <button
                              type="button"
                              className="hover:bg-destructive/20 rounded p-0.5 text-destructive transition-colors flex items-center justify-center cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleExecuteRetry(post.id, channelAccountId)
                              }}
                              title={platformItem.error ? `Retry: ${platformItem.error}` : 'Retry channel'}
                              disabled={isRetrying}
                            >
                              <RotateCcw className={cn('w-3 h-3', isRetryingThisChannel && 'animate-spin')} />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
