import { DashboardStats } from "@/types"
import { Chatbot } from "../chatbot"

export interface DashboardChartsProps {
  contentData: Record<string, number>
  subscriptionData: Record<string, number>
  rolesData: Record<string, number>
  socialData?: Record<string, number>
  chatbots?: Chatbot[]
  revenueData?: {
    month: string
    totalRevenue: number
    transactionCount: number
  }[]
  moduleCreditsData?: {
    labels: string[]
    data: number[]
  }
}

export interface UserDashboardProps {
  stats: DashboardStats
}

export interface AdminDashboardProps {
  stats: DashboardStats
}

export interface RecentActivityProps {
  recentUsers: {
    id: string
    name: string
    email: string
    created_at: string
    avatar: string | null
    role: string
  }[]
  recentArticles: any[]
  recentPosts: any[]
}