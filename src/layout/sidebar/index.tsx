'use client'

import { Button } from '@/components/ui/button'
import { sidebarMenuData } from '@/data/sidebarData'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toggleSidebar } from '@/redux/slices/layoutSlice'
import { MenuItem, SidebarProps } from '@/types'
import { ChevronLeft, X } from 'lucide-react'
import { Fragment } from 'react'
import SectionHeader from './SectionHeader'
import { SidebarProvider } from './SidebarContext'
import SidebarItem from './SidebarItem'
import SidebarLogo from './SidebarLogo'

const Sidebar = ({ isMobile, onClose, onLogoClick }: SidebarProps) => {
  const { hasPermission, role } = usePermission()
  const dispatch = useAppDispatch()
  const { isSidebarCollapsed } = useAppSelector((state) => state.layout)

  const isItemVisible = (item: MenuItem): boolean => {
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return false
    }
    if (item.requiredPermissions && !item.requiredPermissions.some((p) => hasPermission(p))) {
      return false
    }
    if (item.requiredRole && role !== item.requiredRole && role !== 'super_admin') {
      return false
    }
    if (item.children && item.children.length > 0) {
      return item.children.some(isItemVisible)
    }
    return true
  }

  const visibleSections = sidebarMenuData
    .map((section) => ({
      ...section,
      items: section.items.filter(isItemVisible),
    }))
    .filter((section) => section.items.length > 0)

  const isExpanded = isMobile || !isSidebarCollapsed

  return (
    <aside
      className={cn(
        "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,0.9)),url('/images/bg-image.png')] dark:bg-[linear-gradient(to_bottom,rgba(8,6,12,0.9),rgba(8,6,12,0.9)),url('/images/bg-image.png')] inner-card border-none border-glass-border rounded-unset h-full text-sidebar-foreground flex flex-col relative group/sidebar transition-all duration-500 ease-in-out z-30 backdrop-blur-[50px]!",
        isExpanded ? 'w-[270px]' : 'w-[80px]',
        isMobile && 'w-[280px] sm:w-[300px]',
      )}
    >
      {isMobile && onClose && (
        <Button
          onClick={onClose}
          className="absolute inset-e-4 top-5 z-50 w-8 h-8 rounded-[8px] p-0! bg-background/50 backdrop-blur-md border border-glass-border flex items-center justify-center cursor-pointer shadow-sm hover:bg-background transition-all duration-300"
        >
          <X className="w-4 h-4 text-primary" />
        </Button>
      )}

      {!isMobile && (
        <Button
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            'absolute -inset-e-4 top-5 z-30 w-8 h-8 p-0! rounded-[8px] bg-light-primary border border-glass-border flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 opacity-100',
            isSidebarCollapsed && 'rotate-180',
            'rtl:rotate-180',
            isSidebarCollapsed && 'rtl:rotate-0'
          )}
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </Button>
      )}

      <SidebarProvider>
        <div className="relative flex flex-col h-full z-10">
          <SidebarLogo isCollapsed={!isExpanded} onClick={onLogoClick} />

          {/* Main Navigation */}
          <nav className={cn('flex-1 px-4 pb-4 overflow-y-auto space-y-2 custom-scrollbar no-scrollbar overflow-x-hidden', !isExpanded && 'px-0')}>
            {visibleSections.map((section) => (
              <Fragment key={section.title}>
                <SectionHeader label={section.title} isCollapsed={!isExpanded} />
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarItem key={item.id} item={item} isCollapsed={!isExpanded} />
                  ))}
                </div>
              </Fragment>
            ))}
          </nav>
        </div>
      </SidebarProvider>
    </aside>
  )
}

export default Sidebar
