import { baseApi } from './baseApi'

export type AgentType = 'website_builder' | 'seo_agent' | 'server_agent' | 'maintenance_agent' | 'social_agent' | 'google_business'

export interface AiAgent {
  _id: string
  userId: string
  agentType: AgentType
  name: string
  emoji: string
  status: 'active' | 'idle' | 'working' | 'paused'
  description: string
  creditsUsed: number
  tasksCompleted: number
  lastActiveAt?: string
  config?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface DraftItem {
  _id: string
  userId: string
  agentType: AgentType
  stepName: string
  stepIndex: number
  data: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface CreditBalance {
  total: number
  used: number
  remaining: number
  history: CreditTransaction[]
}

export interface CreditTransaction {
  _id: string
  agentType: AgentType
  action: string
  amount: number
  description: string
  createdAt: string
}

export const aiEmployeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentOverview: builder.query<{ agents: AiAgent[]; credits: CreditBalance }, void>({
      query: () => '/ai-employees/overview',
      providesTags: ['AiEmployee', 'AiEmployeeCredits'],
    }),
    getAgentStatus: builder.query<{ agent: AiAgent }, AgentType>({
      query: (type) => `/ai-employees/agents/${type}`,
      providesTags: ['AiEmployee'],
    }),
    activateAgent: builder.mutation<{ agent: AiAgent }, { agentType: AgentType }>({
      query: (data) => ({ url: '/ai-employees/agents/activate', method: 'POST', body: data }),
      invalidatesTags: ['AiEmployee', 'AiEmployeeCredits'],
    }),
    getCreditBalance: builder.query<{ credits: CreditBalance }, void>({
      query: () => '/ai-employees/credits/balance',
      providesTags: ['AiEmployeeCredits'],
    }),
    getCreditHistory: builder.query<{ transactions: CreditTransaction[] }, { page?: number; limit?: number }>({
      query: (params) => ({ url: '/ai-employees/credits/history', params }),
      providesTags: ['AiEmployeeCredits'],
    }),
    deductCredits: builder.mutation<{ remaining: number }, { agentType: AgentType; amount: number; action: string }>({
      query: (data) => ({ url: '/ai-employees/credits/deduct', method: 'POST', body: data }),
      invalidatesTags: ['AiEmployeeCredits'],
    }),
    purchaseCredits: builder.mutation<{ message: string; balance: number }, { amount: number; paymentMethod: string }>({
      query: (data) => ({ url: '/ai-employees/credits/purchase', method: 'POST', body: data }),
      invalidatesTags: ['AiEmployeeCredits'],
    }),
    saveDraft: builder.mutation<{ draft: DraftItem }, Partial<DraftItem>>({
      query: (data) => ({ url: '/ai-employees/drafts', method: 'POST', body: data }),
      invalidatesTags: ['Draft'],
    }),
    getDrafts: builder.query<{ drafts: DraftItem[] }, { agentType?: AgentType }>({
      query: (params) => ({ url: '/ai-employees/drafts', params }),
      providesTags: ['Draft'],
    }),
    deleteDraft: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/ai-employees/drafts/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Draft'],
    }),
    getRecentActivity: builder.query<{ activities: { agentType: AgentType; action: string; timestamp: string; details: string }[] }, void>({
      query: () => '/ai-employees/activity',
      providesTags: ['AiEmployee'],
    }),
  }),
})

export const {
  useGetAgentOverviewQuery,
  useGetAgentStatusQuery,
  useActivateAgentMutation,
  useGetCreditBalanceQuery: useGetEmployeeCreditBalanceQuery,
  useGetCreditHistoryQuery: useGetEmployeeCreditHistoryQuery,
  useDeductCreditsMutation,
  usePurchaseCreditsMutation,
  useSaveDraftMutation,
  useGetDraftsQuery,
  useDeleteDraftMutation,
  useGetRecentActivityQuery,
} = aiEmployeeApi
