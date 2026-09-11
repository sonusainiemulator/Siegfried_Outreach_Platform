'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun } from 'lucide-react'

export const AuthThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-[82px] h-[38px] rounded-full bg-gray-100 dark:bg-zinc-800/60 animate-pulse" />
    )
  }

  const isDark = (resolvedTheme || theme) === 'dark'

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className="inline-flex items-center p-1 rounded-full bg-white/95 dark:bg-[#1A1D24] border border-gray-200/90 dark:border-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300"
    >
      {/* Light Mode Button */}
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-label="Switch to light mode"
        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 cursor-pointer ${
          !isDark
            ? 'bg-white text-amber-500 shadow-[0_2px_6px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-transparent scale-100'
            : 'text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 scale-95'
        }`}
      >
        <Sun className="w-4 h-4 stroke-[2.2]" />
      </button>

      {/* Dark Mode Button with Moon & Stars */}
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-label="Switch to dark mode"
        className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 cursor-pointer ${
          isDark
            ? 'bg-zinc-800 text-purple-400 shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-zinc-700/60 scale-100'
            : 'text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 scale-95'
        }`}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          <path d="M19 3v3" />
          <path d="M20.5 4.5h-3" />
        </svg>
      </button>
    </div>
  )
}

export default AuthThemeToggle
