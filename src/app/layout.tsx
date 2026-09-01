import type { Metadata } from 'next'
import { fontConfig } from './fonts'
import './globals.css'
import Providers from './Providers'

export const metadata: Metadata = {
  title: 'Siegfried Outreach | AI-Powered Marketing & Outreach Platform',
  description: 'AI-Powered Siegfried Outreach Platform for automated multi-channel marketing, social publishing, and customer engagement.',
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
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout;
