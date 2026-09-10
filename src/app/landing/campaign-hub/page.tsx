import CampaignHubLanding from '@/components/landing/campaign-hub/CampaignHubLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campaign Hub | Omnichannel Marketing Automation',
  description:
    'Marketing on Autopilot. Reach your customers where they are across Email, WhatsApp, and Telegram with TTOS Campaign Hub.',
  alternates: {
    canonical: 'https://ttai.in/landing/campaign-hub',
  },
  openGraph: {
    title: 'Campaign Hub | Omnichannel Marketing Automation | TTOS',
    description:
      'Omnichannel broadcast engine with unified inbox, audience segmentation, and multi-channel campaign automation.',
    url: 'https://ttai.in/landing/campaign-hub',
    siteName: 'TTOS',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'TTOS Campaign Hub',
      },
    ],
  },
}

const CampaignHubLandingPage = () => {
  return <CampaignHubLanding />
}

export default CampaignHubLandingPage
