import { Metadata } from 'next'
import McpLanding from '@/components/landing/mcp/McpLanding'

export const metadata: Metadata = {
  title: 'Social Media MCP Server | Siegfried Outreach - Social Media Marketing Agency',
  description:
    'A hosted social media Model Context Protocol (MCP) server at siegfriedoutreach.com by Siegfried Outreach. 28 tools, 9 platforms, official APIs for Claude Code, Cursor, Codex, and Antigravity.',
  alternates: {
    canonical: 'https://siegfriedoutreach.com/mcp',
  },
  openGraph: {
    title: 'Social Media MCP Server | Siegfried Outreach - Social Media Marketing Agency',
    description:
      'A hosted social media MCP server with 28 tools across 9 platforms from Siegfried Outreach. Connect Claude Code, Cursor, or Codex directly to your social presence.',
    url: 'https://siegfriedoutreach.com/mcp',
    siteName: 'Siegfried Outreach - Social Media Marketing Agency',
    images: [
      {
        url: '/images/siegfried-outreach-og.png',
        width: 1200,
        height: 630,
        alt: 'Siegfried Outreach MCP Server',
      },
    ],
  },
}

export default function McpPage() {
  return <McpLanding />
}
