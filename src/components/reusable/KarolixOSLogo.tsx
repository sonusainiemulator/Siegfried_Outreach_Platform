'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface KarolixOSLogoProps {
  className?: string
  href?: string
  showSubtitle?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const KarolixOSLogo: React.FC<KarolixOSLogoProps> = ({
  className,
  href = '/',
  showSubtitle = true,
  size = 'md',
}) => {
  const iconSizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const subtitleSizeClasses = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
  }

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 group cursor-pointer select-none', className)}>
      {/* Circle Icon: Blue gradient badge with bold "TT" Monogram */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full bg-gradient-to-tr from-[#1E5BF6] via-[#2F6BFA] to-[#4379F2] text-white font-black tracking-tight shadow-md shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105 shrink-0',
          iconSizeClasses[size],
        )}
      >
        <span>TT</span>
      </div>

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            'font-bold tracking-tight text-slate-900 dark:text-white transition-colors',
            titleSizeClasses[size],
          )}
        >
          Karolix
        </span>
        {showSubtitle && (
          <span
            className={cn(
              'font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5',
              subtitleSizeClasses[size],
            )}
          >
            AI BUSINESS OPERATING SYSTEM
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center no-underline">
        {content}
      </Link>
    )
  }

  return content
}

export default KarolixOSLogo
