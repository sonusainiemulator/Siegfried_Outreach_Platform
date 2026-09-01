import type { User } from './auth'
import type { Subscription } from './components/plans'
import type { Chatbot } from './chatbot'

export interface Faq {
  id: string
  title: string
  description: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface FaqResponse {
  total: number
  totalPages: number
  page: number
  limit: number
  faqs: Faq[]
}

export interface FaqQueryParams {
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface LoginResponse {
  message: string
  token: string
  user: User
}

export interface RegisterResponse {
  message: string
  token: string
  user: User
}

export interface GenericResponse {
  message: string
}

export interface ApiError {
  data?: {
    message?: string
    error?: string
  }
  status?: number
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdateProfileRequest {
  name?: string
  avatar?: File
  remove_avatar?: boolean
}

export interface ContactInquiry {
  inquiry: any
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  email: string
  name: string
  tags: string[]
  lists: string[]
  phone: string
  attributes: Record<string, unknown>
  consent: {
    email: boolean
    lastConsentDate?: string
    unsubscribeToken?: string
  }
  source: 'manual' | 'csv' | 'registration' | 'form' | 'api'
  createdAt: string
  updatedAt: string
}

export interface ContactInquiryResponse {
  total: number
  totalPages: number
  page: number
  limit: number
  inquiries: ContactInquiry[]
}

export interface ContactInquiryQueryParams {
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface UserResponse {
  total: number
  totalPages: number
  page: number
  limit: number
  users: User[]
}

export interface ContactResponse {
  contacts: Contact[]
  totalPages: number
  currentPage: number
  totalContacts: number
}

export interface ContactQueryParams {
  page?: number
  limit?: number
  search?: string
  listId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  type?: 'email' | 'whatsapp'
}

export interface ContactGroup {
  id: string
  name: string
  description?: string
  count: number
  created_at: string
  updated_at: string
  contacts?: Contact[]
  contactIds?: string[]
  type: 'email' | 'whatsapp'
}

export interface ContactGroupResponse {
  lists: ContactGroup[]
  totalPages?: number
  currentPage?: number
  totalLists?: number
}

export interface ContactGroupQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  type?: 'email' | 'whatsapp'
}

export interface Condition {
  field: string
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'not_equals' | 'not_contains'
  value: string | number
}

export interface Segment {
  id: string
  name: string
  count?: number
  message?: string
  description?: string
  conditions: Condition[]
  created_at: string
  updated_at: string
}

export interface SegmentResponse {
  segments: Segment[]
  totalPages?: number
  currentPage?: number
  totalSegments?: number
}

export interface SegmentQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface UserQueryParams {
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  has_last_login?: string
}

export interface Page {
  id: string
  _id?: string
  title: string
  slug: string
  content: string | null
  meta_title: string | null
  meta_description: string | null
  status: boolean
  created_by: string | User
  created_at: string
  updated_at: string
  description?: string
}

export interface PageResponse {
  total: number
  totalPages: number
  page: number
  limit: number
  pages: Page[]
}

export interface PageQueryParams {
  page?: number
  limit?: number
  search?: string
  created_by?: string
}

export interface DashboardStats {
  cardsCount: {
    totalUsers: number
    totalPendingConversations: number
    totalConversations: number
    totalAgents: number
    totalSubscribers: number
    thisWeekUsers: number
    totalChatbots: number
    totalArticles: number
    totalConnectedSocialPlatforms: number
    totalRevenue: number
  }
  currentPurchasePlan: Subscription | null
  recentUsers: {
    id: string
    name: string
    email: string
    created_at: string
    avatar: string | null
    role: string
  }[]
  recentPosts: {
    id: string
    title: string
    content: string
    publishedAt: string
    platforms: string[]
  }[]
  favoriteChatbots: Chatbot[]
  recentArticles: Page[]
  generatedContentChart: {
    raw: Record<string, number>
    percentages: Record<string, number>
  }
  rolesChart: Record<string, number>
  socialAccountsChart: Record<string, number>
  subscriptionChart: Record<string, number>
  moduleUsage: Record<string, number>
  moduleCreditsChart: {
    labels: string[]
    data: number[]
  }
  revenueGraph: {
    month: string
    totalRevenue: number
    transactionCount: number
  }[]
  systemLimits: Record<string, number>
}

export interface TelegramGroup {
  id: string
  chatId: string
  title: string
  type: 'group' | 'supergroup' | 'channel'
  memberCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TelegramGroupsResponse {
  data: TelegramGroup[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface TelegramGroupInput {
  chatId: string
  title: string
  type?: 'group' | 'supergroup' | 'channel'
  memberCount?: number
}

export interface TelegramSubscriber {
  id: string
  telegramId: string
  username: string
  firstName: string
  lastName: string
  name: string
  status: 'active' | 'blocked' | 'unsubscribed'
  createdAt: string
  updatedAt: string
}

export interface TelegramSubscribersResponse {
  data: TelegramSubscriber[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface TelegramQueryParams {
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
