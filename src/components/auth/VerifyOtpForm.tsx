'use client'

import OtpInput from '@/components/shared/form-fields/OtpInput'
import FormFieldWrapper from '@/components/shared/form-fields/widgets/FormFieldWrapper'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useResendOtpMutation, useVerifyOtpMutation } from '@/redux/api/authApi'
import { ApiError } from '@/types/api'
import { VerifyOtpFormValues } from '@/types/auth'
import { authSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const VerifyOtpForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  const handleSubmit = async (values: VerifyOtpFormValues) => {
    try {
      const response = await verifyOtp({ email, otp: values.otp }).unwrap()
      toast.success(response.message || t('otp_verified_successfully'))
      router.push(
        `${ROUTES.AUTH.RESET_PASSWORD}?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(values.otp)}`,
      )
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('invalid_otp'))
    }
  }

  const handleResend = async () => {
    try {
      const response = await resendOtp({ email }).unwrap()
      toast.success(response.message || t('otp_resent_successfully'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_resend_otp'))
    }
  }

  return (
    <Formik
      initialValues={{
        otp: '',
      }}
      validationSchema={authSchemas.verifyOtp(t)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values, touched, errors }) => (
        <Form className="space-y-8 ">
          <FormFieldWrapper label={t('otp_code')} id="otp" name="otp" error={errors.otp} touched={!!touched.otp}>
            <OtpInput
              digits={6}
              value={values.otp.split('')}
              onChange={(val) => setFieldValue('otp', val.join(''))}
              className="mt-2"
            />
          </FormFieldWrapper>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full h-12 rounded-full text-white bg-primary! dark:bg-white hover:opacity-90 dark:hover:bg-white text-base font-medium active:scale-95 transition-all duration-300 transform-gpu border-none"
              disabled={isSubmitting || isVerifying}
            >
              {isSubmitting || isVerifying ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  {t('verifying')}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 group text-[15px]!">
                  <span className="opacity-90 tracking-[0.05em]">{t('verify_otp')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all duration-500 ease-in-out" />
                </div>
              )}
            </Button>
          </motion.div>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 cursor-pointer p-0 h-auto"
            >
              {isResending ? t('resending') : t('resend_otp_question')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default VerifyOtpForm
