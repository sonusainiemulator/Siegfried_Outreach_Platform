'use client'

import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MaintenanceModeCardProps } from '@/types'
import { useFormikContext } from 'formik'
import { ShieldAlert, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import InlineImageUpload from '../components/InlineImageUpload'

const MaintenanceModeCard = ({ files, setFiles, currentImageUrl }: MaintenanceModeCardProps) => {
  const { t } = useTranslation()
  const { values, setFieldValue } = useFormikContext<any>()

  return (
    <Card className="border-input-border-color  glass-dark-card rounded-border-radius overflow-hidden group transition-all duration-500">
      <CardHeader className="pb-4 p-6 border-b border-glass-border/30">
        <div className="flex items-center justify-between">
          <div className='space-y-1'>
            <div className="flex items-center gap-2">
              <div className="text-primary">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-medium text-title-color dark:text-white">
                {t('maintenance_mode', { defaultValue: 'Maintenance Mode' })}
              </CardTitle>
              <div>
              </div>
            </div>
            <CardDescription className="text-sm font-medium text-subtitle-color">
              {t('control_app_availability', { defaultValue: 'Temporarily disable public access' })}
            </CardDescription>

          </div>
          <Switch
            checked={values.maintenance_mode}
            onCheckedChange={(checked) => setFieldValue('maintenance_mode', checked)}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </CardHeader>
      <CardContent
        className={`pt-6 space-y-4 sm:p-6 p-4 transition-all duration-700 ${!values.maintenance_mode ? 'opacity-40 pointer-events-none filter grayscale-[0.8] scale-[0.98]' : ''}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4 sm:col-span-1">
            <TextInput name="maintenance_title" label={t('maintenance_title')} placeholder="Under Maintenance" />
            <TextAreaField
              name="maintenance_message"
              label={t('maintenance_message')}
              placeholder="Tell users why..."
            />
            <TextInput
              name="maintenance_image_url"
              label={t('maintenance_image_url', { defaultValue: 'Maintenance Image URL' })}
              placeholder="https://example.com/image.png"
            />
          </div>
          <div className="sm:col-span-1">
            <InlineImageUpload
              label="Maintenance Image Upload"
              currentUrl={
                files.maintenance_image === 'null'
                  ? null
                  : files.maintenance_image instanceof File
                    ? null
                    : values.maintenance_image_url || currentImageUrl
              }
              onFileSelect={(file) => setFiles((prev) => ({ ...prev, maintenance_image: file }))}
              onRemove={() => setFiles((prev) => ({ ...prev, maintenance_image: 'null' }))}
            />
          </div>
        </div>
        <div className="pt-2 space-y-3">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-foreground ">
              {t('allowed_ips', { defaultValue: 'Allowed IPs' })}
            </Label>
            <div className="flex flex-wrap gap-2 p-3 glass-dark-card rounded-border-radius! border border-input-border-color bg-accent/5 focus-within:border-primary/50 transition-all min-h-[50px]">
              {(values.maintenance_allowed_ips || []).map((ip: string, index: number) => (
                <div key={index} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold animate-in zoom-in duration-300">
                  {ip}
                  <Button
                    onClick={() => {
                      const newIps = values.maintenance_allowed_ips.filter((_: any, i: number) => i !== index);
                      setFieldValue('maintenance_allowed_ips', newIps);
                    }}
                    className="hover:text-destructive transition-colors bg-unset! p-0!"
                  >
                    <X className="w-3 h-3 " />
                  </Button>
                </div>
              ))}
              <Input
                className="flex-1 bg-transparent border-none outline-hidden text-xs min-w-[120px]"
                placeholder={t('press_enter_to_add_ip', { defaultValue: 'Type IP and press Enter...' })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !values.maintenance_allowed_ips?.includes(val)) {
                      setFieldValue('maintenance_allowed_ips', [...(values.maintenance_allowed_ips || []), val]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MaintenanceModeCard
