'use client'

import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Label from '@/components/ui/label'
import { useCreateSegmentMutation, useUpdateSegmentMutation } from '@/redux/api/segmentApi'
import { ApiError, SegmentModalProps } from '@/types'
import { segmentSchemas } from '@/utils/validation-schemas'
import { FieldArray, Form, Formik } from 'formik'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function SegmentModal({ isOpen, onClose, segment }: SegmentModalProps) {
  const { t } = useTranslation()
  const [createSegment, { isLoading: isCreating }] = useCreateSegmentMutation()
  const [updateSegment, { isLoading: isUpdating }] = useUpdateSegmentMutation()

  const isEditing = !!segment

  const initialValues = {
    name: segment?.name || '',
    description: segment?.description || '',
    conditions: segment?.conditions || [],
  }

  const handleSubmit = async (values: typeof initialValues) => {
    if (values.conditions.length === 0) {
      toast.error(t('at_least_one_condition_required') || 'At least one condition is required')
      return
    }

    try {
      if (isEditing && segment) {
        const res = await updateSegment({ id: segment.id, ...values }).unwrap()
        toast.success(res.message || t('segment_updated_successfully'))
      } else {
        const res = await createSegment(values).unwrap()
        toast.success(res.message || t('segment_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  const fields = [
    { label: t('email'), value: 'email' },
    { label: t('name'), value: 'name' },
    { label: t('tags'), value: 'tags' },
  ]

  const operators = [
    { label: t('equals'), value: 'equals' },
    { label: t('contains'), value: 'contains' },
    { label: t('starts_with'), value: 'starts_with' },
    { label: t('ends_with'), value: 'ends_with' },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! rounded-border-radius!  no-scrollbar max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('edit') + ' ' + t('audience') : t('create') + ' ' + t('audience')}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={segmentSchemas.create(t)}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form className="space-y-4 py-4 pb-0!">
              <TextInput name="name" label={t('name') + '*'} placeholder={t('enter_name')} />
              <TextAreaField
                name="description"
                label={t('description')}
                placeholder={t('enter_description')}
                rows={3}
              />

              <Label className="text-sm font-medium">{t('criteria') + '*'}</Label>
              <div className="space-y-4 border rounded-border-radius p-4 glass-card glass-dark-card">
                <FieldArray name="conditions">
                  {({ push, remove }) => {
                    const isLastConditionEmpty =
                      values.conditions.length > 0 && !String(values.conditions[values.conditions.length - 1].value).trim()

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-primary! text-white"
                            onClick={() => push({ field: 'email', operator: 'contains', value: '' })}
                            disabled={isLastConditionEmpty}
                          >
                            <Plus className="w-4 h-4" />
                            {t('add_condition')}
                          </Button>
                        </div>

                        {values.conditions.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">{t('no_criteria_added')}</p>
                        )}

                        {values.conditions.map((criterion: any, index: number) => (
                          <div key={index} className="group relative">
                            <div className="grid grid-cols-2 gap-3 flex-1 p-3 glass-card glass-dark-card rounded-border-radius">
                              <div className="space-y-1.5 flex flex-col">
                                <Label className="text-sm font-medium text-foreground">{t('field')}</Label>
                                <select
                                  name={`conditions.${index}.field`}
                                  value={criterion.field}
                                  onChange={handleChange}
                                  className="flex h-12 w-full rounded-[8px] glass-card glass-dark-card px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {fields.map((f) => (
                                    <option className='dark:bg-black' key={f.value} value={f.value}>
                                      {f.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1.5 flex flex-col">
                                <Label className="text-sm font-medium text-foreground">{t('operator')}</Label>
                                <select
                                  name={`conditions.${index}.operator`}
                                  value={criterion.operator}
                                  onChange={handleChange}
                                  className="flex h-12 w-full rounded-[8px] glass-card px-3 py-1 text-sm glass-dark-card transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {operators.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1.5 flex flex-col">
                                <Label className="text-sm font-medium text-foreground">{t('value')}</Label>
                                <TextInput
                                  name={`conditions.${index}.value`}
                                  placeholder={t('enter_value')}
                                  className="h-12"
                                />
                              </div>
                              <div className="flex items-end justify-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive bg-destructive/20 hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-all duration-200 absolute -top-3 -right-3"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  }}
                </FieldArray>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className=" w-full! h-12! rounded-[8px] bg-light-gray text-light-text-color dark:text-white transition-all font-medium dark:border-none"
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !values.name.trim() ||
                    values.conditions.length === 0 ||
                    values.conditions.some((c: any) => !String(c.value).trim())
                  }
                  className="w-full! h-12! rounded-[8px] bg-primary! text-white transition-all font-semibold"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? t('update') : t('create')}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
