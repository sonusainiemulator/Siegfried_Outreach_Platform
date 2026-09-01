import { AuthState } from '@/types'
import { authUtils } from '@/utils'
import { createSlice } from '@reduxjs/toolkit'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isImpersonating: false,
  originalAdmin: null,
  originalAdminToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const token = authUtils.getToken()
      const user = authUtils.getUser()
      const isImpersonating = authUtils.isImpersonating()
      const originalAdmin = authUtils.getOriginalAdminUser()
      const originalAdminToken = authUtils.getOriginalAdminToken()

      if (token && user) {
        state.token = token
        state.user = user
        state.isAuthenticated = true
        state.isImpersonating = isImpersonating
        state.originalAdmin = originalAdmin
        state.originalAdminToken = originalAdminToken
      }
      state.isLoading = false
    },
    setAuth: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      if (action.payload.isImpersonating !== undefined) {
        state.isImpersonating = action.payload.isImpersonating
      }
      if (action.payload.originalAdmin !== undefined) {
        state.originalAdmin = action.payload.originalAdmin
      }
      if (action.payload.originalAdminToken !== undefined) {
        state.originalAdminToken = action.payload.originalAdminToken
      }
    },
    clearAuth: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.isImpersonating = false
      state.originalAdmin = null
      state.originalAdminToken = null
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) =>
        action.type === 'api/executeQuery/fulfilled' && action.meta?.arg?.endpointName === 'getProfile',
      (state, action: any) => {
        if (action.payload?.user) {
          const userWithPermissions = {
            ...action.payload.user,
            permissions: action.payload.permissions || [],
          }
          state.user = userWithPermissions
          authUtils.setUser(userWithPermissions)
        }
      },
    )
  },
})

import type { Reducer } from '@reduxjs/toolkit'
export const { initializeAuth, setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer as Reducer<AuthState>
