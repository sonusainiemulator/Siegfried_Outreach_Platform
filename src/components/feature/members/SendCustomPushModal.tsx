'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { useSendCustomPushNotificationMutation } from '@/redux/api/notificationApi'
import { Bell, Loader2, Send, Users } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface SendCustomPushModalProps {
  isOpen: boolean
  onClose: () => void
  selectedUserIds?: string[]
}

export function SendCustomPushModal({ isOpen, onClose, selectedUserIds = [] }: SendCustomPushModalProps) {
  const [target, setTarget] = useState<'all' | 'selected'>(selectedUserIds.length > 0 ? 'selected' : 'all')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [sendPusher, setSendPusher] = useState(true)

  const [sendPush, { isLoading }] = useSendCustomPushNotificationMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !message.trim()) {
      toast.error('Please enter both Title and Message.')
      return
    }

    try {
      const res = await sendPush({
        target,
        user_ids: target === 'selected' ? selectedUserIds : [],
        title: title.trim(),
        message: message.trim(),
        link: link.trim(),
        send_pusher: sendPusher,
      }).unwrap()

      toast.success(res.message || 'Push notification sent successfully!')
      setTitle('')
      setMessage('')
      setLink('')
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send custom push notification.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[16px] bg-white dark:bg-card border shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Send Custom Push Notification</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Broadcast real-time push notifications & in-app alerts to SaaS users.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Target Audience selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Target Audience</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTarget('all')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  target === 'all'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30'
                }`}
              >
                <Users className="w-4 h-4" />
                All SaaS Users
              </button>
              <button
                type="button"
                onClick={() => setTarget('selected')}
                disabled={selectedUserIds.length === 0}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  selectedUserIds.length === 0
                    ? 'opacity-50 cursor-not-allowed border-border'
                    : target === 'selected'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                    : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30'
                }`}
              >
                <Bell className="w-4 h-4" />
                Selected ({selectedUserIds.length})
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="push-title" className="text-xs font-semibold">
              Notification Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="push-title"
              placeholder="e.g. 🚀 Special Offer / System Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-lg h-10"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="push-message" className="text-xs font-semibold">
              Notification Message <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="push-message"
              placeholder="Enter your push message content here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
              className="rounded-lg resize-none"
            />
          </div>

          {/* Action Link (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="push-link" className="text-xs font-semibold">
              Action URL / Redirect Link <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              id="push-link"
              placeholder="e.g. /dashboard or https://siegfriedoutreach.com/plans"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="rounded-lg h-10 font-mono text-xs"
            />
          </div>

          {/* Pusher Integration Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="send-pusher"
              checked={sendPusher}
              onChange={(e) => setSendPusher(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
            />
            <Label htmlFor="send-pusher" className="text-xs font-medium cursor-pointer">
              Broadcast via Pusher.com API SDK & Real-time WebSockets
            </Label>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="rounded-lg">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-lg bg-primary text-white font-bold gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Push Notification
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
