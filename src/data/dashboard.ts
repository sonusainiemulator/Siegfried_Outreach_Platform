import { ROUTES } from '@/constants/routes'
import { CardConfig, ColorKey } from '@/types/layout'
import { Variants } from 'framer-motion'
import { Banknote, Bot, CreditCard, FileText, UserPlus, Users, Zap } from 'lucide-react'

export const colorMap: Record<ColorKey, { text: string; iconBg: string; progressBg: string; cardGradient: string }> = {
  blue: {
    text: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    progressBg: 'bg-blue-400',
    cardGradient: 'from-blue-400/5',
  },
  emerald: {
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    progressBg: 'bg-emerald-400',
    cardGradient: 'from-emerald-400/5',
  },
  amber: {
    text: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    progressBg: 'bg-amber-400',
    cardGradient: 'from-amber-400/5',
  },
  purple: {
    text: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    progressBg: 'bg-purple-400',
    cardGradient: 'from-purple-400/5',
  },
  indigo: {
    text: 'text-indigo-400',
    iconBg: 'bg-indigo-400/10',
    progressBg: 'bg-indigo-400',
    cardGradient: 'from-indigo-400/5',
  },
}

export const cardConfigs: CardConfig[] = [
  {
    labelKey: 'total_registrations',
    defaultLabel: 'Total Registrations',
    descKey: 'global_user_reach',
    defaultDesc: 'Total registered users',
    statKey: 'totalUsers',
    icon: Users,
    color: 'blue',
    trend: '+12%',
    isLive: true,
  },
  {
    labelKey: 'new_this_week',
    defaultLabel: 'New Users this week',
    descKey: 'recent_growth',
    defaultDesc: 'Weekly user growth',
    statKey: 'thisWeekUsers',
    icon: UserPlus,
    color: 'emerald',
    trend: '+24%',
  },
  {
    labelKey: 'active_subscribers',
    defaultLabel: 'Active Subscribers',
    descKey: 'premium_loyalty',
    defaultDesc: 'Users with active paid subscriptions',
    statKey: 'totalSubscribers',
    icon: CreditCard,
    color: 'amber',
    trend: '+8%',
  },
  {
    labelKey: 'total_chatbots',
    defaultLabel: 'Total Chatbots',
    descKey: 'ai_distribution',
    defaultDesc: 'Total bots generated across projects',
    statKey: 'totalChatbots',
    icon: Bot,
    color: 'purple',
    trend: '+15%',
  },
  {
    labelKey: 'support_agents',
    defaultLabel: 'Support Agents',
    descKey: 'team_capacity',
    defaultDesc: 'Active human agents handling support',
    statKey: 'totalAgents',
    icon: Zap,
    color: 'indigo',
    trend: 'Stable',
  },
  {
    labelKey: 'total_revenue',
    defaultLabel: 'Total Revenue',
    descKey: 'revenue_growth',
    defaultDesc: 'Overall revenue from subscriptions',
    statKey: 'totalRevenue',
    icon: Banknote,
    color: 'emerald',
    trend: '+18%',
  },
]

export const userDashboardCardsConfig = [
  {
    labelKey: 'available_credits',
    descKey: 'ai_generation_power',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]',
    gradient: 'from-blue-500/50 via-blue-800/10 to-transparent',
    shadow: 'shadow-blue-500/20',
    glow: 'bg-blue-500/30',
    statKey: 'credits',
  },
  {
    labelKey: 'my_chatbots',
    descKey: 'active_assistants',
    icon: Bot,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10 shadow-[0_0_15px_-3px_rgba(251,146,60,0.3)]',
    gradient: 'from-orange-500/50 via-orange-800/10 to-transparent',
    shadow: 'shadow-orange-500/20',
    glow: 'bg-orange-500/30',
    statKey: 'totalChatbots',
  },
  {
    labelKey: 'my_articles',
    descKey: 'content_created',
    icon: FileText,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]',
    gradient: 'from-purple-500/50 via-purple-800/10 to-transparent',
    shadow: 'shadow-purple-500/20',
    glow: 'bg-purple-500/30',
    statKey: 'totalArticles',
  },
]

export const dashboardColors = ['#5BA5F5', '#95a4fc', '#ff9f43', '#ff5e57', '#10b981', '#06b6d4', '#f59e0b']

export const dashboardParentVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: 'easeOut',
      duration: 0.8,
    },
  },
}

export const dashboardItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const sparklesConfig = [
  {
    wrapperClass: 'absolute top-4 end-8 opacity-15 transition-opacity duration-700',
    iconClass: 'w-4 h-4 animate-pulse',
  },
  {
    wrapperClass: 'absolute top-12 end-16 opacity-15 transition-opacity duration-700 delay-100',
    iconClass: 'w-2 h-2 animate-pulse',
  },
  {
    wrapperClass: 'absolute top-8 end-24 opacity-20 transition-opacity duration-700 delay-300',
    iconClass: 'w-3 h-3 animate-pulse',
  },
  {
    wrapperClass: 'absolute top-15 end-30 opacity-15 transition-opacity duration-700 delay-100',
    iconClass: 'w-2 h-2 animate-pulse',
  },
  {
    wrapperClass: 'absolute bottom-16 end-16 opacity-30 transition-opacity duration-700 delay-500',
    iconClass: 'w-2 h-2 animate-pulse',
  },
  {
    wrapperClass:
      'absolute bottom-16 top-18 end-6 opacity-25 group-hover/card:opacity-60 transition-all duration-1000 group-hover/card:scale-125',
    iconClass: 'w-6 h-6 rotate-12',
  },
]

export const getCommonChartOptions = (isDark: boolean, t: any): any => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
    fontFamily: 'Inter, system-ui, sans-serif',
    animations: {
      enabled: true,
      easing: 'easeout',
      speed: 1000,
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
  },
  theme: { mode: isDark ? 'dark' : 'light' },
  grid: {
    borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: 10, bottom: 0, left: 10 },
  },
  dataLabels: { enabled: false },
  tooltip: {
    enabled: true,
    theme: 'dark',
    followCursor: true,
    intersect: false,
    shared: true,
    custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
      const isPie = ['pie', 'donut', 'polarArea', 'radialBar'].includes(w.config.chart.type)
      const value = isPie
        ? series[seriesIndex]
        : series[seriesIndex]
          ? Array.isArray(series[seriesIndex])
            ? series[seriesIndex][dataPointIndex]
            : series[seriesIndex]
          : 0

      const name = isPie
        ? w.globals.labels[seriesIndex]
        : w.globals.labels[dataPointIndex] || w.config.series[seriesIndex].name

      const color = isPie
        ? w.config.colors[seriesIndex]
        : w.config.plotOptions?.bar?.distributed || w.config.distributed
          ? w.config.colors[dataPointIndex]
          : w.config.colors[seriesIndex]

      const isRevenue =
        String(name || '')
          .toLowerCase()
          .includes('revenue') ||
        String(w.config.series[seriesIndex]?.name || '')
          .toLowerCase()
          .includes('revenue') ||
        String(w.config.series[seriesIndex]?.name || '')
          .toLowerCase()
          .includes('financial')

      const formattedValue = isRevenue ? `$${(value || 0).toLocaleString()}` : (value || 0).toLocaleString()

      return `
          <div class="relative bg-white/95 dark:bg-input-background/95 border-[unset]  px-4 py-2 flex flex-col min-w-[100px] transition-all duration-300">
          <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full shadow-sm" style="background-color: ${color || 'var(--blue-highlight)'}"></div>
          <span class="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest leading-none">${name || t('value')}</span>
          </div>
          <div class="flex items-baseline gap-1">
          <span class="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">${formattedValue}</span>
          </div>
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-input-background/95 rotate-45 border-b border-slate-200 dark:border-white/10"></div>
          </div>
          `
    },
  },
  xaxis: {
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    crosshairs: { show: false },
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
        fontSize: '11px',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
        fontSize: '11px',
      },
    },
  },
})

export const formatChartData = (data: Record<string, number> | undefined) => {
  const entries = Object.entries(data || {})
  return {
    names: entries.map(([name]) => name),
    values: entries.map(([_, value]) => value),
  }
}

export const routeMap: Record<string, string> = {
  totalUsers: ROUTES.MEMBERS,
  thisWeekUsers: ROUTES.MEMBERS,
  totalSubscribers: ROUTES.SUBSCRIPTIONS,
  totalChatbots: ROUTES.CHATBOT_BUILDER,
  totalAgents: ROUTES.CHAT_ASSISTANT.LIVE_AGENT,
  totalRevenue: ROUTES.TRANSACTIONS,
}

export const count = [1, 2, 3, 4]