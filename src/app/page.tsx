import CampaignHubLanding from '@/components/landing/campaign-hub/CampaignHubLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Siegfried Outreach - Social Media Marketing Agency',
  description:
    'Scale your brand on autopilot with Siegfried Outreach — the premier Social Media Marketing Agency & AI-powered outreach platform. Automated publishing and campaigns across Instagram, Facebook, LinkedIn, Twitter/X, YouTube, TikTok, Reddit, Google Business, Email & WhatsApp.',
  alternates: {
    canonical: 'https://siegfriedoutreach.com',
  },
  openGraph: {
    title: 'Siegfried Outreach - Social Media Marketing Agency',
    description:
      'Premier Social Media Marketing Agency and AI-powered omnichannel growth platform for global brands, agencies, and businesses.',
    url: 'https://siegfriedoutreach.com',
    siteName: 'Siegfried Outreach - Social Media Marketing Agency',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'Siegfried Outreach Platform',
      },
    ],
  },
}

export default function Home() {
  return <CampaignHubLanding />
}
