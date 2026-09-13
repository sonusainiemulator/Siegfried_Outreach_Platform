import CampaignHubLanding from '@/components/landing/campaign-hub/CampaignHubLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campaign Hub | Siegfried Outreach - Social Media Marketing Agency',
  description:
    'Marketing on Autopilot. Reach your customers where they are across Email, WhatsApp, and Telegram with Siegfried Outreach Campaign Hub.',
  alternates: {
    canonical: 'https://siegfriedoutreach.com/landing/campaign-hub',
  },
  openGraph: {
    title: 'Campaign Hub | Siegfried Outreach - Social Media Marketing Agency',
    description:
      'Omnichannel broadcast engine with unified inbox, audience segmentation, and multi-channel campaign automation by Siegfried Outreach.',
    url: 'https://siegfriedoutreach.com/landing/campaign-hub',
    siteName: 'Siegfried Outreach - Social Media Marketing Agency',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'Siegfried Outreach Campaign Hub',
      },
    ],
  },
}

const CampaignHubLandingPage = () => {
  return <CampaignHubLanding />
}

export default CampaignHubLandingPage
