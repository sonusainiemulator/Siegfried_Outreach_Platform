'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, TrendingUp, Target, Image, Film, Video, LayoutGrid,
  Zap, ArrowRight, Sparkles, Eye, Heart, MessageCircle, Send,
  BarChart3, Users, Search, Globe, Calendar, Clock, ChevronRight,
  Play, CheckCircle2, CreditCard, Flame, Star, Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─── Mock Data ─── */
const CONTENT_TYPES = [
  { id: 'post_image', label: 'Post Image', icon: Image, creditCost: 2, color: 'from-blue-500 to-cyan-500', desc: 'Static image post with caption' },
  { id: 'post_reel', label: 'Reel / Short', icon: Film, creditCost: 4, color: 'from-pink-500 to-rose-500', desc: 'Short-form vertical video' },
  { id: 'post_video', label: 'Video Post', icon: Video, creditCost: 5, color: 'from-purple-500 to-violet-500', desc: 'Full-length video content' },
  { id: 'post_carousel', label: 'Carousel', icon: LayoutGrid, creditCost: 3, color: 'from-amber-500 to-orange-500', desc: 'Multi-slide swipeable post' },
]

const VIRAL_IDEAS = [
  { id: '1', title: '5 Signs You Need a Root Canal — Don\'t Ignore #3!', platform: 'Instagram', viralScore: 92, contentType: 'post_carousel', hashtags: ['#dental', '#rootcanal', '#dentist', '#oralhealth'], engagement: '8.2K potential reach' },
  { id: '2', title: 'Before & After: Smile Makeover Transformation', platform: 'Instagram', viralScore: 88, contentType: 'post_reel', hashtags: ['#smilemakeover', '#dentistry', '#transformation'], engagement: '12.5K potential reach' },
  { id: '3', title: 'What Your Dentist Wants You to Know But Won\'t Say', platform: 'Instagram', viralScore: 95, contentType: 'post_carousel', hashtags: ['#dentalcare', '#healthtips', '#teethcare'], engagement: '15.8K potential reach' },
  { id: '4', title: 'POV: Your First Dental Cleaning in 5 Years', platform: 'TikTok', viralScore: 87, contentType: 'post_reel', hashtags: ['#dental', '#pov', '#relatable', '#dentistlife'], engagement: '22K potential reach' },
  { id: '5', title: 'Cost Breakdown: Teeth Whitening vs Veneers', platform: 'Instagram', viralScore: 78, contentType: 'post_image', hashtags: ['#teethwhitening', '#veneers', '#dentalcost'], engagement: '5.6K potential reach' },
]

const COMPETITOR_DATA = [
  { name: 'SmilePerfect Clinic', platform: 'Instagram', followers: '12.4K', postFreq: '5 posts/week', topContent: 'Before/After transformations', strength: 'Visual storytelling' },
  { name: 'DrDental Studio', platform: 'Instagram', followers: '8.7K', postFreq: '3 posts/week', topContent: 'Educational carousels', strength: 'Patient testimonials' },
  { name: 'CityDent Hub', platform: 'Facebook', followers: '15.2K', postFreq: '4 posts/week', topContent: 'Offer announcements', strength: 'Community engagement' },
]

const TRENDING_TOPICS = [
  { topic: 'Invisalign vs Braces 2026', score: 94, category: 'Dental', hashtags: ['#invisalign', '#braces', '#orthodontist'] },
  { topic: 'AI in Dentistry', score: 88, category: 'Technology', hashtags: ['#aidentistry', '#dentaltech', '#future'] },
  { topic: 'Smile Design Trends', score: 82, category: 'Cosmetic', hashtags: ['#smiledesign', '#cosmeticdentistry'] },
  { topic: 'Dental Tourism India', score: 76, category: 'Travel', hashtags: ['#dentaltourism', '#affordabledentistry'] },
]

const CONTENT_QUEUE = [
  { id: '1', title: 'Monday Motivation: Your Smile Journey', type: 'post_image', platform: 'Instagram', scheduledAt: 'Sep 8, 10:00 AM', status: 'scheduled' },
  { id: '2', title: 'Patient Testimonial — Teeth Whitening', type: 'post_reel', platform: 'Instagram', scheduledAt: 'Sep 9, 2:00 PM', status: 'generating' },
  { id: '3', title: '5 Foods That Stain Your Teeth', type: 'post_carousel', platform: 'Instagram', scheduledAt: 'Sep 10, 11:00 AM', status: 'ready' },
]

export default function SocialAgentDashboard() {
  const [tab, setTab] = useState<'ideas' | 'create' | 'competitors' | 'trends' | 'queue'>('ideas')
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg text-xl">📱</div>
            Social Media AI Agent
          </h1>
          <p className="text-white/40 text-sm mt-2">Viral content, competitor research, trending topics — all AI-powered.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white font-medium">373 Credits</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-fit flex-wrap">
        {[
          { id: 'ideas' as const, label: 'Viral Ideas', icon: Flame },
          { id: 'create' as const, label: 'Create Content', icon: Sparkles },
          { id: 'competitors' as const, label: 'Competitors', icon: Target },
          { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
          { id: 'queue' as const, label: 'Queue', icon: Calendar },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Viral Ideas Tab ── */}
      {tab === 'ideas' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20">
            <p className="text-sm text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-400" /> AI ne aapke business ke liye <strong>{VIRAL_IDEAS.length}</strong> viral content ideas generate kiye hain.</p>
          </div>
          <div className="space-y-3">
            {VIRAL_IDEAS.map((idea, i) => (
              <motion.div key={idea.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => setSelectedIdea(idea.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all group ${
                  selectedIdea === idea.id ? 'border-pink-500/40 bg-pink-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        idea.viralScore >= 90 ? 'bg-red-500/20 text-red-400' : idea.viralScore >= 80 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                      }`}><Flame className="w-2.5 h-2.5 inline mr-0.5" />{idea.viralScore}% Viral</span>
                      <span className="text-[10px] text-white/20">{idea.platform}</span>
                      <span className="text-[10px] text-white/20">{idea.contentType.replace('post_', '').replace('_', ' ')}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">{idea.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {idea.hashtags.map((tag) => (
                        <span key={tag} className="text-[10px] text-primary/60">{tag}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/30 mt-2 flex items-center gap-1"><Eye className="w-3 h-3" />{idea.engagement}</p>
                  </div>
                  <Button size="sm" className="gap-1 bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 rounded-lg h-8 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    Create <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Create Content Tab ── */}
      {tab === 'create' && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white">Choose Content Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTENT_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <motion.div key={type.id} whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer group transition-all text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{type.label}</h4>
                  <p className="text-[10px] text-white/30 mb-3">{type.desc}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-bold text-white">{type.creditCost} Credits</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Content Input */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white">Content Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Topic / Title</label>
                <input type="text" placeholder="e.g. Top 5 dental hygiene tips for winter" className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Style / Tone</label>
                <div className="flex gap-2 flex-wrap">
                  {['Professional', 'Casual', 'Funny', 'Educational', 'Inspirational', 'Promotional'].map((style) => (
                    <button key={style} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors">{style}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Platform</label>
                <div className="flex gap-2">
                  {['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok'].map((p) => (
                    <button key={p} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-colors">{p}</button>
                  ))}
                </div>
              </div>
              <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl h-11 px-8 shadow-lg shadow-pink-500/20">
                <Sparkles className="w-4 h-4" /> Generate Content <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Competitors Tab ── */}
      {tab === 'competitors' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <p className="text-sm text-white flex items-center gap-2"><Target className="w-4 h-4 text-violet-400" /> AI competitor research — dekho competitors kya kar rahe hain aur unse aage niklo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COMPETITOR_DATA.map((comp, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{comp.name.charAt(0)}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{comp.name}</h4>
                    <p className="text-[10px] text-white/30">{comp.platform}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-white/40">Followers</span><span className="text-white">{comp.followers}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/40">Post Frequency</span><span className="text-white">{comp.postFreq}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/40">Top Content</span><span className="text-white text-right max-w-[150px] truncate">{comp.topContent}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/40">Strength</span><span className="text-primary text-right">{comp.strength}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="outline" className="gap-2 border-white/10 text-white/60 rounded-xl">
            <Search className="w-4 h-4" /> Add Competitor URL
          </Button>
        </div>
      )}

      {/* ── Trends Tab ── */}
      {tab === 'trends' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <p className="text-sm text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-400" /> Real-time trending topics in your industry — updated every hour.</p>
          </div>
          {TRENDING_TOPICS.map((topic, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/[0.06] cursor-pointer transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">{i + 1}</div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{topic.topic}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/20">{topic.category}</span>
                    {topic.hashtags.map((tag) => (<span key={tag} className="text-[10px] text-primary/50">{tag}</span>))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-400">{topic.score}%</p>
                  <p className="text-[10px] text-white/20">Trend Score</p>
                </div>
                <Button size="sm" className="gap-1 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg h-8 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  Create Post <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Queue Tab ── */}
      {tab === 'queue' && (
        <div className="space-y-4">
          {CONTENT_QUEUE.map((content, i) => (
            <motion.div key={content.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  content.type === 'post_image' ? 'bg-blue-500/20' : content.type === 'post_reel' ? 'bg-pink-500/20' : 'bg-amber-500/20'
                }`}>
                  {content.type === 'post_image' ? <Image className="w-5 h-5 text-blue-400" />
                  : content.type === 'post_reel' ? <Film className="w-5 h-5 text-pink-400" />
                  : <LayoutGrid className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{content.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/30">{content.platform}</span>
                    <span className="text-[10px] text-white/20">{content.scheduledAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  content.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400'
                  : content.status === 'generating' ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-green-500/20 text-green-400'
                }`}>{content.status}</span>
                <Button size="sm" className="gap-1 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg h-7 text-[10px]">
                  <Send className="w-3 h-3" /> Post Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
