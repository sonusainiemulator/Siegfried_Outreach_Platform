'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scrollArea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useGetSocialPostsQuery } from '@/redux/api/socialMediaApi'
import { RecentPostsSectionProps } from '@/types/components/socialMedia'
import { formatDate, getUploadPreviewUrl } from '@/utils'
import { platformColors, platformIcons } from '@/data/socialMedia'
import { Archive, ExternalLink, Globe, Image as ImageIcon, Settings, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import RecentPostCard from './RecentPostCard'

const RecentPostsSection = ({ recentPosts, platforms, onEdit, onDelete, canManage }: RecentPostsSectionProps) => {
  const { t } = useTranslation()
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const { data: allPostsData } = useGetSocialPostsQuery({}, { skip: !isArchiveOpen })

  const sortedPosts = allPostsData?.socialPosts
    ? [...allPostsData.socialPosts].sort((a: any, b: any) => {
      const dateA = new Date(a.scheduledDateTime || a.createdAt || Date.now()).getTime()
      const dateB = new Date(b.scheduledDateTime || b.createdAt || Date.now()).getTime()
      return dateB - dateA // Descending order for archive
    })
    : []

  const getLiveUrl = (p: any) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2 flex-wrap">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-medium">{t('social_recent_posts')}</h3>
        </div>

        <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="max-w-5xl bg-card/95 backdrop-blur-3xl border-border/40 rounded-2xl p-0 overflow-hidden shadow-2xl">
            <DialogHeader className="p-8 border-b border-border/10 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight">{t('social_archive_title')}</DialogTitle>
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60">
                    {t('social_archive_desc')}
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-[9px]">
                  {allPostsData?.socialPosts?.length || 0} {t('social_records')}
                </Badge>
              </div>
            </DialogHeader>
            <ScrollArea className="h-[600px] p-8">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/10">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">{t('social_transmission')}</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">
                      {t('social_nodes')}
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">
                      {t('social_protocol')}
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                      {t('social_timestamp')}
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                      {t('social_actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPosts.map((post: any) => {
                    const firstMedia = Array.isArray(post.mediaUrls)
                      ? post.mediaUrls[0]
                      : typeof post.mediaUrls === 'string'
                        ? post.mediaUrls
                        : null
                    const isPublished = post.status === 'published' || post.status === 'partial'
                    const primaryLink = post.postUrl || post.publishedUrl || post.platforms?.map(getLiveUrl).find(Boolean) || null

                    return (
                      <TableRow key={post.id} className="border-border/10 hover:bg-primary/5 transition-colors">
                        <TableCell className="max-w-[300px]">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-muted/50 shrink-0 overflow-hidden ring-1 ring-border/20 relative">
                              {firstMedia ? (
                                <Image
                                  src={getUploadPreviewUrl(firstMedia)}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-xs uppercase truncate">{post.title}</p>
                              <p className="text-[10px] text-muted-foreground line-clamp-1 font-semibold">
                                {post.content}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center -gap-1.5">
                            {post.platforms?.map((p: any, i: number) => {
                              const platformKey = p.platform?.toLowerCase() || ''
                              const Icon = platformIcons[platformKey] || Globe
                              const iconColor = platformColors[platformKey] || 'text-primary'
                              const itemUrl = getLiveUrl(p)

                              return itemUrl ? (
                                <a
                                  key={i}
                                  href={itemUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 rounded-md bg-card border border-border/40 flex items-center justify-center shadow-sm hover:scale-110 hover:border-primary transition-all cursor-pointer relative"
                                  title={`Open published on ${p.platform ? p.platform.toUpperCase() : 'post'}: ${p.accountName || ''}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Icon className={cn('w-3.5 h-3.5', iconColor)} />
                                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                </a>
                              ) : (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-md bg-card border border-border/40 flex items-center justify-center shadow-sm"
                                  title={`${p.platform ? p.platform.toUpperCase() : 'Social'}: ${p.accountName || ''}`}
                                >
                                  <Icon className={cn('w-3.5 h-3.5', iconColor)} />
                                </div>
                              )
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={cn(
                              'text-[8px] font-black uppercase px-2 py-0.5 border-none',
                              isPublished
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : post.status === 'failed'
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-amber-500/10 text-amber-500',
                            )}
                          >
                            {isPublished
                              ? post.status === 'partial' ? 'Published (Live)' : t('social_published')
                              : post.status === 'failed'
                                ? t('failed')
                                : t('social_scheduled')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-[10px] font-black text-muted-foreground">
                          {formatDate(post.scheduledDateTime || post.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            {isPublished && primaryLink && (
                              <a
                                href={primaryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-8 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1 transition-all"
                                title="Open Live Post"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>Live</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {canManage ? (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                                  onClick={(e) => onEdit(post.id, e)}
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all"
                                  onClick={(e) => onDelete(post.id, e)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">{t('view_only')}</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className=" gap-4 overflow-x-auto pb-4 no-scrollbar snap-x grid xl:grid-cols-4 md:grid-cols-2">
        {recentPosts.length === 0 ? (
          <Card className="w-full h-40 rounded-border-radius border-dashed border-border/40 bg-card/20 flex flex-col items-center justify-center gap-3">
            <Archive className="w-8 h-8 text-muted-foreground/20" />
            <p className="text-base font-medium text-muted-foreground opacity-40">
              {t('social_no_transmissions')}
            </p>
          </Card>
        ) : (
          recentPosts
            .slice(0, 6)
            .map((post: any) => (
              <RecentPostCard key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} canManage={canManage} />
            ))
        )}
      </div>
    </div>
  )
}

export default RecentPostsSection
