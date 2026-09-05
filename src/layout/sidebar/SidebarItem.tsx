'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { iconMap } from '@/data/sidebarData'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { ExtendedSidebarItemProps } from '@/types'
import { isBrowser } from '@/utils/environment'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSidebarContext } from './SidebarContext'

const SidebarItem: FC<ExtendedSidebarItemProps> = ({ item, depth = 0, isCollapsed, isLast }) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentType = searchParams.get('type')
  const { hasPermission, hasAnyPermission, role } = usePermission()
  const { openMenuId, setOpenMenuId } = useSidebarContext()
  const isTopLevel = depth === 0
  const [localIsOpen, setLocalIsOpen] = useState(false)
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')
  const [isHovered, setIsHovered] = useState(false)

  const hasChildren = item.children && item.children.length > 0

  const matchesPath = (itemPath: string) => {
    const [basePath, queryString] = itemPath.split('?')
    const isBaseMatch = basePath === pathname || (basePath !== '/' && pathname.startsWith(basePath + '/'))
    if (!isBaseMatch) return false
    if (!queryString) {
      // If itemPath has no query, but current URL has discriminating query params like 'tab' or 'type',
      // only consider it a match if those specific params are empty.
      const currentTab = searchParams.get('tab')
      const currentTypeParam = searchParams.get('type')
      if (currentTab || currentTypeParam) return false
      return true
    }
    const itemParams = new URLSearchParams(queryString)
    for (const [key, val] of itemParams.entries()) {
      if (searchParams.get(key) !== val) return false
    }
    return true
  }

  const isActive =
    (item.path && matchesPath(item.path)) ||
    (hasChildren &&
      item.children?.some(
        (child: any) =>
          (child.path && matchesPath(child.path)) ||
          (child.children && child.children.some((gc: any) => gc.path && matchesPath(gc.path))),
      ))

  const isOpen = isTopLevel ? openMenuId === item.id : localIsOpen

  const handleToggle = () => {
    if (!hasChildren) return
    if (isTopLevel) {
      setOpenMenuId(isOpen ? null : item.id)
    } else {
      setLocalIsOpen(!isOpen)
    }
  }

  useEffect(() => {
    if (isTopLevel && isActive) {
      setTimeout(() => {
        setOpenMenuId(item.id)
      }, 100)
    } else if (!isTopLevel && isActive) {
      setTimeout(() => {
        setLocalIsOpen(true)
      }, 100)
    }
  }, [pathname, searchParams, isActive, isTopLevel, item.id, setOpenMenuId])

  useEffect(() => {
    if (isBrowser) {
      const observer = new MutationObserver(() => {
        setDir((document.documentElement.dir as 'ltr' | 'rtl') || 'ltr')
      })
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] })
      setTimeout(() => {
        setDir((document.documentElement.dir as 'ltr' | 'rtl') || 'ltr')
      }, 100)
      return () => observer.disconnect()
    }
  }, [])

  if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
    return null
  }

  if (item.requiredPermissions && item.requiredPermissions.length > 0 && !hasAnyPermission(item.requiredPermissions)) {
    return null
  }

  if (item.requiredRole && role !== item.requiredRole && role !== 'super_admin') {
    return null
  }

  const IconComponent = iconMap[item.icon as keyof typeof iconMap]
  const label = t(item.label.toLowerCase().replace(/ /g, '_').replace(/\./g, '_'), {
    defaultValue: item.label,
  })

  const ItemContent = (
    <div
      onClick={hasChildren ? handleToggle : undefined}
      className={cn(
        'group flex items-center gap-2 p-3 py-1.5 rounded-[6px] transition-all dark:border-none duration-300 border-primary-color relative overflow-hidden cursor-pointer',
        isCollapsed && depth === 0 ? 'w-12 h-12 rounded-[8px] gap-0 justify-center px-0 mx-auto' : 'w-full',
        isActive && isCollapsed && 'rounded-[8px]',
        isActive
          ? cn(' glass text-title-color font-bold! bg-primary/5 dark:bg-black/40', depth === 0 && isCollapsed && 'sidebar-active-item border-none!')
          : 'text-title-color font-medium hover:text-foreground ',
        depth > 0 &&
        ' py-1 h-9 transition-all duration-300 scale-100 bg-transparent border-none ps-6 hover:bg-transparent',
      )}
    >
      {depth > 0 && (
        <div className="absolute start-3.25 top-0 bottom-0 pointer-events-none">
          {/* Vertical piece */}
          <div
            className={cn(
              'absolute start-0 w-[1.2px] bg-slate-300 dark:bg-zinc-700 transition-all duration-300',
              isLast ? '-top-3 h-7.5' : '-top-3 -bottom-3',
            )}
          />
          {/* Horizontal piece */}
          <div className={cn("absolute start-0 top-1/2 -translate-y-1/2 w-3 h-[1.2px] transition-all duration-300", isActive ? "bg-primary" : "bg-slate-300 dark:bg-zinc-700")} />
        </div>
      )}
      {isActive && depth === 0 && !isCollapsed && (
        <div className="absolute inset-y-0 start-0 w-[3px] bg-primary z-10 rounded-e-[4px]" />
      )}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      <div
        className={cn(
          'transition-all duration-300 shrink-0',
          isActive
            ? 'text-title-color dark:text-white scale-110'
            : 'text-title-color dark:text-sidebar-text-color group-hover:scale-110 group-hover:text-primary dark:group-hover:text-primary',
        )}
      >
        {IconComponent && depth === 0 && <IconComponent className={cn('w-4.5 h-4.5')} />}
      </div>

      <span
        className={cn(
          'text-[15px] font-medium text-start tracking-wide transition-all duration-500 overflow-hidden whitespace-nowrap',
          isCollapsed && depth === 0 ? 'opacity-0 w-0 flex-none' : 'flex-1 opacity-100 w-auto',
          isActive
            ? cn(depth > 0 ? 'text-primary' : 'text-title-color dark:text-white', depth > 0 && 'text-[15px]')
            : cn(
              'group-hover:tracking-[1px] group-hover:text-primary dark:group-hover:text-primary text-title-color dark:text-sidebar-text-color',
              depth > 0 ? 'text-[15px] font-normal' : 'font-normal',
            ),
        )}
      >
        {label}
      </span>
      {hasChildren && !isCollapsed && (
        <div className={cn('transition-transform duration-300 rounded-full p-1', isOpen ? 'rotate-180' : '')}>
          <ChevronDown className={cn('w-3.5 h-3.5 dark:text-white', isActive ? 'text-primary' : '')} />
        </div>
      )}
    </div>
  )

  const ItemWrapper = (
    <div className="space-y-1 relative">
      {!hasChildren && item.path ? (
        <Link href={item.path} className={cn('no-underline flex', isCollapsed ? 'justify-center' : 'block')}>
          {ItemContent}
        </Link>
      ) : (
        ItemContent
      )}

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-0 space-y-0 overflow-hidden"
          >
            {item.children?.map((child: any, index: number) => (
              <SidebarItem
                key={child.id}
                item={child}
                depth={depth + 1}
                isCollapsed={isCollapsed}
                isLast={index === (item.children?.length ?? 0) - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  if (isCollapsed && depth === 0) {
    return (
      <div
        className="flex justify-center w-full px-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!hasChildren ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>{ItemWrapper}</TooltipTrigger>
              <TooltipContent side={dir === 'rtl' ? 'left' : 'right'} sideOffset={10} className="font-medium sidebar-tooltip text-sm rounded-[8px]! text-white bg-primary ">
                {label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Popover open={isHovered}>
            <PopoverTrigger asChild>
              <div className="w-full flex justify-center cursor-pointer">
                {ItemWrapper}
              </div>
            </PopoverTrigger>
            <PopoverContent
              side={dir === 'rtl' ? 'left' : 'right'}
              sideOffset={12}
              align="start"
              className="w-[220px] p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-glass-border dark:border-white/10 text-sm rounded-[8px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] z-[100] space-y-1 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="px-3 py-1.5 mb-1 border-b border-glass-border/50 pb-2">
                <span className="text-sm font-bold text-primary">{label}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                {item.children?.map((child: any) => (
                  <Link
                    key={child.id}
                    href={child.path || '#'}
                    className={cn(
                      "p-2 text-sm font-medium text-title-color dark:text-sidebar-text-color hover:bg-primary/10 hover:text-primary rounded-[8px] transition-all flex items-center gap-3 group/item",
                      (child.path && matchesPath(child.path)) && "bg-primary/10 text-primary font-bold shadow-sm"
                    )}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      (child.path && matchesPath(child.path))
                        ? "bg-primary scale-125"
                        : "bg-slate-300 dark:bg-zinc-700 group-hover/item:bg-primary group-hover/item:scale-125"
                    )} />
                    <span className="flex-1 truncate text-start">
                      {t(child.label.toLowerCase().replace(/ /g, '_').replace(/\./g, '_'), { defaultValue: child.label })}
                    </span>
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    )
  }

  return ItemWrapper
}

export default SidebarItem
