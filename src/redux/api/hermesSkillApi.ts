import { baseApi } from './baseApi'

export const hermesSkillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHermesSkills: builder.query({
      query: (params) => ({
        url: '/hermes-skills',
        params,
      }),
      providesTags: ['HermesSkill'],
    }),
    createHermesSkill: builder.mutation({
      query: (data) => ({
        url: '/hermes-skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['HermesSkill'],
    }),
    updateHermesSkill: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/hermes-skills/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['HermesSkill'],
    }),
    deleteHermesSkill: builder.mutation({
      query: (id) => ({
        url: `/hermes-skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HermesSkill'],
    }),
    assignHermesSkill: builder.mutation({
      query: (data) => ({
        url: '/hermes-skills/assign',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UserSettings', 'HermesSkill'],
    }),
  }),
})

export const {
  useGetHermesSkillsQuery,
  useCreateHermesSkillMutation,
  useUpdateHermesSkillMutation,
  useDeleteHermesSkillMutation,
  useAssignHermesSkillMutation,
} = hermesSkillApi
