import { baseApi } from './baseApi'

export interface ServerSpec {
  _id: string
  plan: 'basic' | 'pro' | 'enterprise'
  storageTotal: number
  storageUsed: number
  bandwidth: number
  speed: string
  ssl: boolean
  domain?: string
  subdomain?: string
  ipAddress?: string
  status: 'available' | 'provisioning' | 'active' | 'error'
  uptime: number
  coreWebVitals?: { lcp: number; fid: number; cls: number }
}

export interface DeploymentStatus {
  _id: string
  websiteId: string
  serverId: string
  status: 'queued' | 'deploying' | 'dns_propagation' | 'ssl_setup' | 'live' | 'error'
  progress: number
  domain: string
  liveUrl?: string
  error?: string
  startedAt: string
  completedAt?: string
}

export const serverAgentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServerSpecs: builder.query<{ servers: ServerSpec[] }, void>({
      query: () => '/ai-employees/server-agent/specs',
      providesTags: ['ServerAgent'],
    }),
    provisionServer: builder.mutation<{ server: ServerSpec }, { plan: string; domain?: string; subdomain?: string }>({
      query: (data) => ({ url: '/ai-employees/server-agent/provision', method: 'POST', body: data }),
      invalidatesTags: ['ServerAgent', 'AiEmployeeCredits'],
    }),
    deployWebsite: builder.mutation<{ deployment: DeploymentStatus }, { websiteId: string; serverId: string; domain: string }>({
      query: (data) => ({ url: '/ai-employees/server-agent/deploy', method: 'POST', body: data }),
      invalidatesTags: ['ServerAgent', 'WebsiteBuilder'],
    }),
    getDeploymentStatus: builder.query<{ deployment: DeploymentStatus }, string>({
      query: (id) => `/ai-employees/server-agent/deployment/${id}`,
      providesTags: ['ServerAgent'],
    }),
    getServerStatus: builder.query<{ server: ServerSpec }, string>({
      query: (id) => `/ai-employees/server-agent/status/${id}`,
      providesTags: ['ServerAgent'],
    }),
  }),
})

export const {
  useGetServerSpecsQuery,
  useProvisionServerMutation,
  useDeployWebsiteMutation,
  useGetDeploymentStatusQuery,
  useGetServerStatusQuery,
} = serverAgentApi
