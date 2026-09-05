'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { Sparkles, ArrowRight, Terminal, Bot, ShieldCheck, Check } from 'lucide-react'

export default function McpCTA() {
  return (
    <section className="py-20 bg-[#070A10] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#161E33] to-[#0D1322] border border-white/15 p-8 sm:p-14 overflow-hidden shadow-2xl shadow-black/80 text-center space-y-6">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Model Context Protocol Infrastructure</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit max-w-2xl mx-auto leading-tight">
            Give Claude & Your AI Agents the Ability to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Actually Publish
            </span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            One hosted endpoint. 32 tools. 11 platforms. Connect Claude Code, Cursor, Codex, or Antigravity in seconds.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-semibold rounded-xl px-8 py-6 text-base shadow-xl shadow-indigo-500/30 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Connect Your Agent Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/plans">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/5 hover:bg-white/10 border-white/15 text-gray-200 font-semibold rounded-xl px-7 py-6 text-base backdrop-blur-md"
              >
                View Flat Plans ($29/mo)
              </Button>
            </Link>
          </div>

          {/* Value Props */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-mono">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Official APIs only</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Zero local server config</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Instant 1-click agent connection</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
