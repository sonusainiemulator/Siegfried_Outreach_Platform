import { baseApi } from './baseApi'
import { DashboardStats } from '@/types'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, { timeFilter?: string; startDate?: string; endDate?: string } | void>({
      query: (params) => {
        if (!params) return '/dashboard'
        const { timeFilter, startDate, endDate } = params
        let url = '/dashboard'
        const queryParams = new URLSearchParams()
        if (timeFilter) queryParams.append('timeFilter', timeFilter)
        if (startDate) queryParams.append('startDate', startDate)
        if (endDate) queryParams.append('endDate', endDate)
        const queryString = queryParams.toString()
        return queryString ? `${url}?${queryString}` : url
      },
      providesTags: ['Dashboard'],
    }),
  }),
})

export const { useGetDashboardStatsQuery } = dashboardApi
