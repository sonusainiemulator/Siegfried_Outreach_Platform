export interface RolePermissionsFormProps {
  roleId: string
  onSave: (permissions: { submodule: string; access: 'read' | 'write' }[]) => Promise<void>
  isLoading?: boolean
}