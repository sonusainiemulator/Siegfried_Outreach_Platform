'use client'

import { Button } from '@/components/ui/button'
import { baseApi } from '@/redux/api/baseApi'
import { useStopImpersonatingMutation } from '@/redux/api/userApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setAuth } from '@/redux/slices/authSlice'
import { ApiError } from '@/types'
import { authUtils } from '@/utils'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function ImpersonationBanner() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { user, isImpersonating, originalAdmin, originalAdminToken } = useAppSelector((state) => state.auth)
  const [stopImpersonating, { isLoading }] = useStopImpersonatingMutation()

  const activeImpersonation = isImpersonating || authUtils.isImpersonating()
  const savedOriginalAdmin = originalAdmin || authUtils.getOriginalAdminUser()
  const savedOriginalAdminToken = originalAdminToken || authUtils.getOriginalAdminToken()

  if (!activeImpersonation) {
    return null
  }

  const handleReturnToAdmin = async () => {
    try {
      const res = await stopImpersonating({
        originalAdminId: savedOriginalAdmin?.id,
        originalAdminToken: savedOriginalAdminToken || undefined,
      }).unwrap()

      // Restore original admin token and user
      authUtils.clearImpersonation()
      authUtils.setToken(res.token)
      authUtils.setUser(res.user)

      dispatch(
        setAuth({
          token: res.token,
          user: res.user,
          isImpersonating: false,
          originalAdmin: null,
          originalAdminToken: null,
        }),
      )

      dispatch(baseApi.util.resetApiState())
      toast.success(res.message || t('returned_to_admin', { defaultValue: 'Returned to Admin Account' }))

      setTimeout(() => {
        window.location.replace('/dashboard')
      }, 300)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_return_to_admin', { defaultValue: 'Failed to return to admin account' }))
    }
  }

  return (
    <div className="w-full mb-6 animate-in fade-in slide-in-from-top duration-300">
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-800 dark:bg-amber-500/30 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg leading-snug text-amber-900 dark:text-amber-100">
              {t('admin_impersonation_active', { defaultValue: 'Admin impersonation active' })}
            </h4>
            <p className="text-sm text-amber-800/90 dark:text-amber-200/90 mt-0.5">
              {t('impersonation_browsing_as', { defaultValue: 'You are currently browsing as this customer.' })}
              {savedOriginalAdmin?.email && (
                <span className="ml-1 opacity-90 text-xs sm:text-sm font-medium">
                  ({t('original_admin', { defaultValue: 'Original Admin:' })} {savedOriginalAdmin.email})
                </span>
              )}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleReturnToAdmin}
          disabled={isLoading}
          className="bg-amber-600! hover:bg-amber-700! text-white! dark:bg-amber-500! dark:hover:bg-amber-400! dark:text-slate-950! font-semibold! px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 shrink-0 border-none cursor-pointer self-end sm:self-auto text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {isLoading
            ? t('returning', { defaultValue: 'Returning...' })
            : t('return_to_admin', { defaultValue: 'Return to Admin' })}
        </Button>
      </div>
    </div>
  )
}
