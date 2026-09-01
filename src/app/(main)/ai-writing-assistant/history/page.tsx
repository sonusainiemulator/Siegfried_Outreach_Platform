'use client'

import HistoryDetailDialog from '@/components/feature/shared/history/HistoryDetailDialog'
import HistoryEmptyState from '@/components/feature/shared/history/HistoryEmptyState'
import HistoryPageHeader from '@/components/feature/shared/history/HistoryPageHeader'
import HistoryTable from '@/components/feature/shared/history/HistoryTable'
import { ROUTES } from '@/constants/routes'
import { useGetTemplateHistoryQuery } from '@/redux/api/smartWriterApi'
import { downloadFile } from '@/utils/download'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const HistoryPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isCopied, setIsCopied] = useState(false)

  const { data: historyData, isLoading, isFetching } = useGetTemplateHistoryQuery({ page, limit: 10 })

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    toast.success(t('writer_copy_success', { defaultValue: 'Copied to clipboard' }))
  }


  const handleDownload = (item: any) => {
    const file = new Blob([item.content], { type: 'text/plain' })
    const url = URL.createObjectURL(file)
    downloadFile(url, `${item.title || 'generation'}.txt`)
    toast.success(t('downloading_content'))
  }

  const filteredHistory =
    historyData?.data?.filter(
      (item: any) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prompt?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <HistoryPageHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-1 overflow-y-auto pt-3 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          {filteredHistory.length > 0 || isLoading ? (
            <HistoryTable
              items={filteredHistory}
              isLoading={isLoading}
              isFetching={isFetching}
              page={page}
              setPage={setPage}
              totalPages={historyData?.totalPages ?? 1}
              currentPage={historyData?.page ?? 1}
              onView={setSelectedItem}
              onCopy={handleCopy}
              onDownload={handleDownload}
            />
          ) : (
            <HistoryEmptyState startRoute={ROUTES.SMART_WRITER} />
          )}
        </div>
      </main>

      <HistoryDetailDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        promptLabel={t('core_concept')}
        isCopied={isCopied}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />
    </div>
  )
}

export default HistoryPage
