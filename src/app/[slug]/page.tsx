import PageClient from './PageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Siegfried Social Media Marketing Platform',
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PageClient slug={slug} />
}
