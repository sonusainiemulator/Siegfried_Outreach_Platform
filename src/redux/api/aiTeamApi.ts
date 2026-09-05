import { baseApi } from './baseApi'

export interface RoleTemplate {
  key: string
  emoji: string
  name: string
  description: string
  platforms: string[]
  contentTypes: string[]
  tools: { captions: boolean; images: boolean; reels: boolean; hashtags: boolean; scheduling: boolean }
}

export interface Employee {
  _id: string
  userId: string
  businessId?: string | null
  name: string
  roleTemplate: string
  emoji: string
  description?: string
  persona?: string
  systemInstruction?: string
  provider?: string
  model?: string
  temperature?: number
  maxTokens?: number
  brandVoice?: string
  platforms?: string[]
  contentTypes?: string[]
  tools?: { captions: boolean; images: boolean; reels: boolean; hashtags: boolean; scheduling: boolean }
  avatar?: string
  status: 'active' | 'paused' | 'archived'
  stats?: { messages: number; draftsCreated: number; postsPublished: number }
  lastUsedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface EmployeeChatMessage {
  _id?: string
  role: 'user' | 'assistant'
  content: string
  artifactType?: string
  createdAt?: string
}

export interface EmployeeChat {
  _id: string
  employeeId: string
  userId: string
  businessId?: string | null
  title?: string
  messages?: EmployeeChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ReferenceStudy {
  _id: string
  userId: string
  url: string
  sourceType: string
  title: string
  status: 'studying' | 'ready' | 'failed'
  error?: string
  snapshot?: {
    metaDescription?: string
    textSnippet?: string
    imageUrls?: string[]
    videoUrls?: string[]
    links?: string[]
  }
  profile?: {
    niche?: string
    audience?: string
    tone?: string
    brandStyle?: string
    contentPillars?: string[]
    hooks?: string[]
    hashtags?: string[]
    ctaPatterns?: string[]
    reelFormula?: string
    keyTakeaways?: string[]
  }
  createdAt: string
  updatedAt: string
}

export const aiTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoleTemplates: builder.query<{ roleTemplates: RoleTemplate[] }, void>({
      query: () => '/ai-team/role-templates',
    }),
    listEmployees: builder.query<{ employees: Employee[] }, void>({
      query: () => '/ai-team',
      providesTags: ['AiTeam'],
    }),
    createEmployee: builder.mutation<{ employee: Employee }, Partial<Employee>>({
      query: (data) => ({ url: '/ai-team', method: 'POST', body: data }),
      invalidatesTags: ['AiTeam'],
    }),
    updateEmployee: builder.mutation<{ employee: Employee }, { id: string; patch: Partial<Employee> }>({
      query: ({ id, patch }) => ({ url: `/ai-team/${id}`, method: 'PUT', body: patch }),
      invalidatesTags: ['AiTeam'],
    }),
    deleteEmployee: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/ai-team/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AiTeam'],
    }),
    chatEmployee: builder.mutation<
      { chatId: string; reply: string },
      { id: string; message: string; chatId?: string }
    >({
      query: ({ id, message, chatId }) => ({
        url: `/ai-team/${id}/chat`,
        method: 'POST',
        body: { message, chatId },
      }),
      invalidatesTags: ['AiTeamChat'],
    }),
    listEmployeeChats: builder.query<{ chats: EmployeeChat[] }, string>({
      query: (id) => `/ai-team/${id}/chats`,
      providesTags: ['AiTeamChat'],
    }),
    getEmployeeChat: builder.query<{ chat: EmployeeChat }, string>({
      query: (chatId) => `/ai-team/chats/${chatId}`,
      providesTags: ['AiTeamChat'],
    }),
    deleteEmployeeChat: builder.mutation<{ message: string }, string>({
      query: (chatId) => ({ url: `/ai-team/chats/${chatId}`, method: 'DELETE' }),
      invalidatesTags: ['AiTeamChat'],
    }),
    createEmployeeDraft: builder.mutation<
      { message: string; postId: string },
      { id: string; content: string; title?: string; platforms?: string[]; mediaUrls?: string[] }
    >({
      query: ({ id, ...body }) => ({ url: `/ai-team/${id}/draft`, method: 'POST', body }),
      invalidatesTags: ['SocialPost'],
    }),
    // ---- Reference study ("brain") ----
    studyReference: builder.mutation<{ study: ReferenceStudy; reused?: boolean }, { url: string }>({
      query: (body) => ({ url: '/ai-team/reference/study', method: 'POST', body }),
      invalidatesTags: ['ReferenceStudy'],
    }),
    listReferenceStudies: builder.query<{ studies: ReferenceStudy[] }, void>({
      query: () => '/ai-team/reference',
      providesTags: ['ReferenceStudy'],
    }),
    getReferenceStudy: builder.query<{ study: ReferenceStudy }, string>({
      query: (id) => `/ai-team/reference/${id}`,
      providesTags: ['ReferenceStudy'],
    }),
    deleteReferenceStudy: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/ai-team/reference/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ReferenceStudy'],
    }),
    generateReferenceContent: builder.mutation<
      { content: string },
      { id: string; topic: string; format: string }
    >({
      query: ({ id, ...body }) => ({ url: `/ai-team/reference/${id}/generate`, method: 'POST', body }),
    }),
    createReferenceDraft: builder.mutation<
      { message: string; postId: string },
      { id: string; content: string; title?: string; platforms?: string[] }
    >({
      query: ({ id, ...body }) => ({ url: `/ai-team/reference/${id}/draft`, method: 'POST', body }),
      invalidatesTags: ['SocialPost', 'ReferenceStudy'],
    }),
  }),
})

export const {
  useGetRoleTemplatesQuery,
  useListEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useChatEmployeeMutation,
  useListEmployeeChatsQuery,
  useGetEmployeeChatQuery,
  useDeleteEmployeeChatMutation,
  useCreateEmployeeDraftMutation,
  useStudyReferenceMutation,
  useListReferenceStudiesQuery,
  useGetReferenceStudyQuery,
  useDeleteReferenceStudyMutation,
  useGenerateReferenceContentMutation,
  useCreateReferenceDraftMutation,
} = aiTeamApi
