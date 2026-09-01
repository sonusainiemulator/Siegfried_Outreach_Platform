import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const ApiHeroHeader = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="relative  overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 group">
      <div className='space-y-2'>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-11 bg-primary/10 text-primary mb-0 hover:bg-primary/10 hover:text-primary rounded-[8px] transition-all shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Button>
          <h1 className="text-3xl font-medium title-color tracking-tight">
            {t('api_command_center', { defaultValue: 'API Command Center' })}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default ApiHeroHeader
