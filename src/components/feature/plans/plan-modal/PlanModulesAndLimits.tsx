'use client'

import { Checkbox } from '@/components/ui/checkbox'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useGetPermissionsQuery } from '@/redux/api/roleApi'
import { PlanModulesAndLimitsProps } from '@/types'
import { Box, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const PlanModulesAndLimits = ({ formData, onChange }: PlanModulesAndLimitsProps) => {
  const { t } = useTranslation()
  const { data: permissionsResp, isLoading } = useGetPermissionsQuery({})
  const permissions = permissionsResp?.permissions || []

  const handleModuleToggle = (moduleId: string) => {
    const currentModules = [...(formData.module_access || [])]

    // Find index handling both string IDs and object references
    const index = currentModules.findIndex(
      (m: any) => m === moduleId || (m && typeof m === 'object' && (m.id === moduleId || m._id === moduleId)),
    )

    if (index > -1) {
      currentModules.splice(index, 1)
    } else {
      currentModules.push(moduleId)
    }
    onChange('module_access', currentModules)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allModuleIds = permissions.map((m: any) => m.id)
      onChange('module_access', allModuleIds)
    } else {
      onChange('module_access', [])
    }
  }

  const allSelected = permissions.length > 0 && (formData.module_access || []).length === permissions.length

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-bold text-foreground">{t('module_access')}</Label>
          {!isLoading && permissions.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all-modules"
                checked={allSelected}
                indeterminate={
                  (formData.module_access || []).length > 0 &&
                  (formData.module_access || []).length < permissions.length
                }
                onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
              />
              <Label htmlFor="select-all-modules" className="text-sm font-medium leading-none cursor-pointer">
                {t('select_all', { defaultValue: 'Select All' })}
              </Label>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t('loading_modules')}...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {permissions.map((module: any) => {
              const isChecked = (formData.module_access || []).some(
                (m: any) =>
                  m === module.id || (m && typeof m === 'object' && (m.id === module.id || m._id === module.id)),
              )

              return (
                <div
                  key={module.id}
                  onClick={() => handleModuleToggle(module.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden",
                    isChecked 
                      ? "bg-primary/5 border-primary/30 shadow-sm ring-1 ring-primary/10" 
                      : "bg-muted/5 border-glass-border hover:border-primary/20 hover:bg-muted/10"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-primary/10 hover:text-primary",
                    isChecked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground "
                  )}>
                    <Box className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pointer-events-none">
                    <Label
                      className={cn(
                        'text-sm font-semibold leading-tight capitalize transition-colors duration-300 truncate block',
                        isChecked ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {module.module.replace(/-/g, ' ')}
                    </Label>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id={`module-${module.id}`}
                      checked={isChecked}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                      className={cn(
                        'rounded-md border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary',
                        !isChecked && 'opacity-50 group-hover:opacity-100 transition-opacity',
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="space-y-4 flex flex-col">
        <Label className="text-lg font-medium text-light-text-color">{t('plan_limits')}</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="total_credits" className="text-sm font-medium text-foreground">
              {t('total_credits')}
            </Label>
            <Input
              id="total_credits"
              type="number"
              value={formData.total_credits ?? ''}
              onChange={(e) => onChange('total_credits', e.target.value === '' ? '' : Number(e.target.value))}
              onBlur={() => {
                if ((formData.total_credits as any) === '' || formData.total_credits === null) {
                  onChange('total_credits', 0)
                }
              }}
              placeholder="0"
              className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="chatbot_creation_limit" className="text-sm font-medium text-foreground">
              {t('chatbot_creation_limit')}
            </Label>
            <Input
              id="chatbot_creation_limit"
              type="number"
              value={formData.chatbot_creation_limit ?? ''}
              onChange={(e) => onChange('chatbot_creation_limit', e.target.value === '' ? '' : Number(e.target.value))}
              onBlur={() => {
                if ((formData.chatbot_creation_limit as any) === '' || formData.chatbot_creation_limit === null) {
                  onChange('chatbot_creation_limit', 0)
                }
              }}
              placeholder="0"
              className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="publish_post_per_day" className="text-sm font-medium text-foreground">
              {t('publish_post_per_day')}
            </Label>
            <Input
              id="publish_post_per_day"
              type="number"
              value={formData.publish_post_per_day ?? ''}
              onChange={(e) => onChange('publish_post_per_day', e.target.value === '' ? '' : Number(e.target.value))}
              onBlur={() => {
                if ((formData.publish_post_per_day as any) === '' || formData.publish_post_per_day === null) {
                  onChange('publish_post_per_day', 0)
                }
              }}
              placeholder="0"
              className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="campaign_per_day" className="text-sm font-medium text-foreground">
              {t('campaign_per_day')}
            </Label>
            <Input
              id="campaign_per_day"
              type="number"
              value={formData.campaign_per_day ?? ''}
              onChange={(e) => onChange('campaign_per_day', e.target.value === '' ? '' : Number(e.target.value))}
              onBlur={() => {
                if ((formData.campaign_per_day as any) === '' || formData.campaign_per_day === null) {
                  onChange('campaign_per_day', 0)
                }
              }}
              placeholder="0"
              className="h-12 rounded-[8px] border-light-border-color focus-visible:ring-primary/20"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanModulesAndLimits
