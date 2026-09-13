import SocialMediaDashboard from '@/components/feature/social-media/dashboard/SocialMediaDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Media Command Center | Siegfried Outreach - Social Media Marketing Agency',
  description: 'Manage, schedule, and analyze all your connected social media channels in one unified dashboard with Siegfried Outreach.',
}

const Page = () => {
  return <SocialMediaDashboard />
}

export default Page
