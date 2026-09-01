import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PaginationProps } from '@/types'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RowsPerPageSelector } from './RowsPerPageSelector'

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  rowsPerPage,
  onRowsPerPageChange,
  showRowsPerPage = true,
  totalResults = 0,
}: PaginationProps) {
  const { t } = useTranslation()

  const startResult = totalResults > 0 ? (currentPage - 1) * (rowsPerPage || 0) + 1 : 0
  const endResult = Math.min(currentPage * (rowsPerPage || 0), totalResults)
  // Helper to generate the page numbers to show
  const getPageNumbers = () => {
    const delta = 1
    const range = []
    const rangeWithDots = []
    let l

    range.push(1)
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i)
      }
    }
    if (totalPages > 1) {
      range.push(totalPages)
    }


    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    }
    return rangeWithDots
  }

  const pages = getPageNumbers()

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 px-2', className)}>
      <div className="flex items-center gap-4">
        {!showRowsPerPage && onRowsPerPageChange && rowsPerPage !== undefined && (
          <RowsPerPageSelector rowsPerPage={rowsPerPage} onRowsPerPageChange={onRowsPerPageChange} />
        )}
        <div className="text-sm text-subtitle-color font-medium">
          {totalResults > 0 ? (
            <>
              {t('showing', { defaultValue: 'Showing' })}{' '}
              <span className="font-medium text-title-color dark:text-subtitle-color">
                {startResult}
              </span>{' '}
              {t('to', { defaultValue: 'to' })}{' '}
              <span className="font-medium text-title-color dark:text-subtitle-color">
                {endResult}
              </span>{' '}
              {t('of', { defaultValue: 'of' })}{' '}
              <span className="font-medium text-title-color dark:text-subtitle-color">
                {totalResults}
              </span>{' '}
              {t('results', { defaultValue: 'results' })}
            </>
          ) : (
            <>
              {t('page', { defaultValue: 'Page' })}{' '}
              <span className="font-bold text-title-color dark:text-subtitle-color">
                {currentPage}
              </span>{' '}
              {t('of', { defaultValue: 'of' })}{' '}
              <span className="font-bold text-title-color dark:text-subtitle-color">
                {totalPages === 0 ? 1 : totalPages}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-9 w-9 rounded-[8px] bg-card-color hover:bg-primary hover:text-white transition-all"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          <span className="sr-only">{t('previous')}</span>
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <Button
                  key={`dots-${index}`}
                  variant="ghost"
                  size="icon"
                  disabled
                  className="h-9 w-9 cursor-default opacity-50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'h-9 w-9 text-xs font-bold rounded-xl transition-all',
                  currentPage === page
                    ? 'bg-primary! text-white pointer-events-none'
                    : 'border-input-border-color hover:border-primary/50 dark:bg-subtitle-color/40',
                )}
              >
                {page}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-9 w-9 rounded-xl bg-card-color hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          <span className="sr-only">{t('next')}</span>
        </Button>
      </div>
    </div>
  )
}
