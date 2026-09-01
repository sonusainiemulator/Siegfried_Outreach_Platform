'use client'

import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { RecentActivityProps } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, FileText, Share2, Users as UsersIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'


export const RecentActivity = ({ recentUsers, recentArticles, recentPosts }: RecentActivityProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-8 md767:grid-cols-1! xl1570:grid-cols-2 xl:grid-cols-3">
      <Card className="p-px rounded-border-radius border-none glass-card glass-dark-card shadow-none overflow-hidden group/users">
        <div className="sm:p-6 p-4 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="rounded-2xl text-primary shadow-2xl">
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-title-color mb-0 tracking-tight flex items-center gap-2 dark:text-white">
                  {t('recent_users')}
                </h3>
              </div>

              <p className="text-base font-medium text-subtitle-color">{t('new_registrations')}</p>
            </div>
            <Badge className="bg-subtitle-color/10 text-light-text-color text-center border-none rounded-full py-1 font-semibold text-sm">
              {recentUsers.length}
            </Badge>

          </div>

          <div className="space-y-3 no-scrollbar h-[375px] overflow-auto">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-border-radius shadow-none! inner-card glass-dark-card transition-all duration-300 group cursor-pointer border border-white/5 hover:border-primary/20"
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-105 transition-transform duration-500">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback
                        className={cn('font-medium uppercase text-xl', getAvatarColorClass(user.name))}
                      >
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2 mb-0">
                      <p className="text-[16px] font-medium truncate transition-colors text-title-color dark:text-white">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-subtitle-color font-medium text-right shrink-0 mt-1">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex text-sm sm:items-center items-start justify-between sm:flex-row flex-col gap-1.5 sm:gap-2">
                      {user.email ? (
                        <div className="text-subtitle-color font-medium">
                          <CopyEmailCell email={user.email} truncate={false} />
                        </div>
                      ) : null}
                      {(() => {
                        const getRoleStyle = (role: string) => {
                          const r = role.toLowerCase()
                          if (r.includes('admin'))
                            return 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20'
                          if (r.includes('assigner'))
                            return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20'
                          if (r.includes('user'))
                            return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20'
                          if (r.includes('member'))
                            return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20'
                          return 'bg-primary/10 text-primary border border-primary/20'
                        }
                        return (
                          <Badge
                            className={`text-[11px] font-medium px-2 py-0.5 mt-1 rounded shadow-none ${getRoleStyle(
                              user.role,
                            )}`}
                          >
                            {user.role}
                          </Badge>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound icon={UsersIcon} height="h-[375px]" />
            )}
          </div>
        </div>
      </Card>

      <Card className="p-px rounded-border-radius border-none shadow-none overflow-hidden group/articles h-full">
        <div className="p-4 sm:p-6  h-full relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex">
              <div className="rounded-2xl text-primary shadow-2xl">
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-title-color mb-0 tracking-tight flex items-center gap-2 dark:text-white">
                  {t('recent_articles')}
                </h3>
                <p className="text-base font-medium text-subtitle-color">{t('latest_generations')}</p>
              </div>
            </div>
            <Badge className="bg-subtitle-color/10 text-light-text-color text-center border-none rounded-full py-1 font-semibold text-sm">
              {recentArticles.length}
            </Badge>
          </div>

          <div className="space-y-3 no-scrollbar h-[375px] overflow-auto">
            {recentArticles.length > 0 ? (
              recentArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-4 rounded-border-radius inner-card glass-dark-card transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={article.user?.avatar} />
                        <AvatarFallback className={cn("font-medium text-xl uppercase", getAvatarColorClass(article.user?.name))}>
                          {article.user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-base font-medium text-subtitle-color">{article.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-subtitle-color font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-base font-medium text-title-color leading-snug line-clamp-2 transition-colors dark:text-white">
                      {article.title}
                    </p>
                  </div>

                </div>
              ))
            ) : (
              <NoDataFound icon={FileText} height="h-[375px]" />
            )}
          </div>
        </div>
      </Card>

      <Card className="p-px rounded-border-radius glass-card glass-drak-crad border-none shadow-none overflow-hidden group/posts h-full">
        <div className=" p-4 sm:p-6  h-full relative">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-medium text-title-color tracking-tight flex items-center dark:text-white">
              <div className="rounded-2xl text-primary shadow-2xl">
              </div>
              <div>
                <h3 className="text-xl font-medium text-title-color mb-0 tracking-tight flex items-center gap-2 dark:text-white">
                  {t('recent_social_posts')}
                </h3>
                <p className="text-base font-medium text-subtitle-color ">{t('distributed_content')}</p>
              </div>
            </div>
            <Badge className="bg-subtitle-color/10 text-light-text-color text-center border-none rounded-full py-1 font-semibold text-sm">
              {recentPosts.length}
            </Badge>
          </div>

          <div className="space-y-4 no-scrollbar h-[375px] overflow-auto pr-2">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-2 p-5 rounded-border-radius inner-card glass-dark-card transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap gap-2">
                      {post.platforms.map((plat: string, i: number) => {
                        const getPlatformStyle = (platform: string) => {
                          const p = platform.toLowerCase()
                          if (p.includes('linkedin'))
                            return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20'
                          if (p.includes('instagram'))
                            return 'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 border border-pink-500/20'
                          if (p.includes('facebook'))
                            return 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400 border border-indigo-600/20'
                          if (p.includes('twitter') || p.includes('x'))
                            return 'bg-slate-900/10 text-slate-900 dark:bg-white/10 dark:text-white border border-slate-900/20'
                          return 'bg-light-gray text-light-text-color dark:text-white border border-transparent'
                        }

                        return (
                          <Badge
                            key={i}
                            className={`text-[12px] font-medium h-6 px-3 rounded-lg shadow-none ${getPlatformStyle(
                              plat,
                            )}`}
                          >
                            {plat}
                          </Badge>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-white/5">
                      <div className="flex items-center gap-1 text-sm text-subtitle-color font-medium text-wrap">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(post.publishedAt || post.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <p className="text-sm text-subtitle-color font-medium line-clamp-3 leading-relaxed group-hover:text-foreground transition-colors">
                      "{post.content}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound icon={Share2} height="h-[375px]" />
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
