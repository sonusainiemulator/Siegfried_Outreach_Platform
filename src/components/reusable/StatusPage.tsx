'use client'
import { Button } from '@/components/ui/button'
import { StatusPageProps } from '@/types'
import { formatDate } from '@/utils'
import { motion } from 'framer-motion'
import { Home, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Clock = () => {
  const [time, setTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-4xl md:text-5xl font-black tracking-widest text-foreground drop-shadow-2xl">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase()}
      </div>
      <div className="text-xs md:text-sm font-medium text-muted-foreground/60 uppercase tracking-[0.3em]">
        {formatDate(time)}
      </div>
    </div>
  )
}

const StatusPage = ({
  title,
  description,
  icon: Icon,
  image,
  showHome = true,
  showRetry = false,
  onRetry,
  isRetrying = false,
  errorCode,
  isMaintenance = false,
  statusBadge
}: StatusPageProps) => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-12">
      {isMaintenance && image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt="background"
            fill
            unoptimized
            className="w-full h-full object-cover opacity-60 grayscale-[0.2] brightness-125"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/40 to-background/90 backdrop-blur-[1px]" />
        </div>
      )}

      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px] animate-pulse-slow" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(var(--primary-rgb),0.05),_transparent_70%)] opacity-50" />

      <div className="z-10 flex max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {statusBadge && (
            <div className="mb-8 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning-orange/10 border border-warning-orange/20 text-warning-orange text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,162,76,0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-warning-orange animate-pulse shadow-[0_0_8px_var(--warning-orange)]" />
                {statusBadge}
              </div>
            </div>
          )}

          {errorCode && !isMaintenance && (
            <span className="mb-4 block text-8xl font-black tracking-tighter text-muted-foreground/10 sm:text-9xl">
              {errorCode}
            </span>
          )}

          {image && !isMaintenance ? (
            <div className="relative mx-auto h-64 w-64 md:h-80 md:w-80">
              <Image
                src={image}
                alt={title}
                fill
                unoptimized
                className="object-contain drop-shadow-2xl brightness-125"
                priority
              />
            </div>
          ) : Icon && !image ? (
            <div className="mb-6 flex flex-col items-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/20 animate-reverse-spin-slow" />
                <div className="relative z-10 w-20 h-20 flex items-center justify-center rounded-full bg-primary/5 text-primary backdrop-blur-md">
                  <Icon className="h-10 w-10 drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ) : isMaintenance && !image ? (
            <div className="mb-6 flex flex-col items-center">
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary animate-pulse">
                {Icon && <Icon className="h-10 w-10" />}
              </div>
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-title-color dark:text-white drop-shadow-2xl">
            {title}
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-subtitle-color font-medium drop-shadow-sm">{description}</p>

          {isMaintenance && <Clock />}

          {isMaintenance && (
            <div className="mb-8 flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
              <div className="w-full h-1 bg-muted/20 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="absolute h-full bg-linear-to-r from-primary to-secondary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                />
              </div>
              <p className="text-[10px] text-muted-foreground/70 italic tracking-wider font-bold uppercase">
                {t('maintenance_footer_msg', {
                  defaultValue: 'We apologize for any inconvenience. Normal service will resume shortly.',
                })}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {showRetry && (
              <Button
                variant="default"
                size="lg"
                onClick={onRetry}
                disabled={isRetrying}
                className="min-w-40 gap-2 btn-color rounded-full p-button-padding! text-white transition-all hover:scale-105"
              >
                <RefreshCw className={`h-5 w-5 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? t('retrying') : t('retry_now')}
              </Button>
            )}

            {showHome && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/')}
                className="min-w-40 gap-2 rounded-full  btn-color p-button-padding! text-white backdrop-blur-md transition-all hover:bg-background/80 hover:scale-105"
              >
                <Home className="h-5 w-5" />
                {t('back_to_home')}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.03]" />
    </div>
  )
}

export default StatusPage
