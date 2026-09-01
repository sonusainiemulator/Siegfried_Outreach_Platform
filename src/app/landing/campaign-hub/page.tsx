import CampaignHubLanding from '@/components/landing/campaign-hub/CampaignHubLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campaign Hub | Siegfried Outreach',
  description: 'Marketing on Autopilot. Reach your customers where they are across Email, WhatsApp, and Telegram with Siegfried Outreach Campaign Hub.',
}

const CampaignHubLandingPage = () => {
  return <CampaignHubLanding />
}

export default CampaignHubLandingPage
