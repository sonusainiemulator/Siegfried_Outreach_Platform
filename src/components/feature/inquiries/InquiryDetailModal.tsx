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
import { useGetContactInquiryByIdQuery } from '@/redux/api/contactInquiryApi'
import { InquiryDetailModalProps } from '@/types/shared'
import { formatDate } from '@/utils'
import { FileText, Loader2, Mail, MessageSquare, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function InquiryDetailModal({ inquiryId, isOpen, onClose }: InquiryDetailModalProps) {
  const { t } = useTranslation()
  const { data: inquiry, isLoading } = useGetContactInquiryByIdQuery(inquiryId!, {
    skip: !inquiryId || !isOpen,
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0 overflow-hidden border-none rounded-border-radius bg-light-body dark:bg-modal-bg-color shadow-2xl">
        {/* Header with Background/Icon */}
        <div className="relative overflow-hidden">
          <DialogHeader className="relative z-10 text-left items-start sm:text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-[8px] bg-primary text-white shadow-lg shadow-primary/20">
                <FileText className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-title-color dark:text-white">
                {t('contact_inquiry_details', { defaultValue: 'Inquiry Details' })}
              </DialogTitle>
            </div>
            <DialogDescription className="text-subtitle-color font-medium">
              {t('view_full_inquiry_information', { defaultValue: 'Full information for this contact inquiry' })}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className="space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium animate-pulse">{t('loading_details', { defaultValue: 'Fetching details...' })}</p>
            </div>
          ) : inquiry ? (
            <div className="grid gap-4">
              {/* Main Info Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex items-start gap-3 p-4 rounded-2xl inner-card glass-dark-card">
                  <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted-foreground mb-1">{t('name')}</p>
                    <p className="text-sm font-semibold text-title-color dark:text-white break-words">{inquiry.inquiry.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-4 rounded-2xl inner-card glass-dark-card">
                  <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
                    <Mail className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted-foreground mb-1">{t('email')}</p>
                    <p className="text-sm font-semibold text-title-color dark:text-white break-all">{inquiry.inquiry.email}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="flex items-start gap-3 p-4 rounded-2xl inner-card glass-dark-card">
                <div className="p-2 rounded-lg bg-orange-500/10 shrink-0">
                  <FileText className="h-4 w-4 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-muted-foreground mb-1">{t('subject')}</p>
                  <p className="text-sm font-semibold text-title-color dark:text-white break-words">{inquiry.inquiry.subject}</p>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl inner-card glass-dark-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground">{t('message')}</p>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none pt-1">
                  <p className="text-sm text-subtitle-color font-medium leading-relaxed whitespace-pre-wrap break-words">
                    {inquiry.inquiry.message}
                  </p>
                </div>
              </div>
            <div className="pt-3 mt-2 border-t border-zinc-200 dark:border-white/10">
            <div className="grid grid-cols-2 gap-4">
                
                <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-title-color dark:text-white">
                    {t('created')}:-
                </span>{" "}
                {formatDate(inquiry.inquiry.created_at)}
                </p>
            </div>
            </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-destructive">
              <p className="text-sm font-semibold">{t('error_loading_inquiry', { defaultValue: 'Failed to load inquiry details.' })}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="pt-0 sm:pt-0 dark:border-white/5 items-center! justify-end!">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="w-full sm:w-auto h-11 px-10! rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 font-semibold transition-all"
          >
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
