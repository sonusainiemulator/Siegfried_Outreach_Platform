import { ROUTES } from '@/constants/routes'
import { useGetAdminSettingsQuery, useGetPublicSettingsQuery } from '@/redux/api/adminSettingApi'
import { useAppSelector } from '@/redux/hooks'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const useSettings = () => {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  // Determine if we are on an authentication page
  const isAuthPage = useMemo(() => {
    if (!pathname) return true
    const authPaths = Object.values(ROUTES.AUTH) as string[]
    return authPaths.some(path => pathname === path || pathname.startsWith(path + '/'))
  }, [pathname])

  // STRICT RULE: Only super_admin can ever access admin settings
  // Regular users and non-authenticated users should ALWAYS use public settings
  const canAccessAdminSettings = useMemo(() => {
    return !isAuthPage && isAuthenticated && user?.role === 'super_admin' && !!user?.id
  }, [isAuthPage, isAuthenticated, user])

  const {
    data: publicSettings,
    isLoading: publicLoading,
    isError: publicError,
  } = useGetPublicSettingsQuery(undefined, {
    skip: canAccessAdminSettings,
  })

  const {
    data: adminSettings,
    isLoading: adminLoading,
    isError: adminError,
  } = useGetAdminSettingsQuery(undefined, {
    skip: !canAccessAdminSettings,
  })

  const rawData = canAccessAdminSettings ? adminSettings : publicSettings
  const isLoading = canAccessAdminSettings ? adminLoading : publicLoading
  const isError = canAccessAdminSettings ? adminError : publicError

  const settings = rawData?.settings || rawData?.setting || rawData

  return {
    settings,
    isLoading,
    isError,
    isAuthenticated,
  }
}

export default useSettings
