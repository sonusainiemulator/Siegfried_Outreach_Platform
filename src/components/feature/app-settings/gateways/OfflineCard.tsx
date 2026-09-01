'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Field } from 'formik'
import { Landmark, QrCode, Wallet } from 'lucide-react'

const OfflineCard = () => {
  return (
    <Card className="rounded-[2.5rem] border-glass-border bg-glass-bg backdrop-blur-3xl overflow-hidden relative group hover:border-emerald-500/30 transition-all duration-500">
      <CardHeader className="sm:p-6 p-4 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-medium">Offline Payment</CardTitle>
              <p className="text-sm font-medium text-subtitle-color">
                Bank Transfer, UPI & Cash (Manual Admin Verification)
              </p>
            </div>
          </div>
          <Field name="offline.enabled">
            {({ field, form }: any) => (
              <div className="flex items-center gap-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => {
                    form.setFieldValue('offline.enabled', checked)
                    form.submitForm()
                  }}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            )}
          </Field>
        </div>
      </CardHeader>

      <CardContent className="sm:p-6 p-4 pt-4 space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500 pt-2 border-t border-border">
            <Landmark className="w-4 h-4" /> Bank Account Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-medium text-foreground">Bank Name</Label>
              <Field name="offline.bank_name">
                {({ field }: any) => (
                  <Input {...field} placeholder="e.g. Chase Bank / HDFC Bank" className="h-11 rounded-[8px] text-xs" />
                )}
              </Field>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-medium text-foreground">Account Holder Name</Label>
              <Field name="offline.account_name">
                {({ field }: any) => (
                  <Input {...field} placeholder="e.g. Siegfried Tech LLC" className="h-11 rounded-[8px] text-xs" />
                )}
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-medium text-foreground">Account Number / IBAN</Label>
              <Field name="offline.account_number">
                {({ field }: any) => (
                  <Input {...field} placeholder="e.g. 123456789012" className="h-11 rounded-[8px] font-mono text-xs" />
                )}
              </Field>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-medium text-foreground">IFSC / SWIFT / Routing Code</Label>
              <Field name="offline.ifsc_swift">
                {({ field }: any) => (
                  <Input {...field} placeholder="e.g. HDFC0001234 or CHASUS33" className="h-11 rounded-[8px] font-mono text-xs" />
                )}
              </Field>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500 pt-4 border-t border-border">
            <QrCode className="w-4 h-4" /> UPI & QR Code
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-medium text-foreground">UPI ID / VPA</Label>
              <Field name="offline.upi_id">
                {({ field }: any) => (
                  <Input {...field} placeholder="e.g. company@upi or number@paytm" className="h-11 rounded-[8px] font-mono text-xs" />
                )}
              </Field>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-xs font-medium text-foreground">UPI QR Image URL</Label>
              <Field name="offline.upi_qr_url">
                {({ field }: any) => (
                  <Input {...field} placeholder="https://example.com/qr.png" className="h-11 rounded-[8px] text-xs" />
                )}
              </Field>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500 pt-4 border-t border-border">
            <Wallet className="w-4 h-4" /> Cash & Additional Instructions
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-xs font-medium text-foreground">Cash Payment Instructions</Label>
            <Field name="offline.cash_instructions">
              {({ field }: any) => (
                <textarea
                  {...field}
                  placeholder="e.g. Visit office at 123 Main St to pay in cash and receive a receipt voucher."
                  rows={2}
                  className="flex w-full rounded-[8px] border border-border px-3 py-2 text-xs bg-background focus-visible:outline-none dark:text-white"
                />
              )}
            </Field>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label className="text-xs font-medium text-foreground">General Instructions for Customer</Label>
            <Field name="offline.instructions">
              {({ field }: any) => (
                <textarea
                  {...field}
                  placeholder="e.g. Please enter your Bank UTR or Transaction Ref ID after sending payment."
                  rows={2}
                  className="flex w-full rounded-[8px] border border-border px-3 py-2 text-xs bg-background focus-visible:outline-none dark:text-white"
                />
              )}
            </Field>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
          <p className="text-xs leading-relaxed text-emerald-600 dark:text-emerald-400 font-medium">
            💡 When enabled, customers can select Offline Payment, view your Bank/UPI details, and submit their transaction reference for manual admin verification and approval.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default OfflineCard
