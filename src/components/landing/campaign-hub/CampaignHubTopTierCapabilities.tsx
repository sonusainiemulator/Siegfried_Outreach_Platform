'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart2,
  Bell,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  Layers,
  LayoutGrid,
  Lock,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  PenTool,
  Plus,
  Radio,
  Repeat,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  ThumbsUp,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type TabKey = 'publishing' | 'collaboration' | 'engagement' | 'analytics' | 'reviews'

interface CapabilityFeature {
  id: string
  icon: any
  iconColor: string
  title: string
  description: string
  linkHref: string
  linkText: string
}

interface TabData {
  key: TabKey
  label: string
  icon: any
  features: CapabilityFeature[]
}

const tabsData: TabData[] = [
  {
    key: 'publishing',
    label: 'Publishing',
    icon: Send,
    features: [
      {
        id: 'pub-1',
        icon: Calendar,
        iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        title: 'Content Calendar',
        description: 'Plan, organize, and schedule posts and property broadcasts for consistent publishing.',
        linkHref: '/social-media',
        linkText: 'Learn More',
      },
      {
        id: 'pub-2',
        icon: Sparkles,
        iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        title: 'AI Pilot',
        description: 'Breakthrough the creative barriers and generate high-converting copy, visuals, and reel captions.',
        linkHref: '/ai-blog-writer',
        linkText: 'Learn More',
      },
      {
        id: 'pub-3',
        icon: Layers,
        iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        title: 'Bulk Scheduling',
        description: 'Manage the multi-channel calendar with 500+ posts, emails, and WhatsApp messages scheduled at once.',
        linkHref: '/campaign-hub',
        linkText: 'Learn More',
      },
    ],
  },
  {
    key: 'collaboration',
    label: 'Collaboration',
    icon: Users,
    features: [
      {
        id: 'col-1',
        icon: Building2,
        iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        title: 'Client Workspaces',
        description: 'Organize brands, property listings, and teams into dedicated workspaces with custom permissions.',
        linkHref: '/members',
        linkText: 'Learn More',
      },
      {
        id: 'col-2',
        icon: UserCheck,
        iconColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        title: 'Approval Workflows',
        description: 'Submit marketing broadcasts and social posts for 1-click client or manager approval before launch.',
        linkHref: '/permissions',
        linkText: 'Learn More',
      },
      {
        id: 'col-3',
        icon: MessageSquare,
        iconColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
        title: 'Internal Team Notes',
        description: 'Leave feedback, assign draft tasks, and track revision history in real-time.',
        linkHref: '/ai-chat-assistant',
        linkText: 'Learn More',
      },
    ],
  },
  {
    key: 'engagement',
    label: 'Engagement',
    icon: MessageCircle,
    features: [
      {
        id: 'eng-1',
        icon: MessageSquare,
        iconColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        title: 'Unified Social & Lead Inbox',
        description: 'Manage Instagram comments, Facebook DMs, WhatsApp inquiries, and Telegram chats in one place.',
        linkHref: '/inquiries',
        linkText: 'Learn More',
      },
      {
        id: 'eng-2',
        icon: Bot,
        iconColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
        title: '24/7 AI Lead Auto-Replies',
        description: 'Qualify buyer and seller inquiries around the clock and book showing appointments automatically.',
        linkHref: '/ai-bot-studio',
        linkText: 'Learn More',
      },
      {
        id: 'eng-3',
        icon: Tag,
        iconColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        title: 'Lead Tagging & Routing',
        description: 'Automatically tag high-intent leads and route conversations straight into your CRM pipeline.',
        linkHref: '/campaign-hub',
        linkText: 'Learn More',
      },
    ],
  },
  {
    key: 'analytics',
    label: 'Analytics',
    icon: BarChart2,
    features: [
      {
        id: 'ana-1',
        icon: TrendingUp,
        iconColor: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
        title: 'Cross-Platform Dashboards',
        description: 'Track impressions, engagement, reach, and broadcast open rates across 9+ channels simultaneously.',
        linkHref: '/dashboard',
        linkText: 'Learn More',
      },
      {
        id: 'ana-2',
        icon: FileText,
        iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        title: 'White-Label Client Reports',
        description: 'Generate stunning branded PDF and CSV performance reports for clients with a single click.',
        linkHref: '/dashboard',
        linkText: 'Learn More',
      },
      {
        id: 'ana-3',
        icon: Zap,
        iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        title: 'Conversion & ROI Tracking',
        description: 'Connect lead conversions, closed deals, and revenue directly to your outreach campaigns.',
        linkHref: '/dashboard',
        linkText: 'Learn More',
      },
    ],
  },
  {
    key: 'reviews',
    label: 'Reviews',
    icon: Star,
    features: [
      {
        id: 'rev-1',
        icon: Star,
        iconColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        title: 'Reputation Management',
        description: 'Monitor brand and agent reviews across Google, Facebook, Trustpilot, and social channels.',
        linkHref: '#testimonials',
        linkText: 'Learn More',
      },
      {
        id: 'rev-2',
        icon: Sparkles,
        iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        title: 'AI Review Response Generator',
        description: 'Generate polite, on-brand responses to client feedback and testimonials in seconds.',
        linkHref: '/ai-content-rewriter',
        linkText: 'Learn More',
      },
      {
        id: 'rev-3',
        icon: Share2,
        iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        title: 'Social Proof Widgets',
        description: 'Turn positive reviews into high-converting social media carousels and website trust badges.',
        linkHref: '#testimonials',
        linkText: 'Learn More',
      },
    ],
  },
]

export default function CampaignHubTopTierCapabilities() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabKey>('publishing')
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState<number>(0)
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('week')

  const currentTab = tabsData.find((t) => t.key === activeTab) || tabsData[0]

  return (
    <section id="capabilities-top-tier" className="py-20 md:py-32 relative overflow-hidden bg-background">
      {/* Background radial glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-primary/8 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute right-0 top-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Heading matching screenshot */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-foreground leading-[1.15]"
          >
            <span className="font-extrabold text-foreground">Top-Tier Capabilities</span>{' '}
            <span className="font-normal text-muted-foreground">Designed</span>
            <br className="hidden sm:block" />
            <span className="font-bold text-foreground"> for Scaling Marketing Agencies and Brands</span>
          </motion.h2>
        </div>

        {/* Tab Navigation Menu Bar */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-full bg-card/80 dark:bg-card/40 backdrop-blur-xl border border-border/80 shadow-md overflow-x-auto max-w-full scrollbar-none">
            {tabsData.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key)
                    setSelectedFeatureIndex(0)
                  }}
                  className={cn(
                    'relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCapabilityTab"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors relative z-10',
                      isActive ? 'text-primary fill-primary/10' : 'text-muted-foreground',
                    )}
                  />
                  <span className="relative z-10">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main 2-Column Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Feature List Items */}
          <div className="lg:col-span-5 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {currentTab.features.map((feature, idx) => {
                  const isSelected = selectedFeatureIndex === idx
                  const Icon = feature.icon

                  return (
                    <div
                      key={feature.id}
                      onClick={() => setSelectedFeatureIndex(idx)}
                      className={cn(
                        'group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer text-left',
                        isSelected
                          ? 'bg-card/95 dark:bg-card/70 border-primary/50 shadow-xl shadow-primary/5 scale-[1.02]'
                          : 'bg-card/40 hover:bg-card/80 border-border/60 hover:border-border/90',
                      )}
                    >
                      {/* Active Indicator Bar on Left */}
                      {isSelected && (
                        <motion.div
                          layoutId="selectedFeatureIndicator"
                          className="absolute left-0 top-4 bottom-4 w-1.5 bg-primary rounded-r-full"
                        />
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-300',
                            feature.iconColor,
                            isSelected ? 'scale-110 shadow-md' : 'group-hover:scale-105',
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                              {feature.title}
                            </h3>
                          </div>

                          <p className="text-xs sm:text-sm font-normal text-muted-foreground leading-relaxed mt-1 mb-3">
                            {feature.description}
                          </p>

                          <Link
                            href={feature.linkHref}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors group/link"
                          >
                            <span>{feature.linkText}</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: High-Fidelity Interactive Mockup Display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl p-1 bg-gradient-to-br from-primary/30 via-border/50 to-primary/10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
              >
                {/* Inner Window Container */}
                <div className="relative rounded-[22px] bg-slate-900/95 dark:bg-slate-950/95 border border-white/10 p-4 sm:p-6 overflow-hidden text-left text-white shadow-2xl min-h-[460px] flex flex-col justify-between">
                  {/* Mock Window Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs text-white/50 font-medium ml-2">
                        app.siegfriedoutreach.com / {activeTab}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md text-[11px] text-white/70">
                        <Calendar className="w-3 h-3 text-primary" />
                        <span>Feb 2026</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold">
                        Live Sync
                      </Badge>
                    </div>
                  </div>

                  {/* Render dynamic interactive preview based on active tab */}
                  {activeTab === 'publishing' && <PublishingMockup calendarView={calendarView} setCalendarView={setCalendarView} />}
                  {activeTab === 'collaboration' && <CollaborationMockup />}
                  {activeTab === 'engagement' && <EngagementMockup />}
                  {activeTab === 'analytics' && <AnalyticsMockup />}
                  {activeTab === 'reviews' && <ReviewsMockup />}

                  {/* Bottom Tool Bar */}
                  <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/10 text-xs text-white/50">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        9 Social & Messaging Channels Connected
                      </span>
                    </div>
                    <Link
                      href="/social-media"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-bold transition-colors"
                    >
                      <span>Open Studio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================================================= */
/* MOCKUP 1: PUBLISHING & CALENDAR (Matches Screenshot Exactly)             */
/* ========================================================================= */
function PublishingMockup({
  calendarView,
  setCalendarView,
}: {
  calendarView: 'month' | 'week' | 'day'
  setCalendarView: (v: 'month' | 'week' | 'day') => void
}) {
  return (
    <div className="space-y-4 relative">
      {/* Calendar top controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">Campaign & Listing Calendar</span>
          <span className="text-white/40">|</span>
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setCalendarView(v)}
                className={cn(
                  'px-2.5 py-1 rounded text-[11px] font-medium capitalize cursor-pointer transition-colors',
                  calendarView === v ? 'bg-primary text-white font-bold' : 'text-white/60 hover:text-white',
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-white/60">
            500+ Posts Queued
          </div>
        </div>
      </div>

      {/* Underlying Calendar Grid Structure */}
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-white/40 pb-1 border-b border-white/10 font-semibold uppercase">
        <span>Sun 15</span>
        <span>Mon 16</span>
        <span>Tue 17</span>
        <span className="text-primary font-bold">Wed 18</span>
        <span>Thu 19</span>
        <span>Fri 20</span>
        <span>Sat 21</span>
      </div>

      {/* Floating Interactive Schedule Modal (Exact clone of screenshot modal) */}
      <div className="relative z-10 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/20 p-4 sm:p-5 shadow-2xl space-y-3">
        {/* Modal Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              OP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Orange Page & Realty</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Post successfully scheduled!
                </span>
              </div>
              <div className="text-[11px] text-white/50 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-primary" />
                <span>09:00 AM, Feb 21, 2026</span>
                <span>·</span>
                <span className="text-primary font-semibold">Queued 1x</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-white/60">
            <button className="p-1 hover:text-white cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Draft Body */}
        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/8 text-xs text-white/90 leading-relaxed font-normal">
          <p className="font-semibold text-amber-300 text-xs mb-1">
            ✨ Summer Luxury Holiday & Penthouse Showcase Greetings!
          </p>
          "Wishing you all the sun, fun, and relaxation you deserve this season! Whether you're hitting the beach, exploring new places, or just enjoying some time off at home, we hope your summer is filled with unforgettable moments. Don't forget to share your adventures with us!"
        </div>

        {/* Media & Tags Footer inside modal */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-white/50 mr-1">Platforms:</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
              Facebook
            </span>
            <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold">
              Instagram
            </span>
            <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
              LinkedIn
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              WhatsApp
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs border-white/20 text-white hover:bg-white/10">
              Edit Draft
            </Button>
            <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              View in Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========================================================================= */
/* MOCKUP 2: COLLABORATION & APPROVALS                                      */
/* ========================================================================= */
function CollaborationMockup() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white text-sm">Agency Client Approvals Queue</span>
        <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">3 Pending Approvals</Badge>
      </div>

      <div className="space-y-2.5">
        <div className="p-4 rounded-xl bg-white/[0.04] border border-primary/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-xs">
              VR
            </div>
            <div>
              <div className="text-sm font-bold text-white">Vanguard Luxury Realty · Penthouse Tour</div>
              <div className="text-xs text-white/50">Submitted by Marcus Vance · 4 platforms scheduled</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              Approve
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-white/60 hover:text-white">
              Changes
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3 opacity-80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-purple-400 text-xs">
              HP
            </div>
            <div>
              <div className="text-sm font-bold text-white">Horizon Property Fund · Off-Market Blast</div>
              <div className="text-xs text-white/50">Approved by Vincent L. · Ready for auto-broadcast</div>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px]">
            Approved ✓
          </Badge>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 text-xs text-white/60">
          <MessageSquare className="w-4 h-4 text-primary shrink-0" />
          <span>Marcus Vance commented: "Looks fantastic! Please make sure WhatsApp blast triggers at 10 AM."</span>
        </div>
      </div>
    </div>
  )
}

/* ========================================================================= */
/* MOCKUP 3: ENGAGEMENT & UNIFIED INBOX                                     */
/* ========================================================================= */
function EngagementMockup() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white text-sm">Unified Lead & Conversation Hub</span>
        <span className="text-xs text-emerald-400 font-bold">⚡ 24/7 AI Bot Active</span>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Channel Selector */}
        <div className="col-span-4 space-y-2 border-r border-white/10 pr-2">
          <div className="p-2.5 rounded-lg bg-primary/20 border border-primary/30 text-left">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>WhatsApp VIP</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-white/60 truncate">Elena Rostova: "Is the penthouse still..."</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-left opacity-70">
            <div className="text-xs font-bold text-white">Instagram DM</div>
            <div className="text-[10px] text-white/60 truncate">Sarah Jenkins: "Booked showing..."</div>
          </div>
        </div>

        {/* Chat Body */}
        <div className="col-span-8 space-y-3 pl-1">
          <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-left">
            <span className="text-[10px] font-bold text-primary block mb-1">Lead: Elena Rostova</span>
            "Hi, I saw your luxury listing broadcast on WhatsApp. Can we schedule a private tour this Thursday at 2 PM?"
          </div>

          <div className="p-3 rounded-xl bg-primary/20 border border-primary/40 text-xs text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <Bot className="w-3 h-3" /> Siegfried AI Auto-Qualified Reply
              </span>
              <span className="text-[9px] text-white/40">Instant</span>
            </div>
            "Hello Elena! I’ve reserved Thursday at 2:00 PM for your private tour. A calendar invite has been dispatched to your email."
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========================================================================= */
/* MOCKUP 4: ANALYTICS                                                      */
/* ========================================================================= */
function AnalyticsMockup() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white text-sm">Unified Marketing & ROI Analytics</span>
        <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">Real-Time Data</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 text-left">
        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="text-[11px] text-white/60">Total Reach</div>
          <div className="text-lg sm:text-xl font-extrabold text-white">1,420,850</div>
          <div className="text-[10px] text-emerald-400 font-bold">+42.8% vs last month</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="text-[11px] text-white/60">WhatsApp Open Rate</div>
          <div className="text-lg sm:text-xl font-extrabold text-white">98.2%</div>
          <div className="text-[10px] text-emerald-400 font-bold">18,400 replies</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="text-[11px] text-white/60">Pipeline Value</div>
          <div className="text-lg sm:text-xl font-extrabold text-white">$14.8M</div>
          <div className="text-[10px] text-emerald-400 font-bold">3.8x ROI multiplier</div>
        </div>
      </div>

      {/* Chart Visual Simulation */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
        <div className="flex justify-between text-xs text-white/60">
          <span>Campaign Growth Performance</span>
          <span className="text-primary font-bold">Instagram · LinkedIn · WhatsApp · Email</span>
        </div>
        <div className="h-16 flex items-end gap-2 pt-2">
          {[40, 65, 45, 80, 60, 95, 85, 100, 75, 90, 110, 125].map((h, i) => (
            <div key={i} className="flex-1 bg-primary/30 hover:bg-primary rounded-t transition-all" style={{ height: `${(h / 130) * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ========================================================================= */
/* MOCKUP 5: REVIEWS & SOCIAL PROOF                                         */
/* ========================================================================= */
function ReviewsMockup() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white text-sm">Reputation & Verified Reviews</span>
        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>4.9 / 5.0 Rating</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">Verónica G. · Skyline Estates</span>
              <Badge className="bg-blue-500/20 text-blue-300 border-none text-[9px]">Google Business</Badge>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-xs text-white/80">
            "Siegfried Outreach helped our agency scale from 5 to 45 property campaigns without hiring extra staff."
          </p>
        </div>

        <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-left flex items-center justify-between">
          <div className="text-xs text-white/80">
            <span className="font-bold text-amber-300">✨ AI Auto-Reply Sent:</span> "Thank you Verónica! Delighted to help Skyline Estates grow!"
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[9px]">Published</Badge>
        </div>
      </div>
    </div>
  )
}
