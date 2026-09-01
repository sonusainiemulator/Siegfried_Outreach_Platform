'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FeatureEntry, Plan, PlanFormProps } from '@/types'
import { ArrowLeft, Loader2, Package, Save, Shield, Wand2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
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

const PlanForm = ({ plan, onSave, isLoading = false }: PlanFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<Plan>>(DEFAULT_FORM)
  const [featureList, setFeatureList] = useState<FeatureEntry[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [initialFormData, setInitialFormData] = useState<Partial<Plan>>(DEFAULT_FORM)

  useEffect(() => {
    if (plan) {
      const moduleAccessIds = (plan.module_access || []).map((m: any) =>
        typeof m === 'object' && m !== null ? m.id || m._id : m,
      )
      const initialData = { ...plan, module_access: moduleAccessIds }
      setFormData(initialData)
      setInitialFormData(initialData)
      setFeatureList(Object.entries(plan.features || {}).map(([key, value]) => ({ key, value: String(value) })))
    } else {
      setFormData(DEFAULT_FORM)
      setInitialFormData(DEFAULT_FORM)
      setFeatureList([])
    }
  }, [plan])

  const handleChange = useCallback(
    (field: string | Record<string, any>, value?: any) => {
      if (typeof field === 'object') {
        setFormData((prev) => ({ ...prev, ...field }))
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (field === 'name' && !plan) {
          setFormData((prev) => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, '-') }))
        }
      }
    },
    [plan],
  )

  const isStep1Valid = () => {
    const isBasicValid =
      !!formData.name?.trim() && !!formData.slug?.trim() && formData.amount !== undefined && formData.amount !== null
    if (formData.plan_type === 'prepaid' || formData.plan_type === 'lifetime') {
      return isBasicValid && !!formData.validity_days
    }
    return isBasicValid
  }

  const hasChanges = () => {
    if (!plan) return true

    // Simple deep compare for our flat-ish structure
    const currentModuleAccess = JSON.stringify([...(formData.module_access || [])].sort())
    const initialModuleAccess = JSON.stringify([...(initialFormData.module_access || [])].sort())

    if (currentModuleAccess !== initialModuleAccess) return true

    // Compare other fields
    const fieldsToCompare: (keyof Plan)[] = [
      'name',
      'slug',
      'description',
      'amount',
      'currency',
      'plan_type',
      'billing_cycle',
      'validity_days',
      'trial_period_days',
      'status',
      'is_default',
    ]

    for (const field of fieldsToCompare) {
      if (formData[field] !== initialFormData[field]) return true
    }

    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isStep1Valid()) return

    const features: Record<string, string> = {}
    featureList.forEach((f) => {
      if (f.key.trim()) features[f.key.trim()] = f.value
    })
    await onSave({ ...formData, features })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative sm:p-6 p-4 rounded-border-radius border border-light-border-color overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-medium text-title-color dark:text-white">
                  {plan ? t('edit_plan') : t('create_new_plan')}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={cn(
                      'h-1.5 w-10 rounded-full transition-all duration-300',
                      currentStep === 1 ? 'bg-primary' : 'bg-primary/20',
                    )}
                  />
                  <div
                    className={cn(
                      'h-1.5 w-10 rounded-full transition-all duration-300',
                      currentStep === 2 ? 'bg-primary' : 'bg-primary/20',
                    )}
                  />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    {t('step')} {currentStep} {t('of')} 2
                  </span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground font-medium max-w-xl text-sm pl-1">
              {currentStep === 1 ? t('basic_info_tip') : t('modules_tip')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-[8px] sm:h-12 h-10 px-6 font-medium gap-2 shadow-none border-none btn-color text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            {t('back_to_list')}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto w-full">
        {/* Content Area - Full Width */}
        <div className="space-y-10">
          <div className="sm:p-6 p-4 rounded-border-radius glass-card glass-dark-card border border-light-border-color backdrop-blur-md min-h-137.5 relative overflow-hidden group">
            <div className="relative z-10 transition-all duration-500">
              <div className="mb-10 flex items-center justify-between border-b border-light-border-color pb-6">
                <div>
                  <h2 className="text-xl font-medium text-title-color dark:text-white flex items-center gap-3">
                    {currentStep === 1 ? (
                      <>
                        <Package className="w-6 h-6 text-primary" />
                        {t('basic_info')}
                      </>
                    ) : (
                      <>
                        <Shield className="w-6 h-6 text-primary" />
                        {t('modules_limits')}
                      </>
                    )}
                  </h2>
                  <p className="text-subtitle-color text-sm font-medium mt-1">
                    {currentStep === 1
                      ? t('configure_pricing_and_feature_access')
                      : t('update_plan_details_and_permissions')}
                  </p>
                </div>
                <div className="px-4 py-2 rounded-[8px] bg-primary/10 border border-primary/10">
                  <span className="text-primary font-black text-sm">0{currentStep}</span>
                </div>
              </div>

              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <PlanBasicFields formData={formData} isEdit={!!plan} onChange={handleChange} />
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <PlanModulesAndLimits formData={formData} onChange={handleChange} />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:gap-6 gap-3 sm:p-6 p-4 rounded-border-radius border border-glass-border backdrop-blur-md">
            {currentStep === 1 ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="rounded-[8px] sm:h-12 h-10 px-8 font-medium text-light-text-color border border-light-border-color bg-light-gray dark:text-white hover:bg-light-gray"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStep1Valid()}
                  className="rounded-[8px] sm:h-12 h-10 px-8 font-medium text-sm transition-all active:scale-95 gap-3 btn-color text-white group"
                >
                  {t('next')}
                  <Wand2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-[8px] sm:h-12 h-10 px-10 font-medium  btn-color text-white flex items-center gap-2 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                  {t('back')}
                </Button>
                <div className="flex items-center gap-4 flex-wrap">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="rounded-[8px] sm:h-12 h-10 px-8 font-medium bg-light-gray glass-card border border-light-border-color text-light-text-color dark:text-white hover:bg-light-gray"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !isStep1Valid() || !hasChanges()}
                    className="rounded-[8px] sm:h-12 h-10 px-12 font-medium text-sm btn-color text-white transition-all active:scale-95 gap-3 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        {t('synchronizing')}...
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        {plan ? t('update_plan') : t('create_plan')}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlanForm
