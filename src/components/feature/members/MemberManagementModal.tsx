'use client'

import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import SelectField from '@/components/shared/form-fields/SelectField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import {
  User,
  Shield,
  Coins,
  CreditCard,
  Package,
  Share2,
  LogIn,
  Save,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Camera,
  Loader2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react'
import { Formik, Form } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { getMediaUrl, formatDate } from '@/utils'
import {
  useGetUserFullDetailsQuery,
  useAdjustUserCreditsMutation,
  useUpdateUserMutation,
  useCreateUserMutation
} from '@/redux/api/userApi'
import { useGetRolesQuery } from '@/redux/api/roleApi'
import {
  useApproveOfflineSubscriptionMutation,
  useRejectOfflineSubscriptionMutation
} from '@/redux/api/subscriptionApi'

interface MemberManagementModalProps {
  isOpen: boolean
  onClose: () => void
  user: any | null
  onImpersonate?: (user: any) => void
}

export function MemberManagementModal({
  isOpen,
  onClose,
  user,
  onImpersonate,
}: MemberManagementModalProps) {
  const { t } = useTranslation()
  const isEditing = !!user?.id || !!user?._id
  const userId = user?.id || user?._id

  const [activeTab, setActiveTab] = useState('overview')
  const [creditAmount, setCreditAmount] = useState('500')
  const [creditType, setCreditType] = useState<'add' | 'deduct'>('add')
  const [creditReason, setCreditReason] = useState('Admin Manual Adjustment')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { data: detailsData, isLoading: isDetailsLoading, refetch: refetchDetails } = useGetUserFullDetailsQuery(userId, {
    skip: !isOpen || !userId,
  })

  const { data: rolesData } = useGetRolesQuery({ page: 1, limit: 100 })
  const [adjustCredits, { isLoading: isAdjusting }] = useAdjustUserCreditsMutation()
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation()
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation()
  const [approveOffline, { isLoading: isApproving }] = useApproveOfflineSubscriptionMutation()
  const [rejectOffline, { isLoading: isRejecting }] = useRejectOfflineSubscriptionMutation()

  const memberData = detailsData?.data?.user || user || {}
  const creditStats = detailsData?.data?.credits || { balance: user?.creditBalance || 0, totalAdded: 0, totalSpent: 0, history: [] }
  const rechargeRequests = detailsData?.data?.rechargeRequests || []
  const subscription = detailsData?.data?.subscription || null
  const stats = detailsData?.data?.stats || { socialAccountsCount: 0, socialAccounts: [], contentCount: 0 }

  const roles = (rolesData?.roles || []).map((r: any) => ({
    value: r._id || r.id,
    label: r.name,
  }))

  const handleAdjustCredits = async () => {
    if (!userId) return
    const amountNum = parseInt(creditAmount, 10)
    if (!amountNum || isNaN(amountNum)) {
      toast.error('Please enter a valid credit amount')
      return
    }

    try {
      const res = await adjustCredits({
        id: userId,
        amount: amountNum,
        type: creditType,
        reason: creditReason,
      }).unwrap()

      toast.success(res.message || 'Credits updated successfully!')
      refetchDetails()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to adjust credits')
    }
  }

  const handleProcessRecharge = async (paymentId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await approveOffline(paymentId).unwrap()
      } else {
        await rejectOffline(paymentId).unwrap()
      }

      toast.success(`Recharge request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
      refetchDetails()
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to ${action} request`)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      setFieldValue('avatar', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async (values: any) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('email', values.email)
      if (values.password) formData.append('password', values.password)
      if (values.roleId) formData.append('roleId', values.roleId)
      formData.append('isActive', String(values.isActive))
      if (values.avatar) formData.append('avatar', values.avatar)

      if (isEditing) {
        formData.append('id', userId)
        const res = await updateUser(formData).unwrap()
        toast.success(res.message || t('user_updated_successfully'))
      } else {
        const res = await createUser(formData).unwrap()
        toast.success(res.message || t('user_created_successfully'))
      }
      refetchDetails()
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save member profile')
    }
  }

  const initialProfileValues = {
    name: memberData.name || '',
    email: memberData.email || '',
    password: '',
    roleId: memberData.roleId?._id || memberData.roleId || '',
    isActive: memberData.isActive ?? true,
    avatar: null as File | null,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border border-border/60 bg-background dark:bg-[#121826] rounded-2xl shadow-2xl no-scrollbar">
        {/* Header Hero Banner */}
        <div className="relative p-6 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-primary/30 shadow-md">
                  <AvatarImage src={previewImage || getMediaUrl(memberData.avatar)} />
                  <AvatarFallback className={cn('text-lg font-bold', getAvatarColorClass(memberData.name || 'U'))}>
                    {(memberData.name || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background',
                    memberData.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                  )}
                  title={memberData.isActive ? 'Active Member' : 'Deactivated Member'}
                />
              </div>

              <div>
                <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {memberData.name || 'New Member'}
                  {memberData.role && (
                    <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wider">
                      {memberData.role}
                    </Badge>
                  )}
                </DialogTitle>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <CopyEmailCell email={memberData.email || 'No email provided'} />
                  {memberData.created_at && (
                    <span>• Joined {formatDate(memberData.created_at)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Impersonate Action */}
            {isEditing && onImpersonate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose()
                  onImpersonate(memberData)
                }}
                className="gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border-primary/30 font-bold text-xs h-9 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login as Member
              </Button>
            )}
          </div>
        </div>

        {/* Tabbed Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 border-b border-border/40 bg-muted/20">
            <TabsList className="bg-transparent h-12 p-0 gap-4 overflow-x-auto flex justify-start">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-semibold text-xs sm:text-sm px-2 gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4" /> 360° Overview
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-semibold text-xs sm:text-sm px-2 gap-1.5 cursor-pointer"
              >
                <Shield className="w-4 h-4" /> Edit Profile & Role
              </TabsTrigger>
              <TabsTrigger
                value="credits"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-semibold text-xs sm:text-sm px-2 gap-1.5 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-500" /> AI Credits & Ledger
              </TabsTrigger>
              <TabsTrigger
                value="recharges"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-semibold text-xs sm:text-sm px-2 gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-blue-500" /> Recharges ({rechargeRequests.length})
              </TabsTrigger>
              <TabsTrigger
                value="plan"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none font-semibold text-xs sm:text-sm px-2 gap-1.5 cursor-pointer"
              >
                <Package className="w-4 h-4 text-purple-500" /> Plan & Usage
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            {/* ───────────────────────────────────────────────────────────── */}
            {/* Tab 1: 360° Overview */}
            {/* ───────────────────────────────────────────────────────────── */}
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Credit Balance Card */}
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">AI Credits</span>
                    <Coins className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black font-mono text-foreground">
                      {(creditStats.balance || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Spent: {(creditStats.totalSpent || 0).toLocaleString()} Cr
                    </span>
                  </div>
                </div>

                {/* Last Credit Request Card */}
                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Last Recharge</span>
                    <CreditCard className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="mt-2">
                    {rechargeRequests.length > 0 ? (
                      <>
                        <span className="text-lg font-bold font-mono text-foreground block">
                          ₹{rechargeRequests[0].amount?.toLocaleString()} ({rechargeRequests[0].credits?.toLocaleString()} Cr)
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] font-bold mt-1 uppercase',
                            rechargeRequests[0].status === 'completed'
                              ? 'border-emerald-500/40 text-emerald-500'
                              : rechargeRequests[0].status === 'pending_approval'
                              ? 'border-amber-500/40 text-amber-500 animate-pulse'
                              : 'border-rose-500/40 text-rose-500'
                          )}
                        >
                          {rechargeRequests[0].status === 'pending_approval' ? 'Pending Approval' : rechargeRequests[0].status}
                        </Badge>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No recharge requests</span>
                    )}
                  </div>
                </div>

                {/* Subscription Card */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Active Plan</span>
                    <Package className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="mt-2">
                    <span className="text-lg font-bold text-foreground block">
                      {subscription?.planName || 'Pro Plan'}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Status: <span className="font-semibold text-emerald-500 capitalize">{subscription?.status || 'Active'}</span>
                    </span>
                  </div>
                </div>

                {/* Social Channels Card */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Social Channels</span>
                    <Share2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black font-mono text-foreground">
                      {stats.socialAccountsCount || 0}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Connected Pages
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Member Administrative Shortcuts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('credits')}
                    className="justify-start gap-2 h-11 text-xs font-semibold border-amber-500/30 hover:bg-amber-500/10 cursor-pointer"
                  >
                    <Coins className="w-4 h-4 text-amber-500" />
                    Top-Up / Adjust AI Credits
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('recharges')}
                    className="justify-start gap-2 h-11 text-xs font-semibold border-blue-500/30 hover:bg-blue-500/10 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    Review Recharge Proofs ({rechargeRequests.filter((r: any) => r.status === 'pending_approval').length} Pending)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('profile')}
                    className="justify-start gap-2 h-11 text-xs font-semibold border-border hover:bg-muted/40 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-primary" />
                    Change Role or Password
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* Tab 2: Profile & Role */}
            {/* ───────────────────────────────────────────────────────────── */}
            <TabsContent value="profile" className="mt-0 space-y-5">
              <Formik initialValues={initialProfileValues} enableReinitialize onSubmit={handleProfileSubmit}>
                {({ setFieldValue, values }) => (
                  <Form className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={previewImage || getMediaUrl(memberData.avatar)} />
                        <AvatarFallback>{(values.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-2 text-xs font-bold cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" /> Change Profile Avatar
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextInput name="name" label="Full Name" placeholder="John Doe" />
                      <TextInput name="email" label="Email Address" placeholder="john@example.com" type="email" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextInput
                        name="password"
                        label={isEditing ? 'New Password (Optional)' : 'Password'}
                        placeholder="••••••••"
                        type="password"
                      />
                      <SelectField name="roleId" label="System Role" options={roles} />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border/40">
                      <Button
                        type="submit"
                        variant="premium"
                        disabled={isUpdatingUser || isCreatingUser}
                        className="gap-2 font-bold cursor-pointer"
                      >
                        {isUpdatingUser || isCreatingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Member Changes
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </TabsContent>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* Tab 3: Credits & Ledger */}
            {/* ───────────────────────────────────────────────────────────── */}
            <TabsContent value="credits" className="mt-0 space-y-6">
              {/* Instant Adjustment Card */}
              <div className="p-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
                <h4 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" /> Instant AI Credit Top-Up / Deduction
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Directly adjust this member's AI credits balance. Changes will be audited in the ledger.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-3">
                    <Label className="text-xs font-bold">Action</Label>
                    <div className="flex rounded-lg border border-border bg-background p-0.5 mt-1">
                      <button
                        type="button"
                        onClick={() => setCreditType('add')}
                        className={cn(
                          'flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-all',
                          creditType === 'add' ? 'bg-emerald-500 text-white shadow-xs' : 'text-muted-foreground'
                        )}
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreditType('deduct')}
                        className={cn(
                          'flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1 transition-all',
                          creditType === 'deduct' ? 'bg-rose-500 text-white shadow-xs' : 'text-muted-foreground'
                        )}
                      >
                        <Minus className="w-3 h-3" /> Deduct
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label className="text-xs font-bold">Credit Amount</Label>
                    <Input
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      placeholder="500"
                      className="mt-1 font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <Label className="text-xs font-bold">Reason / Note</Label>
                    <Input
                      value={creditReason}
                      onChange={(e) => setCreditReason(e.target.value)}
                      placeholder="e.g. Promotional Bonus"
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Button
                      type="button"
                      variant="premium"
                      onClick={handleAdjustCredits}
                      disabled={isAdjusting}
                      className="w-full gap-1.5 font-bold text-xs h-10 cursor-pointer"
                    >
                      {isAdjusting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Apply
                    </Button>
                  </div>
                </div>
              </div>

              {/* Credit Ledger Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-foreground">Recent Credit Ledger Activity</h4>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Type / Description</th>
                        <th className="p-3 text-right">Credits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {creditStats.history?.length > 0 ? (
                        creditStats.history.slice(0, 10).map((l: any, idx: number) => (
                          <tr key={l._id || idx} className="hover:bg-muted/20">
                            <td className="p-3 font-mono text-muted-foreground">{formatDate(l.createdAt)}</td>
                            <td className="p-3 font-medium text-foreground">{l.description || l.action}</td>
                            <td className="p-3 text-right font-bold font-mono">
                              <span className={l.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}>
                                {l.amount > 0 ? `+${l.amount.toLocaleString()}` : l.amount.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-muted-foreground italic">
                            No ledger transactions recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* Tab 4: Recharges & Offline Requests */}
            {/* ───────────────────────────────────────────────────────────── */}
            <TabsContent value="recharges" className="mt-0 space-y-4">
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount / Credits</th>
                      <th className="p-3">Method & UTR</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rechargeRequests.length > 0 ? (
                      rechargeRequests.map((r: any) => (
                        <tr key={r.id} className="hover:bg-muted/20">
                          <td className="p-3 font-mono text-muted-foreground">{formatDate(r.created_at)}</td>
                          <td className="p-3">
                            <span className="font-bold text-foreground">₹{r.amount?.toLocaleString()}</span>
                            <span className="text-[11px] font-mono text-muted-foreground block">
                              +{r.credits?.toLocaleString()} Cr
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold uppercase text-foreground">{r.payment_method || r.payment_gateway}</span>
                            {r.utr_number && (
                              <span className="font-mono text-[10px] text-muted-foreground block">
                                UTR: {r.utr_number}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] font-bold uppercase',
                                r.status === 'completed'
                                  ? 'border-emerald-500/40 text-emerald-500'
                                  : r.status === 'pending_approval'
                                  ? 'border-amber-500/40 text-amber-500 animate-pulse'
                                  : 'border-rose-500/40 text-rose-500'
                              )}
                            >
                              {r.status === 'pending_approval' ? 'Pending Approval' : r.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            {r.status === 'pending_approval' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  onClick={() => handleProcessRecharge(r.id, 'approve')}
                                  disabled={isApproving || isRejecting}
                                  className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleProcessRecharge(r.id, 'reject')}
                                  disabled={isApproving || isRejecting}
                                  className="h-7 px-2 text-[11px] font-bold cursor-pointer"
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-[11px] italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-muted-foreground italic">
                          No recharge requests submitted by this member.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* ───────────────────────────────────────────────────────────── */}
            {/* Tab 5: Plan & Usage */}
            {/* ───────────────────────────────────────────────────────────── */}
            <TabsContent value="plan" className="mt-0 space-y-4">
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold border-purple-500/40 text-purple-500 mb-1">
                    Subscription Tier
                  </Badge>
                  <h4 className="text-lg font-bold text-foreground">{subscription?.planName || 'Pro Plan'}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Status: <span className="font-semibold text-emerald-500 capitalize">{subscription?.status || 'Active'}</span>
                    {subscription?.endDate && <span> • Renews on {formatDate(subscription.endDate)}</span>}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs font-bold border-purple-500/40 text-purple-500 cursor-pointer">
                  Extend Plan Duration
                </Button>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground">Connected Social Channels & AI Assets</h4>
                <p className="text-xs text-muted-foreground">
                  Member has {stats.socialAccountsCount || 0} connected social channel(s) and generated {stats.contentCount || 0} content item(s).
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default MemberManagementModal
