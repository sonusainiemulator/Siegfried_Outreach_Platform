import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Chatbot, InteractionMessage } from './chatbot'

export interface LeftHeaderProps {
  onMenuToggle?: () => void
}

export interface DashboardLayoutProps {
  children: ReactNode
}


export interface StatsCardProps {
  stats: {
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
}

export type ColorKey = 'blue' | 'emerald' | 'amber' | 'purple' | 'indigo'

export interface CardConfig {
  labelKey: string
  defaultLabel: string
  descKey: string
  defaultDesc: string
  statKey: keyof StatsCardProps['stats']
  icon: LucideIcon
  color: ColorKey
  trend: string
  colSpan?: string
  isLive?: boolean
}


export interface MenuItem {
  id: string
  label: string
  icon: string
  path?: string
  badge?: string
  requiredPermission?: string
  requiredPermissions?: string[]
  requiredRole?: string
  children?: MenuItem[]
}

export interface MenuSection {
  title: string
  items: MenuItem[]
}

export interface SidebarProps {
  isMobile?: boolean
  onClose?: () => void
  onLogoClick?: () => void
}

export interface RightSidebarProps {
  rightPanelOpen: boolean
  setRightPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedBot: Chatbot | null
  messages: InteractionMessage[]
}

export interface InternetConnectionWrapperProps {
  children: ReactNode
}

export interface MaintenanceWrapperProps {
  children: ReactNode
}

export interface SocketProviderProps {
  children: ReactNode
}

export interface HeaderProps {
  onMenuToggle: () => void
}

export interface ExtendedSectionHeaderProps {
  label: string
  isCollapsed?: boolean
}

export interface SidebarContextType {
  openMenuId: string | null
  setOpenMenuId: (id: string | null) => void
}

export interface ExtendedSidebarItemProps {
  item: MenuItem
  depth?: number
  isCollapsed?: boolean
  isLast?: boolean
}