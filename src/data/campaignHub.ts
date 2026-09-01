import { ROUTES } from '@/constants/routes'
import { Variants } from 'framer-motion'
import { AlertCircle, Calendar, Layers, Mail, MessageCircle, MessageSquare, SendHorizontal, Store, UserPlus, Users, Video } from 'lucide-react'

export const campaignHubParentVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: 'easeOut',
      duration: 0.6,
    },
  },
}

export const getOverviewCards = (t: any, cards: any) => [
  {
    title: t('total_campaigns', { defaultValue: 'Total Broadcasts' }),
    value: cards?.totalBroadcasts || 0,
    icon: Layers,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    title: t('total_contacts', { defaultValue: 'Total Contacts' }),
    value: cards?.totalContacts || 0,
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    title: t('scheduled_campaigns', { defaultValue: 'Scheduled Broadcasts' }),
    value: cards?.totalScheduled || 0,
    icon: Calendar,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: t('failed_campaigns', { defaultValue: 'Failed Broadcasts' }),
    value: cards?.totalFailedBroadcasts || 0,
    icon: AlertCircle,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  {
    title: t('email_published', { defaultValue: 'Email Published' }),
    value: cards?.totalEmailPublished || 0,
    icon: Mail,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    title: t('whatsapp_published', { defaultValue: 'WhatsApp Published' }),
    value: cards?.totalWhatsappPublished || 0,
    icon: MessageSquare,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: t('telegram_published', { defaultValue: 'Telegram Published' }),
    value: cards?.totalTelegramPublished || 0,
    icon: SendHorizontal,
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
  },
  {
    title: t('telegram_subscribers', { defaultValue: 'Telegram Subscribers' }),
    value: cards?.totalTelegramSubscribers || 0,
    icon: UserPlus,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  {
    title: t('google_locations', { defaultValue: 'Google Locations' }),
    value: cards?.totalGmbAccounts || 0,
    icon: Store,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-600/10',
  },
  {
    title: t('tiktok_accounts', { defaultValue: 'TikTok Accounts' }),
    value: cards?.totalTikTokAccounts || 0,
    icon: Video,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    title: t('reddit_accounts', { defaultValue: 'Reddit Accounts' }),
    value: cards?.totalRedditAccounts || 0,
    icon: MessageCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
]

export const getCampaignChartOptions = (t: any, isDark: boolean, categories: string[]): any => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    },
    background: 'transparent',
  },
  colors: ['#6366f1', '#10b981', '#3b82f6'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 100],
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  grid: {
    borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    strokeDashArray: 4,
    padding: { left: 10, right: 10, bottom: 0 },
  },
  xaxis: {
    categories,
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        fontSize: '11px',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    forceNiceScale: true,
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        fontSize: '11px',
      },
      formatter: (val: number) => Math.floor(val).toString(),
    },
  },
  tooltip: {
    theme: isDark ? 'dark' : 'light',
    x: { show: true },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    fontSize: '13px',
    labels: { colors: isDark ? '#fff' : '#000' },
    markers: { radius: 12 },
  },
})

export const getHourlyChartOptions = (t: any, isDark: boolean, categories: string[]): any => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    animations: { enabled: true },
    background: 'transparent',
  },
  colors: ['#8b5cf6'],
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '45%',
      dataLabels: { position: 'top' },
    },
  },
  stroke: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val.toString(),
    offsetY: -35,
    style: {
      fontSize: '11px',
      colors: [isDark ? '#fff' : '#000'],
      fontWeight: 'bold',
    },
  },
  grid: {
    borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    strokeDashArray: 4,
    padding: { top: 30, left: 10, right: 10, bottom: 0 },
  },
  xaxis: {
    categories,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        fontSize: '11px',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        fontSize: '11px',
      },
    },
  },
  tooltip: { theme: isDark ? 'dark' : 'light', x: { show: false } },
})

export const getContactChartOptions = (t: any, isDark: boolean, categories: string[]): any => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
  },
  colors: ['#8b5cf6'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [0, 100],
    },
  },
  stroke: { curve: 'smooth', width: 3 },
  markers: {
    size: 4,
    strokeWidth: 2,
    strokeColors: '#fff',
    fillColors: '#8b5cf6',
  },
  grid: {
    borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    strokeDashArray: 4,
  },
  xaxis: {
    categories,
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        fontSize: '11px',
      },
    },
  },
  yaxis: {
    min: 0,
    forceNiceScale: true,
    labels: {
      style: {
        colors: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        fontSize: '11px',
      },
    },
  },
  tooltip: { theme: isDark ? 'dark' : 'light' },
})

export const viewCampaigns = [
  { key: 'email', route: ROUTES.CAMPAIGN_HUB.BROADCASTS.EMAIL },
  { key: 'whatsapp', route: ROUTES.CAMPAIGN_HUB.BROADCASTS.WHATSAPP },
  { key: 'telegram', route: ROUTES.CAMPAIGN_HUB.BROADCASTS.TELEGRAM },
]

export const createCampaigns = [
  { key: 'email', route: ROUTES.CAMPAIGN_HUB.BROADCASTS.CREATE.EMAIL },
  { key: 'whatsapp', route: ROUTES.CAMPAIGN_HUB.BROADCASTS.CREATE.WHATSAPP },
  { key: 'telegram', route: ROUTES.CAMPAIGN_HUB.BROADCASTS.CREATE.TELEGRAM },
]

export const cardRoutes = [
  ROUTES.CAMPAIGN_HUB.BROADCASTS.EMAIL, // Total Broadcasts
  ROUTES.CAMPAIGN_HUB.CONTACTS.HOME, // Total Contacts
  ROUTES.CAMPAIGN_HUB.BROADCASTS.WHATSAPP, // Scheduled Broadcasts
  ROUTES.CAMPAIGN_HUB.BROADCASTS.TELEGRAM, // Failed Broadcasts
  ROUTES.CAMPAIGN_HUB.BROADCASTS.EMAIL, // Email Published
  ROUTES.CAMPAIGN_HUB.BROADCASTS.WHATSAPP, // WhatsApp Published
  ROUTES.CAMPAIGN_HUB.BROADCASTS.TELEGRAM, // Telegram Published
  ROUTES.CAMPAIGN_HUB.TELEGRAM.SUBSCRIBERS, // Telegram Subscribers
  ROUTES.SOCIAL_MEDIA.CHANNELS, // Google Locations
  ROUTES.SOCIAL_MEDIA.CHANNELS, // TikTok Accounts
  ROUTES.SOCIAL_MEDIA.CHANNELS, // Reddit Accounts
]