'use client'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scrollArea'
import { platformBgColors, platformColors } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { MetricsPostsModalProps } from '@/types'
import { format } from 'date-fns'
import { t } from 'i18next'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Linkedin,
  XCircle,
  Youtube,
} from 'lucide-react'

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}

const MetricsPostsModal = ({
  isOpen,
  onClose,
  title,
  posts,
  onPostClick,
}: MetricsPostsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open: any) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[85vh] flex flex-col p-0 overflow-hidden border-border/40 bg-white backdrop-blur-2xl rounded-2xl">
        <DialogHeader className="border-b border-border/10">
          <DialogTitle className="text-xl font-semibold text-title-color dark:text-white flex items-center justify-between">
            <span>{title}</span>
            <Badge variant="secondary" className=" mr-6 px-3 bg-primary/10 hover:bg-primary/10 text-primary border-primary/20 font-bold">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="custom-scrollbar overflow-auto">
          <div className="space-y-5 mr-2">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="text-muted-foreground font-medium italic">
                  {t('no_post_found_this_category')}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className="group relative p-5 rounded-2xl border border-border/10 inner-card glass-dark-card hover:border-primary transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Subtle background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={cn(
                          'text-[10px] font-bold uppercase px-3 py-1 rounded-full border-none',
                          post.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : post.status === 'failed'
                              ? 'bg-destructive/15 text-destructive'
                              : post.status === 'cancelled'
                                ? 'bg-slate-500/20 text-slate-500'
                                : post.status === 'draft'
                                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                                  : 'bg-amber-500/15 text-amber-500',
                        )}
                      >
                        {post.status === 'published' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        ) : post.status === 'failed' ? (
                          <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                        ) : post.status === 'cancelled' ? (
                          <XCircle className="w-3.5 h-3.5 mr-1.5" />
                        ) : post.status === 'draft' ? (
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        {post.status}
                      </Badge>

                      <div className="flex -space-x-1.5 gap-2">
                        {post.platforms?.slice(0, 3).map((p, i) => {
                          const Icon = platformIcons[p.platform?.toLowerCase()] || Globe
                          return (
                            <div
                              key={i}
                              className={cn(
                                'w-8 h-8 rounded-xl flex items-center justify-center border-2 border-card transition-transform group-hover:scale-110',
                                platformBgColors[p.platform?.toLowerCase()] || 'bg-muted/20',
                              )}
                              title={p.platform}
                            >
                              <Icon className={cn('w-4 h-4', platformColors[p.platform?.toLowerCase()])} />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <h4 className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </h4>

                    <p className="text-sm text-subtitle-color/80 leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 font-medium">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/5">
                      {post.scheduledDateTime && (
                        <div className="flex items-center gap-2 text-[11px] font-bold text-primary/90 bg-primary/5 px-2.5 py-1 rounded-lg">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{format(new Date(post.scheduledDateTime), 'MMM d, yyyy • hh:mm a')}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground ml-auto">
                        <Clock className="w-3 h-3 opacity-60" />
                        <span>{t('created')}: {format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default MetricsPostsModal
