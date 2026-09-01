'use client'

import TextInput from '@/components/shared/form-fields/TextInput'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { generalResourceLimit } from '@/data/setting'
import { FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ResourceLimitsCard = () => {
  const { t } = useTranslation()

  return (
    <Card className="border-input-border-color  glass-dark-card rounded-border-radius overflow-hidden group transition-all duration-500 lg:col-span-1">
      <CardHeader className="pb-2! sm:p-6 p-4 border-b border-glass-border/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className=" text-emerald-500">
              <FileText className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-medium text-title-color dark:text-white">
              {t('resource_limits', { defaultValue: 'Resource Limits' })}
            </CardTitle>
          </div>
          <div>
            <CardDescription className="text-sm font-medium text-subtitle-color">
              {t('set_upload_and_content_limits', { defaultValue: 'Set boundaries for files and messages' })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 sm:p-6 p-4 pt-2!">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {generalResourceLimit.map((field) => (
            <div key={field.name} className="relative group/input">
              <TextInput
                name={field.name}
                label={
                  <div className="flex items-center gap-2">
                    <span>{field.label}</span>
                    <span className="text-sm opacity-60 group-hover/input:opacity-100 transition-opacity">
                      {field.icon}
                    </span>
                  </div>
                }
                type="number"
                className="transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourceLimitsCard
