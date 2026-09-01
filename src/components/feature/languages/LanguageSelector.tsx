'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import languages from '@/data/languages.json'
import { cn } from '@/lib/utils'
import { LanguageSelectorProps } from '@/types/language'
import { Globe, Plus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function LanguageSelector({
  selectedLang,
  onSelect,
  isSelectOpen,
  setIsSelectOpen,
  searchQuery,
  setSearchQuery,
  error,
}: LanguageSelectorProps) {

  const { t } = useTranslation()
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.locale.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCustomAdd = () => {
    onSelect({
      name: searchQuery,
      locale: '',
      emoji: '🌐',
      code: '',
      isCustom: true
    })
    setIsSelectOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="relative group/selector">
        <div
          onClick={() => setIsSelectOpen(!isSelectOpen)}
          className={cn(
            "w-full h-12 rounded-[8px] inner-card glass-dark-card px-4 flex items-center justify-between cursor-pointer transition-all",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-primary/10 flex items-center justify-center text-primary">
              {selectedLang ? (
                <span className="text-xl">{selectedLang.emoji || '🌐'}</span>
              ) : (
                <Search className="w-4 h-4" />
              )
            }
            </div>
            <span className={cn(
              "font-bold text-sm",
              selectedLang ? "text-foreground" : "text-muted-foreground"
            )}>
              {selectedLang ? selectedLang.name : 'Click to choose language...'}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center -space-y-1 opacity-40">
            <div className="w-1.5 h-1.5 border-r border-b border-foreground rotate-45" />
            <div className="w-1.5 h-1.5 border-r border-b border-foreground rotate-45" />
          </div>
        </div>

        {isSelectOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-popover border border-glass-border rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-muted/50 rounded-xl text-sm focus:outline-none  border-none"
                placeholder="Search languages..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
              {filteredLanguages.map((lang) => (
                <div
                  key={lang.locale}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(lang)
                    setIsSelectOpen(false)
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 cursor-pointer transition-all group/langitem"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover/langitem:grayscale-0 transition-all">
                      {lang.emoji}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{lang.name}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">{lang.locale}</span>
                    </div>
                  </div>
                  <div className="h-6 w-6 rounded-lg bg-background/50 border border-glass-border flex items-center justify-center opacity-0 group-hover/langitem:opacity-100 transition-all">
                    <Plus className="w-3 h-3 text-primary" />
                  </div>
                </div>
              ))}

              {filteredLanguages.length === 0 && searchQuery && (
                <div className="p-4 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 mx-auto flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary/20 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{searchQuery}</p>
                    <p className="text-xs text-muted-foreground">{t('this_language_is_not_our_system')}</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCustomAdd()
                    }}
                    className="w-full rounded-xl bg-primary! text-white gap-2 font-bold h-11"
                  >
                    <Plus className="w-4 h-4" />
                    {t('create_new_language')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-[11px] text-destructive font-bold ml-1">{error}</p>}
    </div>
  )
}
