'use client'

import React, { useState, useMemo } from 'react'
import {
  Sparkles,
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  Share2,
  Send,
  FileText,
  Video,
  Layers,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  Sliders,
  Flame,
  Globe,
  Tag,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Coins,
  Bot,
  ShieldCheck,
  RefreshCw,
  Plus,
  Play
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textArea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { INDIAN_FESTIVALS_CALENDAR, IndianFestival } from '@/data/indianFestivalsData'
import { useGetSocialAccountsQuery, useBatchScheduleSocialPostsMutation, useCreateSocialPostMutation } from '@/redux/api/socialMediaApi'
import { useGetBusinessProfileQuery } from '@/redux/api/aiSocialApi'
import { ROUTES } from '@/constants/routes'

const MONTH_FILTERS = [
  'All', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const CATEGORY_FILTERS = [
  'All',
  'National',
  'Major Hindu',
  'Islamic',
  'Sikh',
  'Christian',
  'Regional & Harvest'
]

export default function IndiaFestivalAutoPilotPage() {
  const { t } = useTranslation()
  const router = useRouter()

  // Queries & Mutations
  const { data: accountsData } = useGetSocialAccountsQuery({})
  const { data: profileData } = useGetBusinessProfileQuery(undefined)
  const [batchScheduleSocialPosts, { isLoading: isBatchScheduling }] = useBatchScheduleSocialPostsMutation()
  const [createSocialPost, { isLoading: isCreatingPost }] = useCreateSocialPostMutation()

  const rawAccounts = accountsData?.socialAccounts || []
  const accounts = rawAccounts.map((a: any) => ({
    id: a.id || a._id,
    _id: a._id || a.id,
    platform: a.platform,
    accountName: a.accountName || a.username || a.name || a.platform,
    isActive: a.isActive ?? true,
    profilePicture: a.profilePicture
  }))

  const business = (profileData as any)?.data
  const brandName = business?.name || 'Siegfried Outreach'

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isAutoPilotActive, setIsAutoPilotActive] = useState(true)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [activeFormatTab, setActiveFormatTab] = useState<Record<string, 'social' | 'reels' | 'whatsapp' | 'wordpress' | 'carousel'>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewFestival, setPreviewFestival] = useState<IndianFestival | null>(null)
  const [isFullYearModalOpen, setIsFullYearModalOpen] = useState(false)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [defaultPostTime, setDefaultPostTime] = useState('08:30')
  const [customOfferCode, setCustomOfferCode] = useState('FESTIVE2026')
  const [selectedFestivalIds, setSelectedFestivalIds] = useState<string[]>(
    INDIAN_FESTIVALS_CALENDAR.map(f => f.id)
  )

  // Initialize selected platforms with all available real accounts
  React.useEffect(() => {
    if (accounts.length > 0 && selectedPlatforms.length === 0) {
      setSelectedPlatforms(accounts.map((a: any) => a.id))
    }
  }, [accounts])

  // Filtered festivals
  const filteredFestivals = useMemo(() => {
    return INDIAN_FESTIVALS_CALENDAR.filter((festival) => {
      const matchesSearch =
        festival.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.hindiName.includes(searchQuery) ||
        festival.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        festival.socialPost.caption.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesMonth = selectedMonth === 'All' || festival.month === selectedMonth
      const matchesCategory = selectedCategory === 'All' || festival.category === selectedCategory

      return matchesSearch && matchesMonth && matchesCategory
    })
  }, [searchQuery, selectedMonth, selectedCategory])

  // Next upcoming festival
  const nextFestival = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const upcoming = INDIAN_FESTIVALS_CALENDAR.filter(f => f.date >= todayStr)
    return upcoming.length > 0 ? upcoming[0] : INDIAN_FESTIVALS_CALENDAR[0]
  }, [])

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied to clipboard! Ready to paste.')
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Get valid account IDs that actually exist in the database
  const getValidPlatformAccountIds = () => {
    const candidateIds = selectedPlatforms.length > 0
      ? selectedPlatforms
      : accounts.map((a: any) => a.id)

    // Filter to only IDs that match real accounts from the API
    return candidateIds.filter((candId: string) =>
      accounts.some((acc: any) => acc.id === candId || acc._id === candId)
    )
  }

  // 1-Click Schedule Single Festival
  const handleScheduleSingleFestival = async (festival: IndianFestival) => {
    const validPlatformIds = getValidPlatformAccountIds()

    if (validPlatformIds.length === 0) {
      toast.error(
        'Please connect at least one Social Media channel (Instagram, WhatsApp, Facebook, LinkedIn, WordPress, etc.) in Channels first!',
        {
          action: {
            label: 'Connect Channels',
            onClick: () => router.push(ROUTES.SOCIAL_MEDIA.CHANNELS)
          }
        }
      )
      return
    }

    try {
      const scheduledDateTime = `${festival.date}T${defaultPostTime}:00`

      const postTypesObj: Record<string, string> = {}
      validPlatformIds.forEach((id: string) => {
        postTypesObj[id] = 'post'
      })

      const formData = new FormData()
      formData.append('title', festival.socialPost.title)
      formData.append('content', festival.socialPost.caption)
      formData.append('isImmediate', 'false')
      formData.append('scheduledDateTime', new Date(scheduledDateTime).toISOString())
      formData.append('postTypes', JSON.stringify(postTypesObj))

      validPlatformIds.forEach((id: string) => {
        formData.append('platformAccounts', id)
      })

      if (festival.socialPost.autoReplyKeyword) {
        formData.append('autoReplyConfig', JSON.stringify({
          isEnabled: true,
          triggerKeyword: [festival.socialPost.autoReplyKeyword],
          publicMessage: 'Thank you for celebrating with us! Please check your message for your festive voucher! 🎁',
          privateMessage: festival.socialPost.autoReplyMessage
        }))
      }

      await createSocialPost(formData).unwrap()
      toast.success(
        `🎉 ${festival.name} successfully scheduled on ${festival.date} at ${defaultPostTime} AM!`,
        {
          description: 'Auto-pilot will broadcast to all connected social media platforms automatically.'
        }
      )
    } catch (err: any) {
      console.error('Schedule festival error:', err)
      toast.error(err?.data?.message || err?.message || 'Failed to schedule festival post.')
    }
  }

  // 1-Click Schedule Entire Year (All Festivals)
  const handleScheduleEntireYear = async () => {
    if (selectedFestivalIds.length === 0) {
      toast.error('Please select at least one festival to schedule!')
      return
    }

    const validPlatformIds = getValidPlatformAccountIds()

    if (validPlatformIds.length === 0) {
      toast.error(
        'Please connect at least one Social Media channel (Instagram, WhatsApp, Facebook, LinkedIn, WordPress, etc.) in Channels first!',
        {
          action: {
            label: 'Connect Channels',
            onClick: () => router.push(ROUTES.SOCIAL_MEDIA.CHANNELS)
          }
        }
      )
      return
    }

    try {
      const festivalsToSchedule = INDIAN_FESTIVALS_CALENDAR.filter(f =>
        selectedFestivalIds.includes(f.id)
      )

      const postsToSchedule = festivalsToSchedule.map((festival, index) => ({
        day: index + 1,
        date: festival.date,
        time: defaultPostTime,
        scheduledDateTime: new Date(`${festival.date}T${defaultPostTime}:00`).toISOString(),
        pillar: festival.category,
        postType: 'post',
        title: festival.socialPost.title,
        content: festival.socialPost.caption,
        hashtags: festival.socialPost.hashtags,
        autoReplyKeyword: festival.socialPost.autoReplyKeyword,
        autoReplyMessage: festival.socialPost.autoReplyMessage
      }))

      await batchScheduleSocialPosts({
        posts: postsToSchedule,
        platforms: validPlatformIds,
        autoReplyConfig: {
          isEnabled: true,
          publicMessage: 'Happy Festive Greetings! Check your inbox for your exclusive celebration voucher! 🎁',
        }
      }).unwrap()

      setIsFullYearModalOpen(false)
      toast.success(
        `🚀 FULL YEAR AUTOPILOT ACTIVATED! ${postsToSchedule.length} Indian Festivals scheduled successfully!`,
        {
          description: 'All festive campaigns, greetings, and auto-replies will publish autonomously without needing human approval.'
        }
      )
    } catch (err: any) {
      console.error('Batch festival schedule failed:', err)
      toast.error(err?.data?.message || err?.message || 'Failed to batch schedule all festivals.')
    }
  }

  // Open in Composer
  const handleOpenInComposer = (festival: IndianFestival) => {
    router.push(`${ROUTES.SOCIAL_MEDIA.CREATE_POST}?title=${encodeURIComponent(festival.socialPost.title)}&content=${encodeURIComponent(festival.socialPost.caption)}`)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4 animate-fade-in">
      {/* Top Header */}
      <PageHeader
        title="🇮🇳 India Festivals 365-Day Auto-Pilot Engine"
        showBackButton={true}
        endContent={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfigModalOpen(true)}
              className="h-9 gap-1.5 text-xs font-semibold rounded-xl border-border/40"
            >
              <Sliders className="w-3.5 h-3.5 text-primary" />
              <span>Brand Config</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setIsFullYearModalOpen(true)}
              className="h-9 gap-2 text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:opacity-95 text-white shadow-lg rounded-xl border-none cursor-pointer"
            >
              <Zap className="w-4 h-4 animate-pulse" />
              <span>⚡ 1-Click Schedule Full Year ({INDIAN_FESTIVALS_CALENDAR.length} Festivals)</span>
            </Button>
          </div>
        }
      />

      {/* Hero Banner: Autonomous Auto-Pilot Status */}
      <Card className="border-primary/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 backdrop-blur-xl shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-2.5 py-0.5 text-xs shadow-xs border-none">
                  🇮🇳 100% India Festivals Ready
                </Badge>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 font-bold px-2.5 py-0.5 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Autonomous Auto-Publish (Zero Human Approval Mode)</span>
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Full-Year Indian Festival Campaign Engine for {brandName}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Pre-made, culturally authentic, high-converting content for <span className="text-foreground font-semibold">Diwali, Raksha Bandhan, Holi, Eid, Navratri, Dussehra, Ganesh Chaturthi, Independence Day, Christmas</span> and 30+ regional festivals. Auto-broadcasts across <span className="text-primary font-semibold">WhatsApp Campaigns, Instagram Reels, Facebook, LinkedIn, X/Twitter & WordPress Blogs</span> without manual intervention.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0 bg-background/60 p-3.5 rounded-2xl border border-border/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">Auto-Pilot Mode</p>
                  <p className="text-[11px] text-muted-foreground">Publish without manual approval</p>
                </div>
                <Switch
                  checked={isAutoPilotActive}
                  onCheckedChange={setIsAutoPilotActive}
                />
              </div>
              <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{accounts.length} Connected Social Nodes Active</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/20">
            <div className="p-2.5 rounded-xl bg-background/40 border border-border/30">
              <p className="text-[11px] text-muted-foreground font-medium">Upcoming Festival</p>
              <p className="text-sm font-bold text-foreground truncate mt-0.5">{nextFestival.name}</p>
              <span className="text-[10px] text-amber-500 font-semibold">{nextFestival.date} ({nextFestival.month})</span>
            </div>
            <div className="p-2.5 rounded-xl bg-background/40 border border-border/30">
              <p className="text-[11px] text-muted-foreground font-medium">Master Calendar</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{INDIAN_FESTIVALS_CALENDAR.length} Festivals</p>
              <span className="text-[10px] text-muted-foreground">Full 365-Day Coverage</span>
            </div>
            <div className="p-2.5 rounded-xl bg-background/40 border border-border/30">
              <p className="text-[11px] text-muted-foreground font-medium">Multi-Format Assets</p>
              <p className="text-sm font-bold text-foreground mt-0.5">5 Formats / Festival</p>
              <span className="text-[10px] text-muted-foreground">Post, Reel, WA, Blog, Slides</span>
            </div>
            <div className="p-2.5 rounded-xl bg-background/40 border border-border/30">
              <p className="text-[11px] text-muted-foreground font-medium">Default Post Time</p>
              <p className="text-sm font-bold text-primary mt-0.5">{defaultPostTime} AM IST</p>
              <span className="text-[10px] text-muted-foreground">High-engagement morning slot</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* No Connected Channels Alert */}
      {accounts.length === 0 && (
        <Card className="border-amber-500/40 bg-amber-500/10 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg shrink-0">
              ⚠️
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">No Social Media Channels Connected Yet</h4>
              <p className="text-xs text-muted-foreground">
                Connect your social media accounts (Instagram, WhatsApp, Facebook, LinkedIn, WordPress, etc.) in Channels so Auto-Pilot can automatically publish your festival campaigns.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => router.push(ROUTES.SOCIAL_MEDIA.CHANNELS)}
            className="h-9 px-4 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shrink-0 cursor-pointer"
          >
            Connect Channels ➔
          </Button>
        </Card>
      )}

      {/* Filter Toolbar */}
      <div className="space-y-3 bg-card/40 p-4 rounded-2xl border border-border/40 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search festival (e.g. Diwali, Rakhi, Holi, Eid)..."
              className="pl-9 h-10 text-xs rounded-xl border-border/40 bg-background/50"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-background/60 text-muted-foreground hover:text-foreground border border-border/30'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-border/20 scrollbar-none">
          <span className="text-[11px] font-bold text-muted-foreground uppercase mr-1 shrink-0">Month:</span>
          {MONTH_FILTERS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMonth(m)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0',
                selectedMonth === m
                  ? 'bg-amber-500 text-white font-bold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Festivals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFestivals.map((festival) => {
          const currentTab = activeFormatTab[festival.id] || 'social'

          return (
            <Card
              key={festival.id}
              className="border-border/40 glass-card glass-dark-card rounded-2xl overflow-hidden shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Festival Card Header */}
                <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/20 bg-gradient-to-r from-background/40 to-background/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md shrink-0 bg-gradient-to-br',
                          festival.gradient
                        )}
                      >
                        {festival.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-bold text-foreground">
                            {festival.name}
                          </h3>
                          <Badge variant="outline" className="text-[10px] px-2 py-0.2 font-bold border-amber-500/30 text-amber-500 bg-amber-500/10">
                            {festival.hindiName}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span className="font-semibold text-foreground">{festival.date}</span>
                          <span>•</span>
                          <span>{festival.region || festival.religionOrType}</span>
                        </p>
                      </div>
                    </div>

                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] font-bold shrink-0">
                      {festival.category}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {festival.description}
                  </p>

                  {/* Multi-Format Format Tabs */}
                  <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-border/30 mt-3 overflow-x-auto scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setActiveFormatTab(prev => ({ ...prev, [festival.id]: 'social' }))}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer',
                        currentTab === 'social' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Social Post</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveFormatTab(prev => ({ ...prev, [festival.id]: 'reels' }))}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer',
                        currentTab === 'reels' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Video className="w-3 h-3" />
                      <span>Reels / Shorts</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveFormatTab(prev => ({ ...prev, [festival.id]: 'whatsapp' }))}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer',
                        currentTab === 'whatsapp' ? 'bg-[#25D366] text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Send className="w-3 h-3" />
                      <span>WhatsApp Campaign</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveFormatTab(prev => ({ ...prev, [festival.id]: 'wordpress' }))}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer',
                        currentTab === 'wordpress' ? 'bg-[#21759B] text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Globe className="w-3 h-3" />
                      <span>WP Blog</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveFormatTab(prev => ({ ...prev, [festival.id]: 'carousel' }))}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer',
                        currentTab === 'carousel' ? 'bg-purple-600 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Layers className="w-3 h-3" />
                      <span>5 Slides</span>
                    </button>
                  </div>
                </CardHeader>

                {/* Tab Content Display */}
                <CardContent className="p-4 sm:p-5 space-y-3">
                  {/* 1. SOCIAL POST TAB */}
                  {currentTab === 'social' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-background/50 border border-border/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">{festival.socialPost.title}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(festival.socialPost.caption, `soc-${festival.id}`)}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer font-medium"
                          >
                            {copiedId === `soc-${festival.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === `soc-${festival.id}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto scrollbar-thin">
                          {festival.socialPost.caption}
                        </p>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Tag className="w-3 h-3 text-primary" />
                          <span className="font-mono text-[11px]">{festival.socialPost.hashtags.slice(0, 4).join(' ')}...</span>
                        </div>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 text-[10px]">
                          Auto-Reply: Comment "{festival.socialPost.autoReplyKeyword}"
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* 2. REELS / SHORTS SCRIPT TAB */}
                  {currentTab === 'reels' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-background/50 border border-border/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>Hook: {festival.reelScript.hook}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(festival.reelScript.scenes.map(s => `[${s.time}] Visual: ${s.visual}\nVoiceover: "${s.audioVoiceover}"`).join('\n\n'), `reel-${festival.id}`)}
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer font-medium"
                          >
                            {copiedId === `reel-${festival.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copy Script</span>
                          </button>
                        </div>

                        <div className="space-y-2 max-h-36 overflow-y-auto scrollbar-thin text-xs">
                          {festival.reelScript.scenes.map((scene, i) => (
                            <div key={i} className="p-2 rounded-lg bg-card/60 border border-border/20 text-[11px] space-y-1">
                              <span className="font-bold text-amber-500">{scene.time}</span>
                              <p className="text-muted-foreground"><strong className="text-foreground">Visual:</strong> {scene.visual}</p>
                              <p className="text-foreground italic"><strong className="text-primary not-italic">Voice:</strong> "{scene.audioVoiceover}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="text-[11px]">🎵 Audio: {festival.reelScript.audioTrackRecommendation}</span>
                      </div>
                    </div>
                  )}

                  {/* 3. WHATSAPP CAMPAIGN TAB */}
                  {currentTab === 'whatsapp' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-[#25D366]/5 border border-[#25D366]/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#25D366] flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5" />
                            <span>{festival.whatsAppCampaign.messageTitle}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(festival.whatsAppCampaign.body, `wa-${festival.id}`)}
                            className="text-xs text-muted-foreground hover:text-[#25D366] flex items-center gap-1 cursor-pointer font-medium"
                          >
                            {copiedId === `wa-${festival.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copy Broadcast</span>
                          </button>
                        </div>
                        <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto scrollbar-thin font-sans">
                          {festival.whatsAppCampaign.body}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-muted-foreground">Coupon: <strong className="text-[#25D366] font-mono">{festival.whatsAppCampaign.offerDiscountCode}</strong></span>
                        <Badge className="bg-[#25D366] text-white text-[10px] font-bold">
                          {festival.whatsAppCampaign.ctaButtonText}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* 4. WORDPRESS BLOG TAB */}
                  {currentTab === 'wordpress' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-[#21759B]/5 border border-[#21759B]/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#21759B] truncate max-w-[80%]">
                            {festival.wordPressBlog.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(festival.wordPressBlog.content, `wp-${festival.id}`)}
                            className="text-xs text-muted-foreground hover:text-[#21759B] flex items-center gap-1 cursor-pointer font-medium"
                          >
                            {copiedId === `wp-${festival.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>Copy Article</span>
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground italic line-clamp-2">
                          "{festival.wordPressBlog.excerpt}"
                        </p>
                        <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto scrollbar-thin font-serif border-t border-border/20 pt-2">
                          {festival.wordPressBlog.content.slice(0, 300)}...
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="text-[11px] font-mono truncate">Slug: /{festival.wordPressBlog.slug}</span>
                        <span className="text-[11px] text-[#21759B] font-semibold">{festival.wordPressBlog.categories.join(', ')}</span>
                      </div>
                    </div>
                  )}

                  {/* 5. CAROUSEL SLIDES TAB */}
                  {currentTab === 'carousel' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-5 gap-1.5">
                        {festival.carouselSlides.map((slide) => (
                          <div key={slide.slideNumber} className="p-2 rounded-xl bg-card/60 border border-border/30 text-center space-y-1">
                            <span className="text-[10px] font-bold text-primary block">Slide {slide.slideNumber}</span>
                            <p className="text-[10px] font-semibold text-foreground truncate">{slide.title}</p>
                            <p className="text-[9px] text-muted-foreground line-clamp-2">{slide.body}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-muted-foreground">5-Slide Swipeable Deck</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(festival.carouselSlides.map(s => `Slide ${s.slideNumber}: ${s.title}\n${s.body}`).join('\n\n'), `car-${festival.id}`)}
                          className="text-xs text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy All Slides</span>
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>

              {/* Card Footer Actions */}
              <CardFooter className="p-4 sm:p-5 pt-3 border-t border-border/20 bg-background/20 flex items-center justify-between gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInComposer(festival)}
                  className="h-8 px-2.5 text-xs font-semibold rounded-lg border-border/40"
                >
                  <Sliders className="w-3.5 h-3.5 mr-1" />
                  <span>Customize in Studio</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleScheduleSingleFestival(festival)}
                    disabled={isCreatingPost}
                    className="h-8 px-3 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white rounded-lg border-none shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Auto-Schedule for {festival.date}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* 1-CLICK SCHEDULE ENTIRE YEAR MODAL */}
      <Dialog open={isFullYearModalOpen} onOpenChange={setIsFullYearModalOpen}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-2xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>1-Click Schedule Full Year Indian Festivals ({selectedFestivalIds.length} Selected)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Autonomous Auto-Pilot will automatically schedule all festival greetings, captions, hashtags, and auto-reply sequences for {brandName} on the exact festival dates at your chosen morning time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Preferred Post Time & Offer Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Default Morning Post Time (IST)</Label>
                <Input
                  type="time"
                  value={defaultPostTime}
                  onChange={(e) => setDefaultPostTime(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Festive Discount Coupon Code</Label>
                <Input
                  value={customOfferCode}
                  onChange={(e) => setCustomOfferCode(e.target.value)}
                  placeholder="e.g. FESTIVE2026"
                  className="h-10 text-xs rounded-xl uppercase font-mono"
                />
              </div>
            </div>

            {/* Select Target Channels */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Target Connected Social Channels:</Label>
                <span className="text-[11px] text-primary font-semibold">
                  {selectedPlatforms.length} / {accounts.length} Selected
                </span>
              </div>
              {accounts.length === 0 ? (
                <div className="p-3.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 text-center space-y-2">
                  <p className="text-xs text-amber-500 font-semibold">No Social Channels Connected Yet</p>
                  <p className="text-[11px] text-muted-foreground">Please connect your Instagram, WhatsApp, Facebook, LinkedIn, etc. in Channels first.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(ROUTES.SOCIAL_MEDIA.CHANNELS)}
                    className="h-8 text-xs font-semibold border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
                  >
                    Connect Channels ➔
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {accounts.map((acc: any) => {
                    const isChecked = selectedPlatforms.includes(acc.id)
                    return (
                      <div
                        key={acc.id}
                        onClick={() => {
                          setSelectedPlatforms(prev =>
                            prev.includes(acc.id) ? prev.filter(p => p !== acc.id) : [...prev, acc.id]
                          )
                        }}
                        className={cn(
                          'p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-xs font-semibold',
                          isChecked
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border/30 bg-background/40 text-muted-foreground'
                        )}
                      >
                        <div className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center text-[10px]',
                          isChecked ? 'bg-primary border-primary text-white' : 'border-neutral-400'
                        )}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{acc.accountName || acc.platform}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Festival Selection Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Included Indian Festivals:</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFestivalIds(INDIAN_FESTIVALS_CALENDAR.map(f => f.id))}
                    className="text-[11px] text-primary hover:underline font-bold"
                  >
                    Select All ({INDIAN_FESTIVALS_CALENDAR.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFestivalIds([])}
                    className="text-[11px] text-muted-foreground hover:text-destructive font-medium"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-xl border border-border/30 bg-background/30 scrollbar-thin">
                {INDIAN_FESTIVALS_CALENDAR.map((f) => {
                  const isChecked = selectedFestivalIds.includes(f.id)
                  return (
                    <div
                      key={f.id}
                      onClick={() => {
                        setSelectedFestivalIds(prev =>
                          prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id]
                        )
                      }}
                      className={cn(
                        'p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer text-xs transition-all',
                        isChecked ? 'border-amber-500/40 bg-amber-500/10' : 'border-border/20 opacity-60'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span>{f.emoji}</span>
                        <span className="font-semibold text-foreground">{f.name}</span>
                        <span className="text-[10px] text-muted-foreground">({f.hindiName})</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-amber-500">{f.date}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setIsFullYearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleScheduleEntireYear}
              disabled={isBatchScheduling}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 text-white font-bold text-xs"
            >
              {isBatchScheduling ? 'Scheduling All...' : `🚀 Confirm & Schedule ${selectedFestivalIds.length} Festivals for 2026`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BRAND CONFIG MODAL */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              <span>India Festival Auto-Pilot Settings</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Customize default publishing behaviors and brand parameters for automated festival releases.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Business / Brand Name</Label>
              <Input
                defaultValue={brandName}
                className="h-10 text-xs rounded-xl"
                placeholder="e.g. Siegfried Outreach"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Autonomous Auto-Publish (Zero Touch)</Label>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30">
                <div>
                  <p className="font-semibold text-foreground">Skip Human Approval</p>
                  <p className="text-[11px] text-muted-foreground">Auto-publish immediately when festival time arrives</p>
                </div>
                <Switch
                  checked={isAutoPilotActive}
                  onCheckedChange={setIsAutoPilotActive}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Default Daily Festival Morning Time</Label>
              <Input
                type="time"
                value={defaultPostTime}
                onChange={(e) => setDefaultPostTime(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => {
              setIsConfigModalOpen(false)
              toast.success('Auto-Pilot settings saved successfully!')
            }}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
