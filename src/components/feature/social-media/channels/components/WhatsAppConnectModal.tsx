'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useCancelWhatsAppQrSessionMutation,
  useConnectWhatsAppOfficialMutation,
  useGetWhatsAppQrStatusQuery,
  useStartWhatsAppQrSessionMutation,
} from '@/redux/api/socialMediaApi'
import { useGetUserSettingsQuery } from '@/redux/api/userSettingApi'
import { ApiError } from '@/types'
import { CheckCircle2, Loader2, MessageSquare, QrCode, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface WhatsAppConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConnected: () => void
}

const WhatsAppConnectModal = ({ isOpen, onClose, onConnected }: WhatsAppConnectModalProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('official')
  const { data: userSettingsData } = useGetUserSettingsQuery(undefined, { skip: !isOpen })

  // Official API tab state
  const [accessToken, setAccessToken] = useState('')
  const [phoneNumberId, setPhoneNumberId] = useState('')
  const [wabaId, setWabaId] = useState('')
  const [postType, setPostType] = useState<'status' | 'channel'>('status')
  const [connectOfficial, { isLoading: isConnectingOfficial }] = useConnectWhatsAppOfficialMutation()

  // QR tab state
  const [qrSessionId, setQrSessionId] = useState<string | null>(null)
  const [startQrSession, { isLoading: isStartingQr }] = useStartWhatsAppQrSessionMutation()
  const [cancelQrSession] = useCancelWhatsAppQrSessionMutation()
  const { data: qrStatus, error: qrStatusError } = useGetWhatsAppQrStatusQuery(qrSessionId as string, {
    skip: !qrSessionId,
    pollingInterval: qrSessionId ? 2000 : 0,
  })

  useEffect(() => {
    if (qrStatusError && qrSessionId) {
      toast.error(t('whatsapp_qr_status_error', { defaultValue: 'Lost connection to the QR session. Please try again.' }))
      setQrSessionId(null)
    }
  }, [qrStatusError])

  useEffect(() => {
    if (!isOpen) {
      setAccessToken('')
      setPhoneNumberId('')
      setWabaId('')
      setPostType('status')
      setQrSessionId(null)
      setActiveTab('official')
    } else if (userSettingsData?.setting) {
      setAccessToken(userSettingsData.setting.whatsapp_access_token || '')
      setPhoneNumberId(userSettingsData.setting.whatsapp_phone_number_id || '')
      setWabaId(userSettingsData.setting.whatsapp_business_account_id || '')
    }
  }, [isOpen, userSettingsData])

  useEffect(() => {
    if (qrStatus?.status === 'connected') {
      toast.success(t('whatsapp_qr_connected', { defaultValue: 'WhatsApp linked successfully!' }))
      onConnected()
      onClose()
    }
    if (qrStatus?.status === 'failed') {
      toast.error(qrStatus.error || t('whatsapp_qr_failed', { defaultValue: 'WhatsApp linking failed. Please try again.' }))
      setQrSessionId(null)
    }
  }, [qrStatus?.status])

  const handleConnectOfficial = async () => {
    if (!accessToken.trim() || !phoneNumberId.trim()) {
      toast.error(t('whatsapp_fields_required', { defaultValue: 'Access Token and Phone Number ID are required.' }))
      return
    }
    try {
      const res = await connectOfficial({ accessToken, phoneNumberId, wabaId, postType }).unwrap()
      toast.success(res.message || t('whatsapp_connected', { defaultValue: 'WhatsApp connected!' }))
      onConnected()
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('whatsapp_connect_failed', { defaultValue: 'Failed to connect WhatsApp.' }))
    }
  }

  const handleStartQr = async () => {
    try {
      const res = await startQrSession(undefined).unwrap()
      setQrSessionId(res.sessionId)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('whatsapp_qr_start_failed', { defaultValue: 'Failed to start QR session.' }))
    }
  }

  const handleTabChange = async (tab: string) => {
    if (activeTab === 'qr' && tab !== 'qr' && qrSessionId) {
      cancelQrSession(qrSessionId)
      setQrSessionId(null)
    }
    setActiveTab(tab)
  }

  const handleClose = () => {
    if (qrSessionId) {
      cancelQrSession(qrSessionId)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-white dark:bg-[#0c101d] border border-neutral-200 dark:border-white/10 shadow-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {t('connect_whatsapp', { defaultValue: 'Connect WhatsApp' })}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                {t('connect_whatsapp_desc', { defaultValue: 'Choose the Official Cloud API or scan a QR code to link a number.' })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="official" className="gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('whatsapp_official_api', { defaultValue: 'Official API' })}
              </TabsTrigger>
              <TabsTrigger value="qr" className="gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                {t('whatsapp_scan_qr', { defaultValue: 'Scan QR Code' })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="official" className="space-y-4 mt-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t('whatsapp_access_token', { defaultValue: 'Meta System User Access Token' })}</Label>
                <PasswordInput
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="EAAG..."
                  className="h-10 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t('whatsapp_phone_number_id', { defaultValue: 'WhatsApp Phone Number ID' })}</Label>
                <Input
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  placeholder="1029384756..."
                  className="h-10 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t('whatsapp_business_account_id', { defaultValue: 'WhatsApp Business Account ID (Optional)' })}</Label>
                <Input
                  value={wabaId}
                  onChange={(e) => setWabaId(e.target.value)}
                  placeholder="1029384756..."
                  className="h-10 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{t('whatsapp_publish_mode', { defaultValue: 'Publish Mode' })}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostType('status')}
                    className={`h-10 rounded-lg border text-xs font-semibold transition-all ${postType === 'status' ? 'border-primary bg-primary/10 text-primary' : 'border-neutral-200 dark:border-white/10'}`}
                  >
                    {t('whatsapp_status_broadcast', { defaultValue: 'Status Broadcast' })}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('channel')}
                    className={`h-10 rounded-lg border text-xs font-semibold transition-all ${postType === 'channel' ? 'border-primary bg-primary/10 text-primary' : 'border-neutral-200 dark:border-white/10'}`}
                  >
                    {t('whatsapp_channel_post', { defaultValue: 'Channel Post' })}
                  </button>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleConnectOfficial}
                disabled={isConnectingOfficial}
                className="w-full h-11 rounded-xl bg-emerald-600! hover:bg-emerald-700! text-white! font-bold text-sm flex items-center justify-center gap-2"
              >
                {isConnectingOfficial ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {t('verify_and_connect', { defaultValue: 'Verify & Connect' })}
              </Button>
            </TabsContent>

            <TabsContent value="qr" className="mt-5">
              <div className="flex flex-col items-center justify-center gap-4 py-4">
                {!qrSessionId && (
                  <>
                    <div className="w-40 h-40 rounded-2xl border border-dashed border-neutral-300 dark:border-white/15 flex items-center justify-center text-neutral-400">
                      <QrCode className="w-12 h-12" />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center max-w-xs">
                      {t('whatsapp_qr_intro', { defaultValue: 'Link your personal or business WhatsApp number instantly — no app credentials needed.' })}
                    </p>
                    <Button
                      type="button"
                      onClick={handleStartQr}
                      disabled={isStartingQr}
                      className="h-11 rounded-xl bg-emerald-600! hover:bg-emerald-700! text-white! font-bold text-sm px-6 flex items-center gap-2"
                    >
                      {isStartingQr ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                      {t('whatsapp_generate_qr', { defaultValue: 'Generate QR Code' })}
                    </Button>
                  </>
                )}

                {qrSessionId && (!qrStatus || qrStatus.status === 'pending' || qrStatus.status === 'connecting') && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {t('whatsapp_qr_generating', { defaultValue: 'Generating QR code...' })}
                    </p>
                  </div>
                )}

                {qrSessionId && qrStatus?.status === 'qr' && qrStatus.qr && (
                  <>
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white p-2">
                      <Image src={qrStatus.qr} alt="WhatsApp QR Code" width={192} height={192} className="w-full h-full object-contain" unoptimized />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center max-w-xs">
                      {t('whatsapp_qr_scan_instructions', { defaultValue: 'Open WhatsApp > Settings > Linked Devices > Link a Device, then scan this code.' })}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (qrSessionId) cancelQrSession(qrSessionId)
                        setQrSessionId(null)
                      }}
                      className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-destructive underline"
                    >
                      {t('whatsapp_qr_start_over', { defaultValue: 'Cancel / Start Over' })}
                    </button>
                  </>
                )}

                {qrSessionId && qrStatus?.status === 'connected' && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    <p className="text-sm font-semibold">{t('whatsapp_qr_connected', { defaultValue: 'WhatsApp linked successfully!' })}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WhatsAppConnectModal
