'use client'

import EmailConfig from '@/components/feature/app-settings/EmailConfig'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const EmailConfigurationPage = () => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Button>
        <div className="flex items-start flex-col ">
          <h1 className="text-3xl font-bold tracking-tight text-title-color title-color dark:text-white leading-[1.3]">
            {t('email_configuration')}
          </h1>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 mt-6">
        <EmailConfig />
      </div>
    </div>
  )
}

export default EmailConfigurationPage
