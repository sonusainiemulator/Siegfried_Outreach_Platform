import SocialInboxDashboard from '@/components/feature/social-media/SocialInboxDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unified Social DM Inbox | Siegfried Outreach Platform',
  description: 'Read and respond to direct messages across Instagram, Facebook Messenger, WhatsApp, and Telegram in one unified inbox with real-time alerts.',
}

const Page = () => {
  return <SocialInboxDashboard />
}

export default Page
