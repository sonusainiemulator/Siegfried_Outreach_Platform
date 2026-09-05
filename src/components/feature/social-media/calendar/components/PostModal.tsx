'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { platformBgColors, platformColors, platformIcons } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { PostModalProps } from '@/types'
import { formatDate, getUploadPreviewUrl } from '@/utils'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  RotateCcw,
  Trash,
  XCircle
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRetrySocialPostMutation } from '@/redux/api/socialMediaApi'
import { toast } from 'sonner'

const PostModal = ({
  isOpen,
  onClose,
  post,
  posts,
  onEdit,
  onDelete,
  onRetry,
  isRetrying: externalIsRetrying
}: PostModalProps) => {
  const allPosts = posts && posts.length > 0 ? posts : post ? [post] : []

  const initialIndex =
    allPosts.length > 0 && post
      ? Math.max(
        0,
        allPosts.findIndex((p) => p.id === post.id),
      )
      : 0

  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [mediaIndex, setMediaIndex] = useState(0)
  const [retryingTarget, setRetryingTarget] = useState<string | null>(null)
  const [retrySocialPostMutation, { isLoading: isMutationRetrying }] = useRetrySocialPostMutation()
  const { t } = useTranslation()
  const current: any = allPosts[currentIndex]

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

  const failedPlatforms = current?.platforms?.filter((p: any) => p.status === 'failed') || []
  const hasFailed = current?.status === 'failed' || current?.status === 'partial' || failedPlatforms.length > 0

  // Sync index when initialIndex changes (e.g. modal re-opens with different post)
  useEffect(() => {
    setTimeout(() => {
      setCurrentIndex(initialIndex)
      setMediaIndex(0)
    }, 100)
  }, [initialIndex])

  useEffect(() => {
    setTimeout(() => {
      setMediaIndex(0)
    }, 100)
  }, [currentIndex])


  const isVideoUrl = (url?: string) => Boolean(url && /\.(mp4|webm|mov|ogg|m4v|avi|mkv)$/i.test(url))

  useEffect(() => {
    const urls = current?.mediaUrls || []
    if (!isOpen || urls.length <= 1) return
    if (isVideoUrl(urls[mediaIndex])) return

    const interval = setInterval(() => {
      setMediaIndex((prev) => (prev + 1) % urls.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isOpen, currentIndex, mediaIndex, current?.mediaUrls])

  if (allPosts.length === 0) return null

  const total = allPosts.length
  const hasMultiple = total > 1

  const goPrev = () => setCurrentIndex((i) => (i - 1 + total) % total)
  const goNext = () => setCurrentIndex((i) => (i + 1) % total)

  return (
    <Dialog key={post?.id ?? 'none'} open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! dark:bg-modal-bg-color backdrop-blur-3xl border-border/40 rounded-border-radius p-0! overflow-hidden shadow-2xl">
        <>
          <DialogHeader className="p-4 sm:p-6 border-b border-border/10 pb-0!">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={cn(
                      'text-[8px] md:text-[9px] font-black uppercase px-2 md:px-3 h-5 md:h-6 border-none',
                      current.status === 'published'
                        ? 'bg-emerald-500 text-white'
                        : current.status === 'failed'
                          ? 'bg-destructive text-white'
                          : current.status === 'cancelled'
                            ? 'bg-slate-500/70 text-white'
                            : current.status === 'draft'
                              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                              : 'bg-amber-500 text-white',
                    )}
                  >
                    {current.status === 'published' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : current.status === 'failed' ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : current.status === 'cancelled' ? (
                      <XCircle className="w-3 h-3 mr-1" />
                    ) : current.status === 'draft' ? (
                      <FileText className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {current.status}
                  </Badge>
                  {hasMultiple && (
                    <Badge className="text-[8px] md:text-[9px] font-black uppercase px-2 md:px-3 h-5 md:h-6 border border-border/30 bg-background/60 text-foreground/70">
                      {currentIndex + 1} / {total}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl font-medium text-title-color dark:text-white truncate">
                  {current.title}
                </DialogTitle>
              </div>

              {current.status !== 'published' && (
                <div className="flex items-center gap-2 shrink-0 mr-8 sm:mr-12!">
                  {hasFailed && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 md:h-10 px-3 rounded-[8px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:border-amber-500/50 font-semibold gap-1.5 transition-all shadow-xs"
                      onClick={() => handleExecuteRetry(current.id)}
                      disabled={isRetrying}
                      title="Retry publishing failed post / channels"
                    >
                      <RotateCcw className={cn('w-3.5 h-3.5', isRetrying && retryingTarget === 'all' && 'animate-spin')} />
                      <span className="text-xs font-semibold">Retry</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 md:h-10 md:w-10 rounded-[8px] bg-light-primary hover:bg-light-primary/80 transition-colors"
                    onClick={() => onEdit(current.id)}
                  >
                    <Edit className="w-4 h-4 text-primary" />
                  </Button>
                  {current.status !== 'cancelled' && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9 md:h-10 md:w-10 rounded-[8px] hover:bg-destructive/90 transition-colors"
                      onClick={() => onDelete(current.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="sm:p-6 p-4 pt-0! space-y-6 overflow-auto custom-scrollbar">
            {current.mediaUrls && current.mediaUrls.length > 0 && (
              <div className="relative aspect-video rounded-border-radius overflow-hidden bg-black/90 border border-border/10 group shadow-inner focus-within:ring-2 ring-primary/20 flex items-center justify-center">
                {isVideoUrl(current.mediaUrls[mediaIndex]) ? (
                  <video
                    key={current.mediaUrls[mediaIndex]}
                    src={getUploadPreviewUrl(current.mediaUrls[mediaIndex])}
                    controls
                    playsInline
                    className="w-full h-full object-contain max-h-[360px]"
                  />
                ) : (
                  <Image
                    src={getUploadPreviewUrl(current.mediaUrls[mediaIndex])}
                    alt={`Slide ${mediaIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-500"
                    unoptimized
                  />
                )}

                {current.mediaUrls.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-white/20 hover:bg-background shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          const urls = current.mediaUrls || []
                          if (urls.length > 0) {
                            setMediaIndex((prev) => (prev - 1 + urls.length) % urls.length)
                          }
                        }}
                      >
                        <ChevronLeft className="w-4 h-4 text-foreground" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-white/20 hover:bg-background shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          const urls = current.mediaUrls || []
                          if (urls.length > 0) {
                            setMediaIndex((prev) => (prev + 1) % urls.length)
                          }
                        }}
                      >
                        <ChevronRight className="w-4 h-4 text-foreground" />
                      </Button>
                    </div>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                      {current.mediaUrls.map((_: any, idx: number) => (
                        <div
                          key={idx}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full transition-all duration-300',
                            idx === mediaIndex ? 'bg-primary w-3' : 'bg-white/50',
                          )}
                        />
                      ))}
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                      {mediaIndex + 1} / {current.mediaUrls.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {hasFailed && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive backdrop-blur-sm space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <AlertCircle className="w-5 h-5 shrink-0 text-destructive mt-0.5" />
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-destructive">
                        Publishing Failed
                      </p>
                      {failedPlatforms.length > 0 ? (
                        <div className="space-y-1">
                          {failedPlatforms.map((p: any, idx: number) => (
                            <p key={idx} className="text-xs text-foreground/90 break-words">
                              <span className="font-semibold capitalize text-destructive">
                                {p.platform || p.accountName}:
                              </span>{' '}
                              <span className="opacity-90">{p.error || 'Failed to publish to channel. Check connection or credentials.'}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-foreground/80">
                          One or more channels failed during publishing. Click below to retry.
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 px-3 text-xs shrink-0 rounded-lg gap-1.5 font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all"
                    onClick={() => handleExecuteRetry(current.id)}
                    disabled={isRetrying}
                  >
                    <RotateCcw className={cn('w-3.5 h-3.5', isRetrying && retryingTarget === 'all' && 'animate-spin')} />
                    <span>Retry All</span>
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">{t('content')}</h4>
              <p className="text-sm text-foreground leading-relaxed inner-card glass-dark-card p-2 rounded-[8px]  border border-border/10">
                {current.content}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">{t('platforms')}</h4>
                {current.status === 'published' && (current.postUrl || current.platforms?.some((p: any) => p.postUrl)) && (
                  <a
                    href={current.postUrl || current.platforms?.find((p: any) => p.postUrl)?.postUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all shadow-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{current.platforms?.some((p: any) => p.platform?.toLowerCase() === 'wordpress') ? 'Open WordPress Blog' : 'View Live Post'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-auto">
                {current.platforms?.map((p: any, i: number) => {
                  const platformKey = p.platform?.toLowerCase() || ''
                  const Icon = platformIcons[platformKey] || Globe
                  const itemUrl = p.postUrl || p.url || (platformKey === 'wordpress' ? current.postUrl || current.publishedUrl : null)
                  const isFailedPlatform = p.status === 'failed'
                  const channelAccountId = p.id || p.socialAccountId
                  const isRetryingChannel = isRetrying && retryingTarget === channelAccountId

                  return itemUrl && !isFailedPlatform ? (
                    <a
                      key={i}
                      href={itemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'px-4 py-2 rounded-xl flex items-center gap-2 border border-border/10 transition-all hover:scale-105 hover:shadow-md cursor-pointer group/plat',
                        platformBgColors[platformKey] || 'bg-muted/20',
                      )}
                      title={`Open published on ${p.platform ? p.platform.toUpperCase() : 'post'}: ${p.accountName || ''}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon className={cn('w-4 h-4', platformColors[platformKey])} />
                      <span className={cn('text-xs font-medium', platformColors[platformKey])}>
                        {p.accountName}
                      </span>
                      <ExternalLink className="w-3 h-3 opacity-60 group-hover/plat:opacity-100" />
                    </a>
                  ) : (
                    <div
                      key={i}
                      className={cn(
                        'px-3.5 py-2 rounded-xl flex items-center gap-2 border transition-all',
                        isFailedPlatform
                          ? 'border-destructive/40 bg-destructive/10'
                          : 'border-border/10 ' + (platformBgColors[platformKey] || 'bg-muted/20'),
                      )}
                      title={p.error ? `${p.accountName}: ${p.error}` : p.accountName}
                    >
                      <Icon className={cn('w-4 h-4', isFailedPlatform ? 'text-destructive' : platformColors[platformKey])} />
                      <span className={cn('text-xs font-medium', isFailedPlatform ? 'text-destructive font-semibold' : platformColors[platformKey])}>
                        {p.accountName}
                      </span>
                      {isFailedPlatform && (
                        <div className="flex items-center gap-1.5 ml-1">
                          <span className="text-[10px] font-bold uppercase text-destructive bg-destructive/20 px-1.5 py-0.5 rounded">
                            Failed
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 rounded-md gap-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleExecuteRetry(current.id, channelAccountId)
                            }}
                            disabled={isRetrying}
                            title={`Retry publishing to ${p.accountName}`}
                          >
                            <RotateCcw className={cn('w-3 h-3', isRetryingChannel && 'animate-spin')} />
                            <span>Retry</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {current.platforms?.some((p: any) => p.status === 'failed' && p.error) && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Publishing Error Details</span>
                  </div>
                  {current.platforms
                    .filter((p: any) => p.status === 'failed' && p.error)
                    .map((p: any, idx: number) => (
                      <p key={idx} className="text-xs text-destructive/90 leading-relaxed pl-6">
                        <strong className="text-destructive font-bold">{p.accountName} ({p.platform}):</strong> {p.error}
                      </p>
                    ))}
                </div>
              )}
            </div>

            {current.scheduledDateTime && (
              <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-border-radius bg-primary/5 border border-primary/10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[8px] bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('scheduled_for')}
                  </p>
                  <p className="text-base font-medium text-foreground truncate">
                    {formatDate(current.scheduledDateTime)} at{' '}
                    {format(new Date(current.scheduledDateTime), 'hh:mm a')}
                  </p>
                </div>
              </div>
            )}

            {hasMultiple && (
              <div className="flex items-center justify-between pt-2 border-t border-border/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 p-button-padding px-4 rounded-[8px] gap-2 glass-dark-card font-medium text-sm"
                  onClick={goPrev}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('prev')}
                </Button>

                <div className="flex items-center justify-center w-[40px] overflow-hidden h-6">
                  <motion.div
                    className="flex items-center gap-1.5"
                    animate={{
                      x: total > 3 ? -Math.max(0, Math.min(currentIndex - 1, total - 3)) * 14 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {allPosts.map((_, idx) => (
                      <Button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all duration-300 shrink-0 border-none ring-0 outline-none p-0!',
                          idx === currentIndex
                            ? 'bg-primary! scale-125'
                            : 'bg-border/60 hover:bg-primary/40',
                        )}
                      />
                    ))}
                  </motion.div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 p-button-padding px-4 rounded-[8px] glass-dark-card gap-2 font-medium text-sm"
                  onClick={goNext}
                >
                  {t('next')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      </DialogContent>
    </Dialog>
  )
}

export default PostModal
