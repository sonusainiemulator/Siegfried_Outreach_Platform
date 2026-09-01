import { CreatePromptRequest, PromptTemplate, PromptTemplateResponse, UpdatePromptRequest } from '@/types';
import { baseApi } from './baseApi';

export const promptApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPrompts: builder.query<PromptTemplateResponse, { search?: string; category?: string; isFavorite?: boolean }>({
      query: (params) => {
        const queryParams: any = { ...params };
        if (params.isFavorite !== undefined) {
          queryParams.favorite = params.isFavorite;
          delete queryParams.isFavorite;
        }
        return {
          url: '/prompts',
          params: queryParams,
        };
      },
      providesTags: ['Prompt'],
    }),

    getPromptById: builder.query<{ prompt: PromptTemplate }, string>({
      query: (id) => `/prompts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Prompt', id }],
    }),

    createPrompt: builder.mutation<{ message: string; prompt: PromptTemplate }, CreatePromptRequest>({
      query: (body) => ({
        url: '/prompts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Prompt'],
    }),

    updatePrompt: builder.mutation<{ message: string; prompt: PromptTemplate }, UpdatePromptRequest>({
      query: ({ id, ...body }) => ({
        url: `/prompts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => ['Prompt', { type: 'Prompt', id }],
    }),

    deletePrompt: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/prompts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prompt'],
    }),

    togglePromptFavorite: builder.mutation<{ message: string; prompt: PromptTemplate }, string>({
      query: (id) => ({
        url: `/prompts/${id}/favorite`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => ['Prompt', { type: 'Prompt', id }],
    }),
  }),
})

export const {
  useGetPromptsQuery,
  useGetPromptByIdQuery,
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useDeletePromptMutation,
  useTogglePromptFavoriteMutation,
} = promptApi
