'use client'

import React, { useState } from 'react'
import { startRegistration, browserSupportsWebAuthn } from '@simplewebauthn/browser'
import {
  useGetPasskeysQuery,
  useGetPasskeyRegisterOptionsMutation,
  useVerifyPasskeyRegisterMutation,
  useDeletePasskeyMutation
} from '@/redux/api/authApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  KeyRound,
  Fingerprint,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const PasskeyManager: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: passkeysData, isLoading, refetch } = useGetPasskeysQuery()
  const [getRegisterOptions] = useGetPasskeyRegisterOptionsMutation()
  const [verifyRegister] = useVerifyPasskeyRegisterMutation()
  const [deletePasskey] = useDeletePasskeyMutation()

  const passkeys = passkeysData?.data || []
  const supportsWebAuthn = typeof window !== 'undefined' && browserSupportsWebAuthn()

  const handleRegisterPasskey = async () => {
    if (!supportsWebAuthn) {
      toast.error('Your browser or device does not support WebAuthn / Passkeys.')
      return
    }

    try {
      setIsRegistering(true)

      // 1. Get Registration Challenge Options from Backend
      const optionsRes = await getRegisterOptions().unwrap()
      if (!optionsRes?.success || !optionsRes?.options) {
        throw new Error('Failed to get registration options')
      }

      // 2. Prompt User Device Biometrics (Touch ID / Face ID / Windows Hello / YubiKey)
      const attResp = await startRegistration({
        optionsJSON: optionsRes.options
      })

      // 3. Verify Attestation on Backend & Store Passkey
      const verifyRes = await verifyRegister({
        response: attResp
      }).unwrap()

      if (verifyRes?.success) {
        toast.success(verifyRes.message || 'Passkey registered successfully!')
        refetch()
      } else {
        throw new Error(verifyRes?.message || 'Failed to verify passkey')
      }
    } catch (error: any) {
      console.error('Passkey registration error:', error)
      if (error?.name === 'NotAllowedError') {
        toast.error('Passkey registration was cancelled.')
      } else {
        toast.error(error?.data?.message || error?.message || 'Failed to register passkey. Please try again.')
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const handleDeletePasskey = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke "${name}"? You will no longer be able to log in with this passkey.`)) {
      return
    }

    try {
      setDeletingId(id)
      const res = await deletePasskey(id).unwrap()
      if (res?.success) {
        toast.success(res.message || 'Passkey revoked successfully')
        refetch()
      }
    } catch (error: any) {
      console.error('Delete passkey error:', error)
      toast.error(error?.data?.message || error?.message || 'Failed to revoke passkey')
    } finally {
      setDeletingId(null)
    }
  }

  const getDeviceIcon = (deviceName: string) => {
    const name = (deviceName || '').toLowerCase()
    if (name.includes('iphone') || name.includes('android') || name.includes('ipad')) {
      return <Smartphone className="w-5 h-5 text-primary" />
    }
    if (name.includes('mac') || name.includes('windows') || name.includes('pc') || name.includes('linux')) {
      return <Laptop className="w-5 h-5 text-primary" />
    }
    return <KeyRound className="w-5 h-5 text-primary" />
  }

  return (
    <Card className="border border-border/40 dark:border-white/10 bg-white/80 dark:bg-card/40 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-border/20 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
            <span>Passkeys & Biometric Security</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Sign in securely using Apple Touch ID, Face ID, Windows Hello, or Hardware Security Keys without entering a password.
          </CardDescription>
        </div>

        <Button
          type="button"
          onClick={handleRegisterPasskey}
          disabled={isRegistering || !supportsWebAuthn}
          className="h-9 px-3.5 bg-gradient-to-r from-primary via-purple-600 to-rose-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-primary/20 gap-1.5 cursor-pointer"
        >
          {isRegistering ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add Passkey</span>
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : passkeys.length > 0 ? (
          <div className="space-y-2.5">
            {passkeys.map((pk: any) => (
              <div
                key={pk.id}
                className="p-3.5 rounded-xl border border-border/40 dark:border-white/10 bg-neutral-50 dark:bg-white/5 flex items-center justify-between gap-3 transition-all hover:border-primary/40"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/40 border border-border/30 flex items-center justify-center shadow-xs">
                    {getDeviceIcon(pk.deviceName)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>{pk.deviceName || 'Passkey Device'}</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-1.5 py-0">
                        Active
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Added on {new Date(pk.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      {pk.lastUsedAt && ` • Last used ${new Date(pk.lastUsedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePasskey(pk.id, pk.deviceName)}
                  disabled={deletingId === pk.id}
                  className="h-8 px-2.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                >
                  {deletingId === pk.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-border/60 bg-neutral-50/50 dark:bg-white/5 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-neutral-800 dark:text-white">
              No Passkeys Registered Yet
            </div>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Add your current device (Touch ID, Face ID, or Windows Hello) to experience lightning fast, 1-click passwordless logins.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PasskeyManager
