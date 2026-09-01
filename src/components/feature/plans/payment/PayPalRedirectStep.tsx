'use client'

import { Button } from '@/components/ui/button'
import { PayPalRedirectStepProps } from '@/types'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const PayPalRedirectStep = ({ paypalUrl, onBack }: PayPalRedirectStepProps) => {
  const { t } = useTranslation()
  return (
  <div className="p-6 text-center space-y-4">
    <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
        alt="PayPal"
        className="h-8 object-contain"
        width={100}
        height={100}
        unoptimized
      />
    </div>
    <div>
      <h3 className="text-lg font-bold">{t('redirecting_to_payPal')}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {t('click_the_button_below_to_complete_your_subscription_with_payPal')}
      </p>
    </div>
    <Button
      onClick={() => window.open(paypalUrl, '_self')}
      className="w-full h-11 rounded-xl font-bold bg-blue-500 hover:bg-blue-600 text-white gap-2"
    >
      <ExternalLink className="w-4 h-4" />
      {t('open_payPal')}
    </Button>
    <Button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground underline">
      {t('go_back')}
    </Button>
  </div>
)
}

export default PayPalRedirectStep
