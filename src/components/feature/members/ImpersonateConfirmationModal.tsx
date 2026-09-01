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
import { User } from '@/types'
import { Loader2, ShieldAlert, UserCheck } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface ImpersonateConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  user: User | null
  isLoading?: boolean
}

export const ImpersonateConfirmationModal: React.FC<ImpersonateConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}) => {
  const { t } = useTranslation()

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] bg-white dark:bg-[#151824] border border-border text-foreground rounded-2xl shadow-2xl p-6">
        <DialogHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 ring-8 ring-amber-500/5">
            <UserCheck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>

          <DialogTitle className="text-center text-xl font-bold text-gray-900 dark:text-white">
            {t('impersonate_user_title', { defaultValue: 'Impersonate User' })}
          </DialogTitle>

          <DialogDescription className="text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            {t('impersonate_user_desc', {
              defaultValue: `You are about to log in as ${user.name} (${user.email}). Every action will be logged. Continue?`,
            })}
          </DialogDescription>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{t('impersonation_notice', { defaultValue: 'You can easily return to your admin account at any time via the top banner.' })}</span>
          </div>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-2 gap-3 mt-6 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full h-11 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-colors"
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold shadow-md transition-all cursor-pointer border-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>{t('logging_in', { defaultValue: 'Logging in...' })}</span>
              </span>
            ) : (
              <span>{t('impersonate', { defaultValue: 'Impersonate' })}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
