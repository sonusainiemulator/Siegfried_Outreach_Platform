import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { ArrowLeft, History as HistoryIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const SmartWriterHeader = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="relative z-[80] backdrop-blur-3xl shrink-0">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 px-3 text-xs gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-fit"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className='flex items-start flex-col'>
            <h1 className="text-3xl font-bold tracking-tight title-color text-title-color capitalize leading-none">
              {t('smart_writer_studio')}
            </h1>
          </div>

        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.SMART_WRITER_HISTORY)}
            className="h-12 px-8 border-none rounded-[8px] btn-color text-white transition-all gap-2 font-medium capitalize text-base tracking-wider"
          >
            <HistoryIcon className="w-5 h-5" />
            <span className="hidden sm:inline">{t('writer_history')}</span>
          </Button>
          <CreditLimitPill />
        </div>
      </div>
    </div>
  )
}

export default SmartWriterHeader
