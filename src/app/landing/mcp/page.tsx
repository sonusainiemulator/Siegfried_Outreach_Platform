import { Metadata } from 'next'
import McpLanding from '@/components/landing/mcp/McpLanding'

export const metadata: Metadata = {
  title: 'Social Media MCP Server | Connect AI Agents to 9 Platforms',
  description:
    'A hosted social media Model Context Protocol (MCP) server at ttai.in. 28 tools, 9 platforms, official APIs for Claude Code, Cursor, Codex, and Antigravity.',
  alternates: {
    canonical: 'https://ttai.in/landing/mcp',
  },
  openGraph: {
    title: 'Social Media MCP Server | Connect AI Agents to 9 Platforms | TTOS',
    description:
      'A hosted social media MCP server with 28 tools across 9 platforms. Connect Claude Code, Cursor, or Codex directly to your social presence.',
    url: 'https://ttai.in/landing/mcp',
    siteName: 'TTOS',
    images: [
      {
        url: '/images/dark-logo2.png',
        width: 1200,
        height: 630,
        alt: 'TTOS MCP Server',
      },
    ],
  },
}

export default function LandingMcpPage() {
  return <McpLanding />
}
