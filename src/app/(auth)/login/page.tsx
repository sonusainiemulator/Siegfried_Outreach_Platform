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
    <div className="space-y-8 animate-in fade-in duration-1000">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative group p-px rounded-border-radius bg-linear-to-b from-primary via-primary/50 to-primary/10 shadow-2xl transition-all duration-500 hover:from-primary hover:via-primary/60"
      >
        {/* Top Highlight/Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-linear-to-r from-transparent via-white/50 to-transparent z-10" />

        <div className="relative bg-white/95 dark:bg-linear-to-b dark:from-[#15171C]/95 dark:to-black/95  backdrop-blur-3xl rounded-[inherit] p-4 sm:p-8 transition-all duration-500 overflow-hidden border-none text-left">
          {/* Subtle Glow inside card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center px-2"
          >
            <h1 className="text-3xl font-medium text-title-color dark:text-white mb-4 ">{t('welcome_back')}</h1>
            <p className="text-subtitle-color sm:mb-12 mb-5 font-medium text-base max-w-85 md:max-w-none mx-auto md:mx-0">
              {t('sign_in_continue')}
            </p>
          </motion.div>
          <LoginForm />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="flex flex-col items-center gap-3 px-4"
      >
        <div className="text-center text-[15px] font-medium text-subtitle-color">
          {t('dont_have_account')}{' '}
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="text-primary hover:text-primary/80 font-medium transition-all hover:tracking-wide ml-1 decoration-2 underline-offset-4 hover:underline"
          >
            {t('sign_up_free')}
          </Link>
        </div>
        <div className="h-px w-8 bg-gray-200 dark:bg-zinc-800 my-1" />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default LoginPage
