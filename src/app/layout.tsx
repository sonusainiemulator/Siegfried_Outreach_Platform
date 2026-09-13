import type { Metadata, Viewport } from 'next'
import { fontConfig } from './fonts'
import './globals.css'
import Providers from './Providers'

export const viewport: Viewport = {
  themeColor: '#0A0C10',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://siegfriedoutreach.com'),
  title: {
    default: 'Siegfried Outreach - Social Media Marketing Agency',
    template: '%s | Siegfried Outreach - Social Media Marketing Agency',
  },
  description:
    'Siegfried Outreach is a premier Social Media Marketing Agency and AI-powered marketing platform. Scale your brand with automated multi-channel publishing, campaign orchestration, autonomous AI social management, and omnichannel outreach.',
  keywords: [
    'Siegfried Outreach',
    'Social Media Marketing Agency',
    'Social Media Agency',
    'AI Social Media Marketing',
    'Social Media Management',
    'Omnichannel Marketing Agency',
    'Autonomous Outreach Engine',
    'Instagram Marketing Agency',
    'Facebook Marketing Agency',
    'LinkedIn Growth Agency',
    'Twitter X Growth Agency',
    'YouTube Marketing Automation',
    'TikTok Marketing Agency',
    'Google My Business Growth',
    'Social Media Automation OS',
    'AI Marketing Platform',
  ],
  authors: [{ name: 'Siegfried Outreach', url: 'https://siegfriedoutreach.com' }],
  creator: 'Siegfried Outreach',
  publisher: 'Siegfried Outreach - Social Media Marketing Agency',
  applicationName: 'Siegfried Outreach',
  category: 'Social Media Marketing & Agency Services',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://siegfriedoutreach.com',
    siteName: 'Siegfried Outreach - Social Media Marketing Agency',
    title: 'Siegfried Outreach - Social Media Marketing Agency',
    description:
      'Premier Social Media Marketing Agency and AI-powered growth platform for multi-channel publishing, automated outreach, and brand growth.',
    images: [
      {
        url: '/images/siegfried-outreach-og.png',
        width: 1200,
        height: 630,
        alt: 'Siegfried Outreach - Social Media Marketing Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siegfried Outreach - Social Media Marketing Agency',
    description:
      'Premier Social Media Marketing Agency and AI-powered growth platform for multi-channel publishing, automated outreach, and brand growth.',
    images: ['/images/siegfried-outreach-og.png'],
    creator: '@SiegfriedMarket',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/siegfried-outreach-square.png',
  },
  alternates: {
    canonical: 'https://siegfriedoutreach.com',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'MarketingAgency'],
      '@id': 'https://siegfriedoutreach.com/#organization',
      name: 'Siegfried Outreach - Social Media Marketing Agency',
      alternateName: 'Siegfried Outreach',
      url: 'https://siegfriedoutreach.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://siegfriedoutreach.com/images/siegfried-outreach-og.png',
      },
      sameAs: [
        'https://twitter.com/SiegfriedMarket',
        'https://linkedin.com/company/siegfriedoutreach',
      ],
      description:
        'Premier Social Media Marketing Agency and AI-powered growth platform for multi-channel publishing, automated outreach, and brand growth.',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://siegfriedoutreach.com/#software',
      name: 'Siegfried Outreach Platform',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      url: 'https://siegfriedoutreach.com',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'AI-Powered Autonomous Marketing & Social Media Operating System for multi-channel publishing, campaign orchestration, and automated outreach.',
    },
  ],
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en" suppressHydrationWarning style={
      {
        [fontConfig.variable]: fontConfig.family,
      } as React.CSSProperties
    }>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontConfig.url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
