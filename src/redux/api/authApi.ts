import { baseApi } from './baseApi'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  GenericResponse,
} from '@/types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    googleLogin: builder.mutation<LoginResponse, { credential?: string; access_token?: string }>({
      query: (data) => ({
        url: '/auth/google',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<{ user: any }, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
      keepUnusedDataFor: 300,
    }),
    updateProfile: builder.mutation<{ message: string; user: any }, FormData>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    requestPasswordReset: builder.mutation<GenericResponse & { demo_otp?: string | null }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/request-password-reset',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<GenericResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resendOtp: builder.mutation<GenericResponse & { demo_otp?: string | null }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation<GenericResponse, any>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    // --- Passkey / WebAuthn Endpoints ---
    getPasskeyRegisterOptions: builder.mutation<{ success: boolean; options: any }, void>({
      query: () => ({
        url: '/passkey/register-options',
        method: 'POST',
      }),
    }),
    verifyPasskeyRegister: builder.mutation<{ success: boolean; message: string; passkey: any }, { response: any; deviceName?: string }>({
      query: (data) => ({
        url: '/passkey/register-verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Passkey' as any],
    }),
    getPasskeyLoginOptions: builder.mutation<{ success: boolean; options: any }, { email?: string } | void>({
      query: (data) => ({
        url: '/passkey/login-options',
        method: 'POST',
        body: data || {},
      }),
    }),
    verifyPasskeyLogin: builder.mutation<LoginResponse, { response: any }>({
      query: (data) => ({
        url: '/passkey/login-verify',
        method: 'POST',
        body: data,
      }),
    }),
    getPasskeys: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => '/passkey/list',
      providesTags: ['Passkey' as any],
    }),
    deletePasskey: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/passkey/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Passkey' as any],
    }),

    getDemoCredentials: builder.query<{
      demo: boolean;
      admin?: { email: string; password: string };
      user?: { email: string; password: string };
    }, void>({
      query: () => '/demo',
    }),
  }),
})

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useRequestPasswordResetMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetDemoCredentialsQuery,
  useGetPasskeyRegisterOptionsMutation,
  useVerifyPasskeyRegisterMutation,
  useGetPasskeyLoginOptionsMutation,
  useVerifyPasskeyLoginMutation,
  useGetPasskeysQuery,
  useDeletePasskeyMutation,
} = authApi
