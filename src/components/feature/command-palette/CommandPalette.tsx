'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import {
  Search,
  Sparkles,
  LayoutDashboard,
  Calendar,
  Building2,
  CheckCircle2,
  Layers,
  BarChart3,
  Coins,
  Megaphone,
  Share2,
  Clock,
  MessageSquare,
  Bot,
  FileText,
  Code,
  ShieldAlert,
  Headset,
  Presentation,
  Video,
  Mic,
  Settings,
  Users,
  ShieldCheck,
  CreditCard,
  Key,
  Languages,
  HelpCircle,
  Flame,
  ArrowRight,
  Sun,
  Moon,
  PlusCircle,
  Send,
  Zap,
  Command as CommandIcon,
  X,
  History,
  CornerDownLeft,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import CreditRechargeModal from '@/components/feature/ai-social/CreditRechargeModal'

export interface CommandItem {
  id: string
  title: string
  description?: string
  category: 'pages' | 'ai_actions' | 'tools' | 'campaigns' | 'settings'
  icon: React.ElementType
  keywords: string[]
  badge?: string
  shortcut?: string
  path?: string
  action?: () => void
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RECENT_COMMANDS_KEY = 'siegfried_recent_commands_v1'

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isRechargeOpen, setIsRechargeOpen] = useState(false)
  const [recentIds, setRecentIds] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Load recent command IDs from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENT_COMMANDS_KEY)
        if (stored) {
          setRecentIds(JSON.parse(stored))
        }
      } catch {}
    }
  }, [open])

  // Save recent command
  const recordRecentCommand = (id: string) => {
    try {
      const updated = [id, ...recentIds.filter((item) => item !== id)].slice(0, 6)
      setRecentIds(updated)
      localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(updated))
    } catch {}
  }

  // Master command registry
  const allCommands = useMemo<CommandItem[]>(() => [
    // ─── AI ACTIONS & QUICK TRIGGERS ───────────────────────────────────────
    {
      id: 'action-recharge-credits',
      title: 'Top-Up AI Credits',
      description: 'Recharge credits via Razorpay, Stripe, Instant, or Bank Wire/UPI',
      category: 'ai_actions',
      icon: Coins,
      badge: 'Popular',
      shortcut: '⌘R',
      keywords: ['recharge', 'credits', 'top up', 'payment', 'buy', 'tokens', 'balance', 'utr', 'upi', 'bank wire'],
      action: () => {
        onOpenChange(false)
        setIsRechargeOpen(true)
      },
    },
    {
      id: 'action-create-post',
      title: 'Create Social Post Wizard',
      description: 'Generate multi-channel social post with AI caption and image',
      category: 'ai_actions',
      icon: Sparkles,
      badge: 'AI Creator',
      shortcut: '⌘N',
      keywords: ['create post', 'new post', 'publish', 'social post', 'instagram', 'facebook', 'linkedin', 'twitter'],
      path: '/social-media/create-post',
    },
    {
      id: 'action-festivals-autopilot',
      title: '🇮🇳 India Festivals Auto-Pilot',
      description: 'Generate festive campaigns for Diwali, Holi, Eid, Independence Day',
      category: 'ai_actions',
      icon: Flame,
      badge: 'High Impact',
      keywords: ['festivals', 'india', 'diwali', 'holi', 'eid', 'christmas', 'independence day', 'raksha bandhan', 'marketing'],
      path: '/ai-social/indian-festivals',
    },
    {
      id: 'action-ai-content-planner',
      title: 'Generate 30-Day Content Plan',
      description: 'AI strategy roadmap tailored to your business profile',
      category: 'ai_actions',
      icon: Calendar,
      badge: 'AI Strategy',
      keywords: ['planner', 'strategy', 'calendar', 'monthly plan', 'content plan', 'campaigns'],
      path: '/ai-social/planner',
    },
    {
      id: 'action-new-email-broadcast',
      title: 'New Email Broadcast',
      description: 'Draft and schedule mass email campaign with AI templates',
      category: 'campaigns',
      icon: Send,
      keywords: ['email broadcast', 'newsletter', 'bulk email', 'mail campaign'],
      path: '/campaign-hub/broadcasts/email/create',
    },
    {
      id: 'action-new-whatsapp-broadcast',
      title: 'New WhatsApp Broadcast',
      description: 'Send broadcast messages to verified WhatsApp contact lists',
      category: 'campaigns',
      icon: MessageSquare,
      keywords: ['whatsapp broadcast', 'whatsapp marketing', 'bulk message', 'wa message'],
      path: '/campaign-hub/broadcasts/whatsapp/create',
    },
    {
      id: 'action-new-telegram-broadcast',
      title: 'New Telegram Broadcast',
      description: 'Post updates to Telegram subscribers and channels',
      category: 'campaigns',
      icon: Send,
      keywords: ['telegram broadcast', 'telegram message', 'tg channel'],
      path: '/campaign-hub/broadcasts/telegram/create',
    },
    {
      id: 'action-ai-slide-maker',
      title: 'Generate Presentation Slides',
      description: 'Create multi-slide pitch decks and carousels with AI',
      category: 'tools',
      icon: Presentation,
      keywords: ['slide maker', 'presentation', 'carousel', 'pitch deck', 'powerpoint', 'pdf'],
      path: '/ai-slide-maker',
    },
    {
      id: 'action-ai-avatar',
      title: 'Generate AI Avatar Video & Photo',
      description: 'Create talking avatars and influencer product video reels',
      category: 'tools',
      icon: Video,
      keywords: ['avatar', 'influencer', 'video', 'talking avatar', 'reels', 'shorts', 'tiktok'],
      path: '/ai-avatar',
    },
    {
      id: 'action-ai-blog-writer',
      title: 'AI Blog & Article Writer',
      description: 'SEO-optimized long-form blog post generator',
      category: 'tools',
      icon: FileText,
      keywords: ['blog', 'article', 'writer', 'seo', 'copywriting', 'smart writer'],
      path: '/ai-blog-writer',
    },
    {
      id: 'action-ai-codex',
      title: 'AI Codex & Code Assistant',
      description: 'Smart code generation, refactoring, and debugging engine',
      category: 'tools',
      icon: Code,
      keywords: ['code', 'codex', 'developer', 'script', 'programming', 'javascript', 'python'],
      path: '/ai-codex',
    },
    {
      id: 'action-toggle-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      description: 'Toggle platform interface color theme',
      category: 'settings',
      icon: theme === 'dark' ? Sun : Moon,
      shortcut: '⌘T',
      keywords: ['theme', 'dark mode', 'light mode', 'color', 'appearance'],
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
        onOpenChange(false)
      },
    },

    // ─── CORE PLATFORM PAGES ───────────────────────────────────────────────
    {
      id: 'page-dashboard',
      title: 'Main Dashboard',
      description: 'Platform overview, AI analytics, and quick shortcuts',
      category: 'pages',
      icon: LayoutDashboard,
      shortcut: 'G D',
      keywords: ['dashboard', 'home', 'overview', 'stats', 'metrics', 'analytics'],
      path: '/dashboard',
    },
    {
      id: 'page-transactions',
      title: 'Transactions & Financial Ledger',
      description: 'Subscription invoices, offline payment requests & admin approvals',
      category: 'pages',
      icon: CreditCard,
      badge: 'Billing',
      keywords: ['transactions', 'payments', 'ledger', 'invoices', 'offline payment', 'utr', 'approval', 'credit recharge'],
      path: '/transactions',
    },
    {
      id: 'page-content-calendar',
      title: 'Multi-Channel Content Calendar',
      description: 'Visual calendar planner for all 14 social networks',
      category: 'pages',
      icon: Calendar,
      keywords: ['calendar', 'social calendar', 'schedule', 'posts', 'instagram', 'facebook', 'linkedin', 'x twitter'],
      path: '/ai-social/calendar',
    },
    {
      id: 'page-approval-center',
      title: 'AI Approval Workflow Center',
      description: 'Review and approve AI generated creatives before publishing',
      category: 'pages',
      icon: CheckCircle2,
      keywords: ['approval', 'review', 'moderation', 'drafts', 'publish workflow'],
      path: '/ai-social/approval',
    },
    {
      id: 'page-social-channels',
      title: 'Social Channels & Accounts',
      description: 'Connect and manage Instagram, Facebook, LinkedIn, X, and WhatsApp',
      category: 'pages',
      icon: Share2,
      keywords: ['channels', 'accounts', 'social accounts', 'connect', 'oauth', 'meta', 'meta ads'],
      path: '/social-media/channels',
    },
    {
      id: 'page-post-queue',
      title: 'Post Queue & Automation',
      description: 'Scheduled post queues and publication engine status',
      category: 'pages',
      icon: Clock,
      keywords: ['queue', 'scheduled', 'publishing', 'automation'],
      path: '/social-media/post-queue',
    },
    {
      id: 'page-meta-ads',
      title: 'Meta Ads Manager',
      description: 'Create and track Facebook & Instagram ad campaigns',
      category: 'pages',
      icon: Megaphone,
      keywords: ['ads', 'meta ads', 'facebook ads', 'instagram ads', 'campaigns', 'adsets'],
      path: '/social-media/ads-manager',
    },
    {
      id: 'page-business-setup',
      title: 'Business Setup & Brand Identity',
      description: 'Company profile, target audience, brand tone, and products',
      category: 'pages',
      icon: Building2,
      keywords: ['business', 'profile', 'brand', 'setup', 'products', 'onboarding', 'brain'],
      path: '/ai-social/setup',
    },
    {
      id: 'page-ai-templates',
      title: 'Social Template Library',
      description: 'Curated prompt templates for marketing and promotions',
      category: 'pages',
      icon: Layers,
      keywords: ['templates', 'prompt library', 'copy templates', 'designs'],
      path: '/ai-social/templates',
    },
    {
      id: 'page-ai-chat-assistant',
      title: 'AI Chat Assistant',
      description: 'Interactive multi-model conversational assistant',
      category: 'tools',
      icon: MessageSquare,
      keywords: ['chat', 'assistant', 'gpt', 'ai chat', 'conversations'],
      path: '/ai-chat-assistant',
    },
    {
      id: 'page-ai-bot-studio',
      title: 'AI Bot Studio',
      description: 'Build and train customer support chatbots on your custom data',
      category: 'tools',
      icon: Bot,
      keywords: ['bot', 'chatbot', 'bot builder', 'knowledge base', 'training', 'widget'],
      path: '/ai-bot-studio',
    },
    {
      id: 'page-ai-detect',
      title: 'AI Content Detector',
      description: 'Detect AI-generated text and evaluate authenticity',
      category: 'tools',
      icon: ShieldAlert,
      keywords: ['detect', 'ai detector', 'plagiarism', 'authenticity'],
      path: '/ai-detect',
    },
    {
      id: 'page-ai-live-agent',
      title: 'AI Live Agent & Inbox',
      description: 'Human handover and real-time omnichannel inbox',
      category: 'tools',
      icon: Headset,
      keywords: ['live agent', 'inbox', 'customer support', 'live chat'],
      path: '/ai-live-agent',
    },
    {
      id: 'page-ai-transcription',
      title: 'AI Audio & Speech Transcription',
      description: 'Convert voice recordings, calls, and podcasts to text',
      category: 'tools',
      icon: Mic,
      keywords: ['transcription', 'audio', 'voice', 'speech to text', 'whisper', 'podcast'],
      path: '/ai-transcription',
    },
    {
      id: 'page-campaign-audience',
      title: 'Audience & Contact Groups',
      description: 'Segment audience lists for email, WhatsApp, and Telegram',
      category: 'campaigns',
      icon: Users,
      keywords: ['audience', 'contacts', 'segments', 'lists', 'subscribers'],
      path: '/campaign-hub/contacts/audience',
    },
    {
      id: 'page-plans-pricing',
      title: 'Subscription Plans & Pricing',
      description: 'View active plan, upgrade subscriptions, and compare tiers',
      category: 'settings',
      icon: CreditCard,
      keywords: ['plans', 'pricing', 'subscription', 'upgrade', 'pro plan'],
      path: '/plans',
    },
    {
      id: 'page-payment-setup',
      title: 'Payment Gateway Configuration',
      description: 'Configure Razorpay, Stripe, Bank Transfer, UPI, and Cash settings',
      category: 'settings',
      icon: CreditCard,
      badge: 'Admin',
      keywords: ['payment setup', 'gateways', 'bank transfer', 'upi', 'razorpay keys', 'stripe keys', 'offline payment setup'],
      path: '/payment-setup',
    },
    {
      id: 'page-members-roles',
      title: 'Team Members & Roles',
      description: 'Invite collaborators and customize granular permissions',
      category: 'settings',
      icon: ShieldCheck,
      keywords: ['members', 'team', 'roles', 'permissions', 'users', 'access control'],
      path: '/members',
    },
    {
      id: 'page-api-keys',
      title: 'API Keys & Developer Hub',
      description: 'Manage REST API tokens and MCP integration keys',
      category: 'settings',
      icon: Key,
      keywords: ['api keys', 'tokens', 'developer', 'webhooks', 'mcp'],
      path: '/api-keys',
    },
    {
      id: 'page-languages',
      title: 'Language & Localization',
      description: 'Manage multi-language translation dictionaries',
      category: 'settings',
      icon: Languages,
      keywords: ['language', 'translations', 'localization', 'i18n', 'hindi', 'english'],
      path: '/languages',
    },
    {
      id: 'page-app-settings',
      title: 'App & System Settings',
      description: 'Platform branding, SMTP mail server, and bot configurations',
      category: 'settings',
      icon: Settings,
      keywords: ['app settings', 'smtp', 'branding', 'email setup', 'system configuration'],
      path: '/app-settings',
    },
    {
      id: 'page-support',
      title: 'Knowledge Base & Support',
      description: 'Guides, API documentation, and helpdesk support tickets',
      category: 'settings',
      icon: HelpCircle,
      keywords: ['support', 'help', 'docs', 'knowledge base', 'faqs'],
      path: '/support/knowledge-base',
    },
  ], [theme, onOpenChange])

  // Filter commands by search and active category
  const filteredCommands = useMemo(() => {
    let list = allCommands

    if (activeCategory !== 'all') {
      list = list.filter((cmd) => cmd.category === activeCategory)
    }

    if (!search.trim()) {
      return list
    }

    const q = search.toLowerCase().trim()
    return list.filter((cmd) => {
      const matchTitle = cmd.title.toLowerCase().includes(q)
      const matchDesc = cmd.description?.toLowerCase().includes(q)
      const matchKeywords = cmd.keywords.some((kw) => kw.toLowerCase().includes(q))
      const matchPath = cmd.path?.toLowerCase().includes(q)
      return matchTitle || matchDesc || matchKeywords || matchPath
    })
  }, [allCommands, search, activeCategory])

  // Recent commands
  const recentCommands = useMemo(() => {
    if (search.trim() || activeCategory !== 'all') return []
    return recentIds
      .map((id) => allCommands.find((cmd) => cmd.id === id))
      .filter((cmd): cmd is CommandItem => !!cmd)
  }, [recentIds, allCommands, search, activeCategory])

  // Combined display list
  const displayItems = useMemo(() => {
    if (recentCommands.length > 0 && !search.trim() && activeCategory === 'all') {
      const nonRecent = filteredCommands.filter((cmd) => !recentIds.includes(cmd.id))
      return [...recentCommands, ...nonRecent]
    }
    return filteredCommands
  }, [recentCommands, filteredCommands, search, activeCategory, recentIds])

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search, activeCategory])

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    } else {
      setSearch('')
      setActiveCategory('all')
    }
  }, [open])

  // Handle command execution
  const executeCommand = (cmd: CommandItem) => {
    recordRecentCommand(cmd.id)
    if (cmd.action) {
      cmd.action()
    } else if (cmd.path) {
      onOpenChange(false)
      router.push(cmd.path)
    }
  }

  // Keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < displayItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayItems.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (displayItems[selectedIndex]) {
        executeCommand(displayItems[selectedIndex])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const categories = ['all', 'pages', 'ai_actions', 'tools', 'campaigns', 'settings']
      const currentIndex = categories.indexOf(activeCategory)
      const nextCategory = e.shiftKey
        ? categories[(currentIndex - 1 + categories.length) % categories.length]
        : categories[(currentIndex + 1) % categories.length]
      setActiveCategory(nextCategory)
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const categoryPills = [
    { id: 'all', label: 'All Items' },
    { id: 'ai_actions', label: '🤖 AI Actions' },
    { id: 'pages', label: '🚀 Pages' },
    { id: 'tools', label: '🛠️ AI Tools' },
    { id: 'campaigns', label: '📢 Campaigns' },
    { id: 'settings', label: '⚙️ Settings' },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-2xl gap-0 z-[100] animate-in fade-in zoom-in-95 duration-200">
          {/* Top Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
            <Search className="w-5 h-5 text-primary shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command, tool name, or search (e.g. 'recharge', 'festivals', 'theme')..."
              className="w-full bg-transparent text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-muted-foreground bg-muted/60 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-300 dark:border-zinc-700">
                ESC
              </kbd>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/20 scrollbar-none">
            {categoryPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveCategory(pill.id)}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0',
                  activeCategory === pill.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                )}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar"
          >
            {displayItems.length === 0 ? (
              <div className="py-12 text-center">
                <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm font-bold text-foreground">No matching commands or pages</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Try searching for "recharge", "festivals", "calendar", "ads", or "theme"
                </p>
              </div>
            ) : (
              displayItems.map((cmd, index) => {
                const Icon = cmd.icon
                const isSelected = index === selectedIndex
                const isRecent = recentIds.includes(cmd.id) && !search.trim() && activeCategory === 'all' && index < recentCommands.length

                return (
                  <div
                    key={cmd.id}
                    data-index={index}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group select-none',
                      isSelected
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary ring-1 ring-primary/30'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/60 text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                          isSelected
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-muted-foreground group-hover:text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn('text-sm font-bold truncate', isSelected ? 'text-primary dark:text-white' : 'text-foreground')}>
                            {cmd.title}
                          </span>
                          {cmd.badge && (
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] font-bold px-1.5 py-0 rounded-md shrink-0',
                                cmd.badge === 'Popular'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                  : cmd.badge === 'AI Creator' || cmd.badge === 'AI Strategy'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-primary/10 text-primary border-primary/30'
                              )}
                            >
                              {cmd.badge}
                            </Badge>
                          )}
                          {isRecent && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-mono">
                              <History className="w-2.5 h-2.5" /> Recent
                            </span>
                          )}
                        </div>

                        {cmd.description && (
                          <p className="text-xs text-muted-foreground truncate leading-relaxed">
                            {cmd.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {cmd.shortcut && (
                        <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] text-muted-foreground bg-muted/60 dark:bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
                          {cmd.shortcut}
                        </kbd>
                      )}
                      <CornerDownLeft
                        className={cn(
                          'w-4 h-4 transition-all duration-150',
                          isSelected ? 'opacity-100 translate-x-0 text-primary' : 'opacity-0 -translate-x-1'
                        )}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Shortcuts Info */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/60 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-muted/70 dark:bg-zinc-800 px-1.5 py-0.5 rounded border text-[10px]">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-muted/70 dark:bg-zinc-800 px-1.5 py-0.5 rounded border text-[10px]">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-muted/70 dark:bg-zinc-800 px-1.5 py-0.5 rounded border text-[10px]">Tab</kbd> Filter
              </span>
            </div>

            <div className="flex items-center gap-1 text-primary font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Siegfried Command 2.0
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Embedded Credit Recharge Modal for direct 1-click trigger */}
      <CreditRechargeModal
        open={isRechargeOpen}
        onOpenChange={setIsRechargeOpen}
      />
    </>
  )
}

export default CommandPalette
