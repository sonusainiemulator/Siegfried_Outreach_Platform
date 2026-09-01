import { TrainingData, TrainingDataRequest } from '@/types';
import { baseApi } from './baseApi';

export const trainingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrainingData: builder.query<{ trainingData: TrainingData }, string>({
      query: (chatbotId) => `/training/${chatbotId}`,
      providesTags: ['Training'],
    }),

    addTrainingData: builder.mutation<
      { message: string; trainingData: TrainingData },
      { chatbotId: string; data: TrainingDataRequest }
    >({
      query: ({ chatbotId, data }) => ({
        url: `/training/${chatbotId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Training', 'Chatbot'],
    }),

    updateTrainingData: builder.mutation<
      { message: string; trainingData: TrainingData },
      { chatbotId: string; data: TrainingDataRequest }
    >({
      query: ({ chatbotId, data }) => ({
        url: `/training/${chatbotId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Training', 'Chatbot'],
    }),

    removeTrainingDataItem: builder.mutation<
      { message: string; trainingData: TrainingData },
      { chatbotId: string; dataType: 'pdf' | 'text' | 'qa'; dataId: string }
    >({
      query: ({ chatbotId, dataType, dataId }) => ({
        url: `/training/${chatbotId}/${dataType}/${dataId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Training', 'Chatbot'],
    }),

    clearTrainingData: builder.mutation<{ message: string; trainingData: TrainingData }, string>({
      query: (chatbotId) => ({
        url: `/training/${chatbotId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Training', 'Chatbot'],
    }),
  }),
})

export const {
  useGetTrainingDataQuery,
  useAddTrainingDataMutation,
  useUpdateTrainingDataMutation,
  useRemoveTrainingDataItemMutation,
  useClearTrainingDataMutation,
} = trainingApi
