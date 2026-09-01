'use client'
import AuthInput from '@/components/auth/AuthInput'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useResetPasswordMutation } from '@/redux/api/authApi'
import { ApiError } from '@/types/api'
import { ResetPasswordFormValues } from '@/types/auth'
import { authSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const ResetPasswordForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const otp = searchParams.get('otp') || ''

  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const response = await resetPassword({
        email,
        otp,
        newPassword: values.password,
      }).unwrap()

      toast.success(response.message || t('password_reset_successfully'))
      router.push(ROUTES.AUTH.LOGIN)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_reset_password'))
    }
  }

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
      }}
      validationSchema={authSchemas.resetPassword(t)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <AuthInput
              name="password"
              label={t('new_password')}
              type="password"
              icon={Lock}
              placeholder={t('enter_new_password')}
              className="border-white/10 h-12 dark:bg-black/40 rounded-[8px] glass-card"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AuthInput
              name="confirmPassword"
              label={t('confirm_new_password')}
              type="password"
              icon={Lock}
              placeholder={t('confirm_your_password')}
              className="border-white/10 h-12 dark:bg-black/40 rounded-[8px] glass-card"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full h-12 rounded-full text-white bg-primary! dark:bg-white hover:opacity-90 dark:hover:bg-white text-base font-medium active:scale-95 transition-all duration-300 transform-gpu border-none"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  {t('resetting')}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 group text-[15px]!">
                  <span className="opacity-90 tracking-[0.05em]">{t('reset_password')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all duration-500 ease-in-out" />
                </div>
              )}
            </Button>
          </motion.div>
        </Form>
      )}
    </Formik>
  )
}

export default ResetPasswordForm
