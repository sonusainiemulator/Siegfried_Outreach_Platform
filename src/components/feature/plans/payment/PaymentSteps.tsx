'use client'

import { Button } from '@/components/ui/button'
import { ConfirmingStepProps, RazorpayCheckoutStepProps, SuccessStepProps } from '@/types'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export const RazorpayCheckoutStep = ({ onBack }: RazorpayCheckoutStepProps) => {
  const { t } = useTranslation()
  return (
  <div className="p-10 text-center space-y-6">
    <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center animate-pulse">
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
        alt="Razorpay"
        width={100}
        height={100}
        unoptimized
        className="h-6 object-contain"
      />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-black">{t('checkout_in_progress')}</h3>
      <p className="text-sm text-muted-foreground">{t('please_complete_your_transaction_in_the_secure_razorpay_window')}</p>
    </div>
    <Button variant="outline" onClick={onBack} className="w-full rounded-xl border-dashed">
      {t('cancel_or_choose_different_method')}
    </Button>
  </div>
)
}

export const ConfirmingStep = (_props: ConfirmingStepProps) => {
  const { t } = useTranslation()
  return (
  <div className="p-12 text-center space-y-6">
    <div className="relative flex justify-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      <Loader2 className="w-24 h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-spin opacity-40" />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-black">{t('finalizing_activation')}</h3>
      <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
        {t('we_are_confirming_your_payment_with_the_gateway_this_will_just_take_a_moment')}
      </p>
    </div>
  </div>
)
}

export const SuccessStep = ({ plan, onClose }: SuccessStepProps) => {
  const { t } = useTranslation()
  return (
  <div className="p-8 text-center space-y-4">
    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
      <CheckCircle2 className="w-8 h-8 text-green-600" />
    </div>
    <div>
      <h3 className="text-xl font-black">{t('subscription_successful')}</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {t('you_are_now_subscribed_to_the')} <span className="font-bold text-foreground">{plan?.name}</span> {t('plan_your_access_is_active_immediately')}
      </p>
    </div>
    <Button
      onClick={() => {
        onClose()
        window.location.href = '/subscriptions'
      }}
      className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20"
    >
      {t('view_my_subscription')}
    </Button>
  </div>
  )
}
