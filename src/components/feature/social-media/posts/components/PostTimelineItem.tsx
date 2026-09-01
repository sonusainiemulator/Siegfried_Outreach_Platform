'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { PostTimelineItemProps } from '@/types/components/socialMedia'
import { formatDate } from '@/utils'
import { format } from 'date-fns'
import { Calendar, Clock, Edit, Facebook, Globe, Instagram, Linkedin, X } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export const PostTimelineItem = ({ post, onEdit, onDelete }: PostTimelineItemProps) => {
  const { t } = useTranslation()

  return (
    <Card className="group relative rounded-border-radius border-border/40 glass-card hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
          {/* Media/Visual Area */}
          <div className="relative shrink-0 mx-auto lg:mx-0 w-full lg:w-48 h-48 lg:h-36">
            <div className="w-full h-full rounded-xl bg-muted/20 flex items-center justify-center relative overflow-hidden group-hover:bg-muted/30 transition-all duration-500 border border-border/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
              <Calendar className="w-8 h-8 text-muted-foreground/30" />

              {post.platforms?.[0] &&
                (() => {
                  const platform = post.platforms[0].platform.toLowerCase()
                  let Icon = Globe
                  let iconBg = 'bg-primary'

                  switch (platform) {
                    case 'facebook':
                      Icon = Facebook
                      iconBg = 'bg-[var(--facebook)]'
                      break
                    case 'instagram':
                      Icon = Instagram
                      iconBg = 'bg-[var(--instagram)]'
                      break
                    case 'linkedin':
                      Icon = Linkedin
                      iconBg = 'bg-[var(--linkedin)]'
                      break
                  }

                  return (
                    <div
                      className={cn(
                        'absolute top-2 left-2 p-1.5 rounded-lg shadow-lg z-10 text-white transition-transform duration-300 group-hover:scale-110',
                        iconBg,
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  )
                })()}
            </div>
          </div>

          {/* Content Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5">
                    {formatDate(post.scheduledDateTime)}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-subtitle-color/60">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold font-mono">
                      {format(new Date(post.scheduledDateTime!), 'hh:mm a')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-[8px] border border-border/10 hover:bg-primary/5 hover:text-primary transition-all"
                    asChild
                  >
                    <Link href={`${ROUTES.SOCIAL_MEDIA.CREATE_POST}?edit=${post.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-[8px] border border-border/10 hover:bg-destructive/5 hover:text-destructive transition-all"
                    onClick={() => onDelete(post.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-xl text-title-color dark:text-white leading-tight group-hover:text-primary transition-colors truncate">
                  {post.title}
                </h4>
                <p className="text-sm text-subtitle-color font-medium opacity-70 line-clamp-2 italic leading-relaxed">
                  {post.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
