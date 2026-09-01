import { Subscription } from "./plans";

export interface HistoryRow {
  plan: string
  members: number
  billing_cycle: string
  amount: number
  status: string
  subscription_date: string
  expiry_date: string
  cancel_at_period_end: boolean
}


export interface SubscriptionHistoryProps {
  filteredHistory: HistoryRow[]
  historyFilter: string
  setHistoryFilter: (filter: 'all' | 'active' | 'expired' | 'cancelled') => void
  sub: Subscription | null
  t: (key: string, options?: Record<string, unknown>) => string
}

export interface UserSubscriptionOverviewProps {
  sub: Subscription | null
  amountPaid: number
  daysRemaining: number
  isCancelDialogOpen: boolean
  setIsCancelDialogOpen: (open: boolean) => void
  handleCancel: () => void
  isCancelling: boolean
  t: (key: string, options?: Record<string, unknown>) => string
}

export interface HistoryStatusBadgeProps {
  status: string
  isCanceled?: boolean
}