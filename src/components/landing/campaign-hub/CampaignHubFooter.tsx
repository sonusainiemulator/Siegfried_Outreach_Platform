'use client'
import { Button } from '@/components/ui/button'
import { footerLinks, socialLinks } from '@/data/landing'
import useSettings from '@/hooks/useSettings'
import { getMediaUrl } from '@/utils'
import { isBrowser } from '@/utils/environment'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function CampaignHubFooter() {
  const { settings } = useSettings()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = !mounted || resolvedTheme === 'dark'

  const logoUrl = isDark
    ? getMediaUrl(settings?.logo_dark_url || settings?.landing_logo_url) || '/images/light-logo2.png'
    : getMediaUrl(settings?.logo_light_url || settings?.landing_logo_url) || '/images/dark-logo2.png'
  const appName = settings?.app_name || 'Siegfried Outreach'
  const { t } = useTranslation()
  const [openSection, setOpenSection] = useState<string | null>(null)

  return (
    <footer className="relative py-[calc(35px+(70-35)*((100vw-320px)/(1920-320)))] bg-slate-100/50 dark:bg-landing-bg-dark border-t border-slate-200/60 dark:border-white/5 transition-colors">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[calc(295px+(1400-295)*((100vw-320px)/(1920-320)))] mx-auto relative z-10 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Brand Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 backdrop-blur-md flex flex-col justify-between shadow-sm group"
          >
            <div className="space-y-6">
              <div className="relative inline-block">
                <Image
                  src={logoUrl}
                  alt={appName}
                  width={160}
                  height={45}
                  className="h-10 sm:h-11 w-auto object-contain"
                  unoptimized
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white/90 max-w-xs leading-relaxed">
                {t('campaign_hub_footer_title', { defaultValue: 'Siegfried Outreach' })} <br />
                <span className="text-sm font-normal text-slate-500 dark:text-white/50">{t('campaign_hub_footer_desc')}</span>
              </h3>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white/60 hover:text-primary dark:hover:text-white hover:border-primary/40 transition-all shadow-xs"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:w-[60%] p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 backdrop-blur-md shadow-sm"
          >
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8">
              {footerLinks.map((section) => {
                const isOpen = openSection === section.title
                return (
                  <div
                    key={section.title}
                    className={`transition-all duration-300 rounded-2xl md:rounded-none md:bg-transparent md:border-0 md:p-0 flex flex-col ${
                      isOpen
                        ? 'border border-primary/40 bg-slate-50 dark:bg-white/[0.04] p-4'
                        : 'border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-4 md:border-0 md:bg-transparent md:p-0'
                    }`}
                  >
                    <Button
                      onClick={() => setOpenSection(isOpen ? null : section.title)}
                      className={`flex items-center justify-between h-auto bg-transparent! w-full md:cursor-default p-0 md:mb-5 transition-all text-left`}
                    >
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {section.title}
                      </h4>
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 md:hidden ${
                          isOpen
                            ? 'bg-primary/20 border-primary/40 text-primary'
                            : 'bg-slate-200/80 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/40'
                        }`}
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </Button>

                    <AnimatePresence initial={false}>
                      <motion.ul
                        initial={false}
                        animate={{
                          height: isOpen || (isBrowser && window.innerWidth >= 768) ? 'auto' : 0,
                          opacity: isOpen || (isBrowser && window.innerWidth >= 768) ? 1 : 0,
                        }}
                        className="space-y-3 overflow-hidden md:!h-auto md:!opacity-100 pt-3 md:pt-0"
                      >
                        {isOpen && <div className="h-px bg-slate-200 dark:bg-white/5 mb-3 md:hidden" />}

                        {section.links.map((link) => (
                          <li key={link.name}>
                            <Link
                              href={link.href}
                              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-white/50 hover:text-primary dark:hover:text-white transition-colors"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs font-medium text-slate-500 dark:text-white/40">
                © {new Date().getFullYear()} {appName}. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-xs font-medium text-slate-500 dark:text-white/40">
                <Link href="/privacy-policy" className="hover:text-primary dark:hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms-and-conditions" className="hover:text-primary dark:hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
