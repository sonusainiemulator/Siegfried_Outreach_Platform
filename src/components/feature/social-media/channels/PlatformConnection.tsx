'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ROUTES } from '@/constants/routes'
import { platforms } from '@/data/socialMedia'
import { useDisconnectSocialAccountMutation, useGetSocialAccountsQuery } from '@/redux/api/socialMediaApi'
import { ApiError } from '@/types'
import { PlatformConfig } from '@/types/components/socialMedia'
import { authUtils } from '@/utils'
import { AlertCircle, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ConnectedAccountsModal from './components/ConnectedAccountsModal'
import PlatformCard from './components/PlatformCard'
import PlatformConnectionHeader from './components/PlatformConnectionHeader'
import WhatsAppConnectModal from './components/WhatsAppConnectModal'
import TelegramConnectModal from './components/TelegramConnectModal'

export default function PlatformConnection() {
  const { t } = useTranslation()
  const { data: accountsData, isLoading, refetch } = useGetSocialAccountsQuery({})
  const [disconnectAccount] = useDisconnectSocialAccountMutation()
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null)
  const [terminatingAccount, setTerminatingAccount] = useState<{ id: string; name: string } | null>(null)
  const [viewingPlatform, setViewingPlatform] = useState<PlatformConfig | null>(null)
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false)

  const accounts = accountsData?.socialAccounts || []

  const handleConnect = async (platformId: string) => {
    if (platformId === 'whatsapp') {
      setIsWhatsAppModalOpen(true)
      return
    }
    if (platformId === 'telegram') {
      setIsTelegramModalOpen(true)
      return
    }
    try {
      setConnectingPlatform(platformId)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
      const response = await fetch(`${API_BASE_URL}/social-auth/${platformId}`, {
        headers: {
          Authorization: `Bearer ${authUtils.getToken()}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || t('social_auth_failed'))
        setConnectingPlatform(null)
        return
      }

      if (data.connected) {
        // Direct-connect platforms (e.g. WordPress) — no OAuth redirect needed
        toast.success(data.message || t('social_account_connected', { defaultValue: 'Account connected successfully!' }))
        refetch()
        setConnectingPlatform(null)
      } else if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        toast.error(data.message || t('social_auth_failed'))
        setConnectingPlatform(null)
      }
    } catch (error: unknown) {
      console.error('Connect error:', error)
      toast.error((error as Error)?.message || t('social_connection_failure'))
      setConnectingPlatform(null)
    }
  }

  const handleDisconnect = (accountId: string, accountName: string) => {
    setTerminatingAccount({ id: accountId, name: accountName })
  }

  const confirmDisconnect = async () => {
    if (!terminatingAccount) return

    try {
      const res = await disconnectAccount(terminatingAccount.id).unwrap()
      toast.success(res.message || t('social_account_disconnected'))
      refetch()
      setTerminatingAccount(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('social_account_disconnect_failed'))
    }
  }

  const getPlatformAccounts = (platformId: string) => {
    return accounts.filter((acc: any) => acc.platform === platformId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-xl shadow-primary/10" />
          <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground animate-pulse">
            {t('social_establishing_link')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <PlatformConnectionHeader onNavigateToDashboard={() => (window.location.href = '/social-media/dashboard')} />

      <div className="grid grid-cols-1 md:grid-cols-2 [@media(min-width:1400px)]:grid-cols-4 gap-5 items-start">
        {platforms.map((platform) => {
          const connectedAccounts = getPlatformAccounts(platform.id)
          const isConnected = connectedAccounts.length > 0
          const isConnecting = connectingPlatform === platform.id

          return (
            <PlatformCard
              key={platform.id}
              platform={platform}
              isConnected={isConnected}
              isConnecting={isConnecting}
              connectedAccounts={connectedAccounts}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onViewAccounts={() => setViewingPlatform(platform as PlatformConfig)}
            />
          )
        })}
      </div>

      {/* WhatsApp Connect Modal (Official API + QR) */}
      <WhatsAppConnectModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        onConnected={() => refetch()}
      />

      {/* Telegram Connect Modal */}
      <TelegramConnectModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        onConnected={() => refetch()}
      />

      {/* Connected Accounts Modal */}
      {viewingPlatform && (
        <ConnectedAccountsModal
          isOpen={!!viewingPlatform}
          onClose={() => setViewingPlatform(null)}
          platform={viewingPlatform}
          accounts={getPlatformAccounts(viewingPlatform.id)}
          onDisconnect={handleDisconnect}
        />
      )}

      {/* Configuration hint */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
        <Settings className="w-4 h-4 shrink-0 opacity-60" />
        <span>
          {t('platform_not_connecting')}{' '}
          <Link
            href={ROUTES.SOCIAL_MEDIA.SOCIAL_SETTINGS}
            className="text-primary text-sm font-semibold hover:underline transition-colors"
          >
            {t('setup_social_media_configuration')}
          </Link>
        </span>
      </div>

      {/* Disconnect Dialog */}
      <Dialog
        open={!!terminatingAccount}
        onOpenChange={(open:any) => {
          if (!open) setTerminatingAccount(null)
        }}
      >
        <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]!  bg-light-body border-border/40 overflow-hidden rounded-border-radius shadow-2xl">
          <DialogHeader className="p-0!">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="font-medium text-lg text-title-color dark:text-white">
                  {t('social_system_revocation')}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-semibold mt-1 text-left rtl:text-right">
                  {t('social_disconnect_account_confirm', { name: terminatingAccount?.name })}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-0! flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-border-radius font-medium h-12 text-base hover:bg-primary hover:text-white  glass-card  shadow-sm border-border/40"
              onClick={() => setTerminatingAccount(null)}
            >
              {t('cancel')}
            </Button>
            <Button
              className="flex-1 rounded-border-radius font-medium h-12 text-base  bg-primary! text-white hover:bg-destructive/90  border-none"
              onClick={confirmDisconnect}
            >
              {t('confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
