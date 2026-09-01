import { Button } from '@/components/ui/button'
import { AdvancedSelectProps } from '@/types/presentation'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const AdvancedSelect = ({ label, value, opts, onChange }: AdvancedSelectProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      )
        setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const current = opts.find((o: any) => (o.value ?? o) === value)
  const currentLabel = current ? (current.label ?? current) : label

  return (
    <div className="relative">
      <Button
        ref={ref}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 px-4 rounded-full bg-[unset]! glass-card glass-dark-card border border-zinc-200 dark:border-zinc-800 font-semibold text-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors text-zinc-700 dark:text-zinc-300 shadow-none!"
      >
        {currentLabel}
        <ChevronDown className="w-3 h-3 text-zinc-400" />
      </Button>
      {open && (
        <div
          ref={listRef}
          className="absolute z-50 top-full mt-2 left-0 bg-white dark:bg-black glass-dark-card glass-card border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl py-2 px-2 min-w-[150px]"
        >
          {opts.map((o: any) => {
            const v = o.value ?? o
            const l = o.label ?? o
            return (
              <Button
                key={v}
                onClick={() => {
                  onChange(v)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium bg-unset! rounded-lg hover:bg-light-primary dark:hover:bg-light-primary transition-colors flex items-center justify-between ${
                  value === v
                    ? 'text-primary bg-light-primary dark:bg-light-primary'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {l}
                {value === v && <Check className="w-3.5 h-3.5" />}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdvancedSelect
