'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PlanCardProps } from '@/types'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const PlanCard = ({ plan, index, billingCycle, isCurrent, onSubscribe }: PlanCardProps) => {
  const { t } = useTranslation()
  const price = plan.amount
  const isHighlighted = plan.slug === 'pro' || index === 1

  return (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (index + 1) }}
      className={cn(
        'group relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden',
        isHighlighted
          ? 'bg-card border-primary/30 shadow-2xl shadow-primary/10 scale-105 z-10'
          : 'bg-card/50 backdrop-blur-xl border-glass-border hover:border-primary/20',
      )}
    >
      {isHighlighted && (
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-black">{plan.name}</h3>
          <p className="text-sm text-muted-foreground font-medium">{plan.description}</p>
        </div>
        {index === 1 && (
          <Badge className="bg-primary hover:bg-primary font-bold rounded-lg px-3 py-1">{t('most_popular')}</Badge>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-black tracking-tight">
          {plan.currency === 'INR' ? '₹' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : '$'}
          {price}
        </span>
        <span className="text-muted-foreground font-medium">/{billingCycle === 'monthly' ? t('mo') : t('yr')}</span>
      </div>

      <div className="space-y-4 mb-10 flex-1">
        {Object.entries(plan.features || {}).map(([key, value]) => (
          <div key={key} className="flex items-center gap-3 group/feature">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 transition-all group-hover/feature:bg-green-500 group-hover/feature:border-green-500">
              <Check className="w-3 h-3 text-green-600 group-hover/feature:text-white" />
            </div>
            <span className="text-sm font-medium text-foreground/80 group-hover/feature:text-foreground transition-colors">
              {key}: <span className="font-bold">{String(value)}</span>
            </span>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onSubscribe(plan)}
        disabled={isCurrent}
        variant={index === 1 ? 'default' : 'outline'}
        className={cn(
          'h-12 w-full rounded-2xl font-bold transition-all relative overflow-hidden group/btn disabled:opacity-50',
          index === 1 && 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 px-8',
        )}
      >
        {isCurrent ? (
          t('current_plan')
        ) : parseFloat(String(price)) === 0 ? (
          t('get_started')
        ) : (
          <>
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            {t('subscribe')}
          </>
        )}
      </Button>
    </motion.div>
  )
}

export default PlanCard
