'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { mcpNavLinks } from '@/data/landingMcp'
import {
  Cpu,
  Copy,
  Check,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Terminal,
} from 'lucide-react'
import { toast } from 'sonner'

export default function McpHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copyEndpoint = () => {
    navigator.clipboard.writeText('https://api.siegfriedoutreach.com/mcp')
    setCopied(true)
    toast.success('MCP Server URL copied: https://api.siegfriedoutreach.com/mcp')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070A10]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/80 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Brand: Clean & Fixed Width */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#070A10] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white font-outfit">
                Siegfried
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm font-mono">
                MCP
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium tracking-wide">
              Social Media Agent Server
            </span>
          </div>
        </Link>

        {/* Center Nav: Glass Pill */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#121826]/80 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-xl shadow-lg">
          {mcpNavLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 whitespace-nowrap"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {/* Quick Copy Endpoint Badge */}
          <button
            onClick={copyEndpoint}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121826] hover:bg-[#1A2338] border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-colors duration-200 group"
            title="Click to copy MCP endpoint URL"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] text-gray-300 group-hover:text-white">
              api.siegfriedoutreach.com/mcp
            </span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-400" />
            )}
          </button>

          <Link href={ROUTES.AUTH.LOGIN}>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-xl px-3.5 h-9"
            >
              Sign In
            </Button>
          </Link>

          <Link href={ROUTES.AUTH.REGISTER}>
            <Button
              size="sm"
              className="text-xs font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white rounded-xl px-4 h-9 shadow-md shadow-indigo-500/25 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Connect Agent Free
            </Button>
          </Link>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="xl:hidden bg-[#070A10]/98 border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl backdrop-blur-2xl animate-fade-in">
          <div className="space-y-1">
            {mcpNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={copyEndpoint}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#121826] border border-white/10 text-xs font-mono text-gray-300"
            >
              <span>api.siegfriedoutreach.com/mcp</span>
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
            </button>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href={ROUTES.AUTH.LOGIN} className="w-full">
                <Button variant="outline" className="w-full text-xs border-white/10 text-gray-200 rounded-xl">
                  Sign In
                </Button>
              </Link>
              <Link href={ROUTES.AUTH.REGISTER} className="w-full">
                <Button className="w-full text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">
                  Connect Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
