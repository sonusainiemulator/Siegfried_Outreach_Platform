import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Button } from '@/components/ui/button'
import { FileChatHeaderProps } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const FileChatHeader = ({ onNewChat, onOpenHistory }: FileChatHeaderProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="flex items-center flex-wrap gap-2 justify-between shrink-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Button>
        <div className="flex items-start flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-title-color dark:text-white title-color">
            {t('file_chat_ai')}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CreditLimitPill />
      </div>
    </div>
  )
}

export default FileChatHeader
