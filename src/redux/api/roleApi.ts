import { PermissionResponse, Role, RoleResponse } from '@/types/role';
import { baseApi } from './baseApi'

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleResponse, any>({
      query: (params) => ({
        url: '/role',
        params,
      }),
      providesTags: ['Role'],
    }),
    createRole: builder.mutation<any, Partial<Role>>({
      query: (body) => ({
        url: '/role/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation<any, { id: string; data: Partial<Role> }>({
      query: ({ id, data }) => ({
        url: `/role/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),
    deleteRoles: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: '/role/delete',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Role'],
    }),
    getPermissions: builder.query<PermissionResponse, any>({
      query: (params) => ({
        url: '/permission',
        params,
      }),
      providesTags: ['Permission'],
    }),
    getRoleById: builder.query<{ message: string; role: Role }, string>({
      query: (id) => ({
        url: `/role/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Role' as const, id }],
    }),
    assignPermissions: builder.mutation<any, { id: string; permissions: any[] }>({
      query: ({ id, permissions }) => ({
        url: `/role/${id}/assign-permissions`,
        method: 'PUT',
        body: { permissions },
      }),
      invalidatesTags: ['Role'],
    }),
  }),
})

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRolesMutation,
  useGetPermissionsQuery,
  useGetRoleByIdQuery,
  useAssignPermissionsMutation,
} = roleApi
