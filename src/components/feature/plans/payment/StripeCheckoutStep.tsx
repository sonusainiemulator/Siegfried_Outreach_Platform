'use client'

import { Button } from '@/components/ui/button'
import { StripeCheckoutStepProps } from '@/types'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const StripeCheckoutStep = ({ clientSecret, stripePromise, onComplete, onBack }: StripeCheckoutStepProps) => {
  const { t } = useTranslation()
  return (
  <div className="flex flex-col">
    <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-muted/30">
      <Button
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground transition-colors"
        title="Back to selection"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
      </Button>
      <div>
        <h2 className="text-base font-bold text-foreground">{t('complete_payment')}</h2>
        <p className="text-xs text-muted-foreground">{t('secure_checkout')}</p>
      </div>
    </div>

    <div className="p-0 max-h-[60vh] overflow-y-auto">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret, onComplete }}>
        <div className="px-4 py-2">
          <EmbeddedCheckout />
        </div>
      </EmbeddedCheckoutProvider>
    </div>

    <div className="p-6 border-t border-border bg-muted/5 flex items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={onBack}
        className="rounded-xl px-8 h-12 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all"
      >
        {t('back')}
      </Button>
      <div className="text-right">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t('powered_by')}</p>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
          alt="Stripe"
          className="h-4 mt-0.5 opacity-60 ml-auto"
          width={100}
          height={100}
          unoptimized
        />
      </div>
    </div>
  </div>
)
}

export default StripeCheckoutStep
