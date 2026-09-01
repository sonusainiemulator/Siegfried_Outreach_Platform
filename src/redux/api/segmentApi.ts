import { baseApi } from './baseApi'
import { Segment, SegmentResponse, SegmentQueryParams } from '@/types'

export const segmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSegments: builder.query<SegmentResponse, SegmentQueryParams | void>({
      query: (params) => ({
        url: '/audience',
        params: params || {},
      }),
      providesTags: ['Segment'],
    }),
    getSegment: builder.query<Segment, string>({
      query: (id) => `/audience/${id}`,
      transformResponse: (response: { segment: Segment }) => response.segment,
      providesTags: (result, error, id) => [{ type: 'Segment', id }],
    }),
    createSegment: builder.mutation<Segment, Partial<Segment>>({
      query: (body) => ({
        url: '/audience',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { segment: Segment }) => response.segment,
      invalidatesTags: ['Segment'],
    }),
    updateSegment: builder.mutation<Segment, Partial<Segment> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/audience/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { segment: Segment }) => response.segment,
      invalidatesTags: (result, error, { id }) => ['Segment', { type: 'Segment', id }],
    }),
    deleteSegments: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: '/audience',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Segment'],
    }),
    calculateSegmentSize: builder.mutation<{ count: number }, { conditions: any }>({
      query: (body) => ({
        url: '/audience/size',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetSegmentsQuery,
  useGetSegmentQuery,
  useCreateSegmentMutation,
  useUpdateSegmentMutation,
  useDeleteSegmentsMutation,
  useCalculateSegmentSizeMutation,
} = segmentApi
