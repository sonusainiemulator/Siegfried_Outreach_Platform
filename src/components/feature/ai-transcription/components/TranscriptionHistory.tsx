'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useDeleteAiContentMutation, useGetTranscribeHistoryQuery } from '@/redux/api/aiContentApi'
import { TranscriptionHistoryProps } from '@/types'
import { formatDate } from '@/utils'
import { Calendar, ChevronRight, FileText, History, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const TranscriptionHistory = ({ onSelect }: TranscriptionHistoryProps) => {
  const { t } = useTranslation()
  const { data: historyRes, isLoading } = useGetTranscribeHistoryQuery({ limit: 3 })
  const [deleteContent] = useDeleteAiContentMutation()
  const [isOpen, setIsOpen] = useState(false)

  const history = historyRes?.data?.data || []

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm(t('confirm_delete', 'Are you sure you want to delete this transcription?'))) {
      try {
        await deleteContent(id).unwrap()
        toast.success(t('deleted_successfully'))
      } catch {
        toast.error(t('delete_failed'))
      }
    }
  }

  if (isLoading) return null
  if (history.length === 0) return null

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-title-color dark:text-white flex items-center gap-2">
          {t('recent_transcription')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {history.map((item: any) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.content)}
            className="group relative p-5 rounded-border-radius glass-dark-card glass-card border border-border/40 transition-all hover:border-primary/40 hover:bg-light-primary cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(e, item._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <h4 className="font-bold text-base text-foreground line-clamp-1 mb-2">
              {item.metadata?.originalFile || t('untitled_transcription')}
            </h4>
            
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(item.created_at)}
            </div>

            <div className="mt-4 text-xs text-muted-foreground line-clamp-2 italic">
              "{item.content}"
            </div>
          </div>
        ))}

        {/* View All History Card */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="flex flex-col items-center justify-center p-5 rounded-border-radius border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group active:scale-[0.98]">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <History className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-sm font-bold text-muted-foreground group-hover:text-primary flex items-center gap-1">
                {t('view_all_history')}
              <ChevronRight className="w-4 h-4 mt-1text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </span>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[50vh] overflow-hidden flex flex-col p-0 glass-dark-card border-border">
             <DialogHeader className="pb-3 border-b border-border">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <History className="h-6 w-6 text-primary" />
                  {t('transcription_history')}
                </DialogTitle>
             </DialogHeader>
             <div className="flex-1 overflow-y-auto no-scrollbar">
                <AllHistoryList onSelect={(content) => { onSelect(content); setIsOpen(false); }} />
             </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

const AllHistoryList = ({ onSelect }: { onSelect: (content: string) => void }) => {
    const { t } = useTranslation()
    const { data: historyRes, isLoading } = useGetTranscribeHistoryQuery({ limit: 100 })
    const history = historyRes?.data?.data || []

    if (isLoading) return <div className="py-20 text-center">{t('loading_history', 'Loading History...')}</div>

    if (history.length === 0) return (
        <div className="py-20 text-center text-muted-foreground">
            {t('no_transcription_history_found', 'No transcription history found.')}
        </div>
    )

    return (
        <div className="space-y-4">
            {history.map((item: any) => (
                <div 
                    key={item._id}
                    onClick={() => onSelect(item.content)}
                    className="flex inner-card glass-dark-card items-center gap-4 p-4 rounded-xl border border-border/40 hover:bg-light-primary transition-all cursor-pointer group active:scale-[0.99]"
                >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-base text-foreground truncate">
                            {item.metadata?.originalFile || t('untitled_transcription')}
                        </h5>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(item.created_at)}
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all group-hover:text-primary" />
                </div>
            ))}
        </div>
    )
}

export default TranscriptionHistory
