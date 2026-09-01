import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { iconMap, sidebarMenuData } from '@/data/sidebarData'
import { usePermission } from '@/hooks/usePermission'
import { LeftHeaderProps, MenuItem } from '@/types/layout'
import { Menu, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LeftHeader = ({ onMenuToggle }: LeftHeaderProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission, role } = usePermission()
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const isItemVisible = (item: MenuItem): boolean => {
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return false
    }
    if (item.requiredPermissions && !item.requiredPermissions.some((p) => hasPermission(p))) {
      return false
    }
    if (item.requiredRole && role !== item.requiredRole) {
      return false
    }
    return true
  }

  // Flatten menu items for searching
  const allItems = sidebarMenuData.flatMap((section) =>
    section.items.flatMap((item) => {
      const items = []
      if (isItemVisible(item)) {
        if (item.path) items.push(item)
        if (item.children) {
          item.children.forEach((child) => {
            if (isItemVisible(child) && child.path) items.push(child)
          })
        }
      }
      return items
    }),
  )

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setTimeout(() => {
        setFilteredItems([])
        setIsOpen(false)
      }, 100)
      return
    }

    const filtered = allItems.filter(
      (item) =>
        t(item.label).toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setTimeout(() => {
      setFilteredItems(filtered)
      setIsOpen(true)
    }, 100)
  }, [searchQuery, t, allItems])

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      setTimeout(() => mobileInputRef.current?.focus(), 100)
    }
  }, [mobileSearchOpen])

  const handleItemClick = (path: string) => {
    router.push(path)
    setSearchQuery('')
    setIsOpen(false)
    setMobileSearchOpen(false)
  }

  const closeMobileSearch = () => {
    setMobileSearchOpen(false)
    setSearchQuery('')
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="sm:hidden fixed inset-0 z-50 sm:p-0 p-2 bg-white dark:bg-black rounded-[8px] flex flex-col shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="relative flex-1" ref={dropdownRef}>
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                ref={mobileInputRef}
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() !== '' && setIsOpen(true)}
                className="w-full ps-11 pe-11 py-0! h-10 text-sm rounded-[8px] glass-button border-border"
              />
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-4 top-1/2 -translate-y-1/2 bg-unset! p-0! text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}

              {/* Mobile Search Results Dropdown - matching desktop design */}
              {isOpen && filteredItems.length > 0 && (
                <div className="absolute top-full start-0 w-full mt-2 bg-light-body backdrop-blur-xl border border-border rounded-border-radius shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-[350px] overflow-y-auto p-2 custom-scrollbar z-10 dark:bg-(--light-body)! dark:border-white-a00!">
                    {filteredItems.map((item) => {
                      const Icon = (iconMap as any)[item.icon]
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          onClick={() => item.path && handleItemClick(item.path)}
                          className="w-full h-auto flex items-center justify-start gap-3 px-4 py-3 text-sm text-start transition-all duration-200 group/item"
                        >
                          <div className="p-2.5 rounded-[8px] bg-light-gray group-hover/item:bg-primary/20 transition-colors dark:bg-light-body">
                            {Icon && (
                              <Icon className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground">{t(item.label)}</span>
                            {item.path && (
                              <span className="text-[10px] text-muted-foreground truncate">{item.path}</span>
                            )}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Mobile No Results Fallback */}
              {isOpen && searchQuery.trim() !== '' && filteredItems.length === 0 && (
                <div className="absolute top-full start-0 w-full mt-2 bg-light-body border border-border rounded-border-radius shadow-2xl p-6 text-center z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-sm text-muted-foreground">
                    {t('no_results_found', { defaultValue: 'No results found for' })}
                    <span className="text-foreground font-bold ms-1">"{searchQuery}"</span>
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobileSearch}
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-unset glass-card glass-dark-card rounded-[8px] flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          suppressHydrationWarning
          className="p-2 min-[992px]:hidden text-muted-foreground hover:text-foreground hover:bg-unset glass-card glass-dark-card rounded-[8px] transition-colors h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Mobile search trigger button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSearchOpen(true)}
          className="sm:hidden text-muted-foreground hover:text-foreground hover:bg-unset glass-card glass-dark-card rounded-[8px] transition-colors h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Desktop search bar */}
        <div className="hidden sm:flex search-lining group flex-1 max-w-xl relative" ref={dropdownRef}>
          <div className="search-lining-content relative w-full">
            <Search className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors z-30" />
            <Input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() !== '' && setIsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredItems.length > 0) {
                  const firstItem = filteredItems[0]
                  if (firstItem.path) handleItemClick(firstItem.path)
                }
              }}
              className="glass-header-card ps-10 pe-11 rounded-[8px]! glass-button py-2.5 text-base h-11 focus-visible:ring-0 w-full"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute end-4 top-1/2 transform -translate-y-1/2 z-30 text-muted-foreground hover:text-foreground transition-colors h-auto w-auto p-0 hover:bg-transparent"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Desktop Search Results Dropdown */}
          {isOpen && filteredItems.length > 0 && (
            <div className="absolute top-full start-0 w-full mt-2 bg-white dark:bg-modal-bg-color backdrop-blur-xl border border-border rounded-border-radius shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar z-10 dark:bg-(--light-body)! dark:border-white-a00!">
                {filteredItems.map((item) => {
                  const Icon = (iconMap as any)[item.icon]
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => item.path && handleItemClick(item.path)}
                      className="w-full h-auto flex items-center justify-start gap-3 px-4 py-3 text-sm text-start hover:bg-primary/5 dark:hover:bg-white-a05 hover:text-accent-foreground rounded-border-radius transition-all duration-200 group/item"
                    >
                      <div className="p-2 rounded-[8px] bg-light-gray group-hover/item:bg-primary/20 transition-colors dark:bg-light-body">
                        {Icon && (
                          <Icon className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                        )}
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="font-semibold text-sm text-foreground">{t(item.label)}</span>
                        {item.path && (
                          <span className="text-xs font-medium text-muted-foreground truncate max-w-50">{item.path}</span>
                        )}
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Desktop No Results Fallback */}
          {isOpen && searchQuery.trim() !== '' && filteredItems.length === 0 && (
            <div className="absolute top-full inset-s-0 w-full mt-2 bg-light-body border border-border rounded-border-radius glass-dark-card shadow-2xl p-6 text-center z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-sm text-muted-foreground">
                {t('no_results_found', { defaultValue: 'No results found for' })}
                <span className="text-foreground font-bold ms-1">`{searchQuery}`</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default LeftHeader
