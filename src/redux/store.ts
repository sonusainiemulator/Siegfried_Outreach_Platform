import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from './api/baseApi'
import authReducer from './slices/authSlice'
import layoutReducer from './slices/layoutSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore binary/blob responses in RTK Query actions and state
        ignoredActions: [
          'api/executeQuery/fulfilled',
          'api/executeQuery/pending',
          'api/executeMutation/fulfilled',
          'api/executeMutation/pending',
          '__rtkq/focused',
          '__rtkq/unfocused',
        ],
        ignoredPaths: [
          /api\.queries\..*\.data/,
          /api\.mutations\..*\.data/,
          /__rtkq/,
        ],
      },
    }).concat(baseApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
