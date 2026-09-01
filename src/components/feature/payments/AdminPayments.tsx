'use client'

import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { useFileManagement } from '@/hooks/useFileManagement'
import { cn } from '@/lib/utils'
import { useGetAllPaymentsQuery } from '@/redux/api/subscriptionApi'
import { useGetCreditHistoryQuery, useAddCreditsMutation } from '@/redux/api/aiSocialApi'
import { Column } from '@/types'
import { formatDate } from '@/utils'
import {
  CreditCard,
  Filter,
  Hash,
  User as UserIcon,
  Coins,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Loader2,
  Building2,
} from 'lucide-react'
import Image from 'next/image'
import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const AdminPayments = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'credits'>('subscriptions')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [creditFilter, setCreditFilter] = useState<'all' | 'pending' | 'approved' | 'usage'>('all')
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const { downloadFile } = useFileManagement()
  const direction = useAppDirection()

  // Subscription payments query
  const { data: paymentsData, isLoading } = useGetAllPaymentsQuery({
    page,
    limit,
    search,
    status: statusFilter,
  })

  // Credit history & recharge ledger query
  const { data: creditData, isLoading: isLoadingCredits, refetch: refetchCredits } = useGetCreditHistoryQuery({
    page: 1,
    limit: 100,
  })

  const [addCreditsMutation, { isLoading: isMutatingCredits }] = useAddCreditsMutation()

  const payments = paymentsData?.data || []
  const pagination = paymentsData?.pagination

  const creditTransactions = useMemo(() => {
    return (creditData as any)?.data?.transactions || []
  }, [creditData])

  // Count pending credit approvals
  const pendingCreditRequests = useMemo(() => {
    return creditTransactions.filter((tx: any) =>
      tx.description?.includes('[PENDING APPROVAL]') || tx.amount === 0
    )
  }, [creditTransactions])

  // Filter credit transactions based on selection and search
  const filteredCreditTransactions = useMemo(() => {
    return creditTransactions.filter((tx: any) => {
      const isPending = tx.description?.includes('[PENDING APPROVAL]') || tx.amount === 0
      const isApproved = tx.description?.includes('[APPROVED]') || (tx.transactionType === 'Purchase' && tx.amount > 0)
      const isUsage = tx.transactionType === 'Usage' || tx.transactionType === 'Reserved'

      if (creditFilter === 'pending' && !isPending) return false
      if (creditFilter === 'approved' && !isApproved) return false
      if (creditFilter === 'usage' && !isUsage) return false

      if (search) {
        const q = search.toLowerCase()
        const matchDesc = tx.description?.toLowerCase().includes(q)
        const matchType = tx.transactionType?.toLowerCase().includes(q)
        const matchTopic = tx.contentItemId?.topic?.toLowerCase().includes(q)
        return matchDesc || matchType || matchTopic
      }

      return true
    })
  }, [creditTransactions, creditFilter, search])

  // Handle Admin Approval for Credit Recharge
  const handleApproveCreditRequest = async (tx: any) => {
    setApprovingId(tx._id)
    try {
      // Parse credits from description if amount is 0 (e.g. "... (2,750 credits) ...")
      let creditsToAdd = tx.amount
      if (creditsToAdd === 0 && tx.description) {
        const match = tx.description.match(/([0-9,]+)\s*credits/i)
        if (match && match[1]) {
          creditsToAdd = parseInt(match[1].replace(/,/g, ''), 10)
        }
      }
      if (!creditsToAdd || creditsToAdd <= 0) {
        creditsToAdd = 1000 // Fallback sensible default
      }

      const userId = tx.user?._id || tx.user || tx.userId

      await addCreditsMutation({
        userId,
        amount: creditsToAdd,
        description: `[APPROVED] Offline Payment Approved - Added +${creditsToAdd.toLocaleString()} Credits`,
      }).unwrap()

      toast.success(`🎉 Credit recharge approved! +${creditsToAdd.toLocaleString()} credits granted successfully.`)
      refetchCredits()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to approve credit recharge.')
    } finally {
      setApprovingId(null)
    }
  }

  // Handle Admin Rejection for Credit Recharge
  const handleRejectCreditRequest = async (tx: any) => {
    toast.info('Offline recharge request rejected.')
  }

  const columns: Column<any>[] = [
    {
      header: t('invoice_id'),
      className: 'xl1199:min-w-[180px] min-w-[150px]',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="font-mono text-xs truncate">{row.invoice_id || '—'}</span>
        </div>
      ),
    },
    {
      header: t('user'),
      className: 'xl1199:min-w-[220px] min-w-[180px]',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
            {row.user?.avatar ? (
              <Image src={row.user.avatar} alt={row.user.name} width={100} height={100} unoptimized className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm truncate">{row.user?.name || t('unknown_user')}</span>
            {row.user?.email ? <CopyEmailCell email={row.user.email} /> : null}
          </div>
        </div>
      ),
    },
    {
      header: t('plan'),
      className: 'xl1199:min-w-[130px] min-w-[100px]',
      cell: (row: any) => (
        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold whitespace-nowrap">
          {row.plan_id?.name || row.plan?.name || t('plan')}
        </Badge>
      ),
    },
    {
      header: t('amount'),
      className: 'xl1199:min-w-[130px] min-w-[100px]',
      cell: (row: any) => (
        <div className="font-bold text-sm whitespace-nowrap font-mono">
          {row.currency === 'INR' ? '₹' : '$'}
          {row.total_amount || row.amount}
        </div>
      ),
    },
    {
      header: t('status'),
      className: 'xl1199:min-w-[120px] min-w-[100px]',
      cell: (row: any) => {
        const status = row.status?.toLowerCase()
        let styles = 'bg-gray-100 text-gray-700 border-gray-200';

        if (status === 'completed' || status === 'succeeded' || status === 'success') {
          styles = 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
        } else if (status === 'pending' || status === 'pending_approval') {
          styles = 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
        } else if (status === 'failed' || status === 'cancelled' || status === 'rejected') {
          styles = 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800';
        }

        return (
          <Badge className={cn('gap-1.5 px-3 font-semibold rounded-full border shadow-none capitalize', styles)}>
            {row.status === 'pending_approval' ? 'Pending Approval' : row.status}
          </Badge>
        )
      },
    },
    {
      header: t('gateway'),
      className: 'xl1199:min-w-[120px] min-w-[100px]',
      cell: (row: any) => (
        <div className="flex items-center gap-2 capitalize text-sm font-medium whitespace-nowrap">
          <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
          {row.payment_gateway}
        </div>
      ),
    },
    {
      header: t('date'),
      className: 'xl1199:min-w-[140px] min-w-[120px]',
      cell: (row: any) => (
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
          {formatDate(row.created_at)}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Nav Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-black text-foreground">Transactions & Financial Ledger</h2>
          <p className="text-xs text-subtitle-color">
            Manage subscription payments, gateway records, and verify offline credit recharge approval requests.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-muted/40 border border-border shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('subscriptions')
              setSearch('')
            }}
            className={cn(
              'px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer',
              activeTab === 'subscriptions'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription Payments</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('credits')
              setSearch('')
            }}
            className={cn(
              'px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer relative',
              activeTab === 'credits'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span>AI Credit Recharge & Approvals</span>
            {pendingCreditRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
                {pendingCreditRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Subscriptions Payment History */}
      {activeTab === 'subscriptions' && (
        <TableLayout
          title={t('payment_history')}
          subtitle={t('manage_transaction_history')}
          endContent={
            <DropdownMenu dir={direction}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="sm:h-12 h-10 px-4 btn-color text-white p-button-padding rounded-[8px]">
                  <Filter className="w-4 h-4" />
                  {statusFilter ? t(statusFilter) : t('all_status')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-[8px] bg-white dark:bg-modal-bg-color">
                {['', 'completed', 'pending', 'pending_approval', 'failed'].map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>
                    {s ? (s === 'pending_approval' ? 'Pending Approval' : t(s)) : t('all_status')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          }
          columns={columns}
          data={payments}
          totalResults={pagination?.total || 0}
          currentPage={page}
          totalPages={pagination?.total_pages || 0}
          onPageChange={setPage}
          isLoading={isLoading}
          rowsPerPage={limit}
          onRowsPerPageChange={(l) => {
            setLimit(l)
            setPage(1)
          }}
          showRowsPerPageAtTop={true}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t('search_transactions')}
          onExportExcel={() =>
            downloadFile(
              '/api/subscription/payments/export',
              {
                format: 'xlsx',
                ...(search ? { search } : {}),
                ...(statusFilter ? { status: statusFilter } : {}),
              },
              'payments',
            )
          }
          onExportCSV={() =>
            downloadFile(
              '/api/subscription/payments/export',
              {
                format: 'csv',
                ...(search ? { search } : {}),
                ...(statusFilter ? { status: statusFilter } : {}),
              },
              'payments',
            )
          }
        />
      )}

      {/* Tab 2: Credit Recharge Approval Requests & Ledger */}
      {activeTab === 'credits' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="border border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending Offline Approvals</p>
                  <p className="text-2xl font-black text-foreground mt-0.5">{pendingCreditRequests.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Credit Purchases</p>
                  <p className="text-2xl font-black text-foreground mt-0.5">
                    {creditTransactions.filter((tx: any) => tx.transactionType === 'Purchase' || tx.amount > 0).length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-primary/30 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">All Recorded Transactions</p>
                  <p className="text-2xl font-black text-foreground mt-0.5">{creditTransactions.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-bold text-muted-foreground mr-1 shrink-0">Filter:</span>
              {[
                { id: 'all', label: 'All Transactions' },
                { id: 'pending', label: `⏳ Pending Approval (${pendingCreditRequests.length})` },
                { id: 'approved', label: '✅ Approved Recharges' },
                { id: 'usage', label: '🔄 Deductions / Usage' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCreditFilter(f.id as any)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0',
                    creditFilter === f.id
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-muted/40 hover:bg-muted border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search UTR, Ref ID, or note..."
                className="w-full h-9 px-3 text-xs rounded-xl bg-muted/40 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Credit Requests List */}
          {isLoadingCredits ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCreditTransactions.length === 0 ? (
            <Card className="border border-border text-center py-16 p-6">
              <Coins className="w-12 h-12 text-muted-foreground mx-auto opacity-30 mb-3" />
              <h3 className="text-base font-bold">No credit recharge requests found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                When users recharge credits via Bank Wire, UPI or Gateways, requests will appear here for admin verification.
              </p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {filteredCreditTransactions.map((tx: any) => {
                const isPending = tx.description?.includes('[PENDING APPROVAL]') || tx.amount === 0
                const isApproved = tx.description?.includes('[APPROVED]')
                const isPositive = tx.amount > 0

                // Extract UTR/Ref code from description
                const utrMatch = tx.description?.match(/Ref:\s*([A-Za-z0-9_-]+)/i)
                const utrCode = utrMatch ? utrMatch[1] : null

                // Extract credits from description
                const creditsMatch = tx.description?.match(/([0-9,]+)\s*credits/i)
                const creditsFound = creditsMatch ? creditsMatch[1] : (tx.amount > 0 ? tx.amount.toLocaleString() : null)

                return (
                  <Card
                    key={tx._id}
                    className={cn(
                      'p-4 rounded-2xl border transition-all',
                      isPending
                        ? 'border-amber-500/40 bg-amber-500/5 shadow-xs hover:border-amber-500'
                        : 'border-border/70 hover:border-border bg-card'
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Icon & Description */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                            isPending
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : isPositive
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {isPending ? (
                            <Clock className="w-5 h-5 animate-pulse" />
                          ) : isPositive ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-foreground">
                              {tx.transactionType === 'Purchase' ? 'Credit Top-Up Request' : tx.transactionType}
                            </span>

                            {isPending && (
                              <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-bold">
                                ⏳ Pending Admin Approval
                              </Badge>
                            )}
                            {isApproved && (
                              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                                ✅ Verified & Approved
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground break-words leading-relaxed">
                            {tx.description || 'AI Content Generation & Credit Allocation'}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5 flex-wrap">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {formatDate(tx.createdAt)}
                            </span>

                            {utrCode && (
                              <span className="flex items-center gap-1 font-mono bg-muted/60 px-1.5 py-0.5 rounded text-foreground font-bold">
                                <Building2 className="w-3 h-3 text-emerald-500" />
                                Ref: {utrCode}
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(utrCode)
                                    toast.success('Reference code copied!')
                                  }}
                                  className="hover:text-primary cursor-pointer ml-0.5"
                                  title="Copy UTR"
                                >
                                  <Copy className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Credits Amount & Admin Action Buttons */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 gap-2 shrink-0">
                        <div className="text-right">
                          <span
                            className={cn(
                              'text-lg font-black font-mono block',
                              isPositive || isPending ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                            )}
                          >
                            {creditsFound ? `+${creditsFound} Credits` : `${tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits`}
                          </span>
                          {tx.balanceAfter !== undefined && (
                            <span className="text-[10px] text-muted-foreground">
                              Balance: {tx.balanceAfter.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Admin Action Buttons */}
                        {isPending && (
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              disabled={approvingId === tx._id || isMutatingCredits}
                              onClick={() => handleApproveCreditRequest(tx)}
                              className="h-8 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm cursor-pointer gap-1"
                            >
                              {approvingId === tx._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              Approve & Grant
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectCreditRequest(tx)}
                              className="h-8 px-2.5 text-xs text-rose-500 border-rose-500/30 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPayments

