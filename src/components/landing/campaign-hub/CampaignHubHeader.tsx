'use client'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useSectionRefs } from '@/context/SectionRefsContext'
import useSettings from '@/hooks/useSettings'
import ThemeToggle from '@/layout/header/ThemeToggle'
import { cn } from '@/lib/utils'
import { getMediaUrl } from '@/utils'
import { scrollToAnchor } from '@/utils/counter'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart2,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  LayoutGrid,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface NavDropdownItem {
  title: string
  desc: string
  href: string
  icon: any
  badge?: string
}

export default function CampaignHubHeader() {
  const { settings } = useSettings()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = !mounted || resolvedTheme === 'dark'

  const logoUrl = isDark
    ? getMediaUrl(settings?.logo_dark_url || settings?.landing_logo_url) || '/images/light-logo2.png'
    : getMediaUrl(settings?.logo_light_url || settings?.landing_logo_url) || '/images/dark-logo2.png'
  const appName = settings?.app_name || 'Siegfried Outreach'
  const { sectionRefs } = useSectionRefs()
  const router = useRouter()
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(menu)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const platformItems: NavDropdownItem[] = [
    {
      title: 'Publishing & Calendar',
      desc: 'Cross-platform visual scheduler & bulk posting',
      href: '/social-media',
      icon: Calendar,
      badge: 'Popular',
    },
    {
      title: 'Multi-Channel Outreach',
      desc: 'WhatsApp, Telegram, and Email broadcasts',
      href: '/campaign-hub',
      icon: MessageSquare,
      badge: '98% Open',
    },
    {
      title: 'AI Pilot & Copywriter',
      desc: 'Generate viral captions, descriptions & emails',
      href: '/ai-blog-writer',
      icon: Sparkles,
    },
    {
      title: '24/7 AI Lead Qualification Bots',
      desc: 'Qualify buyers and book meetings automatically',
      href: '/ai-bot-studio',
      icon: Bot,
    },
    {
      title: 'Real Estate Growth Suite',
      desc: 'MLS listing descriptions & investor deal alerts',
      href: '#capabilities-top-tier',
      icon: Building2,
    },
    {
      title: 'MCP Studio & CRM Sync',
      desc: 'Integrate Hermes AI agents with Perfex CRM',
      href: '/landing/mcp',
      icon: Zap,
    },
  ]

  const solutionsItems: NavDropdownItem[] = [
    {
      title: 'Real Estate & Brokerages',
      desc: 'Automate off-market deal blasts & open house leads',
      href: '#testimonials',
      icon: Building2,
    },
    {
      title: 'Marketing Agencies',
      desc: 'Multi-client workspaces with 1-click approvals',
      href: '#capabilities-top-tier',
      icon: Users,
    },
    {
      title: 'Growth Teams & Brands',
      desc: 'High-velocity multi-platform publishing & ads',
      href: '/social-media',
      icon: TrendingUp,
    },
    {
      title: 'Property Wholesalers',
      desc: 'Bulk buyer lists with instantaneous SMS/Telegram reach',
      href: '/campaign-hub',
      icon: Send,
    },
  ]

  const resourcesItems: NavDropdownItem[] = [
    {
      title: 'Help Center & Tutorials',
      desc: 'Step-by-step onboarding guides & documentation',
      href: '#faq',
      icon: FileText,
    },
    {
      title: 'MCP Agent Skills Library',
      desc: 'Explore custom tools and automation workflows',
      href: '/landing/mcp#tools',
      icon: Zap,
    },
    {
      title: 'Verified Customer Reviews',
      desc: 'See 850+ real estate & agency reviews',
      href: '#testimonials',
      icon: CheckCircle2,
    },
    {
      title: 'Live Chat & Support',
      desc: 'Connect with our 24/7 assistant team',
      href: '/support',
      icon: MessageCircle,
    },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-500',
          scrolled ? 'top-2 sm:top-3' : 'top-3 sm:top-5',
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out rounded-2xl border pointer-events-auto',
            scrolled
              ? 'max-w-[1320px] py-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-slate-200/80 dark:border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
              : 'max-w-[1400px] py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-white/10 shadow-md',
          )}
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="Go to home">
            <Image
              src={logoUrl}
              alt={appName}
              width={220}
              height={55}
              className="h-10 sm:h-12 max-h-12 w-auto max-w-[200px] object-contain"
              unoptimized
            />
          </Link>

          {/* Desktop Navigation Links with Dropdown Menus */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 relative" aria-label="Main navigation">
            {/* Platform Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('platform')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
                  activeDropdown === 'platform'
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted/50',
                )}
              >
                <span>Platform</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    activeDropdown === 'platform' && 'rotate-180 text-primary',
                  )}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'platform' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-[520px] rounded-2xl p-4 bg-card/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-border/80 shadow-2xl grid grid-cols-2 gap-2 z-50"
                  >
                    {platformItems.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <span>{item.title}</span>
                              {item.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/15 text-primary font-extrabold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{item.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
                  activeDropdown === 'solutions'
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted/50',
                )}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    activeDropdown === 'solutions' && 'rotate-180 text-primary',
                  )}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'solutions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-[460px] rounded-2xl p-4 bg-card/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-border/80 shadow-2xl grid grid-cols-2 gap-2 z-50"
                  >
                    {solutionsItems.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">{item.title}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{item.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
                  activeDropdown === 'resources'
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted/50',
                )}
              >
                <span>Resources</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    activeDropdown === 'resources' && 'rotate-180 text-primary',
                  )}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-[460px] rounded-2xl p-4 bg-card/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-border/80 shadow-2xl grid grid-cols-2 gap-2 z-50"
                  >
                    {resourcesItems.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">{item.title}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{item.desc}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Links */}
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault()
                scrollToAnchor('#pricing', undefined, (sectionRefs.current as any)['pricing'])
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Pricing
            </a>

            <a
              href="#testimonials"
              onClick={(e) => {
                e.preventDefault()
                scrollToAnchor('#testimonials', undefined, (sectionRefs.current as any)['testimonials'])
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Reviews
            </a>
          </nav>

          {/* Right Actions matching Screenshot */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            <ThemeToggle />

            {/* Log In */}
            <Link
              href={`${ROUTES.AUTH.LOGIN}?redirect_to=${ROUTES.SOCIAL_MEDIA.DASHBOARD}`}
              className="hidden sm:inline-flex items-center text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors px-2 py-1.5"
            >
              Log In
            </Link>

            {/* Request Demo */}
            <Link
              href="/support"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full border border-border/80 hover:border-foreground/40 text-xs sm:text-sm font-semibold text-foreground bg-card/60 hover:bg-card transition-all cursor-pointer shadow-sm"
            >
              Request Demo
            </Link>

            {/* Start Your Free Trial CTA button */}
            <Link
              href={ROUTES.AUTH.REGISTER}
              className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-primary via-indigo-600 to-primary text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-all"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-0 left-0 right-0 z-50 lg:hidden"
            >
              <div className="mx-3 mt-3 rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <Image
                    src={logoUrl}
                    alt={appName}
                    width={140}
                    height={40}
                    className="h-8 w-auto object-contain"
                    unoptimized
                  />
                  <Button
                    onClick={() => setIsMenuOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="p-1 rounded-full text-foreground/70"
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 py-1">
                    Platform
                  </div>
                  {platformItems.slice(0, 4).map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>

                <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
                  <Link
                    href={`${ROUTES.AUTH.LOGIN}?redirect_to=${ROUTES.CAMPAIGN_HUB}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-muted"
                  >
                    Log In
                  </Link>

                  <Link
                    href={ROUTES.AUTH.REGISTER}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-bold rounded-xl bg-primary text-white shadow-lg"
                  >
                    Start Your Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
