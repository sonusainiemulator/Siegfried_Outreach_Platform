'use client'
import AuthInput from '@/components/auth/AuthInput'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useRegisterMutation } from '@/redux/api/authApi'
import { ApiError } from '@/types/api'
import { RegisterFormValues } from '@/types/auth'
import { authSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const RegisterForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword, ...registerData } = values
      const response = await register(registerData).unwrap()
      toast.success(response.message || t('account_created_successfully'))

      // Redirect to login with email
      router.push(`${ROUTES.AUTH.LOGIN}?email=${encodeURIComponent(values.email)}`)
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError?.data?.message || t('registration_failed')
      toast.error(errorMessage)
    }
  }

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={authSchemas.register(t)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <AuthInput
              label={t('name')}
              name="name"
              icon={User}
              placeholder={t('enter_name')}
              className="border-white/10 h-12 dark:bg-black/40 rounded-[8px] glass-card"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AuthInput
              label={t('email')}
              name="email"
              type="email"
              icon={Mail}
              placeholder={t('email_placeholder')}
              className="border-white/10 h-12 dark:bg-black/40 rounded-[8px] glass-card"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AuthInput
              label={t('password')}
              name="password"
              type="password"
              icon={Lock}
              placeholder={t('create_password')}
              className="border-white/10 h-12 dark:bg-black/40 rounded-[8px] glass-card"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AuthInput
              label={t('confirm_password')}
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder={t('confirm_your_password')}
              className="border-white/10 h-12 dark:bg-black/40 rounded-[8px] glass-card"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="pt-2"
          >
            <Button
              type="submit"
              className="w-full h-12 rounded-full text-white bg-primary! dark:bg-white hover:opacity-90 dark:hover:bg-white text-base font-medium active:scale-95 transition-all duration-300 transform-gpu border-none"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  {t('creating_account')}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 group text-[15px]!">
                  <span className="opacity-90 tracking-[0.05em]">{t('create_account')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all duration-500 ease-in-out" />
                </div>
              )}
            </Button>
          </motion.div>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10" />
            </div>
            <div className="relative bg-white dark:bg-[#15171C] px-4 text-xs uppercase text-gray-400 dark:text-white/40 font-medium">
              {t('or', { defaultValue: 'OR' })}
            </div>
          </div>

          <GoogleLoginButton label={t('sign_up_with_google', { defaultValue: 'Sign up with Google' })} />
        </Form>
      )}
    </Formik>
  )
}

export default RegisterForm
