'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Search, Globe, Star, TrendingUp, MessageSquare,
  Zap, ArrowRight, Sparkles, CheckCircle2, AlertCircle,
  BarChart3, FileText, ExternalLink, Eye, ArrowUp, ArrowDown,
  Target, Shield, Calendar, Hash, Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─── Mock Data ─── */
const PROFILE_SCORE = 72

const PROFILE_CHECKS = [
  { label: 'Business Name', status: 'good' as const, detail: 'Sharma Dental Clinic' },
  { label: 'Address', status: 'good' as const, detail: 'Complete address listed' },
  { label: 'Phone Number', status: 'good' as const, detail: '+91 98765 43210' },
  { label: 'Business Hours', status: 'warning' as const, detail: 'Missing Saturday hours' },
  { label: 'Categories', status: 'good' as const, detail: 'Dental Clinic, Dentist' },
  { label: 'Description', status: 'warning' as const, detail: 'Too short — expand to 750 chars' },
  { label: 'Photos', status: 'warning' as const, detail: 'Only 5 photos — add 15+ for better ranking' },
  { label: 'Reviews', status: 'good' as const, detail: '42 reviews, 4.6 avg rating' },
  { label: 'Posts', status: 'critical' as const, detail: 'No Google posts in 30 days' },
  { label: 'Q&A', status: 'warning' as const, detail: '3 unanswered questions' },
]

const LOCAL_KEYWORDS = [
  { keyword: 'dentist near me andheri', volume: 3200, rank: 4, change: 2, type: 'geo_modified' as const },
  { keyword: 'dental clinic mumbai', volume: 8800, rank: 7, change: -1, type: 'primary' as const },
  { keyword: 'best dentist andheri west', volume: 1400, rank: 2, change: 3, type: 'service_area' as const },
  { keyword: 'root canal treatment andheri', volume: 890, rank: 5, change: 0, type: 'long_tail' as const },
  { keyword: 'teeth whitening near me', volume: 5600, rank: 12, change: -3, type: 'geo_modified' as const },
  { keyword: 'emergency dentist mumbai', volume: 2100, rank: 8, change: 1, type: 'primary' as const },
  { keyword: 'kids dentist andheri', volume: 720, rank: 3, change: 4, type: 'service_area' as const },
]

const CITATION_SOURCES = [
  { platform: 'Justdial', status: 'claimed' as const, priority: 'high' as const },
  { platform: 'Sulekha', status: 'unclaimed' as const, priority: 'high' as const },
  { platform: 'Practo', status: 'claimed' as const, priority: 'high' as const },
  { platform: 'Google Maps', status: 'claimed' as const, priority: 'high' as const },
  { platform: 'Yelp', status: 'unclaimed' as const, priority: 'medium' as const },
  { platform: 'Yellow Pages India', status: 'inconsistent' as const, priority: 'medium' as const },
]

const GOOGLE_POSTS = [
  { id: '1', title: 'Diwali Special: 20% Off on Teeth Whitening', status: 'draft' as const, date: 'Draft' },
  { id: '2', title: 'New Service: Invisible Braces Now Available', status: 'published' as const, date: 'Aug 15, 2026' },
  { id: '3', title: 'COVID-19 Safety Protocols at Our Clinic', status: 'published' as const, date: 'Aug 1, 2026' },
]

export default function GoogleBusinessDashboard() {
  const [tab, setTab] = useState<'profile' | 'keywords' | 'citations' | 'posts'>('profile')

  const getScoreColor = (s: number) => s >= 80 ? 'text-green-400' : s >= 50 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg text-xl">📍</div>
            AI Google Business Expert
          </h1>
          <p className="text-white/40 text-sm mt-2">Local SEO, Google Profile optimization, local keywords — sab automated.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl h-10 shadow-lg shadow-red-500/20">
            <Sparkles className="w-4 h-4" /> Run Full Audit
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit flex-wrap">
        {[
          { id: 'profile' as const, label: 'Profile Audit', icon: Shield },
          { id: 'keywords' as const, label: 'Local Keywords', icon: Target },
          { id: 'citations' as const, label: 'Citations', icon: Globe },
          { id: 'posts' as const, label: 'Google Posts', icon: FileText },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Profile Audit Tab ── */}
      {tab === 'profile' && (
        <div className="space-y-6">
          {/* Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="fill-none stroke-white/10" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" className={`fill-none ${PROFILE_SCORE >= 80 ? 'stroke-green-500' : PROFILE_SCORE >= 50 ? 'stroke-amber-500' : 'stroke-red-500'}`} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${PROFILE_SCORE * 2.64} 264`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(PROFILE_SCORE)}`}>{PROFILE_SCORE}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Profile Score</p>
                <p className="text-xs text-white/30">Needs improvement</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-amber-400" /><span className="text-xs text-white/50">Average Rating</span></div>
              <p className="text-2xl font-bold text-white">4.6 <span className="text-sm text-white/30">/ 5.0</span></p>
              <p className="text-xs text-white/30 mt-1">42 total reviews</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-blue-400" /><span className="text-xs text-white/50">Search Impressions</span></div>
              <p className="text-2xl font-bold text-white">2.4K <span className="text-xs text-green-400">↑ 12%</span></p>
              <p className="text-xs text-white/30 mt-1">Last 30 days</p>
            </div>
          </div>

          {/* Profile Checklist */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="px-5 py-3 bg-white/[0.03] border-b border-white/5">
              <h3 className="text-sm font-bold text-white">Profile Completeness Checklist</h3>
            </div>
            {PROFILE_CHECKS.map((check, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  {check.status === 'good' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  {check.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                  {check.status === 'critical' && <AlertCircle className="w-4 h-4 text-red-400" />}
                  <div>
                    <p className="text-xs font-medium text-white">{check.label}</p>
                    <p className="text-[10px] text-white/30">{check.detail}</p>
                  </div>
                </div>
                {check.status !== 'good' && (
                  <Button size="sm" className="gap-1 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg h-7 text-[10px]">
                    Fix <ArrowRight className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Local Keywords Tab ── */}
      {tab === 'keywords' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
            <p className="text-sm text-white flex items-center gap-2"><Target className="w-4 h-4 text-red-400" /> Track your local search rankings and optimize for high-impact keywords.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="grid grid-cols-6 gap-4 px-5 py-3 bg-white/[0.03] border-b border-white/5 text-[10px] text-white/30 font-semibold uppercase tracking-wider">
              <div className="col-span-2">Keyword</div><div>Volume</div><div>Rank</div><div>Change</div><div>Action</div>
            </div>
            {LOCAL_KEYWORDS.map((kw, i) => (
              <div key={i} className="grid grid-cols-6 gap-4 px-5 py-3 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02]">
                <div className="col-span-2">
                  <p className="text-xs font-medium text-white">{kw.keyword}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    kw.type === 'primary' ? 'bg-blue-500/20 text-blue-400'
                    : kw.type === 'geo_modified' ? 'bg-green-500/20 text-green-400'
                    : kw.type === 'service_area' ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-white/10 text-white/40'
                  }`}>{kw.type.replace('_', ' ')}</span>
                </div>
                <div className="text-xs text-white/60">{kw.volume.toLocaleString()}</div>
                <div className="text-xs font-bold text-white">#{kw.rank}</div>
                <div className="flex items-center gap-1">
                  {kw.change > 0 ? <><ArrowUp className="w-3 h-3 text-green-400" /><span className="text-xs text-green-400">+{kw.change}</span></>
                  : kw.change < 0 ? <><ArrowDown className="w-3 h-3 text-red-400" /><span className="text-xs text-red-400">{kw.change}</span></>
                  : <span className="text-xs text-white/30">—</span>}
                </div>
                <div>
                  <Button size="sm" className="h-6 text-[10px] px-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg">Optimize</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Citations Tab ── */}
      {tab === 'citations' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <p className="text-sm text-white flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> NAP (Name, Address, Phone) consistency across directories helps local SEO ranking.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CITATION_SOURCES.map((citation, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white font-bold text-sm">{citation.platform.charAt(0)}</div>
                    <h4 className="text-sm font-semibold text-white">{citation.platform}</h4>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    citation.status === 'claimed' ? 'bg-green-500/20 text-green-400'
                    : citation.status === 'unclaimed' ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400'
                  }`}>{citation.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] ${citation.priority === 'high' ? 'text-red-400' : 'text-amber-400'}`}>{citation.priority} priority</span>
                  {citation.status !== 'claimed' && (
                    <Button size="sm" className="gap-1 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg h-7 text-[10px]">
                      {citation.status === 'unclaimed' ? 'Claim' : 'Fix'} <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Google Posts Tab ── */}
      {tab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Google Business Posts</h3>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl h-9 shadow-lg shadow-red-500/20">
              <Sparkles className="w-3.5 h-3.5" /> AI Create Post
            </Button>
          </div>
          <div className="space-y-3">
            {GOOGLE_POSTS.map((post) => (
              <div key={post.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/[0.06] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-red-400" /></div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{post.title}</h4>
                    <p className="text-[10px] text-white/30">{post.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>{post.status}</span>
                  {post.status === 'draft' && (
                    <Button size="sm" className="gap-1 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg h-7 text-[10px]">
                      Publish <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
