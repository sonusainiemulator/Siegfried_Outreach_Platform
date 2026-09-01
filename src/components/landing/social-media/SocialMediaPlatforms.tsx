'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  Sparkles,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Play,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Calendar,
  Send,
  Plus,
  Compass,
  Home,
  User,
  Clock,
  Flame,
  Bot,
  Video,
  Layers,
  AtSign,
} from 'lucide-react'
import Image from 'next/image'

export default function SocialMediaPlatforms() {
  return (
    <section id="platforms" className="py-20 md:py-32 px-4 sm:px-6 relative overflow-hidden bg-background/50">
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1320px] mx-auto space-y-12 md:space-y-16">
        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Title & Mascot */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* 3D-Style AI Bot Avatar */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-primary via-indigo-600 to-purple-600 p-[2px] shadow-2xl shadow-primary/30">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  <Bot className="w-10 h-10 text-cyan-400 animate-pulse relative z-10" />
                  <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center mt-1 border border-primary/50">
                    <span className="text-[10px] font-black text-white">R</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-background animate-ping" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-background" />
            </div>

            {/* Headings */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
                Create. Schedule.{' '}
                <span className="block mt-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  Publish Everywhere.
                </span>
              </h2>
            </div>
          </div>

          {/* Right Subtitle & Platforms Bar */}
          <div className="max-w-md space-y-4 text-center lg:text-left">
            <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              All-in-one AI platform to manage, automate & grow your brand across every social media.
            </p>

            {/* Quick platform badges */}
            <div className="p-2.5 rounded-2xl bg-card/80 border border-border/40 backdrop-blur-md shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-center lg:justify-start gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" /> Supported Platforms
              </div>
              <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
                {[
                  { name: 'Instagram', color: 'text-pink-500', icon: Instagram },
                  { name: 'Facebook', color: 'text-blue-500', icon: Facebook },
                  { name: 'LinkedIn', color: 'text-sky-600', icon: Linkedin },
                  { name: 'X', color: 'text-foreground', icon: Twitter },
                  { name: 'YouTube', color: 'text-red-500', icon: Youtube },
                  { name: 'TikTok', color: 'text-cyan-400', icon: Video },
                  { name: 'Threads', color: 'text-foreground', icon: AtSign },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.name}
                      className="flex flex-col items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-muted/30 transition-colors"
                      title={item.name}
                    >
                      <div className="w-7 h-7 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-xs">
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground hidden sm:inline truncate">
                        {item.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid for Primary 6 Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* 1. INSTAGRAM CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group"
          >
            {/* Glow backdrop overlay */}
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Left Column: Info */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Instagram</h3>
                  <p className="text-white/80 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Create stunning posts, Reels & carousels that engage and grow your audience.
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {[
                    'Feed Posts & Carousels',
                    'Reels & Stories',
                    'AI Captions & Hashtags',
                    'Best Time to Post',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Phone Mockup */}
              <div className="relative mx-auto w-full max-w-[210px] aspect-[9/16] rounded-[28px] border-4 border-white/40 bg-slate-950/80 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden">
                {/* Top Phone Notch */}
                <div className="flex items-center justify-between text-[8px] text-white/70 px-1 font-bold">
                  <span>9:41</span>
                  <span className="text-[9px] uppercase tracking-wider">New Reel</span>
                  <span>5G</span>
                </div>

                {/* Simulated Reel Media */}
                <div className="relative flex-1 my-1.5 rounded-xl overflow-hidden bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-2.5">
                  <div className="absolute inset-0 bg-cover bg-center opacity-90"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80')",
                    }}
                  />
                  <div className="relative z-10 text-[9px] font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full w-fit">
                    Trending Audio 🎵
                  </div>

                  {/* Reel Actions on Right */}
                  <div className="relative z-10 ml-auto space-y-2 text-center text-[8px]">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      </div>
                      <span>12.4K</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                        <MessageCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>312</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                        <Share2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>1.3K</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Instagram Nav */}
                <div className="flex items-center justify-around text-white/70 pt-1 border-t border-white/10">
                  <Home className="w-3.5 h-3.5" />
                  <Compass className="w-3.5 h-3.5" />
                  <div className="w-5 h-5 rounded-md border border-white flex items-center justify-center">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                  <Heart className="w-3.5 h-3.5" />
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. FACEBOOK CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0866FF] via-[#0052cc] to-[#00398a] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Facebook</h3>
                  <p className="text-white/80 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Manage pages, publish content and grow your community.
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {[
                    'Posts, Images & Videos',
                    'Page Management',
                    'AI Captions',
                    'Team Collaboration',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Composer Mockup */}
              <div className="rounded-2xl bg-white text-slate-900 shadow-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800">Create Post</span>
                  <span className="text-slate-400 text-xs">✕</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Reelease AI</p>
                    <span className="text-[10px] text-slate-500 font-medium">🌐 Public</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Exploring new places and creating unforgettable memories. 🌲✨
                </p>
                <div
                  className="w-full h-24 rounded-lg bg-cover bg-center border border-slate-200"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80')",
                  }}
                />
                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-1 text-xs">
                    <span>👍</span>
                    <span>❤️</span>
                    <span>😮</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-700 hover:bg-slate-200">
                      Schedule
                    </button>
                    <button className="px-3 py-1 text-[10px] font-bold rounded bg-blue-600 text-white hover:bg-blue-700">
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. LINKEDIN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0A66C2] via-[#004182] to-[#00264d] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">LinkedIn</h3>
                  <p className="text-white/80 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Build your brand, share insights & connect with professionals.
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {[
                    'Company & Personal Posts',
                    'AI Business Captions',
                    'Article & Link Sharing',
                    'Industry Hashtags',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* LinkedIn Composer Mockup */}
              <div className="rounded-2xl bg-white text-slate-900 shadow-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800">Create Post</span>
                  <span className="text-slate-400 text-xs">✕</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-bold">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Reelease AI</p>
                    <span className="text-[10px] text-slate-500 font-medium">👥 Anyone</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  The future is built by those who innovate today. 💼💡 #Leadership
                </p>
                <div
                  className="w-full h-24 rounded-lg bg-cover bg-center border border-slate-200"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80')",
                  }}
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                    Schedule
                  </button>
                  <button className="px-3 py-1 text-[10px] font-bold rounded bg-[#0A66C2] text-white">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. X (TWITTER) CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#18181b] via-[#09090b] to-[#000000] text-white shadow-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">X (Twitter)</h3>
                  <p className="text-white/70 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Create threads, tweets & engage with trending conversations.
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {[
                    'Thread Composer',
                    'AI Thread Generation',
                    'Trending Topics',
                    'Quote & Image Tweets',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* X Thread Mockup */}
              <div className="rounded-2xl bg-slate-900 border border-white/15 text-white shadow-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-white">New Thread</span>
                  <span className="text-[10px] text-white/50">1/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-black">
                    𝕏
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Reelease AI <span className="text-white/40 font-normal">@reeleaseai</span></p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/90 leading-relaxed">
                    Building in public is the best way to build trust.
                  </p>
                  <p className="text-xs text-cyan-400 font-semibold">
                    Here's why 👇
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <button className="text-[10px] text-white/60 hover:text-white flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add to thread
                  </button>
                  <button className="px-3 py-1 text-[10px] font-bold rounded-full bg-white text-black hover:bg-white/90">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5. THREADS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#121212] via-[#0a0a0a] to-[#000000] text-white shadow-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
                  <AtSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Threads</h3>
                  <p className="text-white/70 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Share ideas, start conversations and grow your community.
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {[
                    'Quick & Easy Publishing',
                    'AI Conversation Starters',
                    'Image & Text Posts',
                    'Best Time Suggestions',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Threads Mockup */}
              <div className="rounded-2xl bg-black border border-white/15 text-white shadow-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold">New Thread</span>
                  <span className="text-white/40 text-xs">✕</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    Good ideas start great conversations. What's on your mind today? 💡
                  </p>
                  <div
                    className="w-full h-20 rounded-lg bg-cover bg-center border border-white/10 opacity-85"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80')",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-white/50">Add to thread</span>
                  <button className="px-3 py-1 text-[10px] font-bold rounded-full bg-white text-black">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 6. TIKTOK CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#010101] via-[#0a0d14] to-[#111827] text-white shadow-2xl border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between group"
          >
            {/* Cyber neon border glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px]" />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-cyan-400/40">
                  <Video className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight">TikTok</h3>
                  <p className="text-white/70 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Create viral short videos and publish directly to TikTok.
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {[
                    'AI Video Generation',
                    'Auto Captions & Hashtags',
                    'Trending Content Ideas',
                    'Direct Publishing',
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      <div className="w-4 h-4 rounded-full bg-cyan-400/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-cyan-400 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TikTok Phone Mockup */}
              <div className="relative mx-auto w-full max-w-[210px] aspect-[9/16] rounded-[28px] border-4 border-cyan-500/30 bg-black shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-center text-[9px] font-bold text-white/80 gap-3">
                  <span className="opacity-50">Following</span>
                  <span className="underline decoration-cyan-400 underline-offset-4 font-black">For You</span>
                </div>

                <div
                  className="relative flex-1 my-1.5 rounded-xl bg-cover bg-center flex flex-col justify-end p-2"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80')",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="relative z-10 space-y-0.5">
                    <p className="text-[10px] font-bold text-white">@viralcreator</p>
                    <p className="text-[8px] text-white/80 line-clamp-1">AI Video editing workflow #ai #tech</p>
                  </div>
                </div>

                <div className="flex items-center justify-around text-white/70 pt-1 text-[8px]">
                  <Home className="w-3.5 h-3.5 text-white" />
                  <Compass className="w-3.5 h-3.5" />
                  <div className="w-6 h-4 rounded-md bg-gradient-to-r from-cyan-400 to-rose-500 flex items-center justify-center text-black font-bold">
                    +
                  </div>
                  <MessageCircle className="w-3.5 h-3.5" />
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 7. YOUTUBE FULL-WIDTH BANNER (Bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#FF0000] via-[#CC0000] to-[#800000] text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                <Youtube className="w-6 h-6 text-white" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight">YouTube</h3>
                <p className="text-white/80 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
                  Publish videos & Shorts, grow subscribers and expand your reach across the world's largest video platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'YouTube Videos & Shorts',
                  'Custom Thumbnails',
                  'AI Title & Description',
                  'Playlist Management',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                    <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Mockup (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white text-slate-900 shadow-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">New Video</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                      Upload
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-900 text-white">Video</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-600">Shorts</span>
                  </div>
                </div>

                <div
                  className="w-full h-28 sm:h-32 rounded-xl bg-cover bg-center relative overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80')",
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-900">
                    Exploring the Future of AI 🚀
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    AI is changing the world. In this video, we explore how AI is transforming content creation...
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-1.5">
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">AI</span>
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Technology</span>
                  </div>
                  <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors">
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
