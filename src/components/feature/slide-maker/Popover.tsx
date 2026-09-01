import { PopoverProps } from '@/types/presentation'
import { useEffect, useRef } from 'react'

const Popover = ({ anchor, open, onClose, children, width = '200px' }: PopoverProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) &&
        anchor.current && !anchor.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose, anchor])

  if (!open) return null

  return (
    <div
      ref={ref}
      className="absolute z-50 top-full mt-2 left-0 bg-white dark:bg-zinc-900 glass-dark-card border border-zinc-200 dark:border-zinc-800 rounded-border-radius hover:bg-zinc-50 bg-light-primary shadow-2xl overflow-hidden"
      style={{ minWidth: width }}
    >
      {children}
    </div>
  )
}

export default Popover
