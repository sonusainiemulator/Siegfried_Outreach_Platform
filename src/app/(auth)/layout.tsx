'use client'

import React, { useEffect } from 'react'
import { ROUTES } from '@/constants/routes'
import useSettings from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { RootState } from '@/redux/store'
import { getMediaUrl } from '@/utils'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import AuthThemeToggle from '@/components/auth/AuthThemeToggle'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false)
  const router = useRouter()
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    setMounted(true)
  }, [])

  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)
  const { settings } = useSettings()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [isLoading, isAuthenticated, router])

  const shouldShowLoader = isLoading && !mounted

  const logoUrl = mounted
    ? (currentTheme === 'dark' ? settings?.logo_dark_url : settings?.logo_light_url)
    : null

  const displayLogo = logoUrl
    ? getMediaUrl(logoUrl)
    : (mounted && currentTheme === 'dark' ? '/images/ttos-logo-dark.png' : '/images/ttos-logo-light.png')

  if (shouldShowLoader || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between transition-colors duration-500 bg-[#F8F9FD] dark:bg-[#0B0D11] text-gray-900 dark:text-white">
      {/* Top Header with Brand Logo (Left) and Theme Toggle Pill (Right) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-7 flex items-center justify-between z-20">
        <Link href="/" className="inline-flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <Image
            src={displayLogo || '/images/ttos-logo-light.png'}
            alt={settings?.app_name || 'TTOS'}
            width={240}
            height={60}
            className={cn(
              'h-9 sm:h-11 w-auto max-w-[220px] object-contain transition-all duration-300',
              currentTheme === 'dark'
                ? 'drop-shadow-[0_4px_12px_rgba(255,255,255,0.08)] brightness-110'
                : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
            )}
            unoptimized
            priority
          />
        </Link>

        {/* Pill-shaped Dark / Light Mode Switch */}
        <div className="flex items-center">
          <AuthThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px]"
        >
          {children}
        </motion.div>
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="w-full py-4 text-center text-xs text-gray-400 dark:text-zinc-600 z-10">
        © {new Date().getFullYear()} {settings?.app_name || 'TTOS Platform'}. All rights reserved.
      </footer>
    </div>
  )
}

export default AuthLayout
