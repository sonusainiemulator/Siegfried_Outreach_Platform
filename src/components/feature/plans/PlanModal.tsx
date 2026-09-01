'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FeatureEntry, Plan, PlanModalProps } from '@/types'
import { Loader2, Package } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PlanBasicFields from './plan-modal/PlanBasicFields'
import PlanModulesAndLimits from './plan-modal/PlanModulesAndLimits'

const DEFAULT_FORM: Partial<Plan> = {
  name: '',
  slug: '',
  description: '',
  billing_cycle: 'monthly',
  plan_type: 'subscription',
  amount: 0,
  currency: 'USD',
  module_access: [],
  validity_days: null,
  chatbot_creation_limit: 0,
  publish_post_per_day: 0,
  campaign_per_day: 0,
  total_credits: 0,
  status: 'active',
  is_default: false,
  trial_period_days: 0,
  display_order: 0,
  features: {},
  paypal_plan_id_monthly: '',
  paypal_plan_id_yearly: '',
  stripe_price_id: '',
  razorpay_plan_id: '',
}

const PlanModal = ({ isOpen, onClose, onSave, plan, isLoading = false }: PlanModalProps) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Partial<Plan>>(DEFAULT_FORM)
  const [featureList, setFeatureList] = useState<FeatureEntry[]>([])

  useEffect(() => {
    if (plan) {
      const moduleAccessIds = (plan.module_access || []).map((m: any) =>
        typeof m === 'object' && m !== null ? m.id || m._id : m
      )
      setTimeout(() => {
        setFormData({ ...plan, module_access: moduleAccessIds })
        setFeatureList(Object.entries(plan.features || {}).map(([key, value]) => ({ key, value: String(value) })))
      }, 100)
    } else {
      setTimeout(() => {
        setFormData(DEFAULT_FORM)
        setFeatureList([])
      }, 100)
    }
  }, [plan, isOpen])

  const handleChange = (field: string | Record<string, any>, value?: any) => {
    if (typeof field === 'object') {
      setFormData((prev) => ({ ...prev, ...field }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (field === 'name' && !plan) {
        setFormData((prev) => ({ ...prev, slug: (value as string).toLowerCase().replace(/\s+/g, '-') }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const features: Record<string, string> = {}
    featureList.forEach((f) => {
      if (f.key.trim()) features[f.key.trim()] = f.value
    })
    onSave({ ...formData, features })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-hidden flex flex-col border-none shadow-2xl rounded-border-radius! bg-light-body">
        <DialogHeader className=" flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-medium text-title-color dark:text-white">
              {plan ? t('edit_plan') : t('add_plan')}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
            <PlanBasicFields formData={formData} isEdit={!!plan} onChange={handleChange} />
            <PlanModulesAndLimits formData={formData} onChange={handleChange} />
          </div>

          <DialogFooter className="sm:p-6 p-4 pb-0! px-0! bg-muted/20 border-t border-glass-border gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 w-full rounded-border-radius p-button-padding! border-glass-border hover:bg-primary hover:text-white transition-all font-semibold"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name?.trim() || !formData.slug?.trim()}
              className="h-10 w-full rounded-border-radius p-button-padding! bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}...
                </>
              ) : plan ? (
                t('update')
              ) : (
                t('save')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PlanModal
