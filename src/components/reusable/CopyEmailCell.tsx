'use client'

import { cn } from '@/lib/utils'
import { CopyEmailCellProps } from '@/types'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

/**
 * Renders an email string in a table cell with a copy-to-clipboard icon
 * that appears on hover. Shows a check mark briefly after copying.
 */
export const CopyEmailCell = ({ email, truncate = true }: CopyEmailCellProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <span className="group/email inline-flex items-center gap-1.5 max-w-full">
      <span className={cn('text-sm text-subtitle-color', truncate ? 'truncate' : 'break-all')}>{email}</span>
      <Button
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy email'}
        className="shrink-0 opacity-0 group-hover/email:opacity-100 p-0! transition-opacity duration-150 text-muted-foreground hover:text-foreground focus:opacity-100 focus:outline-none"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </Button>
    </span>
  )
}
