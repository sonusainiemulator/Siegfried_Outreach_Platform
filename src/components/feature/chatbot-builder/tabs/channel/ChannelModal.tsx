'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChannelModalProps } from '@/types'
import { Facebook, MessageCircle, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import MessengerForm from './MessengerForm'
import TelegramForm from './TelegramForm'
import WhatsappForm from './WhatsappForm'

const ChannelModal = ({
  isOpen,
  onClose,
  selectedChannel,
  messengerData,
  setMessengerData,
  whatsappData,
  setWhatsappData,
  telegramData,
  setTelegramData,
  onAddChannel,
}: ChannelModalProps) => {
  const { t } = useTranslation()

  const renderIcon = () => {
    switch (selectedChannel) {
      case 'messenger':
        return <Facebook className="h-6 w-6 text-messenger" />
      case 'whatsapp':
        return <MessageCircle className="h-6 w-6 text-whatsapp" />
      case 'telegram':
        return <Send className="h-6 w-6 text-telegram-alt" />
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (selectedChannel) {
      case 'messenger':
        return 'Messenger'
      case 'whatsapp':
        return 'WhatsApp'
      case 'telegram':
        return 'Telegram'
      default:
        return ''
    }
  }

  const getDescription = () => {
    switch (selectedChannel) {
      case 'messenger':
        return t('messenger_desc', {
          defaultValue: 'You can add a new channel by including the Facebook messenger integration details.',
        })
      case 'whatsapp':
        return t('whatsapp_desc', { defaultValue: 'Configure your Twilio WhatsApp integration details.' })
      case 'telegram':
        return t('telegram_desc', { defaultValue: 'Configure your Telegram bot integration details.' })
      default:
        return ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! rounded-border-radius! bg-light-body glass-dark-card backdrop-blur-xl no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-title-color dark:text-white flex items-center gap-2">
            {renderIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-subtitle-color text-sm">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {selectedChannel === 'messenger' && (
          <MessengerForm data={messengerData} onChange={setMessengerData} />
        )}
        {selectedChannel === 'whatsapp' && (
          <WhatsappForm data={whatsappData} onChange={setWhatsappData} />
        )}
        {selectedChannel === 'telegram' && (
          <TelegramForm data={telegramData} onChange={setTelegramData} />
        )}

        <DialogFooter>
          <Button
            onClick={onAddChannel}
            className="w-full h-12 rounded-2xl bg-primary! hover:bg-primary/90 text-primary-foreground font-medium animate-scale-in"
          >
            {t('add_channel', { defaultValue: 'Add Channel' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChannelModal
