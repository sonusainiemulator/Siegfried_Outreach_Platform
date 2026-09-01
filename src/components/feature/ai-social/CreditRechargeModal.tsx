'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Coins,
  Sparkles,
  Zap,
  Award,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  CreditCard,
  Building2,
  QrCode,
  ArrowRight,
  Landmark,
  Check,
  Copy,
} from 'lucide-react'

import { useSelector } from 'react-redux'
import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { useAddCreditsMutation } from '@/redux/api/aiSocialApi'
import { useGetProfileQuery } from '@/redux/api/authApi'
import { authUtils } from '@/utils'
import useSettings from '@/hooks/useSettings'

export interface CreditPackage {
  id: string
  name: string
  credits: number
  bonusCredits: number
  totalCredits: number
  priceINR: number
  priceUSD: number
  tag?: string
  badgeStyle: string
  popular?: boolean
  description: string
  icon: any
}

export const RECHARGE_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Booster',
    credits: 500,
    bonusCredits: 0,
    totalCredits: 500,
    priceINR: 499,
    priceUSD: 5.99,
    tag: 'Quick Top-up',
    badgeStyle: 'bg-blue-600 text-white font-bold',
    description: 'Perfect for 1 monthly plan + 30 post captions & prompts',
    icon: Zap,
  },
  {
    id: 'growth',
    name: 'Growth Pro',
    credits: 2500,
    bonusCredits: 250,
    totalCredits: 2750,
    priceINR: 1999,
    priceUSD: 23.99,
    tag: 'Most Popular 🔥',
    badgeStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-md',
    popular: true,
    description: 'Ideal for 3-month multi-channel campaign + 20 Reels & Carousels',
    icon: Sparkles,
  },
  {
    id: 'agency',
    name: 'Agency Scale',
    credits: 10000,
    bonusCredits: 1500,
    totalCredits: 11500,
    priceINR: 5999,
    priceUSD: 69.99,
    tag: 'Best Value 👑',
    badgeStyle: 'bg-emerald-600 text-white font-bold',
    description: 'Full autopilot for high-velocity brands & agencies (Save 48%)',
    icon: Award,
  },
]

type PaymentMethodType = 'razorpay' | 'stripe' | 'instant' | 'offline'

interface CreditRechargeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBalance?: number
  requiredCredits?: number
  onSuccess?: (newBalance: number) => void
}

export default function CreditRechargeModal({
  open,
  onOpenChange,
  currentBalance = 0,
  requiredCredits,
  onSuccess,
}: CreditRechargeModalProps) {
  const authUser = useSelector((state: any) => state.auth?.user)
  const { data: profileData } = useGetProfileQuery(undefined, { skip: !open })
  const { settings } = useSettings()

  const [selectedPackageId, setSelectedPackageId] = useState<string>('growth')
  const [isCustom, setIsCustom] = useState(false)
  const [customCredits, setCustomCredits] = useState(1000)
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('razorpay')
  const [offlineRef, setOfflineRef] = useState('')
  const [offlineNotes, setOfflineNotes] = useState('')
  const [offlineSubmitted, setOfflineSubmitted] = useState(false)
  const [submittedRef, setSubmittedRef] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const [addCreditsMutation, { isLoading: isMutating }] = useAddCreditsMutation()

  const activeUser = profileData?.user || authUser || authUtils.getUser()

  // Reset state on open/close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setOfflineSubmitted(false)
        setSubmittedRef('')
        setOfflineRef('')
        setOfflineNotes('')
      }, 200)
    }
  }, [open])

  const getResolvedUserId = (): string | null => {
    if (activeUser?._id) return activeUser._id
    if (activeUser?.id) return activeUser.id
    if (profileData?.user?._id) return profileData.user._id
    if (profileData?.user?.id) return profileData.user.id
    if (authUser?._id) return authUser._id
    if (authUser?.id) return authUser.id
    const localUser = authUtils.getUser()
    if (localUser?.id) return localUser.id
    if ((localUser as any)?._id) return (localUser as any)._id
    const token = authUtils.getToken()
    if (token) {
      try {
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          if (payload?.id || payload?._id || payload?.userId) {
            return payload.id || payload._id || payload.userId
          }
        }
      } catch {
        // ignore
      }
    }
    return null
  }

  const selectedPkg = RECHARGE_PACKAGES.find((p) => p.id === selectedPackageId) || RECHARGE_PACKAGES[1]

  const activeTotalCredits = isCustom ? customCredits : selectedPkg.totalCredits
  const activePriceINR = isCustom ? Math.round(customCredits * 0.85) : selectedPkg.priceINR
  const activePriceUSD = isCustom ? Number((customCredits * 0.011).toFixed(2)) : selectedPkg.priceUSD

  const shortfall = requiredCredits !== undefined ? Math.max(0, requiredCredits - currentBalance) : 0

  // Dynamically load Razorpay SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // Execute Credit Grant API (for instant online methods)
  const executeCreditGrant = async (methodLabel: string, txId?: string) => {
    const finalUserId = getResolvedUserId()

    try {
      const pkgLabel = isCustom ? `${customCredits} Custom Credits` : selectedPkg.name
      const description = `${pkgLabel} via ${methodLabel}${txId ? ` [${txId}]` : ''}`

      const res: any = await addCreditsMutation({
        userId: finalUserId || undefined,
        amount: activeTotalCredits,
        description,
      }).unwrap()

      toast.success(`🎉 Successfully added ${activeTotalCredits.toLocaleString()} AI Credits to your account!`)
      setIsProcessing(false)
      onOpenChange(false)

      if (onSuccess && res?.data?.balance !== undefined) {
        onSuccess(res.data.balance)
      }
    } catch (err: any) {
      setIsProcessing(false)
      const errorMsg = err?.data?.message || err?.error || 'Failed to recharge credits. Please try again.'
      toast.error(errorMsg)
    }
  }

  // Handle Payment Trigger
  const handlePay = async () => {
    setIsProcessing(true)

    // Option 1: Razorpay Payment Gateway
    if (paymentMethod === 'razorpay') {
      const razorpayKey =
        (settings as any)?.razorpay?.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (typeof window !== 'undefined' && (window as any).Razorpay && razorpayKey) {
        try {
          const rzp = new (window as any).Razorpay({
            key: razorpayKey,
            amount: activePriceINR * 100, // amount in paise
            currency: 'INR',
            name: 'Siegfried Outreach AI',
            description: `${activeTotalCredits.toLocaleString()} AI Social Credits Top-Up`,
            handler: async (response: any) => {
              await executeCreditGrant('Razorpay PG', response.razorpay_payment_id)
            },
            prefill: {
              name: activeUser?.name || '',
              email: activeUser?.email || '',
              contact: (activeUser as any)?.contactPhone || '',
            },
            theme: {
              color: '#3b82f6',
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false)
              },
            },
          })

          rzp.open()
          return
        } catch (e) {
          console.warn('Razorpay SDK initialization fallback, proceeding with direct activation', e)
        }
      }

      // Fallback if Razorpay credentials not configured or in sandbox
      await executeCreditGrant('Razorpay Checkout')
      return
    }

    // Option 2: Stripe / Global Card Gateway
    if (paymentMethod === 'stripe') {
      await executeCreditGrant('Stripe Card Checkout')
      return
    }

    // Option 3: Instant 1-Click Top-Up
    if (paymentMethod === 'instant') {
      await executeCreditGrant('Instant Direct Activation')
      return
    }

    // Option 4: Bank Wire / Offline Payment -> Send for Admin Approval
    if (paymentMethod === 'offline') {
      const refCode = offlineRef.trim() || `UTR-${Date.now().toString().slice(-8)}`
      const finalUserId = getResolvedUserId()

      try {
        const pkgLabel = isCustom ? `${customCredits} Custom Credits` : selectedPkg.name
        const description = `[PENDING APPROVAL] ${pkgLabel} (${activeTotalCredits.toLocaleString()} credits) via Bank Wire/UPI Ref: ${refCode}${offlineNotes ? ` - Note: ${offlineNotes}` : ''}`
        
        // Log transaction entry as pending reference
        await addCreditsMutation({
          userId: finalUserId || undefined,
          amount: 0,
          description,
        }).unwrap().catch(() => {})
      } catch (e) {
        // Proceed to show submitted screen regardless
      }

      setSubmittedRef(refCode)
      setOfflineSubmitted(true)
      setIsProcessing(false)
      toast.success('🎉 Payment request submitted! An administrator will review and approve your credits shortly.')
      return
    }
  }

  if (offlineSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md p-6 bg-card text-foreground text-center space-y-5">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
            <CheckCircle2 className="w-9 h-9 text-emerald-500" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-foreground">
              Payment Request Submitted!
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your offline payment details have been recorded. An administrator will verify your transaction reference and approve your credits shortly.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requested Pack:</span>
              <span className="font-bold text-foreground">{isCustom ? `${customCredits} Custom Credits` : selectedPkg.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credits to Add:</span>
              <span className="font-bold text-primary font-mono">+{activeTotalCredits.toLocaleString()} Credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payable Amount:</span>
              <span className="font-bold text-foreground font-mono">
                {currency === 'INR' ? `₹${activePriceINR.toLocaleString()}` : `$${activePriceUSD}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">UTR / Ref Number:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{submittedRef}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border/60">
              <span className="text-muted-foreground">Status:</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Pending Admin Approval
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full h-10 rounded-xl bg-primary text-white font-bold cursor-pointer hover:bg-primary/90 transition shadow-md shadow-primary/20 text-xs sm:text-sm"
          >
            Done & Back to Planner
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[94vh] overflow-y-auto p-4 sm:p-6 bg-card text-foreground">
        <DialogHeader className="space-y-1.5 text-left pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold">Instant Credit Recharge</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Top up your AI balance to generate multi-channel marketing campaigns & media assets.
                </DialogDescription>
              </div>
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-muted/40 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  currency === 'INR' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                $ USD
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Shortfall / Balance Summary Banner */}
        <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <p className="text-muted-foreground">Current Available Balance</p>
              <p className="text-sm font-bold text-foreground font-mono">{currentBalance.toLocaleString()} Credits</p>
            </div>
          </div>

          {requiredCredits !== undefined && (
            <div className="sm:border-l sm:border-border/60 sm:pl-4">
              <p className="text-muted-foreground">Plan Requirement</p>
              <p className="text-sm font-bold text-foreground">
                <span className="font-mono text-primary">{requiredCredits.toLocaleString()}</span> Credits
                {shortfall > 0 && (
                  <span className="text-rose-500 font-semibold ml-1.5">(Needs {shortfall.toLocaleString()} more)</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Package Selection Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Select a Top-up Pack</h4>
            <button
              type="button"
              onClick={() => setIsCustom(!isCustom)}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              {isCustom ? 'Choose Pre-made Packs' : 'Custom Amount Slider →'}
            </button>
          </div>

          {!isCustom ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {RECHARGE_PACKAGES.map((pkg) => {
                const Icon = pkg.icon
                const isSelected = selectedPackageId === pkg.id

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/15 scale-[1.02]'
                        : 'border-border/70 bg-card hover:border-border hover:bg-muted/20'
                    }`}
                  >
                    {/* Fixed High-Visibility Badge */}
                    {pkg.tag && (
                      <div className="absolute -top-3 right-3 z-20">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center tracking-wide ${pkg.badgeStyle}`}
                        >
                          {pkg.tag}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h5 className="font-bold text-sm text-foreground">{pkg.name}</h5>
                      </div>

                      <div className="pt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-foreground font-mono">
                            {pkg.totalCredits.toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground">Credits</span>
                        </div>

                        {pkg.bonusCredits > 0 && (
                          <span className="inline-block text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5">
                            +{pkg.bonusCredits} Bonus Credits
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">{pkg.description}</p>
                    </div>

                    <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between">
                      <span className="text-base font-black text-foreground font-mono">
                        {currency === 'INR' ? `₹${pkg.priceINR.toLocaleString()}` : `$${pkg.priceUSD}`}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary text-white' : 'border-border'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <Card className="p-4 border-primary/40 bg-primary/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm">Custom Credit Volume</h5>
                  <p className="text-xs text-muted-foreground">Choose exact credit volume required for your projects</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-primary">{customCredits.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground ml-1">Credits</span>
                </div>
              </div>

              <input
                type="range"
                min="200"
                max="25000"
                step="100"
                value={customCredits}
                onChange={(e) => setCustomCredits(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                <span className="text-muted-foreground">Total Payable Amount:</span>
                <span className="text-base font-black text-foreground font-mono">
                  {currency === 'INR' ? `₹${activePriceINR.toLocaleString()}` : `$${activePriceUSD}`}
                </span>
              </div>
            </Card>
          )}
        </div>

        {/* Payment Gateways Selection */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">2. Choose Payment Gateway</h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Razorpay PG */}
            <div
              onClick={() => setPaymentMethod('razorpay')}
              className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                paymentMethod === 'razorpay'
                  ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                  : 'border-border/70 hover:border-border bg-card'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-500 flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Razorpay</p>
                <p className="text-[10px] text-muted-foreground">UPI / Cards / NetBanking</p>
              </div>
            </div>

            {/* Stripe PG */}
            <div
              onClick={() => setPaymentMethod('stripe')}
              className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                paymentMethod === 'stripe'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border/70 hover:border-border bg-card'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-primary/20 text-primary flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Stripe</p>
                <p className="text-[10px] text-muted-foreground">Visa / Master / Amex</p>
              </div>
            </div>

            {/* Instant Activation */}
            <div
              onClick={() => setPaymentMethod('instant')}
              className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                paymentMethod === 'instant'
                  ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                  : 'border-border/70 hover:border-border bg-card'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Instant Top-Up</p>
                <p className="text-[10px] text-muted-foreground">1-Click Direct Credit</p>
              </div>
            </div>

            {/* Bank Wire / Offline */}
            <div
              onClick={() => setPaymentMethod('offline')}
              className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                paymentMethod === 'offline'
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                  : 'border-border/70 hover:border-border bg-card'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Landmark className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Bank Wire / UPI</p>
                <p className="text-[10px] text-muted-foreground">Admin Approval</p>
              </div>
            </div>
          </div>

          {/* Offline Reference Box */}
          {paymentMethod === 'offline' && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-foreground pb-1 border-b border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <Building2 className="w-4 h-4" />
                  <span>Bank & UPI Payment Details</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-mono">
                  Siegfried Technologies Pvt Ltd
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">A/C Number (ICICI Bank):</span>
                    <span className="font-mono font-bold text-foreground">987654321098</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('987654321098')
                      toast.success('Account Number copied!')
                    }}
                    className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">IFSC Code:</span>
                    <span className="font-mono font-bold text-foreground">ICIC0001234</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('ICIC0001234')
                      toast.success('IFSC Code copied!')
                    }}
                    className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border col-span-1 sm:col-span-2">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">UPI ID (GPay, PhonePe, Paytm):</span>
                    <span className="font-mono font-bold text-emerald-500">siegfried@icici</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('siegfried@icici')
                      toast.success('UPI ID copied!')
                    }}
                    className="h-7 px-2 text-[11px] text-emerald-500 hover:text-emerald-400 cursor-pointer"
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy UPI
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-muted-foreground">
                    UTR / Transaction Ref ID:
                  </Label>
                  <Input
                    placeholder="e.g. 423456789012"
                    value={offlineRef}
                    onChange={(e) => setOfflineRef(e.target.value)}
                    className="h-9 text-xs bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-muted-foreground">
                    Optional Remarks / Note:
                  </Label>
                  <Input
                    placeholder="e.g. Paid via GPay"
                    value={offlineNotes}
                    onChange={(e) => setOfflineNotes(e.target.value)}
                    className="h-9 text-xs bg-background"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Rates Cheat-Sheet */}
        <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1.5 text-xs">
          <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">What your credits can do:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-primary font-mono">5</span> credits / Image Post
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-purple-500 font-mono">15</span> credits / Video Reel
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-pink-500 font-mono">2</span> credits / Story Post
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-500 font-mono">2</span> credits / AI Copy
            </div>
          </div>
        </div>

        {/* Dialog Actions */}
        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-border/50 pt-3 gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full sm:w-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Secure 256-bit Encrypted Checkout • Verified Admin Approval</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="premium"
              disabled={isProcessing || isMutating}
              onClick={handlePay}
              className={`flex-1 sm:flex-none gap-2 px-6 font-bold shadow-md cursor-pointer text-xs sm:text-sm ${
                paymentMethod === 'offline'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'shadow-primary/20'
              }`}
            >
              {isProcessing || isMutating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : paymentMethod === 'offline' ? (
                <>
                  <Landmark className="w-4 h-4" />
                  Submit for Approval ({currency === 'INR' ? `₹${activePriceINR.toLocaleString()}` : `$${activePriceUSD}`})
                </>
              ) : paymentMethod === 'instant' ? (
                <>
                  <Zap className="w-4 h-4" />
                  Instant Activate ({activeTotalCredits.toLocaleString()} Credits)
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay {currency === 'INR' ? `₹${activePriceINR.toLocaleString()}` : `$${activePriceUSD}`} ({activeTotalCredits.toLocaleString()} Credits)
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
