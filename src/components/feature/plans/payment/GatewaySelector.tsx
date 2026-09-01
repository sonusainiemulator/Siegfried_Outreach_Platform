'use client'

import { Button } from '@/components/ui/button'
import { currencySymbols, gateways } from '@/data/plan'
import { cn } from '@/lib/utils'
import { Gateway, GatewaySelectorProps } from '@/types'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import useSettings from '@/hooks/useSettings'
import { Landmark } from 'lucide-react'

const GatewaySelector = ({
  plan,
  billingCycle,
  selectedGateway,
  onSelectGateway,
  onProceed,
  isInitializing,
}: GatewaySelectorProps) => {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const isOneTime = plan?.plan_type === 'prepaid' || plan?.plan_type === 'lifetime' || billingCycle === 'one-time'
  const price = plan?.amount || 0

  const symbol = currencySymbols[plan?.currency || 'USD'] || (plan?.currency || '$')

  const availableGateways = gateways.filter((g) => {
    const gatewaySetting = (settings as any)?.[g.id]
    if (gatewaySetting && typeof gatewaySetting.enabled === 'boolean') {
      return gatewaySetting.enabled
    }
    // Default fallback if settings not yet loaded or missing
    return true
  })

  const activeGateway = availableGateways.find((g) => g.id === selectedGateway) || availableGateways[0] || gateways[0]

  useEffect(() => {
    if (activeGateway && selectedGateway !== activeGateway.id) {
      onSelectGateway(activeGateway.id as Gateway)
    }
  }, [selectedGateway, activeGateway?.id, onSelectGateway])

  return (
    <div>
      <div className="sm:px-6 px-4 py-4 border-b border-border flex items-center gap-3 bg-muted/30 dark:bg-modal-bg-color">

        <div>
          <h2 className="text-xl text-title-color dark:text-white font-medium">{t('select_payment_method')}</h2>
          <p className="text-sm text-subtitle-color">
            {plan?.name} – {symbol}{Number(price).toFixed(2)}{isOneTime ? '' : `/${billingCycle === 'monthly' ? 'mo' : 'yr'}`}
          </p>
        </div>
      </div>

      <div className="sm:p-6 p-4 space-y-4">
        <div className="p-4 rounded-border-radius bg-muted/30 dark:bg-modal-bg-color border border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-subtitle-color font-medium">{t('total_amount')}</p>
            <p className="font-medium text-title-color dark:text-white">
              {plan?.name} — {isOneTime ? 'One-time' : billingCycle}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">{symbol}{Number(price).toFixed(2)}</p>
            {!isOneTime && <p className="text-sm text-subtitle-color">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold  text-subtitle-color">{t('choose_payment_method')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {availableGateways.map((gw) => (
              <Button
                key={gw.id}
                onClick={() => onSelectGateway(gw.id)}
                className={cn(
                  'relative p-4 rounded-border-radius border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200',
                  selectedGateway === gw.id ? gw.activeClass : `border-border bg-muted/20 dark:bg-modal-bg-color ${gw.hoverClass}`,
                )}
              >
                {selectedGateway === gw.id && (
                  <div
                    className={cn(
                      'absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center',
                      gw.id === 'paypal' ? 'bg-blue-500' : gw.id === 'razorpay' ? 'bg-social-blue' : gw.id === 'offline' ? 'bg-emerald-500' : 'bg-primary',
                    )}
                  >
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
                {gw.id === 'offline' ? (
                  <Landmark className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Image src={gw.logo} alt={gw.label} width={100} height={100} unoptimized className="h-5 object-contain" />
                )}
                <span className="text-xs font-bold text-foreground">{gw.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {activeGateway && (
          <div className={cn('p-3 rounded-border-radius border text-xs', activeGateway.infoClass)}>{activeGateway.infoText}</div>
        )}

        <Button
          onClick={onProceed}
          disabled={isInitializing || !activeGateway}
          className="w-full h-12 rounded-[8px] text-base font-bold bg-primary! text-white cursor-pointer transition-transform active:scale-95"
        >
          {isInitializing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('processing')}
            </>
          ) : selectedGateway === 'offline' ? (
            'Proceed with Offline Payment'
          ) : (
            `Pay with ${selectedGateway ? selectedGateway.charAt(0).toUpperCase() + selectedGateway.slice(1) : 'Gateway'}`
          )}
        </Button>

        <p className="text-center text-[10px] text-muted-foreground">
          {t('secure_encrypted_payments')}. {t('multi_currency_supported')}.
        </p>
      </div>
    </div>
  )
}

export default GatewaySelector
