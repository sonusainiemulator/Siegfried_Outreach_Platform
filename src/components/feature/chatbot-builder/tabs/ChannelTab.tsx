'use client'

import { useAddChannelMutation } from '@/redux/api/chatbotApi'
import { ApiError, ChannelTabProps, MessengerChannel, TelegramChannel, WhatsappChannel } from '@/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ActiveChannelsTable from './channel/ActiveChannelsTable'
import ChannelGrid from './channel/ChannelGrid'
import ChannelModal from './channel/ChannelModal'

const ChannelTab = ({ formData, updateFormField, chatbotId }: ChannelTabProps) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [addChannel] = useAddChannelMutation()

  const [whatsappData, setWhatsappData] = useState<Partial<WhatsappChannel>>(
    formData.whatsapp || {
      enabled: false,
      sid: '',
      token: '',
      phone: '',
      sandboxPhone: '',
      environment: 'sandbox',
      phoneNumberId: '',
      wabaId: '',
      accessToken: '',
    },
  )

  const [messengerData, setMessengerData] = useState<Partial<MessengerChannel>>(
    formData.messenger || {
      enabled: false,
      appId: '',
      appSecret: '',
      pageId: '',
      pageName: '',
      accessToken: '',
      verifyToken: '',
    },
  )

  const [telegramData, setTelegramData] = useState<Partial<TelegramChannel>>(
    formData.telegram || {
      enabled: false,
      botToken: '',
      botName: '',
    },
  )

  // Sync state with formData when it loads
  useEffect(() => {
    if (formData.messenger) {
      setTimeout(() => {
        setMessengerData((prev) => ({ ...prev, ...formData.messenger }))
      }, 100)
    }
    if (formData.whatsapp) {
      setTimeout(() => {
        setWhatsappData((prev) => ({ ...prev, ...formData.whatsapp }))
      }, 100)
    }
    if (formData.telegram) {
      setTimeout(() => {
        setTelegramData((prev) => ({ ...prev, ...formData.telegram }))
      }, 100)
    }
  }, [formData.messenger, formData.whatsapp, formData.telegram])

  const handleChannelClick = (channelId: string) => {
    setSelectedChannel(channelId)
    if (['messenger', 'whatsapp', 'telegram'].includes(channelId)) {
      setIsModalOpen(true)
    } else {
      toast.info(t('channel_coming_soon', { defaultValue: 'This channel integration is coming soon!' }))
    }
  }

  const handleAddChannel = async () => {
    if (selectedChannel === 'messenger') await handleAddMessenger()
    else if (selectedChannel === 'whatsapp') await handleAddWhatsapp()
    else if (selectedChannel === 'telegram') await handleAddTelegram()
  }

  const handleAddTelegram = async () => {
    if (!telegramData.botToken || !telegramData.botName) {
      toast.error(t('fill_required_fields', { defaultValue: 'Please fill in all required fields' }))
      return
    }

    const updatedTelegram = { ...telegramData, enabled: true } as TelegramChannel

    if (chatbotId) {
      try {
        const res = await addChannel({
          id: chatbotId,
          channel: 'telegram',
          config: updatedTelegram,
        }).unwrap()

        updateFormField('telegram', updatedTelegram)
        setIsModalOpen(false)
        toast.success(res.message || t('telegram_added_successfully', { defaultValue: 'Telegram channel added successfully' }))
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('error_adding_channel', { defaultValue: 'Failed to add channel' }))
      }
    } else {
      updateFormField('telegram', updatedTelegram)
      setIsModalOpen(false)
      toast.success(t('telegram_added_successfully', { defaultValue: 'Telegram channel added successfully' }))
    }
  }

  const handleAddWhatsapp = async () => {
    if (!whatsappData.sid || !whatsappData.token || !whatsappData.phone) {
      toast.error(t('fill_required_fields', { defaultValue: 'Please fill in all required fields' }))
      return
    }

    if (whatsappData.environment === 'sandbox' && !whatsappData.sandboxPhone) {
      toast.error(t('fill_sandbox_phone', { defaultValue: 'Please fill in sandbox phone number' }))
      return
    }

    const updatedWhatsapp = { ...whatsappData, enabled: true } as WhatsappChannel

    if (chatbotId) {
      try {
        const res = await addChannel({
          id: chatbotId,
          channel: 'whatsapp',
          config: updatedWhatsapp,
        }).unwrap()

        updateFormField('whatsapp', updatedWhatsapp)
        setIsModalOpen(false)
        toast.success(res.message || t('whatsapp_added_successfully', { defaultValue: 'WhatsApp channel added successfully' }))
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('error_adding_channel', { defaultValue: 'Failed to add channel' }))
      }
    } else {
      updateFormField('whatsapp', updatedWhatsapp)
      setIsModalOpen(false)
      toast.success(t('whatsapp_added_successfully', { defaultValue: 'WhatsApp channel added successfully' }))
    }
  }

  const handleAddMessenger = async () => {
    if (!messengerData.appId || !messengerData.accessToken || !messengerData.pageName) {
      toast.error(t('fill_required_fields', { defaultValue: 'Please fill in all required fields' }))
      return
    }

    const updatedMessenger = { ...messengerData, enabled: true } as MessengerChannel

    if (chatbotId) {
      try {
        const res = await addChannel({
          id: chatbotId,
          channel: 'messenger',
          config: updatedMessenger,
        }).unwrap()

        updateFormField('messenger', updatedMessenger)
        setIsModalOpen(false)
        toast.success(res.message || t('messenger_added_successfully', { defaultValue: 'Messenger channel added successfully' }))
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('error_adding_channel', { defaultValue: 'Failed to add channel' }))
      }
    } else {
      updateFormField('messenger', updatedMessenger)
      setIsModalOpen(false)
      toast.success(t('messenger_added_successfully', { defaultValue: 'Messenger channel added successfully' }))
    }
  }

  const handleCopyWebhook = (channel: string) => {
    const baseUrl = window.location.origin
    let webhookUrl = ''

    if (channel === 'whatsapp') webhookUrl = `${baseUrl}/api/ai-agents/webhook/whatsapp`
    else if (channel === 'messenger') webhookUrl = `${baseUrl}/api/ai-agents/webhook/messenger`
    else if (channel === 'telegram') webhookUrl = `${baseUrl}/api/ai-agents/webhook/telegram/${chatbotId}`
    else return

    navigator.clipboard.writeText(webhookUrl)
    toast.success(t('webhook_copied', { defaultValue: 'Webhook URL copied to clipboard' }))
  }

  const activeChannels = []
  if (formData.messenger?.enabled)
    activeChannels.push({ id: 'messenger', type: 'Messenger', channelId: formData.messenger.pageName })
  if (formData.whatsapp?.enabled)
    activeChannels.push({
      id: 'whatsapp',
      type: 'Whatsapp',
      channelId: formData.whatsapp.phone || formData.whatsapp.phoneNumberId,
    })
  if (formData.telegram?.enabled)
    activeChannels.push({ id: 'telegram', type: 'Telegram', channelId: formData.telegram.botName })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <ChannelGrid formData={formData} onChannelClick={handleChannelClick} />

      <ActiveChannelsTable
        activeChannels={activeChannels}
        onCopyWebhook={handleCopyWebhook}
        onDeleteChannel={(id) => updateFormField(id as any, { enabled: false })}
      />

      <ChannelModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        selectedChannel={selectedChannel}
        messengerData={messengerData}
        setMessengerData={setMessengerData}
        whatsappData={whatsappData}
        setWhatsappData={setWhatsappData}
        telegramData={telegramData}
        setTelegramData={setTelegramData}
        onAddChannel={handleAddChannel}
      />
    </div>
  )
}

export default ChannelTab
