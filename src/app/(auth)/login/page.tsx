'use client'

import LoginForm from '@/components/auth/LoginForm'
import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const LoginPage = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative rounded-[28px] bg-white dark:bg-[#15171C] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] border border-gray-100 dark:border-zinc-800/90 p-6 sm:p-10 transition-all duration-300"
      >
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 dark:text-white tracking-tight">
            {t('log_in_to_account', { defaultValue: 'Log in to your account' })}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm sm:text-[14.5px] mt-2 font-normal leading-relaxed">
            {t('enter_credentials_login', { defaultValue: 'Enter your username or email and password below to log in' })}
          </p>
        </div>

        <LoginForm />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col items-center gap-3 px-4"
      >
        <div className="text-center text-[14px] font-normal text-gray-500 dark:text-zinc-400">
          {t('dont_have_account')}{' '}
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="text-primary hover:text-primary/80 font-semibold transition-colors ml-1"
          >
            {t('sign_up_free')}
          </Link>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-zinc-500 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer pt-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default LoginPage
