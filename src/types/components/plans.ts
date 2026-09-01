import { User } from '../auth'
import { loadStripe } from '@stripe/stripe-js'

export interface Plan {
  id: string
  name: string
  slug: string
  description: string
  amount: number
  currency: string
  billing_cycle: 'monthly' | 'yearly' | 'both' | 'one-time'
  plan_type: 'subscription' | 'prepaid' | 'lifetime'
  validity_days: number | null
  module_access: (string | { module: string; id: string })[]
  stripe_price_id: string | null
  paypal_plan_id_monthly: string | null
  paypal_plan_id_yearly: string | null
  razorpay_plan_id: string | null
  features: Record<string, any>
  chatbot_creation_limit: number
  publish_post_per_day: number
  campaign_per_day: number
  total_credits: number
  display_order: number
  is_default: boolean
  trial_period_days: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface PlanResponse {
  plans: Plan[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string | Plan
  plan?: Plan
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'unpaid'
  billing_cycle: 'monthly' | 'yearly' | 'both' | 'one-time'
  total_amount: number
  amount?: number
  currency: string
  stripe_subscription_id?: string
  paypal_subscription_id?: string
  razorpay_subscription_id?: string
  subscription_date?: string
  expiry_date?: string
  is_active?: boolean
  days_remaining?: number
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at: string
  payment_gateway: string
  created_at: string
  updated_at: string
  user?: User
  member_count?: number
  history?: Subscription[]
}

export interface Payment {
  id: string
  user_id: string
  subscription_id: string
  amount: number
  currency: string
  payment_gateway: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  gateway_payment_id?: string
  gateway_order_id?: string
  completed_at?: string
  failure_reason?: string
  subscription_payment_sequence: number
  created_at: string
}

export interface BillingHeroProps {
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  onToggle: () => void
}

export interface CurrentSubscriptionCardProps {
  subscription: Subscription
  isCanceling: boolean
  onCancel: () => void
}

export interface PlanCardProps {
  plan: Plan
  index: number
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  isCurrent: boolean
  onSubscribe: (plan: Plan) => void
}

export type PaymentStep =
  | 'select-gateway'
  | 'stripe-checkout'
  | 'paypal-redirect'
  | 'razorpay-checkout'
  | 'offline-payment'
  | 'confirming'
  | 'success'

export type Gateway = 'stripe' | 'paypal' | 'razorpay' | 'offline'

export interface GatewaySelectorProps {
  plan: Plan | null
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  selectedGateway: Gateway
  onSelectGateway: (g: Gateway) => void
  onProceed: () => void
  onClose: () => void
  isInitializing: boolean
}

export interface RazorpayCheckoutStepProps {
  onBack: () => void
}

export interface ConfirmingStepProps {}

export interface SuccessStepProps {
  plan: Plan | null
  onClose: () => void
}

export interface PayPalRedirectStepProps {
  paypalUrl: string
  onBack: () => void
}

export interface StripeCheckoutStepProps {
  clientSecret: string
  stripePromise: ReturnType<typeof loadStripe> | null
  onComplete: () => void
  onBack: () => void
}

export interface PlanBasicFieldsProps {
  formData: Partial<Plan>
  isEdit: boolean
  onChange: (field: string | Record<string, unknown>, value?: unknown) => void
}

export interface FeatureEntry {
  key: string
  value: string
}

export interface PlanFeaturesEditorProps {
  features: FeatureEntry[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, field: 'key' | 'value', value: string) => void
}

export interface PlanGatewayFieldsProps {
  formData: Partial<Plan>
  onChange: (field: string | Record<string, unknown>, value?: unknown) => void
}

export interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
  billingCycle: 'monthly' | 'yearly' | 'one-time'
  onSuccess?: () => void
}

export interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Plan>) => void
  plan?: Plan | null
  isLoading?: boolean
}

export interface SubscribePlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan | null
  initialBillingCycle: 'monthly' | 'yearly' | 'one-time'
  onProceedToPayment: (billingCycle: 'monthly' | 'yearly' | 'one-time') => void
}

export interface GatewayConfig {
  id: Gateway
  label: string
  logo: string
  activeClass: string
  hoverClass: string
  checkClass: string
  infoText: string
  infoClass: string
}

export interface PlanFormProps {
  plan?: Plan | null
  onSave: (data: Partial<Plan>) => Promise<void>
  isLoading?: boolean
}

export interface PlanModulesAndLimitsProps {
  formData: Partial<Plan>
  onChange: (field: string | Record<string, unknown>, value?: unknown) => void
}

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
  t: (key: string, options?: any) => string
}

export interface UserSubscriptionOverviewProps {
  sub: Subscription | null
  amountPaid: number
  daysRemaining: number
  isCancelDialogOpen: boolean
  setIsCancelDialogOpen: (open: boolean) => void
  handleCancel: () => void
  isCancelling: boolean
  t: (key: string, options?: any) => string
}
