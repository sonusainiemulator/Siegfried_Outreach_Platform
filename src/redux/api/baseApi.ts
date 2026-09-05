import { clearAuth } from '@/redux/slices/authSlice'
import { isBrowser } from '@/utils/environment'
import { authUtils } from '@/utils'
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

const API_BASE_URL = '/api'

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    const token = authUtils.getToken()

    const publicEndpoints = ['getActivePlans', 'getFaqs', 'getPublicSettings']
    if (publicEndpoints.includes(endpoint)) {
      return headers
    }

    if (token && token !== 'undefined' && token !== 'null') {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions)
  const token = authUtils.getToken()

  if (result.error && result.error.status === 401) {
    if (token) {

      authUtils.clearAuth()

      api.dispatch(clearAuth())

      api.dispatch(baseApi.util.resetApiState())
    }

    if (isBrowser) {
      const publicPaths = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/',
        '/mcp',
        '/social-media',
        '/campaign-hub',
      ]
      const pathname = window.location.pathname
      const isPublicPath =
        publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
        pathname.startsWith('/landing')


      if (!isPublicPath && pathname !== '/login') {
        window.location.replace('/login')
      } else if (token) {

        return await baseQuery(args, api, extraOptions)
      }
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Faq',
    'Contact',
    'ContactGroup',
    'Segment',
    'Chatbot',
    'Training',
    'UserSettings',
    'Campaign',
    'AiContent',
    'SocialAccount',
    'SocialPost',
    'ContactInquiry',
    'Conversation',
    'Prompt',
    'AgentChat',
    'AdminSettings',
    'Role',
    'Permission',
    'Plan',
    'Subscription',
    'Language',
    'Notification',
    'Page',
    'Dashboard',
    'TelegramGroup',
    'TelegramSubscriber',
    'CampaignInbox',
    'Tag',
    'McpKey',
    'McpLog',
    'HermesSkill',
    'MetaAds',
    'MetaCampaigns',
    'TikTokAds',
    'TikTokCampaigns',
    'RedditAds',
    'RedditCampaigns',
    'GoogleAds',
    'GoogleCampaigns',
    'CalendarNote',
    'SocialAnalytics',
    'SocialPublishLog'
  ],
  endpoints: () => ({}),
})
