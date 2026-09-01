import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { HistoryPageHeaderProps } from '@/types'
import { ArrowLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const HistoryPageHeader: React.FC<HistoryPageHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <header className="shrink-0">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-11 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20 hover:text-primary rounded-[8px] transition-all shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
            <div className='flex items-start flex-col'>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-title-color dark:text-white line-clamp-1 leading-[1.1] title-color">{t('writer_history')}</h1>
              </div>

            </div>
          </div>
        </div>

        <div className="w-full md:w-96 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 transition-colors" />
          <Input
            placeholder={t('search_templates')}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 inner-card glass-dark-card rounded-[8px] "
          />
        </div>
      </div>
    </header>
  )
}

export default HistoryPageHeader
