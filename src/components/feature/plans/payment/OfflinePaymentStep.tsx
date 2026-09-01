'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import useSettings from '@/hooks/useSettings'
import { Plan } from '@/types'
import { ArrowLeft, Building2, CheckCircle2, Copy, CreditCard, Landmark, Loader2, QrCode, Wallet } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface OfflinePaymentStepProps {
  plan: Plan | null
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  onBack: () => void
  onSubmit: (data: { offline_reference: string; offline_notes: string }) => Promise<void>
  isSubmitting: boolean
}

export const OfflinePaymentStep = ({
  plan,
  billingCycle,
  onBack,
  onSubmit,
  isSubmitting,
}: OfflinePaymentStepProps) => {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const offlineConfig = (settings as any)?.offline || {}

  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reference.trim()) {
      toast.error('Please enter your transaction reference / UTR number.')
      return
    }

    try {
      await onSubmit({
        offline_reference: reference.trim(),
        offline_notes: notes.trim(),
      })
      setSubmitted(true)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit offline payment request.')
    }
  }

  if (submitted) {
    return (
      <div className="p-6 sm:p-8 text-center space-y-6 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-title-color dark:text-white">Payment Submitted!</h3>
          <p className="text-sm text-subtitle-color max-w-md mx-auto">
            Your offline payment details have been submitted successfully. An administrator will verify your transaction reference and approve your subscription shortly.
          </p>
        </div>

        <div className="p-4 rounded-border-radius bg-muted/30 dark:bg-modal-bg-color border border-border text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-subtitle-color">Plan:</span>
            <span className="font-bold text-title-color dark:text-white">{plan?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-subtitle-color">Reference ID:</span>
            <span className="font-bold text-primary font-mono">{reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-subtitle-color">Status:</span>
            <span className="font-bold text-amber-500 uppercase tracking-wider">Pending Admin Approval</span>
          </div>
        </div>

        <Button
          onClick={onBack}
          className="w-full h-11 rounded-[8px] btn-color text-white font-bold"
        >
          Close
        </Button>
      </div>
    )
  }

  return (
    <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="sm:px-6 px-4 py-4 border-b border-border flex items-center gap-3 bg-muted/30 dark:bg-modal-bg-color sticky top-0 z-10 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 rounded-full hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg text-title-color dark:text-white font-medium">Offline Payment Details</h2>
          <p className="text-xs text-subtitle-color">
            Complete your transfer to the details below and enter your reference ID.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Payment Info Cards */}
        <div className="space-y-4">
          {/* Bank Transfer Details */}
          {(offlineConfig.bank_name || offlineConfig.account_number) && (
            <div className="p-4 rounded-border-radius bg-muted/20 dark:bg-modal-bg-color border border-border space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Bank Transfer Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {offlineConfig.bank_name && (
                  <div>
                    <span className="text-subtitle-color block">Bank Name:</span>
                    <span className="font-bold text-title-color dark:text-white">{offlineConfig.bank_name}</span>
                  </div>
                )}
                {offlineConfig.account_name && (
                  <div>
                    <span className="text-subtitle-color block">Account Name:</span>
                    <span className="font-bold text-title-color dark:text-white">{offlineConfig.account_name}</span>
                  </div>
                )}
                {offlineConfig.account_number && (
                  <div className="flex items-center justify-between col-span-1 sm:col-span-2 p-2 rounded bg-background border border-border">
                    <div>
                      <span className="text-subtitle-color block text-[10px]">Account Number:</span>
                      <span className="font-mono font-bold text-title-color dark:text-white text-sm">{offlineConfig.account_number}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(offlineConfig.account_number, 'Account Number')}
                      className="h-7 px-2 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                  </div>
                )}
                {offlineConfig.ifsc_swift && (
                  <div className="flex items-center justify-between col-span-1 sm:col-span-2 p-2 rounded bg-background border border-border">
                    <div>
                      <span className="text-subtitle-color block text-[10px]">IFSC / SWIFT Code:</span>
                      <span className="font-mono font-bold text-title-color dark:text-white text-sm">{offlineConfig.ifsc_swift}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(offlineConfig.ifsc_swift, 'IFSC/SWIFT Code')}
                      className="h-7 px-2 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* UPI Payment Details */}
          {(offlineConfig.upi_id || offlineConfig.upi_qr_url) && (
            <div className="p-4 rounded-border-radius bg-muted/20 dark:bg-modal-bg-color border border-border space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <QrCode className="w-4 h-4" />
                <span>UPI Payment Option</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
                {offlineConfig.upi_qr_url && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border bg-white p-1 flex-shrink-0">
                    <Image
                      src={offlineConfig.upi_qr_url}
                      alt="UPI QR Code"
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {offlineConfig.upi_id && (
                  <div className="flex-1 w-full space-y-2">
                    <span className="text-subtitle-color block">UPI ID:</span>
                    <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
                      <span className="font-mono font-bold text-emerald-500 text-sm">{offlineConfig.upi_id}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(offlineConfig.upi_id, 'UPI ID')}
                        className="h-7 px-2 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cash Payment Details */}
          {offlineConfig.cash_instructions && (
            <div className="p-4 rounded-border-radius bg-muted/20 dark:bg-modal-bg-color border border-border space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <Wallet className="w-4 h-4" />
                <span>Cash Payment Option</span>
              </div>
              <p className="text-xs text-subtitle-color leading-relaxed whitespace-pre-line">
                {offlineConfig.cash_instructions}
              </p>
            </div>
          )}

          {/* Additional Instructions */}
          {offlineConfig.instructions && (
            <div className="p-3 rounded-border-radius bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
              💡 {offlineConfig.instructions}
            </div>
          )}
        </div>

        {/* Payment Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-title-color dark:text-white">
              Transaction Reference / UTR Number / Receipt ID <span className="text-destructive">*</span>
            </label>
            <Input
              value={reference}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReference(e.target.value)}
              placeholder="e.g. UTR123456789 or TXN-987654"
              required
              className="h-11 rounded-[8px] font-mono text-sm bg-background border-border"
            />
            <p className="text-[10px] text-muted-foreground">
              Enter the bank transaction ref, UPI UTR number, or cash receipt voucher code.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-title-color dark:text-white">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="e.g. Paid via HDFC Bank on Aug 1st..."
              rows={2}
              className="flex w-full rounded-[8px] border border-border px-3 py-2 text-xs bg-background focus-visible:outline-none dark:text-white"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !reference.trim()}
            className="w-full h-12 rounded-[8px] text-base font-bold bg-primary! text-white cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Payment for Approval'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
