'use client'

import Link from 'next/link'
import { ROUTES } from '@/constants/routes'
import { Cpu, Terminal, ShieldCheck, Heart } from 'lucide-react'
import useSettings from '@/hooks/useSettings'

export default function McpFooter() {
  const { settings } = useSettings()
  const appName = settings?.app_name || 'Siegfried'

  return (
    <footer className="bg-[#05070C] border-t border-white/10 py-16 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-outfit">{appName} MCP</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Autonomous social media infrastructure for AI agents. One unified endpoint, 28 tools, 9 official platforms.
            </p>
            <div className="text-[11px] font-mono text-gray-500">
              Endpoint: <code className="text-indigo-400">api.siegfriedoutreach.com/mcp</code>
            </div>
          </div>

          {/* Col 2: Supported AI Agents */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              AI Clients
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#clients" className="hover:text-white transition-colors">Claude Code</a></li>
              <li><a href="#clients" className="hover:text-white transition-colors">Claude Desktop & Cowork</a></li>
              <li><a href="#clients" className="hover:text-white transition-colors">Cursor</a></li>
              <li><a href="#clients" className="hover:text-white transition-colors">OpenAI Codex</a></li>
              <li><a href="#clients" className="hover:text-white transition-colors">Google Antigravity</a></li>
              <li><a href="#clients" className="hover:text-white transition-colors">Windsurf & Gemini CLI</a></li>
            </ul>
          </div>

          {/* Col 3: Platform Endpoints */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Platforms
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#platforms" className="hover:text-white transition-colors">Instagram Graph API</a></li>
              <li><a href="#platforms" className="hover:text-white transition-colors">LinkedIn v2 API</a></li>
              <li><a href="#platforms" className="hover:text-white transition-colors">X (Twitter) v2 API</a></li>
              <li><a href="#platforms" className="hover:text-white transition-colors">TikTok Content Posting</a></li>
              <li><a href="#platforms" className="hover:text-white transition-colors">YouTube Data v3</a></li>
              <li><a href="#platforms" className="hover:text-white transition-colors">Facebook Pages API</a></li>
            </ul>
          </div>

          {/* Col 4: Resources & Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Developers & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#tools" className="hover:text-white transition-colors">28 MCP Tools Reference</a></li>
              <li><a href="#playground" className="hover:text-white transition-colors">Interactive Playground</a></li>
              <li><Link href="/plans" className="hover:text-white transition-colors">Flat Rate Pricing</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} {appName}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for the Autonomous Agent Era</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
