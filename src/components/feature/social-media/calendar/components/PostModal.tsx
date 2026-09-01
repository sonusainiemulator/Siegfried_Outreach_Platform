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
  Globe,
  Trash,
  XCircle
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PostModal = ({ isOpen, onClose, post, posts, onEdit, onDelete }: PostModalProps) => {
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
  const { t } = useTranslation()
  const current: any = allPosts[currentIndex]

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


  useEffect(() => {
    const urls = current?.mediaUrls || []

    if (!isOpen || urls.length <= 1) return

    const interval = setInterval(() => {
      setMediaIndex((prev) => (prev + 1) % urls.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isOpen, currentIndex])

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
                            : 'bg-amber-500 text-white',
                    )}
                  >
                    {current.status === 'published' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : current.status === 'failed' ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : current.status === 'cancelled' ? (
                      <XCircle className="w-3 h-3 mr-1" />
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
                <div className="flex gap-2 shrink-0 mr-8 sm:mr-12!">
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
              <div className="relative aspect-video rounded-border-radius overflow-hidden bg-muted/20 border border-border/10 group shadow-inner focus-within:ring-2 ring-primary/20">
                <Image
                  src={getUploadPreviewUrl(current.mediaUrls[mediaIndex])}
                  alt={`Slide ${mediaIndex + 1}`}
                  fill
                  className="object-cover transition-opacity duration-500"
                  unoptimized
                />

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
              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-auto">
                {current.platforms?.map((p: any, i: number) => {
                  const platformKey = p.platform?.toLowerCase() || ''
                  const Icon = platformIcons[platformKey] || Globe
                  const itemUrl = p.postUrl || p.url || (platformKey === 'wordpress' ? current.postUrl || current.publishedUrl : null)

                  return itemUrl ? (
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
                        'px-4 py-2 rounded-xl flex items-center gap-2 border border-border/10',
                        platformBgColors[platformKey] || 'bg-muted/20',
                      )}
                    >
                      <Icon className={cn('w-4 h-4', platformColors[platformKey])} />
                      <span className={cn('text-xs font-medium', platformColors[platformKey])}>
                        {p.accountName}
                      </span>
                    </div>
                  )
                })}
              </div>
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
