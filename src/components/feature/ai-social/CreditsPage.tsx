'use client'

import React, { useState } from 'react'
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  CreditCard,
  Sparkles,
  Layers,
  Video,
  Image as ImageIcon,
  FileText,
  Plus,
  Zap,
} from 'lucide-react'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  useGetCreditBalanceQuery,
  useGetCreditHistoryQuery,
} from '@/redux/api/aiSocialApi'
import CreditRechargeModal from './CreditRechargeModal'

export default function CreditsPage() {
  const [showRechargeModal, setShowRechargeModal] = useState(false)
  const { data: balanceData, isLoading: loadingBalance } = useGetCreditBalanceQuery(undefined)
  const { data: historyData, isLoading: loadingHistory } = useGetCreditHistoryQuery({})

  const balance = (balanceData as any)?.data?.balance || 0
  const transactions = (historyData as any)?.data?.transactions || []

  const COSTS = [
    { label: 'Standard Image Post', cost: '5 credits', icon: ImageIcon },
    { label: 'Multi-Slide Carousel', cost: '8 credits', icon: Layers },
    { label: 'Video / Reel Script', cost: '15 credits', icon: Video },
    { label: 'AI Caption & Hashtags', cost: '2 credits', icon: FileText },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2 sm:p-4">
      <PageHeader
        title="Credits & Usage Ledger"
        showBackButton={true}
        endContent={
          <Button
            size="sm"
            variant="premium"
            onClick={() => setShowRechargeModal(true)}
            className="gap-1.5 font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Recharge Credits
          </Button>
        }
      />

      {/* Balance Highlight Banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6 sm:p-8 text-center space-y-4">
          <Badge variant="premium" className="px-3 py-1 gap-1.5 mx-auto">
            <Coins className="w-3.5 h-3.5" />
            Live AI Credit Ledger
          </Badge>
          <div>
            <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Available Credits</p>
            <p className="text-5xl font-black text-foreground mt-1 font-mono">
              {loadingBalance ? '...' : balance.toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Credits are reserved prior to generation and deducted only upon successful completion. Failed requests are automatically refunded.
          </p>

          <div className="pt-2 flex justify-center">
            <Button
              variant="premium"
              onClick={() => setShowRechargeModal(true)}
              className="gap-2 px-6 font-bold shadow-md cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Recharge AI Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rates Table */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Standard Credit Rates</CardTitle>
          <CardDescription>Fixed credit deductions per content asset generation</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 pt-0">
          {COSTS.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.label} className="p-3 rounded-xl border border-border/50 bg-muted/20 text-center space-y-1">
                <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground font-medium line-clamp-1">{c.label}</p>
                <p className="text-sm font-bold text-foreground">{c.cost}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border border-border">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base font-bold">Audit History</CardTitle>
          <CardDescription>Complete log of allocations, reserves, deductions, and refunds</CardDescription>
        </CardHeader>

        <CardContent className="p-4 divide-y divide-border/40">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No ledger entries recorded yet.</p>
          ) : (
            transactions.map((tx: any) => {
              const isPositive = tx.amount >= 0
              return (
                <div key={tx._id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{tx.description}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()} · <span className="font-medium text-foreground">{tx.transactionType}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`font-mono text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isPositive ? '+' : ''}{tx.amount}
                  </span>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Out-of-the-Box Credit Recharge Modal */}
      <CreditRechargeModal
        open={showRechargeModal}
        onOpenChange={setShowRechargeModal}
        currentBalance={balance}
      />
    </div>
  )
}
