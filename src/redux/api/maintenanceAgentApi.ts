import { baseApi } from './baseApi'

export interface MaintenanceSchedule {
  _id: string
  websiteId: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  changeTypes: MaintenanceChangeType[]
  approvalMode: 'auto' | 'manual'
  nextRunAt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type MaintenanceChangeType = 'content_update' | 'security_patch' | 'performance' | 'design_refresh' | 'seo_update' | 'backup'

export interface MaintenanceLog {
  _id: string
  websiteId: string
  scheduleId: string
  changeType: MaintenanceChangeType
  title: string
  description: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'rolled_back'
  before?: string
  after?: string
  creditCost: number
  executedAt: string
  canRollback: boolean
}

export const maintenanceAgentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMaintenanceSchedule: builder.query<{ schedule: MaintenanceSchedule | null }, string>({
      query: (websiteId) => `/ai-employees/maintenance-agent/schedule/${websiteId}`,
      providesTags: ['MaintenanceAgent'],
    }),
    setMaintenanceSchedule: builder.mutation<{ schedule: MaintenanceSchedule }, Partial<MaintenanceSchedule>>({
      query: (data) => ({ url: '/ai-employees/maintenance-agent/schedule', method: 'POST', body: data }),
      invalidatesTags: ['MaintenanceAgent'],
    }),
    getMaintenanceLogs: builder.query<{ logs: MaintenanceLog[] }, { websiteId: string; page?: number }>({
      query: (params) => ({ url: '/ai-employees/maintenance-agent/logs', params }),
      providesTags: ['MaintenanceAgent'],
    }),
    rollbackChange: builder.mutation<{ log: MaintenanceLog }, string>({
      query: (logId) => ({ url: `/ai-employees/maintenance-agent/rollback/${logId}`, method: 'POST' }),
      invalidatesTags: ['MaintenanceAgent', 'WebsiteBuilder'],
    }),
    runMaintenanceNow: builder.mutation<{ log: MaintenanceLog }, { websiteId: string; changeType: MaintenanceChangeType }>({
      query: (data) => ({ url: '/ai-employees/maintenance-agent/run-now', method: 'POST', body: data }),
      invalidatesTags: ['MaintenanceAgent', 'AiEmployeeCredits'],
    }),
    pauseMaintenance: builder.mutation<{ message: string }, string>({
      query: (scheduleId) => ({ url: `/ai-employees/maintenance-agent/pause/${scheduleId}`, method: 'POST' }),
      invalidatesTags: ['MaintenanceAgent'],
    }),
  }),
})

export const {
  useGetMaintenanceScheduleQuery,
  useSetMaintenanceScheduleMutation,
  useGetMaintenanceLogsQuery,
  useRollbackChangeMutation,
  useRunMaintenanceNowMutation,
  usePauseMaintenanceMutation,
} = maintenanceAgentApi
