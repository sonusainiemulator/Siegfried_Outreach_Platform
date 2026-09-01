'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { dashboardItemVariants } from '@/data/dashboard'
import { ArticlesLibraryProps } from '@/types/components/campaignHub'
import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export const DashboardArticlesLibrary = ({ recentArticles }: ArticlesLibraryProps) => {
  const { t } = useTranslation()

  return (
    <motion.section variants={dashboardItemVariants}>
      <Card className="rounded-border-radius glass-dark-card border border-white/10 overflow-hidden relative group">
        <div className="sm:p-6 p-4 rounded-border-radius">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <div>
                <h3 className="text-lg sm:text-xl font-medium text-title-color dark:text-white">
                  {t('neural_library', { defaultValue: 'My Library' })}
                </h3>
                <p className="text-base font-medium text-subtitle-color dark:text-slate-300 opacity-90">
                  {t('latest_content_streams', { defaultValue: 'Real-time content generation streams' })}
                </p>
              </div>
            </div>
            {recentArticles.length > 0 && (
              <Link
                href={ROUTES.SMART_WRITER}
                className=" p-button-padding! sm:h-12 border border-primary glass-card rounded-[8px] font-medium text-base text-center text-white btn-color"
              >
                {t('archive_access', { defaultValue: 'View Full Archive' })}
              </Link>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 custom-scrollbar h-[260px] overflow-auto">
            {recentArticles.length > 0 ? (
              recentArticles.slice(0, 4).map((article, index) => (
                <motion.div key={index}>
                  <Link
                    href={`${ROUTES.SMART_WRITER}/${article._id || article.id}`}
                    className="flex items-center gap-2 sm:gap-6 p-4 sm:p-6 rounded-border-radius border border-white/5 transition-all duration-700 group/art glass-card glass-dark-card relative overflow-hidden hover:-translate-y-1 hover:shadow-sm hover:shadow-primary/5"
                  >
                    <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-border-radius bg-primary/10 flex items-center justify-center shrink-0 transition-all duration-1000 ring-1 ring-white/5 relative z-10">
                      <FileText className="sm:w-6 sm:h-6 w-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 relative z-10 space-y-1">
                      <h4 className="text-md font-medium line-clamp-2 transition-colors ">{article.title}</h4>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <Badge className=" sm:text-xs font-medium  bg-primary/10 text-primary border-primary/20 px-3 rounded-border-radiustransition-colors duration-700">
                          {t('modules')}
                        </Badge>
                        <span className="text-sm text-subtitle-color font-medium">
                          {article.created_at
                            ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
                                new Date(article.created_at),
                              )
                            : ''}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-full bg-white/5 transition-all duration-700 shadow-2xl relative z-10 rtl:group-hover:-translate-x-2">
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rtl:-scale-x-100" />
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-4 items-center justify-center">
                <NoDataFound
                  icon={FileText}
                  height="h-[250px]"
                  message={t('neural_streams_empty', { defaultValue: 'No active content streams detected' })}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.section>
  )
}
