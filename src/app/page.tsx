import CampaignHubLanding from '@/components/landing/campaign-hub/CampaignHubLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Siegfried Outreach | AI-Powered Marketing & Outreach Platform',
  description: 'Marketing on Autopilot. Reach your customers where they are across Email, WhatsApp, Telegram, and Social Media with Siegfried Outreach.',
}

export default function Home() {
  return <CampaignHubLanding />
}
