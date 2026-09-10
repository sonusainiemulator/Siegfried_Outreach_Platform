import CampaignHubLanding from '@/components/landing/campaign-hub/CampaignHubLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TTOS | AI-Powered Marketing & Outreach Platform',
  description:
    'Marketing on Autopilot. Reach your customers where they are across Email, WhatsApp, Telegram, and Social Media with TTOS.',
  alternates: {
    canonical: 'https://ttai.in',
  },
  openGraph: {
    title: 'TTOS | AI-Powered Marketing & Outreach Platform',
    description:
      'Autonomous AI marketing and omnichannel growth engine for global brands, agencies, and businesses.',
    url: 'https://ttai.in',
    siteName: 'TTOS',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'TTOS Platform',
      },
    ],
  },
}

export default function Home() {
  return <CampaignHubLanding />
}
