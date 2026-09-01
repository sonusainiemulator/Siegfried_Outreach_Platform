'use client'

import { useGetPublicSettingsQuery } from '@/redux/api/adminSettingApi'
import { useGoogleLoginMutation } from '@/redux/api/authApi'
import { useAppDispatch } from '@/redux/hooks'
import { setAuth } from '@/redux/slices/authSlice'
import { authUtils } from '@/utils'
import { ROUTES } from '@/constants/routes'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

declare global {
  interface Window {
    google?: any
  }
}

interface GoogleLoginButtonProps {
  label?: string
}

export default function GoogleLoginButton({ label }: GoogleLoginButtonProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [googleLogin, { isLoading }] = useGoogleLoginMutation()
  const { data: publicSettingsData } = useGetPublicSettingsQuery(undefined)

  const settings = publicSettingsData?.settings || publicSettingsData?.setting || publicSettingsData
  const googleClientId = settings?.google_client_id || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  const tokenClientRef = useRef<any>(null)

  const handleAuthSuccess = async (payload: { credential?: string; access_token?: string }) => {
    try {
      const res = await googleLogin(payload).unwrap()
      authUtils.setToken(res.token)
      authUtils.setUser(res.user)

      dispatch(
        setAuth({
          token: res.token,
          user: res.user,
        })
      )

      toast.success(res.message || t('login_successful', { defaultValue: 'Login successful!' }))

      const redirectTo = searchParams.get('redirect_to')
      if (redirectTo) {
        router.replace(redirectTo)
      } else {
        router.replace(ROUTES.DASHBOARD)
      }
    } catch (error: any) {
      const msg = error?.data?.message || t('google_login_failed', { defaultValue: 'Google authentication failed' })
      toast.error(msg)
    }
  }

  useEffect(() => {
    if (!googleClientId) return

    const initGoogle = () => {
      if (window.google?.accounts?.oauth2) {
        try {
          tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'openid profile email',
            callback: (tokenResponse: any) => {
              if (tokenResponse.error) {
                toast.error(t('google_login_failed', { defaultValue: 'Google authentication failed' }))
                return
              }
              if (tokenResponse.access_token) {
                handleAuthSuccess({ access_token: tokenResponse.access_token })
              }
            },
          })
        } catch (e) {
          console.error('Google token client init error:', e)
        }
      }

      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response: any) => {
              if (response?.credential) {
                handleAuthSuccess({ credential: response.credential })
              }
            },
            auto_select: false,
          })
        } catch (e) {
          console.error('Google accounts initialize error:', e)
        }
      }
    }

    if (window.google?.accounts) {
      initGoogle()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      initGoogle()
    }
    document.body.appendChild(script)
  }, [googleClientId])

  const triggerGoogleLogin = () => {
    if (!googleClientId) {
      toast.error(t('google_credentials_missing', { defaultValue: 'Please configure Google Client ID in settings.' }))
      return
    }

    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' })
    } else if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          toast.error(t('google_login_prompt_dismissed', { defaultValue: 'Google sign in prompt was closed. Please try again.' }))
        }
      })
    } else {
      toast.error(t('google_sdk_loading', { defaultValue: 'Google SDK is loading, please try again.' }))
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <button
        type="button"
        onClick={triggerGoogleLogin}
        disabled={isLoading}
        className="w-full h-12 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white flex items-center justify-center gap-3 text-[15px] font-medium transition-all shadow-xs cursor-pointer active:scale-95"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{label || t('continue_with_google', { defaultValue: 'Continue with Google' })}</span>
      </button>
    </div>
  )
}

