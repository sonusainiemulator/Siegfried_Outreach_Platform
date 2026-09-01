import { Payment, Subscription } from '@/types';
import { baseApi } from './baseApi'

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentSubscription: builder.query<{ history?: Subscription[]; subscription: Subscription; days_remaining: number; is_active: boolean }, void>({
      query: () => '/subscription/my',
      providesTags: ['Subscription'],
    }),
    getSubscriptionDetails: builder.query<{ data: Subscription }, string>({
      query: (id) => `/subscription/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subscription', id }],
    }),
    getAllSubscriptions: builder.query<{ data: Subscription[]; pagination: any }, any>({
      query: (params) => ({
        url: '/subscription/all',
        params,
      }),
      providesTags: ['Subscription'],
    }),
    getSubscriptionPayments: builder.query<{ data: Payment[] }, string>({
      query: (subscriptionId) => `/subscription/payments/${subscriptionId}`,
      providesTags: (result, error, id) => [{ type: 'Subscription', id: `payments-${id}` }],
    }),
    initSubscription: builder.mutation<any, { plan_id: string; payment_gateway: string; billing_cycle?: string; embedded?: boolean }>({
      query: (data) => ({
        url: '/subscription/init',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    cancelSubscription: builder.mutation<any, { subscription_id: string }>({
      query: (data) => ({
        url: '/subscription/cancel',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription', 'User'],
    }),
    confirmSubscription: builder.mutation<any, { payment_gateway: string; session_id?: string; paypal_subscription_id?: string; token?: string; PayerID?: string; razorpay_payment_id?: string; razorpay_subscription_id?: string; razorpay_signature?: string }>({
      query: (data) => ({
        url: '/subscription/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription', 'User'],
    }),
    checkSession: builder.mutation<{ status: string }, string>({
      query: (sessionId) => ({
        url: `/subscription/check-session/${sessionId}`,
        method: 'GET',
      }),
      invalidatesTags: (result) => result?.status === 'activated' ? ['Subscription', 'User'] : [],
    }),
    deleteSubscriptions: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: '/subscription/delete',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Subscription', 'User'],
    }),
    getAllPayments: builder.query<{ data: any[]; pagination: any }, any>({
      query: (params) => ({
        url: '/subscription/payments/history',
        params,
      }),
      providesTags: ['Subscription'],
    }),
    approveOfflineSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription/approve-offline/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription', 'User'],
    }),
    rejectOfflineSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription/reject-offline/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Subscription', 'User'],
    }),
  }),
})

export const {
  useGetCurrentSubscriptionQuery,
  useGetSubscriptionDetailsQuery,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionPaymentsQuery,
  useInitSubscriptionMutation,
  useCancelSubscriptionMutation,
  useConfirmSubscriptionMutation,
  useCheckSessionMutation,
  useDeleteSubscriptionsMutation,
  useGetAllPaymentsQuery,
  useApproveOfflineSubscriptionMutation,
  useRejectOfflineSubscriptionMutation,
} = subscriptionApi
