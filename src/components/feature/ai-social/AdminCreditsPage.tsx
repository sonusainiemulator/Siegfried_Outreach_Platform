'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Coins,
  Plus,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  UserCheck,
  Check,
} from 'lucide-react'

import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  useAddCreditsMutation,
  useGetCreditHistoryQuery,
} from '@/redux/api/aiSocialApi'

export default function AdminCreditsPage() {
  const [userId, setUserId] = useState('')
  const [amount, setAmount] = useState<number>(100)
  const [description, setDescription] = useState('Admin Allocation')

  const [addCredits, { isLoading: allocating }] = useAddCreditsMutation()
  const { data: historyData, isLoading: loadingHistory, refetch } = useGetCreditHistoryQuery({})

  const transactions = (historyData as any)?.data?.transactions || []

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) {
      toast.error('Target Tenant User ID is required')
      return
    }
    if (!amount || amount <= 0) {
      toast.error('Valid positive credit amount required')
      return
    }

    try {
      await addCredits({
        userId: userId.trim(),
        amount: Number(amount),
        description,
      }).unwrap()

      toast.success(`Successfully allocated ${amount} credits to tenant!`)
      setUserId('')
      setAmount(100)
      setDescription('Admin Allocation')
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to allocate credits')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2 sm:p-4">
      <PageHeader
        title="Admin: Credit Allocation"
        showBackButton={true}
      />

      {/* Grant Credits Card */}
      <Card className="border-primary/40 shadow-lg">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Coins className="w-4 h-4 text-amber-500" /> Manual Credit Grant
          </div>
          <CardTitle className="text-base font-bold">Allocate Credits to Tenant</CardTitle>
          <CardDescription>
            Grant subscription credits or compensations directly to any tenant's account balance.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleAllocate}>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tenant User ID (ObjectId) *</Label>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. 66a1b2c3d4e5f67890..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Credit Quantity *</Label>
                <Input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description / Ledger Reason</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Growth Plan Monthly Grant or Special Bonus"
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/40 pt-4 flex justify-end">
            <Button
              type="submit"
              variant="premium"
              disabled={allocating}
              className="gap-1.5"
            >
              {allocating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Allocating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Grant {amount} Credits
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Global Audit Log */}
      <Card className="border border-border">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base font-bold">Recent System Credit Ledger</CardTitle>
          <CardDescription>Live feed of credit transactions across the platform</CardDescription>
        </CardHeader>

        <CardContent className="p-4 divide-y divide-border/40">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No transaction logs available.</p>
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
                        User: <span className="font-mono text-primary font-semibold">{typeof tx.user === 'object' ? tx.user?._id : tx.user}</span> · {new Date(tx.createdAt).toLocaleString()}
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
    </div>
  )
}
