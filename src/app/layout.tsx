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
  metadataBase: new URL('https://ttai.in'),
  title: {
    default: 'TTOS | AI-Powered Marketing & Outreach Platform',
    template: '%s | TTOS',
  },
  description:
    'TTOS is an enterprise-grade AI-powered marketing and outreach operating system. Automate multi-channel broadcasts across WhatsApp, Telegram, Email, and social publishing with autonomous AI agents.',
  keywords: [
    'TTOS',
    'AI Marketing Platform',
    'Omnichannel Marketing',
    'Autonomous Outreach Engine',
    'WhatsApp Marketing Automation',
    'Telegram Broadcast Automation',
    'Social Media Publisher',
    'AI Content Generator',
    'MCP Server Social Media',
    'Marketing Automation OS',
    'Autonomous AI Agents',
  ],
  authors: [{ name: 'TTOS Platform', url: 'https://ttai.in' }],
  creator: 'TT INFOTECHS PVT LTD',
  publisher: 'TTOS',
  applicationName: 'TTOS',
  category: 'Marketing Technology',
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
    url: 'https://ttai.in',
    siteName: 'TTOS',
    title: 'TTOS | AI-Powered Marketing & Outreach Platform',
    description:
      'Enterprise-grade autonomous AI marketing & omnichannel growth platform for WhatsApp, Telegram, Email, and Social Media.',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'TTOS Autonomous Marketing OS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TTOS | AI-Powered Marketing & Outreach Platform',
    description:
      'Autonomous AI marketing & omnichannel growth engine for global brands, agencies, and businesses.',
    images: ['/images/dark-logo2.png'],
    creator: '@ttos_ai',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/logo.png',
  },
  alternates: {
    canonical: 'https://ttai.in',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://ttai.in/#organization',
      name: 'TTOS Platform',
      url: 'https://ttai.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ttai.in/images/dark-logo2.png',
      },
      sameAs: [
        'https://twitter.com/ttos_ai',
        'https://linkedin.com/company/ttos-platform',
      ],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://ttai.in/#software',
      name: 'TTOS',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      url: 'https://ttai.in',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'AI-Powered Autonomous Marketing & Omnichannel Outreach Platform for WhatsApp, Telegram, Email, and Social Media.',
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
