'use client'

import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PlanBasicFieldsProps } from '@/types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const PlanBasicFields = ({ formData, onChange }: PlanBasicFieldsProps) => {
  const { t } = useTranslation()

  // Ensure billing cycle is synced with plan type
  useEffect(() => {
    if (formData.plan_type === 'lifetime' || formData.plan_type === 'prepaid') {
      if (formData.billing_cycle !== 'one-time') {
        onChange('billing_cycle', 'one-time')
      }
    } else if (formData.plan_type === 'subscription') {
      if (formData.billing_cycle === 'one-time') {
        onChange('billing_cycle', 'monthly')
      }
    }
  }, [formData.plan_type, formData.billing_cycle, onChange])

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-2 flex flex-col">
        <Label htmlFor="name" className="text-sm font-medium text-foreground">
          {t('plan_name')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder={t('enter_plan_name')}
          required
          className="h-12 rounded-[8px]  border-light-border-color focus-visible:ring-primary/20"
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <Label htmlFor="slug" className="text-sm font-medium text-foreground">
          {t('slug')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => onChange('slug', e.target.value)}
          placeholder={t('enter_plan_slug')}
          required
          className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
        />
      </div>

      <div className="sm:col-span-2 space-y-2 flex flex-col">
        <Label htmlFor="description" className="text-sm font-medium text-foreground">
          {t('description')}
        </Label>
        <Input
          id="description"
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder={t('enter_plan_description')}
          className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
        />
      </div>

      <div className="space-y-2 flex flex-col">
        <Label htmlFor="amount" className="text-sm font-medium text-foreground">
          {t('amount')} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount ?? ''}
          onChange={(e) => onChange('amount', e.target.value === '' ? '' : parseFloat(e.target.value))}
          onBlur={() => {
            if ((formData.amount as any) === '' || formData.amount === null || formData.amount === undefined) {
              onChange('amount', 0)
            }
          }}

          placeholder="0.00"
          required
          className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
        />

      </div>

      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">{t('currency')}</Label>
        <Select value={formData.currency} onValueChange={(val: unknown) => onChange('currency', val)}>
          <SelectTrigger className="h-12 rounded-[8px] border-light-border-color glass-button">
            <SelectValue placeholder={t('select_currency')} />
          </SelectTrigger>
          <SelectContent className='bg-white! dark:bg-modal-bg-color!'>
            <SelectItem value="USD">{t('usd')}</SelectItem>
            <SelectItem value="INR">{t('inr')}</SelectItem>
            <SelectItem value="EUR">{t('eur')}</SelectItem>
            <SelectItem value="GBP">{t('gbp')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">{t('plan_type')}</Label>
        <Select 
          value={formData.plan_type} 
          onValueChange={(val: string) => {
            const updates: any = { plan_type: val }
            if (val === 'lifetime' || val === 'prepaid') {
              updates.billing_cycle = 'one-time'
            } else {
              updates.billing_cycle = 'monthly'
            }
            onChange(updates)
          }}

        >
          <SelectTrigger className="h-12 rounded-[8px] border-light-border-color glass-button">
            <SelectValue placeholder={t('select_plan_type')} />
          </SelectTrigger>
          <SelectContent className='bg-white! dark:bg-modal-bg-color!'>
            <SelectItem value="subscription">{t('subscription')}</SelectItem>
            <SelectItem value="prepaid">{t('prepaid')}</SelectItem>
            <SelectItem value="lifetime">{t('lifetime')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 flex flex-col">
        <Label className="text-sm font-medium text-foreground">{t('billing_cycle')}</Label>
        <Select 
          value={formData.billing_cycle} 
          onValueChange={(val: unknown) => onChange('billing_cycle', val)}
          disabled={formData.plan_type !== 'subscription'}
        >
          <SelectTrigger className="h-12 rounded-[8px] border-light-border-color glass-button">
            <SelectValue placeholder={t('select_cycle')} />
          </SelectTrigger>
          <SelectContent className='bg-white! dark:bg-modal-bg-color!'>
            {formData.plan_type === 'subscription' ? (
              <>
                <SelectItem value="monthly">{t('monthly')}</SelectItem>
                <SelectItem value="yearly">{t('yearly')}</SelectItem>
              </>
            ) : (
              <SelectItem value="one-time">{t('one_time')}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {(formData.plan_type === 'prepaid' || formData.plan_type === 'lifetime') && (
        <div className="space-y-2 flex flex-col">
          <Label htmlFor="validity_days" className="text-sm font-medium text-foreground">
            {t('validity_days')} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="validity_days"
            type="number"
            step={1}
            min={1}
            max={365}
            value={formData.validity_days ?? ''}
            onChange={(e) => onChange('validity_days', e.target.value === '' ? '' : parseInt(e.target.value))}
            onBlur={() => {
              if ((formData.validity_days as any) === '' || formData.validity_days === null) {
                onChange('validity_days', null)
              }
            }}

            placeholder="30"
            required
            className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
          />

        </div>
      )}

      <div className="space-y-2 flex flex-col">
        <Label htmlFor="trial_days" className="text-sm font-medium text-foreground">
          {t('trial_period_days')}
        </Label>
        <Input
          id="trial_days"
          type="number"
          value={formData.trial_period_days ?? ''}
          onChange={(e) => onChange('trial_period_days', e.target.value === '' ? '' : parseInt(e.target.value))}
          onBlur={() => {
            if ((formData.trial_period_days as any) === '' || formData.trial_period_days === null) {
              onChange('trial_period_days', 0)
            }
          }}

          placeholder="0"
          className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
        />

      </div>

      <div className="flex items-center justify-between p-4 rounded-border-radius bg-muted/20 border border-glass-border glass-dark-card">
        <div className="space-y-0.5">
          <Label className="font-bold">{t('set_as_default')}</Label>
          <p className="text-xs text-muted-foreground line-clamp-1">{t('default_plan_desc')}</p>
        </div>
        <Switch checked={formData.is_default} onCheckedChange={(val: unknown) => onChange('is_default', val)} />
      </div>

      <div className="flex items-center justify-between p-4 rounded-border-radius bg-muted/20 border border-glass-border glass-dark-card">
        <div className="space-y-0.5">
          <Label className="font-bold">{t('active_status')}</Label>
          <p className="text-xs text-muted-foreground line-clamp-1">{t('plan_status_desc')}</p>
        </div>
        <Switch
          checked={formData.status === 'active'}
          onCheckedChange={(val: any) => onChange('status', val ? 'active' : 'inactive')}
        />
      </div>
    </div>
  )
}

export default PlanBasicFields
