'use client'

import DataLoader from '@/components/reusable/DataLoader'
import StatusPage from '@/components/reusable/StatusPage'
import { ROUTES } from '@/constants/routes'
import useSettings from '@/hooks/useSettings'
import { useAppSelector } from '@/redux/hooks'
import { MaintenanceWrapperProps } from '@/types'
import { getMediaUrl, authUtils } from '@/utils'
import { Wrench } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const MaintenanceWrapper = ({ children }: MaintenanceWrapperProps) => {
  const { settings, isLoading: isSettingsLoading } = useSettings()
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAppSelector((state) => state.auth)
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  const isAuthRoute =
    pathname?.includes('/login') ||
    pathname?.includes('/register') ||
    pathname?.includes('/forgot-password') ||
    pathname?.includes('/verify-otp') ||
    pathname?.includes('/reset-password')

  const isMaintenanceMode = Boolean(settings?.maintenance_mode) || settings?.maintenance_mode === '1' || settings?.maintenance_mode === 1
  const isLandingPageEnabled =
    settings?.landing_page_enabled !== false &&
    settings?.landing_page_enabled !== 'false' &&
    settings?.landing_page_enabled !== 0 &&
    settings?.landing_page_enabled !== '0'
  const isSuperAdmin = user?.role === 'super_admin'
  const isLandingRoute = pathname === ROUTES.HOME || pathname?.startsWith('/landing')
  const shouldRedirectFromLanding = isLandingRoute && !isLandingPageEnabled

  const userIp = settings?.userIp
  const allowedIps = settings?.maintenance_allowed_ips || []
  const isIpAllowed = allowedIps.includes(userIp)

  useEffect(() => {
    if (!shouldRedirectFromLanding) return
    const hasAuth = isAuthenticated || authUtils.isAuthenticated()
    router.replace(hasAuth ? ROUTES.DASHBOARD : ROUTES.AUTH.LOGIN)
  }, [shouldRedirectFromLanding, isAuthenticated, router])

  if (isSettingsLoading || isAuthLoading) {
    return <DataLoader fullPage />
  }

  if (shouldRedirectFromLanding) {
    return <DataLoader fullPage />
  }

  if (isMaintenanceMode && !isSuperAdmin && !isIpAllowed && !isAuthRoute) {
    return (
      <StatusPage
        title={settings?.maintenance_title || t('maintenance_mode_title')}
        description={settings?.maintenance_message || t('maintenance_mode_desc')}
        image={getMediaUrl(settings?.maintenance_image_url)}
        icon={Wrench}
        showHome={false}
        isMaintenance={true}
      />
    )
  }

  return <>{children}</>
}

export default MaintenanceWrapper
