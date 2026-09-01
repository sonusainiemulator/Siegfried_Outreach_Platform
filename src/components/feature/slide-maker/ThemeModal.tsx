import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import { themeFilters } from '@/data/slideMaker'
import { ThemeModalProps } from '@/types/presentation'
import { Check, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ThemeModal = ({ open, onClose, themes, selectedTheme, onSelect }: ThemeModalProps) => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'Dark' | 'Light'>('All')

  const filtered = themes.filter((th: any) => {
    const name = (th.label || th.value || th.name || '').toLowerCase()
    const matchSearch = name.includes(search.toLowerCase())
    const matchFilter = filter === 'All' ? true : filter === 'Dark' ? th.mode === 'dark' : th.mode === 'light'
    return matchSearch && matchFilter
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)]! rounded-border-radius! flex flex-col max-h-[90vh]">
        <DialogHeader className="px-0 pt-0 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <DialogTitle className="text-xl font-medium text-title-color dark:text-white">
            {t('pick_a_style')}
          </DialogTitle>
        </DialogHeader>

        <div className="py-5 space-y-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Looking for a style?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-[8px]  glass-card glass-dark-card text-sm font-medium text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2">
            {themeFilters.map((f) => (
              <Button
                key={f}
                onClick={() => setFilter(f)}
                variant={filter === f ? 'default' : 'outline'}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${filter === f
                  ? 'bg-primary text-light-text-color'
                  : 'bg-[unset] shadow-none border-none dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400  dark:hover:bg-zinc-700'
                  }`}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {filtered.length > 0 ? (
              filtered.map((th: any) => {
                const name = th.label || th.value || th.name || ''
                const isSelected = selectedTheme === name
                return (
                  <Button
                    key={name}
                    onClick={() => {
                      onSelect(name)
                      onClose()
                    }}
                    variant="ghost"
                    className={`group p-0! h-auto! flex-col! items-stretch! rounded-2xl! border overflow-hidden text-left transition-all hover:shadow-lg ${isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-zinc-200 dark:border-zinc-700'
                      }`}
                  >
                    <div
                      className="h-24 flex flex-col justify-center px-4 relative transition-colors"
                      style={{
                        background: th.background || th.bg || (th.mode === 'dark' ? 'var(--dark-midnight)' : 'var(--white)')
                      }}
                    >
                      <p
                        className="text-sm font-bold truncate leading-tight mb-1"
                        style={{ color: th.titleColor || th.titleC || (th.mode === 'dark' ? 'var(--white)' : 'var(--dark-deep)') }}
                      >
                        {t('title')}
                      </p>
                      <p
                        className="text-[10px] opacity-70 truncate leading-tight"
                        style={{ color: th.mode === 'dark' ? 'var(--gray-light)' : 'var(--gray-muted)' }}
                      >
                        {t('body')} &amp;{' '}
                        <span className="underline" style={{ color: th.accentColor || th.accent || 'var(--indigo-main)' }}>
                          {t('link')}
                        </span>
                      </p>
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm animate-in fade-in zoom-in duration-200">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-2.5 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                      <p
                        className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-zinc-700 dark:text-zinc-300'}`}
                      >
                        {name}
                      </p>
                    </div>
                  </Button>
                )
              })
            ) : (
              <div className="col-span-4 text-center py-12 text-zinc-400 font-medium">
                {t('no_styles_match_your_search')}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ThemeModal
