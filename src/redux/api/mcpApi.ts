import { baseApi } from './baseApi'

export interface McpApiKey {
  id: string
  name: string
  key: string
  maskedKey: string
  lastUsedAt: string | null
  usageCount: number
  isActive: boolean
  createdAt: string
}

export interface McpLog {
  id: string
  toolName: string
  platform: string
  clientAgent: string
  status: 'success' | 'failed' | 'error' | 'pending'
  durationMs: number
  paramsSummary: any
  responseSummary: any
  errorMessage: string | null
  created_at: string
}

export interface McpStats {
  status: string
  latency: string
  totalTools: number
  supportedPlatforms: number
  totalCalls: number
  activeKeys: number
  connectedAccounts: number
  protocolVersion: string
  serverEndpoint: string
}

export const mcpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMcpStats: builder.query<{ success: boolean } & McpStats, void>({
      query: () => ({
        url: '/mcp/stats',
        method: 'GET',
      }),
    }),
    getUserMcpKeys: builder.query<{ success: boolean; keys: McpApiKey[] }, void>({
      query: () => ({
        url: '/mcp/keys',
        method: 'GET',
      }),
      providesTags: ['McpKey'],
    }),
    createMcpKey: builder.mutation<{ success: boolean; message: string; key: McpApiKey }, { name: string }>({
      query: (body) => ({
        url: '/mcp/keys',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['McpKey'],
    }),
    revokeMcpKey: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/mcp/keys/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['McpKey'],
    }),
    getMcpLogs: builder.query<{ success: boolean; total: number; page: number; limit: number; logs: McpLog[] }, { page?: number; limit?: number; status?: string; toolName?: string }>({
      query: (params) => ({
        url: '/mcp/logs',
        method: 'GET',
        params,
      }),
      providesTags: ['McpLog'],
    }),
    testMcpTool: builder.mutation<{ success: boolean; toolName: string; args: any; result: any }, { toolName: string; args?: any }>({
      query: (body) => ({
        url: '/mcp/test-tool',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['McpLog'],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetMcpStatsQuery,
  useGetUserMcpKeysQuery,
  useCreateMcpKeyMutation,
  useRevokeMcpKeyMutation,
  useGetMcpLogsQuery,
  useTestMcpToolMutation,
} = mcpApi
