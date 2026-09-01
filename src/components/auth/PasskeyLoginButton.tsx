'use client'

import React, { useState, useEffect } from 'react'
import { startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser'
import { Button } from '@/components/ui/button'
import { useGetPasskeyLoginOptionsMutation, useVerifyPasskeyLoginMutation } from '@/redux/api/authApi'
import { useAppDispatch } from '@/redux/hooks'
import { setAuth } from '@/redux/slices/authSlice'
import { authUtils } from '@/utils'
import { ROUTES } from '@/constants/routes'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { KeyRound, Fingerprint, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface PasskeyLoginButtonProps {
  email?: string
  className?: string
}

export const PasskeyLoginButton: React.FC<PasskeyLoginButtonProps> = ({ email, className }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [getLoginOptions] = useGetPasskeyLoginOptionsMutation()
  const [verifyLogin] = useVerifyPasskeyLoginMutation()

  useEffect(() => {
    setIsSupported(browserSupportsWebAuthn())
  }, [])

  if (!isSupported) {
    return null
  }

  const handlePasskeyLogin = async () => {
    try {
      setIsLoading(true)

      // 1. Fetch WebAuthn Challenge Options from Backend
      const optionsRes = await getLoginOptions(email ? { email } : undefined).unwrap()
      if (!optionsRes?.success || !optionsRes?.options) {
        throw new Error('Could not initialize Passkey session')
      }

      // 2. Invoke Native Browser Biometrics / Passkey Prompt (Touch ID, Face ID, Windows Hello, Security Key)
      const asseResp = await startAuthentication({
        optionsJSON: optionsRes.options
      })

      // 3. Verify Assertion Signature with Backend
      const verifyRes = await verifyLogin({ response: asseResp }).unwrap()

      if (verifyRes?.token && verifyRes?.user) {
        // Save token and user in storage & Redux
        authUtils.setToken(verifyRes.token)
        authUtils.setUser(verifyRes.user)

        dispatch(
          setAuth({
            token: verifyRes.token,
            user: verifyRes.user,
          })
        )

        toast.success(verifyRes.message || 'Passkey authentication successful! Welcome back.')

        const redirectTo = searchParams.get('redirect_to')
        if (redirectTo) {
          router.replace(redirectTo)
        } else {
          router.replace(ROUTES.DASHBOARD)
        }
      } else {
        throw new Error(verifyRes?.message || 'Authentication verification failed')
      }
    } catch (error: any) {
      console.error('Passkey login error:', error)
      if (error?.name === 'NotAllowedError') {
        toast.error('Passkey verification was cancelled.')
      } else {
        toast.error(error?.data?.message || error?.message || 'Passkey login failed. Please try password login.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handlePasskeyLogin}
      disabled={isLoading}
      variant="outline"
      className={cn(
        'w-full h-12 rounded-full border border-neutral-300 dark:border-white/15 bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-xs group',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Verifying Biometrics / Passkey...</span>
        </>
      ) : (
        <>
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Fingerprint className="w-4 h-4" />
          </div>
          <span>Sign in with Passkey / Face ID</span>
          <KeyRound className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 ml-auto" />
        </>
      )}
    </Button>
  )
}

export default PasskeyLoginButton
