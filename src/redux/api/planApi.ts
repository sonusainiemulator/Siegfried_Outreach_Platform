import { Plan, PlanResponse } from '@/types';
import { baseApi } from './baseApi'


export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<{ data: PlanResponse }, any>({
      query: (params) => ({
        url: '/plan',
        params,
      }),
      providesTags: ['Plan'],
    }),
    getActivePlans: builder.query<{ data: Plan[] }, void>({
      query: () => '/plan/active',
      providesTags: ['Plan'],
    }),
    getPlan: builder.query<{ data: Plan }, string>({
      query: (id) => `/plan/${id}`,
      providesTags: (result, error, id) => [{ type: 'Plan', id }],
    }),
    getPlanBySlug: builder.query<{ data: Plan }, string>({
      query: (slug) => `/plan/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Plan', id: slug }],
    }),
    createPlan: builder.mutation<any, Partial<Plan>>({
      query: (data) => ({
        url: '/plan/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Plan'],
    }),
    updatePlan: builder.mutation<any, { id: string; data: Partial<Plan> }>({
      query: ({ id, data }) => ({
        url: `/plan/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Plan', { type: 'Plan', id }],
    }),
    updatePlanStatus: builder.mutation<any, { id: string; status: 'active' | 'inactive' }>({
      query: ({ id, status }) => ({
        url: `/plan/status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ['Plan', { type: 'Plan', id }],
    }),
    deletePlans: builder.mutation<any, { ids: string[] }>({
      query: (data) => ({
        url: '/plan/delete',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Plan'],
    }),
    setDefaultPlan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/plan/set-default/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Plan'],
    }),
  }),
})

export const {
  useGetPlansQuery,
  useGetActivePlansQuery,
  useGetPlanQuery,
  useGetPlanBySlugQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useUpdatePlanStatusMutation,
  useDeletePlansMutation,
  useSetDefaultPlanMutation,
} = planApi
