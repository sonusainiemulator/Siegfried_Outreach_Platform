'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const PlatformConnectionHeader = ({ onNavigateToDashboard }: { onNavigateToDashboard: () => void }) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className="relative overflow-hidden ">
      <div className="relative z-10 grid grid-cols-1 gap-10 items-center">
        <div className="space-y-6">
          <div className="flex justify-between flex-wrap gap-2">
            <div className='flex items-center gap-2'>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20  hover:text-primary rounded-[8px] transition-all h-9 w-11"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
              <div className="flex items-start flex-col">
                <h1 className="text-3xl font-bold leading-tight title-color text-title-color truncate">{t('social_network_hub')}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlatformConnectionHeader
