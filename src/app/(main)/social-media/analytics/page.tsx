import AdvancedSocialAnalytics from '@/components/feature/social-media/analytics/AdvancedSocialAnalytics'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advanced Social Media Analytics | TTOS',
  description: 'Deep multi-platform social media performance analytics, audience intelligence, and raw data management for Perfex CRM & TTOS.',
}

const Page = () => {
  return <AdvancedSocialAnalytics />
}

export default Page
