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
        optionsJSON: optionsRes.options,
      })

      // 3. Verify Attestation on Backend & Store Passkey
      const verifyRes = await verifyRegister({
        response: attResp,
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
    if (name.includes('iphone') || name.includes('android') || name.includes('ipad') || name.includes('phone')) {
      return <Smartphone className="w-5 h-5 text-primary" />
    }
    if (name.includes('mac') || name.includes('windows') || name.includes('pc') || name.includes('linux')) {
      return <Laptop className="w-5 h-5 text-primary" />
    }
    return <KeyRound className="w-5 h-5 text-primary" />
  }

  return (
    <Card className="md:col-span-3 glass-card glass-dark-card border-glass-border bg-glass-bg backdrop-blur-xl rounded-border-radius overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <CardHeader className="p-6 pb-4 border-b border-border/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
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
          className="h-10 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 gap-2 shrink-0 cursor-pointer"
        >
          {isRegistering ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scanning Biometrics...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add New Passkey</span>
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : passkeys.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {passkeys.map((pk: any) => (
              <div
                key={pk.id}
                className="p-4 rounded-xl border border-border/50 bg-accent/5 hover:bg-accent/10 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    {getDeviceIcon(pk.deviceName)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground flex items-center gap-2 truncate">
                      <span className="truncate">{pk.deviceName || 'Passkey Device'}</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-1.5 py-0 shrink-0">
                        Active
                      </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      Added on {new Date(pk.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      {pk.lastUsedAt && ` • Used ${new Date(pk.lastUsedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePasskey(pk.id, pk.deviceName)}
                  disabled={deletingId === pk.id}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg shrink-0 cursor-pointer"
                  title="Revoke passkey"
                >
                  {deletingId === pk.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl border border-dashed border-border/60 bg-accent/5 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">
                No Passkeys Registered Yet
              </div>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                Add your current device (Touch ID, Face ID, or Windows Hello) to experience lightning fast, 1-click passwordless logins.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PasskeyManager
