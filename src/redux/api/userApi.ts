import { baseApi } from './baseApi'
import { User, UserResponse, UserQueryParams } from '@/types'

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, UserQueryParams>({
      query: (params) => ({
        url: '/user/all',
        params,
      }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation<{message:string; data: User}, FormData>({
      query: (body) => ({
        url: '/user/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<{ message: string; user: User }, FormData>({
      query: (body) => ({
        url: '/user/update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserStatus: builder.mutation<{message?: string}, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/user/${id}/update/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),
    deleteUsers: builder.mutation<{message?: string}, string[]>({
      query: (ids) => ({
        url: '/user/delete',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['User'],
    }),
    loginAsUser: builder.mutation<{ message: string; token: string; user: User; originalAdminToken?: string; originalAdmin?: User }, string>({
      query: (id) => ({
        url: `/user/${id}/login-as`,
        method: 'POST',
      }),
    }),
    stopImpersonating: builder.mutation<{ message: string; token: string; user: User }, { originalAdminId?: string; originalAdminToken?: string } | void>({
      query: (body) => ({
        url: '/user/stop-impersonating',
        method: 'POST',
        body: body || {},
      }),
    }),
    getUserFullDetails: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => `/user/${id}/full-details`,
      providesTags: ['User', 'AiSocialCredits'] as any,
    }),
    adjustUserCredits: builder.mutation<{ success: boolean; message: string; data: any }, { id: string; amount: number; type: 'add' | 'deduct'; reason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/user/${id}/adjust-credits`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'AiSocialCredits'] as any,
    }),
    getImpersonationLogs: builder.query<{ data: any[]; total: number; page: number; totalPages: number }, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/user/impersonation-logs',
        params,
      }),
      providesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useDeleteUsersMutation,
  useLoginAsUserMutation,
  useStopImpersonatingMutation,
  useGetImpersonationLogsQuery,
  useGetUserFullDetailsQuery,
  useAdjustUserCreditsMutation,
} = userApi
