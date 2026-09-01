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
import { ConfirmationModalProps } from '@/types'
import { AlertCircle, Loader2 } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false,
  variant = 'primary',
}) => {
  const { t } = useTranslation()

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive'
      case 'premium':
        return 'premium'
      default:
        return 'default'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! bg-white dark:bg-[#151824] border border-border text-foreground rounded-2xl shadow-2xl p-6 gap-0 overflow-hidden">
        <div>
          <DialogHeader className="mb-6">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5 animate-scale-in">
              <div className="relative">
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
            </div>

            <DialogTitle className="text-center text-xl font-medium text-title-color dark:text-white ">
              {title}
            </DialogTitle>

            <DialogDescription className="text-center text-subtitle-color mt-2 text-base">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 gap-3 sm:gap-3 sm:space-x-0">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:h-12 h-10 rounded-[8px] bg-light-gray text-light-text-color  dark:text-white border-none! transition-all duration-200"
            >
              {cancelText || t('cancel')}
            </Button>
            <Button
              variant={getVariantStyles() as any}
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full sm:h-12 h-10  rounded-[8px] bg-primary! text-white transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>{t('processing')}...</span>
                </>
              ) : (
                <>{confirmText || t('confirm')}</>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
