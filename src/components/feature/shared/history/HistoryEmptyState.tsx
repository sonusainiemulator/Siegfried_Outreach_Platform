import { Button } from '@/components/ui/button'
import { HistoryEmptyStateProps } from '@/types'
import { History as HistoryIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({ startRoute }) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="glass-card glass-dark-card rounded-border-radius sm:p-10 p-4 text-center">
      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <HistoryIcon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-medium text-title-color dark:text-white mb-2">{t('writer_no_history')}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">{t('generate_to_start')}</p>
      <Button
        onClick={() => router.push(startRoute)}
        className="mt-8 rounded-[8px] bg-primary! text-white px-8 sm:h-12 h-10 font-medium transition-all active:scale-95"
      >
        {t('start_writing')}
      </Button>
    </div>
  )
}

export default HistoryEmptyState
