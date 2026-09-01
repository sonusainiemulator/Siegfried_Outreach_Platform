import { Contact, TelegramSubscriber } from '../api'

export interface CampaignHubActivityProps {
  recentContacts: Contact[]
  recentTelegramSubscribers: TelegramSubscriber[]
}

export interface PlanCardProps {
  currentPurchasePlan: any
  t: (key: string, options?: any) => string
}

export interface IntelligenceOverviewProps {
  generatedContentChart: {
    percentages?: Record<string, number>
  }
}

export interface ArticlesLibraryProps {
  recentArticles: any[]
}

export interface PageProps {
  params: Promise<{ id: string }>
}

