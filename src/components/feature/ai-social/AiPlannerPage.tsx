'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Sparkles,
  Target,
  Calendar,
  Zap,
  TrendingUp,
  FileText,
  Video,
  Image as ImageIcon,
  BarChart3,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Coins,
  Plus,
  AlertTriangle,
  CreditCard,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  useGetBusinessProfileQuery,
  useGeneratePlanMutation,
  useGetCreditBalanceQuery,
} from '@/redux/api/aiSocialApi'
import CreditRechargeModal from './CreditRechargeModal'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function AiPlannerPage() {
  const router = useRouter()
  const now = new Date()
  const [month, setMonth] = useState(MONTHS[now.getMonth()])
  const [year, setYear] = useState(now.getFullYear())
  const [posts, setPosts] = useState(30)
  const [reels, setReels] = useState(8)
  const [stories, setStories] = useState(12)
  const [leads, setLeads] = useState(20)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [showRechargeModal, setShowRechargeModal] = useState(false)

  const { data: profileData } = useGetBusinessProfileQuery(undefined)
  const { data: creditData } = useGetCreditBalanceQuery(undefined)
  const [generatePlan, { isLoading }] = useGeneratePlanMutation()

  const business = (profileData as any)?.data
  const credits = (creditData as any)?.data?.balance ?? 0

  const estimatedCredits = posts * 5 + reels * 15 + stories * 2
  const hasInsufficientCredits = credits < estimatedCredits

  const handleGenerate = async () => {
    if (!business) {
      toast.error('Please complete Business Setup first', {
        action: {
          label: 'Setup Now',
          onClick: () => router.push('/ai-social/setup'),
        },
      })
      return
    }

    if (hasInsufficientCredits) {
      toast.error(`Insufficient credits! You need ${estimatedCredits.toLocaleString()} credits (Balance: ${credits.toLocaleString()}).`, {
        action: {
          label: 'Recharge Now',
          onClick: () => setShowRechargeModal(true),
        },
      })
      setShowRechargeModal(true)
      return
    }

    try {
      const res: any = await generatePlan({
        businessId: business._id,
        targetPosts: posts,
        targetReels: reels,
        targetStories: stories,
        targetLeads: leads,
        month,
        year,
      }).unwrap()

      setGeneratedPlan(res.data)
      toast.success(`🎉 Marketing Plan generated! ${res.count} items added to calendar.`)
    } catch (e: any) {
      const errMsg = e?.data?.error || e?.data?.message || 'Failed to generate plan'
      if (errMsg.toLowerCase().includes('credit') || errMsg.toLowerCase().includes('balance') || errMsg.toLowerCase().includes('insufficient')) {
        setShowRechargeModal(true)
      }
      toast.error(errMsg)
    }
  }

  const contentMix = [
    { label: 'Educational (Tips & How-to)', count: Math.round(posts * 0.27), icon: FileText, color: 'text-blue-500' },
    { label: 'Promotional (Services & Offers)', count: Math.round(posts * 0.20), icon: TrendingUp, color: 'text-amber-500' },
    { label: 'Trust & Authority', count: Math.round(posts * 0.17), icon: Target, color: 'text-emerald-500' },
    { label: 'Customer Testimonials', count: Math.round(posts * 0.13), icon: BarChart3, color: 'text-purple-500' },
    { label: 'FAQ / Problem Solver', count: Math.round(posts * 0.10), icon: FileText, color: 'text-cyan-500' },
    { label: 'Festival / Local Engagement', count: Math.round(posts * 0.07), icon: Calendar, color: 'text-pink-500' },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4">
      <PageHeader
        title="AI Marketing Planner"
        showBackButton={true}
        endContent={
          <div className="flex items-center gap-2">
            {/* Interactive Credit Balance Pill */}
            <button
              type="button"
              onClick={() => setShowRechargeModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                credits === 0
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 animate-pulse'
                  : hasInsufficientCredits
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                  : 'border-primary/30 bg-primary/5 hover:bg-primary/10 text-foreground'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-muted-foreground hidden sm:inline">Credits:</span>
              <span className="font-bold font-mono">{credits.toLocaleString()}</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px] font-bold">
                <Plus className="w-2.5 h-2.5" /> Top-up
              </span>
            </button>
          </div>
        }
      />

      {/* Out-of-the-Box Zero / Low Credit Warning Banner */}
      {hasInsufficientCredits && (
        <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent backdrop-blur-md animate-in fade-in duration-300">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  {credits === 0 ? 'No AI Credits Available' : 'Low Credit Balance for Configured Plan'}
                  <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-600 dark:text-amber-400">
                    Needs {estimatedCredits.toLocaleString()} Credits
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground">
                  You currently have <span className="font-bold text-foreground font-mono">{credits.toLocaleString()}</span> credits. Recharge instantly to generate your autonomous {month} {year} content calendar.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="premium"
              onClick={() => setShowRechargeModal(true)}
              className="gap-2 shrink-0 font-bold text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Recharge Credits Now
            </Button>
          </CardContent>
        </Card>
      )}

      {business ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center text-base">
                {business.name?.[0] || 'B'}
              </div>
              <div>
                <h2 className="font-bold text-foreground leading-snug">{business.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {business.category} · Tone: <span className="font-medium text-foreground">{business.brandTone}</span> · Language: <span className="font-medium text-foreground">{business.preferredLanguage}</span>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/ai-social/setup')}
              className="text-xs h-8 self-start sm:self-auto cursor-pointer"
            >
              Update Business Brain
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="text-sm text-foreground">
              <span className="font-semibold text-amber-500">Notice:</span> Business profile has not been set up yet.
            </div>
            <Button size="sm" variant="premium" onClick={() => router.push('/ai-social/setup')} className="cursor-pointer">
              Setup Profile
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <Card className="lg:col-span-7 border border-border">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Sparkles className="w-4 h-4" /> Autonomous Content Strategy
            </div>
            <CardTitle className="text-xl font-bold">Configure Marketing Targets</CardTitle>
            <CardDescription>Tell the AI what volume and conversion goals you want to achieve.</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planMonth">Target Month</Label>
                <select
                  id="planMonth"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="flex h-12 w-full rounded-[8px] border border-input-border-color bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground inner-card"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="planYear">Year</Label>
                <Input
                  id="planYear"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <ImageIcon className="w-4 h-4 text-blue-500" /> Image Posts / Carousels
                  </span>
                  <Badge variant="outline" className="font-bold text-blue-500">{posts} posts</Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={posts}
                  onChange={(e) => setPosts(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Video className="w-4 h-4 text-purple-500" /> Short-Form Reels / Videos
                  </span>
                  <Badge variant="outline" className="font-bold text-purple-500">{reels} reels</Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={reels}
                  onChange={(e) => setReels(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-pink-500" /> Daily Stories
                  </span>
                  <Badge variant="outline" className="font-bold text-pink-500">{stories} stories</Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={stories}
                  onChange={(e) => setStories(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Target className="w-4 h-4 text-emerald-500" /> Target Leads / Inquiries
                  </span>
                  <Badge variant="outline" className="font-bold text-emerald-500">{leads} inquiries</Badge>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={leads}
                  onChange={(e) => setLeads(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Estimated Cost Breakdown & Recharge Action */}
            <Card className="border border-border/80 bg-muted/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground font-medium block">Estimated Generation Cost</span>
                  <span className="text-xs text-muted-foreground">
                    ({posts} images × 5 + {reels} reels × 15 + {stories} stories × 2)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-black text-base text-foreground font-mono">
                      {estimatedCredits.toLocaleString()} credits
                    </span>
                    {hasInsufficientCredits && (
                      <span className="text-destructive font-semibold block text-xs">
                        Balance: {credits.toLocaleString()} (Short by {(estimatedCredits - credits).toLocaleString()})
                      </span>
                    )}
                  </div>
                  {hasInsufficientCredits && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowRechargeModal(true)}
                      className="text-xs font-bold border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                    >
                      + Top-up
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </CardContent>

          <CardFooter className="border-t border-border/40 pt-4">
            {hasInsufficientCredits ? (
              <Button
                variant="premium"
                size="lg"
                onClick={() => setShowRechargeModal(true)}
                className="w-full gap-2 font-bold shadow-md bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white hover:opacity-95 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Recharge Credits to Generate Plan ({estimatedCredits.toLocaleString()} Credits)
              </Button>
            ) : (
              <Button
                variant="premium"
                size="lg"
                disabled={isLoading || !business}
                onClick={handleGenerate}
                className="w-full gap-2 font-semibold shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Comprehensive Plan...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate {month} {year} Content Plan
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Right Column: AI Content Mix Preview */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Planned Content Distribution</CardTitle>
              <CardDescription>Industry-standard balanced formula for consistent engagement.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {contentMix.map((mix) => {
                const Icon = mix.icon
                return (
                  <div key={mix.label} className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-background/50">
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${mix.color}`} />
                      <span className="text-xs font-medium text-foreground">{mix.label}</span>
                    </div>
                    <Badge variant="secondary" className="font-bold">{mix.count}</Badge>
                  </div>
                )
              })}

              <div className="border-t border-border/60 pt-3 flex items-center justify-between text-sm font-bold">
                <span className="text-muted-foreground">Total Feed Items:</span>
                <span className="text-primary text-base">{posts + reels}</span>
              </div>
            </CardContent>
          </Card>

          {generatedPlan && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  Plan Active & Stored
                </div>
                <CardTitle className="text-base">Calendar populated for {month} {year}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>Content items have been scheduled into draft status. Head to Approval Center to review captions & schedule.</p>
              </CardContent>
              <CardFooter className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/ai-social/calendar')}
                  className="flex-1 cursor-pointer"
                >
                  View Calendar
                </Button>
                <Button
                  variant="premium"
                  size="sm"
                  onClick={() => router.push('/ai-social/approval')}
                  className="flex-1 gap-1 cursor-pointer"
                >
                  Approval Center <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* Out-of-the-Box Credit Recharge Modal */}
      <CreditRechargeModal
        open={showRechargeModal}
        onOpenChange={setShowRechargeModal}
        currentBalance={credits}
        requiredCredits={estimatedCredits}
      />
    </div>
  )
}
