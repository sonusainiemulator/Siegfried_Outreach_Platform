import SocialMediaLanding from '@/components/landing/social-media/SocialMediaLanding'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Media Studio | AI Publishing & Strategy Engine',
  description:
    'Boost your social media growth with AI. Create, schedule and publish stunning content for Instagram, Facebook, LinkedIn, Twitter/X, YouTube, TikTok, and Reddit with TTOS.',
  alternates: {
    canonical: 'https://ttai.in/landing/social-media',
  },
  openGraph: {
    title: 'Social Media Studio | AI Publishing & Strategy Engine | TTOS',
    description:
      'Multi-channel autonomous social media management, 30-day autopilot content planner, and high-converting ad copy generation.',
    url: 'https://ttai.in/landing/social-media',
    siteName: 'TTOS',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'TTOS Social Media Studio',
      },
    ],
  },
}

const SocialMediaLandingPage = () => {
  return <SocialMediaLanding />
}

export default SocialMediaLandingPage
