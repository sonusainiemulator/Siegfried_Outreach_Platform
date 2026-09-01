import { Metadata } from 'next'
import McpLanding from '@/components/landing/mcp/McpLanding'

export const metadata: Metadata = {
  title: 'Social Media MCP Server: Publish to 9 Platforms With Any AI Agent | Siegfried',
  description:
    'A hosted social media Model Context Protocol (MCP) server at api.siegfriedoutreach.com/mcp. 28 tools, 9 platforms, official APIs for Claude Code, Cursor, Codex, and Antigravity.',
}

export default function LandingMcpPage() {
  return <McpLanding />
}
