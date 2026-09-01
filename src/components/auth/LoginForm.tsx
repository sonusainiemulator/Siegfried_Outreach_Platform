'use client'
import AuthInput from '@/components/auth/AuthInput'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import PasskeyLoginButton from '@/components/auth/PasskeyLoginButton'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useGetDemoCredentialsQuery, useLoginMutation } from '@/redux/api/authApi'
import { useAppDispatch } from '@/redux/hooks'
import { setAuth } from '@/redux/slices/authSlice'
import { ApiError } from '@/types/api'
import { LoginFormValues } from '@/types/auth'
import { authUtils } from '@/utils'
import { authSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail, Shield, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const LoginForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') || ''
  const dispatch = useAppDispatch()
  const [login] = useLoginMutation()

  const { data: demoData } = useGetDemoCredentialsQuery()
  const isDemoMode = demoData?.demo === true

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values).unwrap()
      // Save token and user data
      authUtils.setToken(response.token)
      authUtils.setUser(response.user)

      // Update Redux state
      dispatch(
        setAuth({
          token: response.token,
          user: response.user,
        }),
      )

      toast.success(response.message || t('login_successful'))

      // Redirect to specified path or default dashboard
      const redirectTo = searchParams.get('redirect_to')
      if (redirectTo) {
        router.replace(redirectTo)
      } else {
        router.replace(ROUTES.DASHBOARD)
      }
    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError?.data?.message || t('login_failed')
      toast.error(errorMessage)
    } finally {
    }
  }

  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: '',
      }}
      enableReinitialize={true}
      validationSchema={authSchemas.login(t)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
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
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <AuthInput
              label={t('password')}
              name="password"
              type="password"
              icon={Lock}
              placeholder={'********'}
              className="border-white/10 h-12 dark:bg-black/40 rounded-[8px] glass-card"
            />
          </motion.div>

          <div className="flex justify-end items-center px-6">
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-[13px] font-semibold text-subtitle-color dark:text-white/60 hover:text-primary dark:hover:text-white transition-colors tracking-tight underline decoration-subtitle-color/20 dark:decoration-white/20 underline-offset-4"
            >
              {t('forgot_password_question')}
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full h-12 rounded-full text-white bg-primary! dark:bg-white hover:opacity-90 dark:hover:bg-white text-base font-medium active:scale-95 transition-all duration-300 transform-gpu border-none cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  {t('signing_in')}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 group text-[15px]!">
                  <span className="opacity-90 tracking-[0.05em] ">{t('sign_in')}</span>
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

          {/* Biometric / Passkey Login Button */}
          <div className="space-y-3">
            <PasskeyLoginButton email={values.email} />
            <GoogleLoginButton label={t('sign_in_with_google', { defaultValue: 'Sign in with Google' })} />
          </div>

          {isDemoMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-dashed bg-light-primary border-primary/30 hover:bg-primary hover:border-primary/50 text-primary font-medium hover:text-white transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setFieldValue('email', demoData?.admin?.email || '')
                  setFieldValue('password', demoData?.admin?.password || '')
                }}
              >
                <Shield className="w-4 h-4" />
                {t('admin_demo', { defaultValue: 'Demo Admin' })}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-dashed bg-light-primary border-primary/30 hover:bg-primary hover:border-primary/50 text-primary hover:text-white font-medium transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setFieldValue('email', demoData?.user?.email || '')
                  setFieldValue('password', demoData?.user?.password || '')
                }}
              >
                <User className="w-4 h-4" />
                {t('user_demo', { defaultValue: 'Demo User' })}
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
