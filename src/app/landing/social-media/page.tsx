import SocialMediaLanding from '@/components/landing/social-media/SocialMediaLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Media Studio | Siegfried Outreach - Social Media Marketing Agency',
  description:
    'Boost your social media growth with AI from Siegfried Outreach — premier Social Media Marketing Agency. Create, schedule and publish stunning content for Instagram, Facebook, LinkedIn, Twitter/X, YouTube, TikTok, Reddit, and Google Business.',
  alternates: {
    canonical: 'https://siegfriedoutreach.com/landing/social-media',
  },
  openGraph: {
    title: 'Social Media Studio | Siegfried Outreach - Social Media Marketing Agency',
    description:
      'Multi-channel autonomous social media management, 30-day autopilot content planner, and high-converting ad copy generation by Siegfried Outreach.',
    url: 'https://siegfriedoutreach.com/landing/social-media',
    siteName: 'Siegfried Outreach - Social Media Marketing Agency',
    images: [
      {
        url: '/images/siegfried-outreach-og.png',
        width: 1200,
        height: 630,
        alt: 'Siegfried Outreach Social Media Studio',
      },
    ],
  },
}

const SocialMediaLandingPage = () => {
  return <SocialMediaLanding />
}

export default SocialMediaLandingPage
