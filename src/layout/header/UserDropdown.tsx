'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { ROUTES } from '@/constants/routes'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useGetProfileQuery, useLogoutMutation } from '@/redux/api/authApi'
import { useStopImpersonatingMutation } from '@/redux/api/userApi'
import { baseApi } from '@/redux/api/baseApi'
import { useGetCurrentSubscriptionQuery } from '@/redux/api/subscriptionApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearAuth, setAuth } from '@/redux/slices/authSlice'
import { authUtils, getMediaUrl } from '@/utils'
import { ArrowLeft, CreditCard, Loader2, LogOut, Settings, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const UserDropdown = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const direction = useAppDirection()
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAppSelector((state) => state.auth)
  const [stopImpersonating] = useStopImpersonatingMutation()

  useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 5 * 60 * 1000,
    refetchOnFocus: true,
  })

  const [logout, { isLoading }] = useLogoutMutation()
  const { data: subData } = useGetCurrentSubscriptionQuery()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const planIdField = subData?.subscription?.plan_id
  const currentPlan =
    subData?.subscription?.plan ??
    (typeof planIdField === 'object' && planIdField !== null ? planIdField : undefined)

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch {
    } finally {
      authUtils.clearAuth()
      dispatch(clearAuth())
      dispatch(baseApi.util.resetApiState())
      setShowLogoutDialog(false)
      router.replace(ROUTES.AUTH.LOGIN)
      toast.success(t('logged_out_successfully'))
    }
  }

  return (
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DropdownMenu dir={direction}>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer transition-all">
              <div className="relative group">
                <Avatar className="w-9! h-9! sm:w-11! sm:h-11! glass-button">
                  <AvatarImage 
                    src={user?.avatar && user.avatar !== 'null' ? getMediaUrl(user.avatar) : undefined} 
                    alt={user?.name || 'User'} 
                    className="object-cover" 
                  />
                  <AvatarFallback
                    className={cn('flex items-center justify-center font-bold', getAvatarColorClass(user?.name))}
                  >
                    {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 border border-border bg-white dark:bg-modal-bg-color rounded-border-radius! shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenuLabel>
              <div className="hidden min-[992px]:block group/profile">
                {isAuthLoading ? (
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-primary/5 animate-pulse rounded-md ms-auto" />
                    <div className="h-3 w-16 bg-muted animate-pulse rounded-md ms-auto" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-bold text-primary transition-colors">
                      {user?.role === 'admin' || user?.role === 'super_admin' ? t(user.role) : user?.name || t('guest')}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Zap className="w-2.5 h-2.5 text-primary fill-primary" />
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {(typeof currentPlan === 'object' && currentPlan?.name) || t('free_plan')}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={ROUTES.PROFILE} className="flex items-center w-full">
                <User className="me-2 h-4 w-4" />
                <span>{t('profile')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={ROUTES.SUBSCRIPTIONS} className="flex items-center w-full">
                <CreditCard className="me-2 h-4 w-4" />
                <span>{t('subscriptions')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {authUtils.isImpersonating() && (
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const savedAdmin = authUtils.getOriginalAdminUser()
                    const savedAdminToken = authUtils.getOriginalAdminToken()
                    const res = await stopImpersonating({
                      originalAdminId: savedAdmin?.id,
                      originalAdminToken: savedAdminToken || undefined,
                    }).unwrap()
                    authUtils.clearImpersonation()
                    authUtils.setToken(res.token)
                    authUtils.setUser(res.user)
                    dispatch(setAuth({ token: res.token, user: res.user, isImpersonating: false }))
                    dispatch(baseApi.util.resetApiState())
                    toast.success(res.message || t('returned_to_admin', { defaultValue: 'Returned to Admin Account' }))
                    setTimeout(() => window.location.replace('/dashboard'), 300)
                  } catch (err: any) {
                    toast.error(err?.data?.message || t('failed_to_return_to_admin', { defaultValue: 'Failed to return to admin account' }))
                  }
                }}
                className="bg-amber-500/15 text-amber-800 dark:text-amber-200 font-medium cursor-pointer hover:bg-amber-500/25 my-1"
              >
                <ArrowLeft className="me-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>{t('return_to_admin', { defaultValue: 'Return to Admin Account' })}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="me-2 h-4 w-4" />
              <Link href={ROUTES.APP_SETTINGS.HOME} className="flex items-center w-full">
                <span>{t('settings')}</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e: { preventDefault: () => void }) => {
                e.preventDefault()
                setShowLogoutDialog(true)
              }}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="me-2 h-4 w-4" />
              <span>{t('sign_out')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-lg! max-w-[calc(100%-2rem)]! rounded-border-radius! gap-0 overflow-hidden border-none shadow-2xl bg-light-body">
          <div>
            <DialogHeader className="mb-6">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5 animate-scale-in">
                <div className="relative">
                  <LogOut className="h-8 w-8 text-primary ps-1" />
                </div>
              </div>

              <DialogTitle className="text-center text-xl font-bold tracking-tight">{t('sign_out')}</DialogTitle>

              <DialogDescription className="text-center text-muted-foreground mt-2 text-[15px] leading-relaxed">
                {t('sign_out_confirm')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="grid grid-cols-2 gap-3 sm:gap-3 sm:space-x-0">
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
                className="w-full sm:h-12 h-10 rounded-[8px] border-border text-light-text-color bg-light-gray inner-card dark:text-white transition-all duration-200"
              >
                {t('cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full sm:h-12 h-10 rounded-[8px] shadow-md transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    <span>{t('signing_out')}...</span>
                  </>
                ) : (
                  t('sign_out')
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
  )
}

export default UserDropdown
