'use client'
import NotFound from '@/app/not-found'
import ImpersonationBanner from '@/components/layout/ImpersonationBanner'
import DataLoader from '@/components/reusable/DataLoader'
import { ROUTES } from '@/constants/routes'
import { sidebarMenuData } from '@/data/sidebarData'
import { usePermission } from '@/hooks/usePermission'
import Header from '@/layout/header'
import Sidebar from '@/layout/sidebar'
import { cn } from '@/lib/utils'
import { setSidebarCollapsed } from '@/redux/slices/layoutSlice'
import { RootState } from '@/redux/store'
import { DashboardLayoutProps, MenuItem } from '@/types/layout'
import { authUtils } from '@/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOverlay, setIsSidebarOverlay] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth)
  const { hasPermission, role } = usePermission()

  // Flatten all menu items to check permissions for the current route
  const allMenuItems = useMemo(() => {
    const items: MenuItem[] = []
    const flatten = (menuItems: MenuItem[]) => {
      menuItems.forEach((item) => {
        if (item.path) items.push(item)
        if (item.children) flatten(item.children)
      })
    }
    sidebarMenuData.forEach((section) => flatten(section.items))
    return items
  }, [])

  // Check if the current route is allowed based on sidebar permissions
  const isRouteAllowed = useMemo(() => {
    if (!user) return true

    // Find if the current path matches any sidebar item (or its sub-paths)
    const matchedItem = allMenuItems
      .filter((item) => {
        const basePath = item.path ? item.path.split('?')[0] : ''
        return pathname === basePath || (basePath !== '/' && pathname.startsWith(`${basePath}/`))
      })
      .sort((a, b) => (b.path?.length || 0) - (a.path?.length || 0))[0]


    // whitelist routes that are NOT in the sidebar but are valid and allowed
    const HIDDEN_ALLOWED_PATHS = [
      ROUTES.DASHBOARD,
      '/profile',
      '/payment-success',
      '/billing',
      '/subscription/success',
      '/subscription/cancel',
      '/social/select-pages',
      '/ai-social',
      '/ai-agent-skills',
      ROUTES.MCP_STUDIO,
      '/mcp-studio',
    ]
    const isHiddenAllowed = HIDDEN_ALLOWED_PATHS.some(
      (path) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`)),
    )

    if (isHiddenAllowed) return true

    if (!matchedItem) {
      return false
    }

    // Re-implement the visibility logic from the Sidebar component
    if (matchedItem.requiredPermission && !hasPermission(matchedItem.requiredPermission)) {
      return false
    }
    if (matchedItem.requiredPermissions && !matchedItem.requiredPermissions.some((p) => hasPermission(p))) {
      return false
    }
    if (matchedItem.requiredRole && role !== matchedItem.requiredRole && role !== 'super_admin') {
      return false
    }

    return true
  }, [pathname, allMenuItems, user, hasPermission, role])

  const dispatch = useDispatch()
  const { isSidebarCollapsed } = useSelector((state: RootState) => state.layout)
  const isSidebarCollapsedRef = useRef(isSidebarCollapsed)

  useEffect(() => {
    isSidebarCollapsedRef.current = isSidebarCollapsed
  }, [isSidebarCollapsed])

  useEffect(() => {
    const updateSidebarBasedOnWidth = () => {
      const windowWidth = window.innerWidth
      const currentCollapsed = isSidebarCollapsedRef.current

      if (windowWidth >= 992 && windowWidth <= 1280) {
        if (!currentCollapsed) {
          dispatch(setSidebarCollapsed(true))
        }
      } else if (windowWidth > 1280) {
        if (currentCollapsed) {
          dispatch(setSidebarCollapsed(false))
        }
      }
    }

    updateSidebarBasedOnWidth()
    window.addEventListener('resize', updateSidebarBasedOnWidth)
    return () => window.removeEventListener('resize', updateSidebarBasedOnWidth)
  }, [dispatch])

  const lastPathnameRef = useRef(pathname)

  useEffect(() => {
    // Only trigger auto-collapse/expand when route actually changes
    if (lastPathnameRef.current !== pathname) {
      setTimeout(() => {
        setIsMobileMenuOpen(false)
      }, 100)

      const collapseRoutes = [
        ROUTES.CAMPAIGN_HUB.MESSAGES,
      ]

      // We only collapse for the Messages/Inbox module to maximize workspace
      if (collapseRoutes.includes(pathname as any)) {
        if (!isSidebarCollapsedRef.current) {
          dispatch(setSidebarCollapsed(true))
        }
      } else {
        // Return to default state for other modules if shared width allows
        if (isSidebarCollapsedRef.current && window.innerWidth > 1280) {
          dispatch(setSidebarCollapsed(false))
        }
      }
      lastPathnameRef.current = pathname
    }
  }, [pathname, dispatch])


  const hasAuth = isAuthenticated || authUtils.isAuthenticated()

  useEffect(() => {
    if (!isLoading && !hasAuth) {
      router.replace(ROUTES.AUTH.LOGIN)
    }
  }, [isLoading, hasAuth, router])

  if (isLoading || (!hasAuth && !isLoading)) {
    return <DataLoader fullPage size="md" />
  }

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isRouteAllowed) {
      router.replace(ROUTES.DASHBOARD)
    }
  }, [isLoading, isAuthenticated, isRouteAllowed, router])

  if (!isRouteAllowed && !isLoading && isAuthenticated) {
    return <DataLoader fullPage size="md" />
  }

  return (
    <div className="flex h-screen gap-0 min-[992px]:gap-3 overflow-hidden transition-all duration-500 relative bg-[var(--light-body)]">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] dark:block hidden" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] dark:block hidden" />
      </div>

      {/* Mobile Menu Backdrop */}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 min-[992px]:hidden flex justify-start">
          {/* Sidebar Content */}
          <div className="relative z-50 h-full animate-slide-in-left rtl:animate-slide-in-right!">
            <div className="h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <Sidebar isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          'hidden min-[992px]:block flex-shrink-0 z-[50] transition-all duration-500 ease-in-out ',
          isSidebarOverlay ? 'absolute left-4 top-4 bottom-4 w-[280px]' : isSidebarCollapsed ? 'w-20' : 'w-[260px]',
        )}
      >
        <Sidebar
          onLogoClick={() => {
            router.push(ROUTES.DASHBOARD)
            setIsSidebarOverlay(false)
          }}
        />
      </div>

      {/* Floating Main Content Area */}
      <div
        className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden relative z-10 transition-all duration-500"
        onClick={() => isSidebarOverlay && setIsSidebarOverlay(false)}
      >
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main
          className={cn(
            'flex-1 min-[992px]:p-15 px-4 pt-0! xl1280:p-8 lg991:p-4! lg991:pt-0! md:pb-6 pb-4 bg-transparent custom-scrollbar bg-glass-bg backdrop-blur-3xl border-glass-border',
            [
              ROUTES.CHAT_ASSISTANT.LIVE_AGENT,
              ROUTES.SMART_FILE_CHAT,
              ROUTES.CAMPAIGN_HUB.MESSAGES,
              ROUTES.SLIDE_MAKER,
            ].includes(pathname as any) || pathname.startsWith('/ai-chat-assistant/')
              ? 'overflow-hidden flex flex-col'
              : 'overflow-y-auto overflow-x-hidden',
          )}
        >
          <div
            className={cn(
              'w-full',
              [
                ROUTES.CHAT_ASSISTANT.LIVE_AGENT,
                ROUTES.SMART_FILE_CHAT,
                ROUTES.CAMPAIGN_HUB.MESSAGES,
                ROUTES.SLIDE_MAKER,
              ].includes(pathname as any) || pathname.startsWith('/ai-chat-assistant/')
                ? 'h-full flex flex-col min-h-0'
                : 'animate-fade-in',
            )}
          >
            <ImpersonationBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
