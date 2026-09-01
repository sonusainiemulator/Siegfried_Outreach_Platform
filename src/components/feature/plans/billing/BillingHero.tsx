'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BillingHeroProps } from '@/types'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BillingHero = ({ billingCycle, onToggle }: BillingHeroProps) => {
  const { t } = useTranslation()
  return (
    <div className="relative overflow-hidden pt-12 text-center space-y-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
      >
        <Shield className="w-4 h-4" />
        {t('pricing')}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-6xl font-black tracking-tighter"
      >
        {t('choose_your_plan')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium"
      >
        {t('flexible_plans_desc')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-4 pt-4"
      >
        <span
          className={cn(
            'text-sm font-bold transition-colors',
            billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {t('pay_monthly')}
        </span>
        <Button
          onClick={onToggle}
          className="relative w-16 h-8 rounded-full bg-muted border border-border flex items-center p-1 transition-all"
        >
          <motion.div
            animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
            className="w-6 h-6 rounded-full bg-primary shadow-lg shadow-primary/20"
          />
        </Button>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-bold transition-colors',
              billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {t('pay_yearly')}
          </span>
          <Badge className="bg-green-500 hover:bg-green-600 text-[10px] h-5 rounded-md animate-pulse">
            {t('save_20')}
          </Badge>
        </div>
      </motion.div>
    </div>
  )
}

export default BillingHero
