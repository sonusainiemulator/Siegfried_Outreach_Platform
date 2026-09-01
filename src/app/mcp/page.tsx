import { Metadata } from 'next'
import McpLanding from '@/components/landing/mcp/McpLanding'

export const metadata: Metadata = {
  title: 'Social Media MCP Server: Publish to 9 Platforms With Any AI Agent | Siegfried',
  description:
    'A hosted social media Model Context Protocol (MCP) server at api.siegfriedoutreach.com/mcp. 28 tools, 9 platforms, official APIs for Claude Code, Cursor, Codex, and Antigravity.',
  openGraph: {
    title: 'Social Media MCP Server: Publish to 9 Platforms With Any AI Agent',
    description:
      'A hosted social media MCP server with 28 tools across 9 platforms. Connect Claude Code, Cursor, or Codex directly to your social presence.',
    url: 'https://siegfriedoutreach.com/mcp',
  },
}

export default function McpPage() {
  return <McpLanding />
}
