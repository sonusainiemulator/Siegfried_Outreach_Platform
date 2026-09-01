import { AlertCircle, CheckCircle2, Clock, RotateCcw, XCircle } from 'lucide-react'
import React from 'react'

export const subscription_status_config: Record<
  string,
  { labelKey: string; className: string; icon: React.ReactNode }
> = {
  active: {
    labelKey: 'active',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  canceled: {
    labelKey: 'canceled',
    className: 'bg-red-500/10 text-red-600 border-red-500/20',
    icon: <XCircle className="w-3 h-3" />,
  },
  past_due: {
    labelKey: 'past_due',
    className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  incomplete: {
    labelKey: 'processing',
    className: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    icon: <Clock className="w-3 h-3 animate-pulse" />,
  },
  trialing: {
    labelKey: 'trialing',
    className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    icon: <RotateCcw className="w-3 h-3" />,
  },
  expired: {
    labelKey: 'expired',
    className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    icon: <XCircle className="w-3 h-3" />,
  },
  cancelling: {
    labelKey: 'cancelling',
    className: 'bg-red-500/10 text-red-600 border-red-500/20',
    icon: <XCircle className="w-3 h-3" />,
  },
  pending_approval: {
    labelKey: 'pending_approval',
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/30 font-bold',
    icon: <Clock className="w-3 h-3 animate-pulse" />,
  },
  rejected: {
    labelKey: 'rejected',
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
    icon: <XCircle className="w-3 h-3" />,
  },
}

export const subscription_history_filters = ['all', 'active', 'pending_approval', 'expired', 'cancelled'] as const

export const subscriptionStatus = ['', 'pending_approval', 'active', 'past_due', 'canceled', 'rejected', 'trialing', 'expired', 'changed']
