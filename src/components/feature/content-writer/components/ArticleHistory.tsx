'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { useDeleteAiContentMutation, useGetAiHistoryQuery } from '@/redux/api/aiContentApi'
import { ArticleHistoryProps } from '@/types'
import { formatDate } from '@/utils'
import { Calendar, ExternalLink, FileText, Globe, History, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const ArticleHistory = ({ onSelect }: ArticleHistoryProps) => {
  const { t } = useTranslation()
  const [limit, setLimit] = useState(6)
  const { data: historyRes, isLoading, isFetching } = useGetAiHistoryQuery({ type: 'article', limit })
  const [deleteContent] = useDeleteAiContentMutation()

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm(t('confirm_delete', 'Are you sure you want to delete this article?'))) {
      try {
        await deleteContent(id).unwrap()
        toast.success(t('deleted_successfully'))
      } catch {
        toast.error(t('delete_failed'))
      }
    }
  }

  const articles = useMemo(() => {
    const rawData = historyRes?.data || []
    const seen = new Set()
    return rawData.filter((item: Record<string, unknown>) => {
      const itemId = (item.id as string) || (item._id as string)
      if (!itemId || seen.has(itemId)) return false
      seen.add(itemId)
      return true
    })
  }, [historyRes])

  const hasMore = (historyRes?.totalCount || 0) > articles.length && !isLoading && !isFetching

  if (isLoading && limit === 6) {
    return <Spinner className="py-20" text={t('loading_history')} />
  }

  if (articles.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-20">
        <History className="w-12 h-12 mb-4" />
        <p className="text-sm font-medium">{t('no_articles_found')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 py-2 sm:py-4">
      <div className="space-y-3 sm:space-y-4 custom-scrollbar">
        {articles.map((article: Record<string, unknown>) => (
          <div
            key={(article.id as string) || (article._id as string)}
            onClick={() => onSelect(article)}
            className="group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-border-radius glass-dark-card glass-card border border-border/40 transition-all hover:border-primary/40 hover:bg-light-primary cursor-pointer active:scale-[0.98]"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[8px] bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
              <h4 className="font-bold text-sm sm:text-base text-foreground truncate pr-6 sm:pr-10">{article.title as string}</h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {formatDate(article.created_at as string)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  {article.platform as string}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl dark:hover:bg-red-900/20 text-destructive bg-destructive/10"
                onClick={(e) => handleDelete(e, (article.id as string) || (article._id as string))}
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/20">
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="pt-4 flex justify-center">
          <Button
            variant="ghost"
            className="rounded-[8px] border-border/40 bg-primary hover:bg-primary hover:text-white text-white font-medium text-sm gap-2 px-8 sm:h-12 h-10  transition-all active:scale-95 "
            onClick={() => setLimit((prev) => prev + 6)}
            disabled={isFetching}
          >
            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {t('load_more_articles', 'Load More Articles')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ArticleHistory
