import AdvancedSocialAnalytics from '@/components/feature/social-media/analytics/AdvancedSocialAnalytics'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advanced Social Media Analytics | Siegfried Outreach - Social Media Marketing Agency',
  description:
    'Deep multi-platform social media performance analytics, audience intelligence, post density heatmaps, and raw data management for Siegfried Outreach.',
  alternates: {
    canonical: 'https://siegfriedoutreach.com/social-media/analytics',
  },
  openGraph: {
    title: 'Advanced Social Media Analytics | Siegfried Outreach - Social Media Marketing Agency',
    description:
      'Real-time multi-platform social media performance analytics, audience insights, and engagement telemetry by Siegfried Outreach.',
    url: 'https://siegfriedoutreach.com/social-media/analytics',
    siteName: 'Siegfried Outreach - Social Media Marketing Agency',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'Siegfried Outreach Analytics',
      },
    ],
  },
}

const Page = () => {
  return <AdvancedSocialAnalytics />
}

export default Page
