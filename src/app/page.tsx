import CampaignHubLanding from '@/components/landing/campaign-hub/CampaignHubLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TTOS | AI-Powered Marketing & Outreach Platform',
  description: 'Marketing on Autopilot. Reach your customers where they are across Email, WhatsApp, Telegram, and Social Media with TTOS.',
}

export default function Home() {
  return <CampaignHubLanding />
}
