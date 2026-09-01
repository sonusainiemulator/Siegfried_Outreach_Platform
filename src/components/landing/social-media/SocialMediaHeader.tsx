'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useSectionRefs } from '@/context/SectionRefsContext'
import { cn } from '@/lib/utils'
import useSettings from '@/hooks/useSettings'
import { getMediaUrl } from '@/utils'
import { scrollToAnchor } from '@/utils/counter'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import ThemeToggle from '@/layout/header/ThemeToggle'
import { useTranslation } from 'react-i18next'
import { navLinks } from '../../../data/landingSocialMedia'

export default function SocialMediaHeader() {
  const { settings } = useSettings()
  const logoUrl = getMediaUrl(settings?.landing_logo_url || settings?.logo_dark_url || settings?.logo_light_url) || '/images/light-logo2.png'
  const appName = settings?.app_name || 'Logo'
  const { sectionRefs } = useSectionRefs()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      const offsets = navLinks.map((l) => {
        const key = l.href.replace('#', '')
        const el = (sectionRefs.current as any)[key]
        return { href: l.href, top: el ? el.offsetTop : Infinity }
      })
      const current = offsets.filter((o) => o.top <= window.scrollY + 120).pop()
      setActiveHash(current?.href ?? '')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionRefs])

  const bodyRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    bodyRef.current = document.body
  }, [])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.overflow = isMenuOpen ? 'hidden' : ''
    }
    return () => {
      if (bodyRef.current) {
        bodyRef.current.style.overflow = ''
      }
    }
  }, [isMenuOpen])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-500',
          scrolled ? 'top-2 sm:top-3' : 'top-4 sm:top-6',
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out rounded-2xl border pointer-events-auto',
            scrolled
              ? 'max-w-[1400px] py-4 bg-background/80 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
              : 'max-w-[calc(100%-20px)] sm:max-w-[calc(100%-60px)] xl:max-w-[calc(100%-200px)] py-4 bg-white/5 backdrop-blur-md border-white/5',
          )}
        >
          <Button
            className="flex items-center gap-2 cursor-pointer group shrink-0 bg-unset! p-0!"
            onClick={() => router.push('/')}
            aria-label="Go to home"
          >
            <div
              className={cn(
                'flex items-center gap-2 transition-all duration-700 ease-in-out',
                scrolled ? 'scale-90' : 'scale-100',
              )}
            >
              <Image
                src={logoUrl}
                alt={appName}
                width={240}
                height={60}
                className="h-12 sm:h-14 max-h-14 w-auto max-w-[220px] object-contain"
                unoptimized
              />
            </div>
          </Button>

          <nav
            className={cn(
              'hidden lg:flex items-center transition-all duration-700 ease-in-out',
              scrolled ? 'gap-4 xl:gap-6' : 'gap-6 xl:gap-8',
            )}
            aria-label="Main navigation"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToAnchor(link.href, undefined, (sectionRefs.current as any)[link.href.replace('#', '')])
                }}
                className={cn(
                  'text-[16px] font-medium transition-all duration-300 relative group whitespace-nowrap',
                  activeHash === link.href ? 'text-white' : 'text-white/60 hover:text-white',
                )}
              >
                {link.name}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300',
                    activeHash === link.href ? 'w-full' : 'w-0 group-hover:w-full',
                  )}
                />
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 shrink-0">
            <ThemeToggle />
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden sm:block text-base font-semibold text-white/70 hover:text-white transition-colors"
              onClick={() => router.push(`${ROUTES.AUTH.LOGIN}?redirect_to=${ROUTES.SOCIAL_MEDIA.DASHBOARD}`)}
            >
              {t('sign_in')}
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => router.push(ROUTES.AUTH.REGISTER)}
              className="hidden sm:block relative p-[1px] rounded-[14px] transition-all duration-300 group overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(149,164,252,0.15)] hover:shadow-[0_0_25px_rgba(149,164,252,0.25)]"
              aria-label="Get Started"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary1 opacity-100  transition-opacity" />
              <div
                className={cn(
                  'relative rounded-[14px] flex items-center justify-center bg-dark-void/80 transition-all duration-700 ease-in-out',
                  scrolled ? 'px-4 py-2' : 'px-4 sm:px-7 py-2 sm:py-3',
                )}
              >
                <span className="text-sm font-bold text-white tracking-wide">{t('get_started')}</span>
              </div>
            </motion.button>

            <Button
              className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-light-primary backdrop-blur-sm lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 right-0 z-50 lg:hidden"
            >
              <div className="mx-3 mt-3 rounded-3xl border border-white/10 bg-landing-bg-deep/95 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                  <Button
                    className="flex items-center gap-2 group p-0!"
                    onClick={() => {
                      closeMenu()
                      router.push('/')
                    }}
                  >
                    <Image
                      src={logoUrl}
                      alt={appName}
                      width={100}
                      height={100}
                     className="h-10 w-auto object-contain relative z-10"
                      unoptimized
                    />
                  </Button>

                  <Button
                    onClick={closeMenu}
                    className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </Button>
                </div>

                <nav className="px-3 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToAnchor(link.href, closeMenu, (sectionRefs.current as any)[link.href.replace('#', '')])
                      }}
                      className={cn(
                        'flex items-center justify-between px-4 py-3.5 rounded-border-radius text-base font-semibold transition-all duration-200 group',
                        activeHash === link.href
                          ? 'bg-primary/15 text-primary'
                          : 'text-white/75 hover:bg-white/8 hover:text-white',
                      )}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </nav>

                <div className="mx-5 h-px bg-white/8" />

                <div className="px-5 py-5 flex flex-col gap-3">
                  <div className="flex justify-between items-center px-2 py-1 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-sm font-semibold text-white/70">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full h-11 font-semibold text-white bg-white/10 hover:bg-unset rounded-[15px]"
                    onClick={() => {
                      closeMenu()
                      router.push(`${ROUTES.AUTH.LOGIN}?redirect_to=${ROUTES.SOCIAL_MEDIA.DASHBOARD}`)
                    }}
                  >
                    {t('sign_in')}
                  </Button>

                  <Button
                    onClick={() => {
                      closeMenu()
                      router.push(ROUTES.AUTH.REGISTER)
                    }}
                    className="relative w-full p-[1px] rounded-[15px] overflow-hidden group shadow-[0_0_15px_rgba(149,164,252,0.1)]"
                  >
                    <div className="absolute inset-0 btn-color transition-opacity" />
                    <div className="relative transition-all duration-300 flex items-center justify-center gap-2">
                      <span className="text-sm font-bold text-white tracking-wide">{t('get_started_free')}</span>
                      <ChevronRight
                        size={16}
                        className="text-white/80 group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                  </Button>
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
