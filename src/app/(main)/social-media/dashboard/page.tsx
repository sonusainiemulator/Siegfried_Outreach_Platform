import SocialMediaDashboard from '@/components/feature/social-media/dashboard/SocialMediaDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Media Command Center | Multi-Account Management',
  description: 'Manage, schedule, and analyze all your connected social media channels in one unified dashboard with TTOS.',
}

const Page = () => {
  return <SocialMediaDashboard />
}

export default Page
