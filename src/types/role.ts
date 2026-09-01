
export interface SubmodulePermission {
  id: string
  name: string
  access: 'read' | 'write'
}

export interface ModulePermissions {
  module: string
  submodules: SubmodulePermission[]
}

export interface Permission {
  id: string
  module: string
  submodules: {
    id: string
    name: string
    read: boolean
    write: boolean
  }[]
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: ModulePermissions[]
  permissionCount?: number
  system_reserved?: boolean
  created_at: string
  updated_at: string
}

export interface RoleResponse {
  message: string
  roles: Role[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface PermissionResponse {
  message: string
  permissions: Permission[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface RoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Role>) => void
  role?: Role | null
  isLoading?: boolean
}

export interface AssignPermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (permissions: { submodule: string; access: 'read' | 'write' }[]) => void
  role: Role | null
  isLoading?: boolean
}