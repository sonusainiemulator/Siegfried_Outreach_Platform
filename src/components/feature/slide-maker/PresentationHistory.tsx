'use client'

import { Button } from '@/components/ui/button'
import { useDeletePresentationMutation, useGetPresentationHistoryQuery } from '@/redux/api/presentationApi'
import { ApiError } from '@/types'
import { ArrowLeft, Loader2, MonitorPlay } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import PresentationCard from './PresentationCard'
import PresentationViewer from './PresentationViewer'

const PresentationHistory = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const { data: historyData, isLoading: historyLoading } = useGetPresentationHistoryQuery({ page, limit: 12 })
  const [deletePresentation, { isLoading: isDeleting }] = useDeletePresentationMutation()

  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedPresentation, setSelectedPresentation] = useState<any>(null)

  const handleViewPresentation = (presentation: any) => {
    setSelectedPresentation(presentation)
    setViewerOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePresentation(id).unwrap()
      toast.success(t('deleted'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('could_not_delete'))
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen  relative overflow-y-auto w-full custom-scrollbar">
      <div className="relative z-10 mb-10">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-[8px] bg-primary/10 text-primary"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Button>
          <h1 className="text-3xl font-medium dark:text-white title-color">
            {t('ai_presentation_history')}
          </h1>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center p-24">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
          </div>
        ) : historyData?.data?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {historyData.data.map((item: any, index: number) => (
                <PresentationCard
                  key={item._id || `his-${index}`}
                  item={item}
                  onView={handleViewPresentation}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              ))}
            </div>

            {historyData.total > 12 && (
              <div className="flex justify-end mt-12 gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-[8px]  bg-primary! text-white sm:h-12 h-11 p-button-padding!"
                >
                  {t('back')}
                </Button>
                <Button
                  variant="outline"
                  disabled={historyData.data.length < 12}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-[8px]  bg-primary! text-white sm:h-12 h-11 p-button-padding!"
                >
                  {t('next')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-24 border-2 border-dashed border-light-border-color rounded-border-radius">
            <div className="w-20 h-20 bg-primary/10 rounded-[8px] flex items-center justify-center mx-auto mb-6">
              <MonitorPlay className="w-10 h-10 text-primary" />
            </div>
            <p className="text-zinc-500 font-bold">{t('ai_presentation_no_history')}</p>
            <Button
              className="mt-6 rounded-[8px] sm:h-12 h-10 px-8 bg-primary! text-white"
              onClick={() => router.back()}
            >
              {t('start_designing')}
            </Button>
          </div>
        )}
      </div>

      <PresentationViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        presentation={selectedPresentation}
      />
    </div>
  )
}

export default PresentationHistory
