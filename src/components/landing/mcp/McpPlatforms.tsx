'use client'

import { useState } from 'react'
import { mcpPlatforms } from '@/data/landingMcp'
import {
  Check,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  Camera,
  ThumbsUp,
  BriefcaseBusiness,
  Bird,
  Video,
  PlaySquare,
  MessageCircle,
  Share2,
  Pin,
  Bot,
  Copy,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

export default function McpPlatforms() {
  const [filter, setFilter] = useState<'all' | 'analytics' | 'messaging' | 'video'>('all')
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null)

  const filteredPlatforms = mcpPlatforms.filter((p) => {
    if (filter === 'analytics') return p.capabilities.analytics
    if (filter === 'messaging') return p.capabilities.comments || p.capabilities.dms
    if (filter === 'video') return p.supportedFormats.some((f) => f.toLowerCase().includes('video') || f.toLowerCase().includes('reel') || f.toLowerCase().includes('short'))
    return true
  })

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPromptId(id)
    toast.success('Example prompt copied!')
    setTimeout(() => setCopiedPromptId(null), 2000)
  }

  return (
    <section id="platforms" className="py-24 bg-[#090D16] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>9 Platforms • Official APIs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-outfit">
            What Can Your Agent Actually Do on Each Network?
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Capability is uneven across networks, and most tools gloss over that. Here is the honest breakdown of
            publishing, scheduling, analytics, and direct messaging across all 9 supported platforms.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Platforms (9)' },
              { id: 'analytics', label: 'Analytics Supported (5)' },
              { id: 'messaging', label: 'Comments & DMs (2)' },
              { id: 'video', label: 'Video, Shorts & Reels (4)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filter === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="rounded-2xl bg-[#0F1523]/80 border border-white/10 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/50"
            >
              <div className="space-y-4">
                {/* Platform Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: platform.color }}
                    >
                      <span className="font-bold text-sm">{platform.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {platform.name}
                      </h3>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {platform.badgeText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed min-h-[48px]">
                  {platform.description}
                </p>

                {/* Capability Matrix Badges */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Supported Capabilities
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Publishing</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Scheduling</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {platform.capabilities.analytics ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-gray-300">Analytics</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                          <span className="text-gray-600 line-through">Analytics</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {platform.capabilities.comments ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-gray-300">Comments</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                          <span className="text-gray-600 line-through">Comments</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      {platform.capabilities.dms ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-gray-300">Direct Messages & Auto-Replies</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                          <span className="text-gray-600 line-through">Direct Messages</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Supported Formats */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Supported Formats
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {platform.supportedFormats.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-300 font-medium"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Example Agent Prompt Box */}
              <div className="mt-5 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    Agent Prompt
                  </span>
                  <button
                    onClick={() => copyPrompt(platform.id, platform.examplePrompt)}
                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                  >
                    {copiedPromptId === platform.id ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Copy className="w-3 h-3" /> Copy
                      </span>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-gray-300 leading-relaxed">
                  &ldquo;{platform.examplePrompt}&rdquo;
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
