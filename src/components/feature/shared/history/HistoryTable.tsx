import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { HistoryTableProps } from '@/types'
import { formatDate } from '@/utils'
import { Calendar, ChevronLeft, ChevronRight, Copy, Download, Eye, FileText } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const HistoryTable: React.FC<HistoryTableProps> = ({
  items,
  isLoading,
  isFetching,
  page,
  setPage,
  totalPages,
  currentPage,
  onView,
  onCopy,
  onDownload,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="glass-crad glass-dark-card rounded-border-radius border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
            <TableHead className="w-[500px] font-bold py-5 px-6">{t('writer_template')}</TableHead>
            <TableHead className="font-bold">{t('writer_date')}</TableHead>
            <TableHead className="font-bold text-center">{t('writer_actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow
              key={item.id}
              className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 transition-colors"
            >
              <TableCell className="py-3 px-6 [@media(max-width:830px)]:min-w-93.75">
                <div className="flex items-center gap-3">
                  <div className="min-w-10 h-10 rounded-[8px] bg-light-primary flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-title-color dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-sm text-subtitle-color capitalize">{item.type}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="[@media(max-width:830px)]:min-w-45">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{formatDate(item.created_at)}</span>
                </div>
              </TableCell>
              <TableCell className="[@media(max-width:830px)]:min-w-40">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(item)}
                    className="h-8 w-8 bg-primary/10 hover:bg-primary hover:text-white text-primary"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCopy(item.content)}
                    className="h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDownload(item)}
                    className="h-8 w-8 bg-destructive/10 hover:text-white text-destructive hover:bg-destructive"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-sm text-zinc-500 font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryTable
