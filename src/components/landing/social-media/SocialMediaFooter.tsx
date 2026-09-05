'use client'

import { footerLinks } from '@/data/landingSocialMedia'
import useSettings from '@/hooks/useSettings'
import { getMediaUrl } from '@/utils'
import { motion } from 'framer-motion'
import { TwitterXIcon } from '@/data/socialMedia'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const SOCIALS = [
  { icon: TwitterXIcon, label: 'X' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Facebook, label: 'Facebook' },
]

export default function SocialMediaFooter() {
  const { settings } = useSettings()
  const logoUrl = getMediaUrl(settings?.landing_logo_url || settings?.logo_dark_url || settings?.logo_light_url) || '/images/light-logo2.png'
  const appName = settings?.app_name || 'Logo'
  const { t } = useTranslation()
  return (
    <footer className="relative mt-20 bg-dark-deep pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-light/40 to-transparent" />

        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-indigo-light/10 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] bg-info/10 rounded-full blur-[160px]"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-10">

          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src={logoUrl}
                  alt={appName}
                  width={160}
                  height={160}
                  className="h-11 sm:h-12 w-auto object-contain relative z-10"
                  unoptimized
                />
              </div>
              <p className="text-white/40 font-medium leading-relaxed max-w-[320px] text-lg">
                {t('the_only_ai_powered_platform_designed_for_high_growth_social_media_presence')}
              </p>
            </div>

            <div className="pt-4">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-6">{t('connect_with_us')}</p>
              <div className="flex items-center gap-3 pt-2">
                {SOCIALS.map(({ icon: Icon, label }) => (
                  <Link
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-12 lg:pl-12 border-l border-white/[0.03]">
            {footerLinks.map((col, i) => (
              <div key={i} className="space-y-10 group">
                <h4 className="text-white font-black uppercase tracking-[0.25em] text-[11px] flex items-center gap-3">
                  <span className="w-6 h-px bg-gradient-to-r from-indigo-light to-transparent opacity-50" />
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href="#"
                        className="text-white/40 hover:text-white transition-all duration-300 text-[15px] font-medium flex items-center gap-3 group/link"
                      >
                        <div className="w-1 h-1 rounded-full bg-indigo-light opacity-0 group-hover/link:opacity-100 transition-all translate-x-[-4px] group-hover/link:translate-x-0" />
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-6">
            <div className="text-white text-base font-medium hover:text-white/30 transition-colors">
              © {new Date().getFullYear()} {t('pixel_ai_all_rights_reserved')}
            </div>
          </div>

          <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-3 gap-8 shadow-inner relative group isolate overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 relative" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 group-hover:text-emerald-500 transition-colors">
                {t('system_active')}
              </span>
            </div>

            <div className="w-px h-4 bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('designed_by')}</span>
              <span className="text-white font-black uppercase tracking-[0.2em] text-[10px] bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">
                {t('pixel_ai')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
