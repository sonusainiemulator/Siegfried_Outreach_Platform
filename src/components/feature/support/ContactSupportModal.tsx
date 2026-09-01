'use client'

import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateContactInquiryMutation } from '@/redux/api/contactInquiryApi'
import { ApiError, ContactSupportModalProps } from '@/types'
import { Form, Formik } from 'formik'
import { Loader2, Mail, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as yup from 'yup'

export default function ContactSupportModal({ isOpen, onClose }: ContactSupportModalProps) {
  const { t } = useTranslation()
  const [createInquiry, { isLoading }] = useCreateContactInquiryMutation()

  const validationSchema = yup.object({
    name: yup.string().required(t('name_required')),
    email: yup.string().email(t('invalid_email')).required(t('email_required')),
    subject: yup.string().required(t('subject_required', 'Subject is required')),
    message: yup.string().required(t('description_required')).min(10, t('message_too_short', 'Message is too short')),
  })

  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await createInquiry(values).unwrap()
      toast.success(t('message_sent_successfully'))
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0! overflow-hidden bg-light-body backdrop-blur-2xl border border-white/10 rounded-border-radius! shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="sm:p-6 p-4 sm:pr-12 pr-12  relative overflow-hidden">
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-medium text-title-color dark:text-white">
              {t('contact_support_title')}
            </DialogTitle>
            <p className="text-subtitle-color font-medium pr-12 rtl:pr-0 rtl:pl-12  text-left rtl:text-right">{t('contact_support_desc')}</p>
          </DialogHeader>
        </div>

        <div className=" ">
          <div className="  sm:p-6 p-4 pb-0! ">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {() => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <TextInput name="name" label={t('full_name')} placeholder={t('enter_name')} />
                    </div>
                    <div className="relative group">
                      <TextInput name="email" label={t('email_address')} placeholder={t('email_placeholder')} />
                    </div>
                  </div>

                  <TextInput
                    name="subject"
                    label={t('subject')}
                    placeholder={t('enter_subject') || "What's this regarding?"}
                  />

                  <TextAreaField
                    name="message"
                    label={t('message')}
                    placeholder={t('how_can_we_help') || 'Tell us more about your issue...'}
                    rows={4}
                  />

                  <div className="pt-2 flex itmes-center justify-center">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="sm:h-12 h-10 rounded-[8px] bg-primary! text-white text-base font-medium transition-all flex items-center justify-center gap-2 group"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 " />
                      ) : (
                        <>
                          {t('send_message')}
                          <Send className="h-5 w-5 " />
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="my-6 text-center">
            <p className="text-xs flex-col sm:flex-row text-muted-foreground font-medium flex items-center justify-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              {t('or_email_us_directly_at')}{' '}
              <span className="text-primary hover:underline cursor-pointer">{t('support_email')}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

