import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCreateFaqMutation, useUpdateFaqMutation } from '@/redux/api/faqApi'
import { ApiError, FaqModalProps } from '@/types'
import { faqSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function FaqModal({ isOpen, onClose, faq }: FaqModalProps) {
  const { t } = useTranslation()
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation()
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation()

  const isEditing = !!faq

  const initialValues = {
    title: faq?.title || '',
    description: faq?.description || '',
    status: faq?.status ?? true,
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing && faq) {
        const res = await updateFaq({ id: faq.id, ...values }).unwrap()
        toast.success(res.message || t('faq_updated_successfully'))
      } else {
        const res = await createFaq(values).unwrap()
        toast.success(res.message || t('faq_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! rounded-border-radius no-scrollbar">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('edit_faq') : t('create_faq')}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={faqSchemas.create(t)}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4 py-4 pb-0!">
              <TextInput name="title" label={t('title')} placeholder={t('enter_faq_title')} />
              <TextAreaField
                name="description"
                label={t('description')}
                placeholder={t('enter_faq_description')}
                rows={4}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={values.status}
                  onCheckedChange={(checked) => setFieldValue('status', checked)}
                />
                <Label htmlFor="status">{t('active')}</Label>
              </div>
              <DialogFooter>
                <Button className="w-full sm:h-12 h-10 bg-light-gray text-light-text-color dark:text-white" type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  {t('cancel')}
                </Button>
                <Button className="w-full sm:h-12 h-10 bg-primary! text-white" type="submit" disabled={isLoading}>
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
