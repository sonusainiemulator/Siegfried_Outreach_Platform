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
    title: `${formattedTitle} | Siegfried Outreach - Social Media Marketing Agency`,
    description: `Explore ${formattedTitle} on Siegfried Outreach — premier Social Media Marketing Agency and AI-powered outreach operating system.`,
    alternates: {
      canonical: `https://siegfriedoutreach.com/${slug}`,
    },
    openGraph: {
      title: `${formattedTitle} | Siegfried Outreach - Social Media Marketing Agency`,
      description: `Explore ${formattedTitle} on Siegfried Outreach — premier Social Media Marketing Agency and AI-powered outreach platform.`,
      url: `https://siegfriedoutreach.com/${slug}`,
      siteName: 'Siegfried Outreach - Social Media Marketing Agency',
      images: [
        {
          url: '/images/siegfried-outreach-og.png',
          width: 1200,
          height: 630,
          alt: `Siegfried Outreach - ${formattedTitle}`,
        },
      ],
    },
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PageClient slug={slug} />
}
