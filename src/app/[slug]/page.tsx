import PageClient from './PageClient'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const formattedTitle = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  return {
    title: `${formattedTitle} | TTOS`,
    description: `Explore ${formattedTitle} on TTOS — the autonomous AI marketing and outreach operating system.`,
    alternates: {
      canonical: `https://ttai.in/${slug}`,
    },
    openGraph: {
      title: `${formattedTitle} | TTOS`,
      description: `Explore ${formattedTitle} on TTOS — the autonomous AI marketing and outreach platform.`,
      url: `https://ttai.in/${slug}`,
      siteName: 'TTOS',
      images: [
        {
          url: '/images/dark-logo2.png',
          width: 1200,
          height: 630,
          alt: 'TTOS Platform',
        },
      ],
    },
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PageClient slug={slug} />
}
