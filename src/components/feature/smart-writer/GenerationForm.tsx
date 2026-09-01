'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textArea'
import { aiWriterModels } from '@/data/smartWriter'
import { cn } from '@/lib/utils'
import { GenerationFormProps } from '@/types/components/smartWriter'
import { useFormik } from 'formik'
import { History, Loader2, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

const GenerationForm = ({
  template,
  onSubmit,
  isLoading,
  layout = 'vertical',
}: GenerationFormProps & { layout?: 'vertical' | 'horizontal' }) => {
  const { t } = useTranslation()

  const initialValues: Record<string, any> = {
    modelName: 'deepseek/deepseek-chat',
    variantsCount: 1,
  }

  template.formFields?.forEach((field) => {
    if (field.type === 'select' && field.options?.length) {
      initialValues[field.name] = field.options[0]
    } else {
      initialValues[field.name] = ''
    }
  })

  const validationSchema = Yup.object().shape({
    variantsCount: Yup.number()
      .min(1, t('min_variants_required', { defaultValue: 'Min 1 variant' }))
      .max(10, t('max_variants_limit', { defaultValue: 'Max 10 variants' }))
      .required(t('variants_required', { defaultValue: 'Required' })),
    modelName: Yup.string().required(t('model_required', { defaultValue: 'Required' })),
    ...(template.formFields || []).reduce((acc: any, field) => {
      if (field.required) {
        acc[field.name] = Yup.string().required(`${field.label} is required`)
      }
      return acc
    }, {}),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className={cn('space-y-10', layout === 'horizontal' && 'space-y-0')}>
      <div className={cn('space-y-4', layout === 'horizontal' && 'flex flex-wrap items-stretch gap-4')}>
        {/* Compact Field: Variants */}
        <div className={cn('flex flex-col', layout === 'horizontal' ? 'w-[100px] shrink-0' : 'space-y-1 mb-4')}>
          <Label className="text-xs font-medium capitalize tracking-tighter text-subtitle-color  mb-1 truncate">
            {t('draft_variants')}
          </Label>
          <Input
            name="variantsCount"
            type="number"
            min="1"
            max="10"
            value={formik.values.variantsCount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={cn(
              'h-10 inner-card glass-dark-card rounded-[8px] font-medium text-center',
              formik.touched.variantsCount && formik.errors.variantsCount && 'border-red-500',
            )}
          />
        </div>

        {/* Flexible Fields: Main Inputs */}
        {(template.formFields || [])
          .filter((f) => f.name !== 'variantsCount' && f.name !== 'modelName')
          .map((field) => (
            <div
              key={field.name}
              className={cn(
                'flex flex-col',
                layout === 'horizontal'
                  ? field.type === 'textarea'
                    ? 'w-full'
                    : 'flex-1 min-w-[200px]'
                  : 'space-y-1 mb-4',
              )}
            >
              <Label className="text-xs font-medium capitalize tracking-tighter text-subtitle-color  mb-1 truncate">
                {field.label} {field.required && <span className="text-red-500">•</span>}
              </Label>

              {field.type === 'textarea' ? (
                <Textarea
                  name={field.name}
                  value={formik.values[field.name] || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={field.placeholder || ''}
                  className={cn(
                    'inner-card rounded-[8px] min-h-[40px] max-h-[120px] focus-visible:ring-primary/20 font-medium text-sm py-2',
                    formik.touched[field.name] && formik.errors[field.name] && 'border-red-500',
                  )}
                />
              ) : field.type === 'select' ? (
                <Select
                  name={field.name}
                  onValueChange={(value) => formik.setFieldValue(field.name, value)}
                  defaultValue={formik.values[field.name]}
                >
                  <SelectTrigger className="inner-card rounded-[8px] h-10 focus:ring-primary/20 shadow-none font-medium text-xs">
                    <SelectValue placeholder={field.placeholder || `${t('writer_select')} ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-dark-muted rounded-border-radius border-zinc-200 dark:border-zinc-800">
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option} className="rounded-lg font-medium p-2">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  name={field.name}
                  value={formik.values[field.name] || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={field.type}
                  placeholder={field.placeholder || ''}
                  className={cn(
                    'inner-card rounded-[8px] h-10 focus-visible:ring-primary/20 font-medium text-sm px-3',
                    formik.touched[field.name] && formik.errors[field.name] && 'border-red-500',
                  )}
                />
              )}
            </div>
          ))}

        {/* Compact Field: Model */}
        <div className={cn('flex flex-col', layout === 'horizontal' ? 'w-[180px] shrink-0' : 'space-y-1 mb-4')}>
          <Label className="text-xs font-medium capitalize tracking-tighter text-subtitle-color  mb-1 truncate">
            {t('writer_select_model')}
          </Label>
          <Select
            name="modelName"
            onValueChange={(value) => formik.setFieldValue('modelName', value)}
            defaultValue={formik.values.modelName}
          >
            <SelectTrigger className="inner-card rounded-[8px] h-10 shadow-none font-medium text-xs">
              <SelectValue placeholder={t('writer_select_model')} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-dark-muted border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
              {aiWriterModels.map((model) => (
                <SelectItem
                  key={model.value}
                  value={model.value}
                  className="rounded-lg dark:hover:bg-dark-muted font-bold p-2 text-xs"
                >
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fixed Position: Submit */}
        <div className={cn('flex items-center', layout === 'horizontal' ? 'h-10 self-center mt-1' : 'pt-4')}>
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              'rounded-[8px] btn-color text-white transition-all duration-500 font-medium text-sm flex items-center justify-center gap-2 group shadow-md px-6 capitalize tracking-wider',
              layout === 'horizontal' ? 'h-10' : 'h-12 w-full',
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
            )}
            {isLoading ? t('generating_content') : t('generate_content')}
          </Button>
        </div>
      </div>

      {layout === 'vertical' && (
        <div className="flex items-center justify-center gap-2 py-4">
          <History className="w-4 h-4 text-subtitle-color" />
          <span className="text-sm font-medium text-subtitle-color">{t('writer_recent_generations')}</span>
        </div>
      )}
    </form>
  )
}

export default GenerationForm
