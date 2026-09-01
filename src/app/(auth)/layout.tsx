'use client'

import { ROUTES } from '@/constants/routes'
import useSettings from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { RootState } from '@/redux/store'
import { getMediaUrl } from '@/utils'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

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
    : (mounted && currentTheme === 'dark' ? '/images/light-logo2.png' : '/images/dark-logo2.png')

  if (shouldShowLoader || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 md:p-6 lg:p-12 transition-colors duration-700 bg-light-body">
      {/* Background Blobs and Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Custom background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/auth-bg-3.png"
            alt="background"
            fill
            className="object-cover mix-blend-luminosity dark:mix-blend-overlay animate-in fade-in duration-1000"
            priority
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-[460px] z-10"
      >
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="inline-block relative group"
          >
            <div className="relative">
              <Image
                src={displayLogo || ''}
                alt={settings?.app_name || 'Logo'}
                width={320}
                height={120}
                className={cn(
                  'h-20 sm:h-24 max-h-24 w-auto max-w-[320px] object-contain transition-all duration-300',
                  currentTheme === 'dark'
                    ? 'drop-shadow-[0_10px_20px_rgba(255,255,255,0.1)] brightness-110'
                    : 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]',
                )}
                unoptimized
                priority
              />
            </div>
          </motion.div>
        </div>

        {children}
      </motion.div>
    </div>
  )
}

export default AuthLayout
