import SocialMediaDashboard from '@/components/feature/social-media/dashboard/SocialMediaDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Media Dashboard | TTOS',
  description: 'Manage and analytics for your social media accounts',
}

const Page = () => {
  return <SocialMediaDashboard />
}

export default Page
