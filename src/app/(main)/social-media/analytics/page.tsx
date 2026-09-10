import AdvancedSocialAnalytics from '@/components/feature/social-media/analytics/AdvancedSocialAnalytics'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advanced Social Media Analytics | Multi-Platform Telemetry',
  description:
    'Deep multi-platform social media performance analytics, audience intelligence, post density heatmaps, and raw data management for TTOS.',
  alternates: {
    canonical: 'https://ttai.in/social-media/analytics',
  },
  openGraph: {
    title: 'Advanced Social Media Analytics | TTOS',
    description:
      'Real-time multi-platform social media performance analytics, audience insights, and engagement telemetry.',
    url: 'https://ttai.in/social-media/analytics',
    siteName: 'TTOS',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'TTOS Analytics',
      },
    ],
  },
}

const Page = () => {
  return <AdvancedSocialAnalytics />
}

export default Page
