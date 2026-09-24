'use client'

import { useAppSelector } from '@/redux/hooks'
import { authUtils } from '@/utils'

export const usePermission = () => {
  const { user, isAuthenticated: authStateAuthenticated } = useAppSelector((state) => state.auth)
  const isAuthenticated = authStateAuthenticated || authUtils.isAuthenticated()
  const userPermissions = user?.permissions || []
  let userRole = user?.role || 'user'

  // If role is an ObjectId or unexpected string, normalize to 'user'
  if (userRole !== 'super_admin' && userRole !== 'admin' && userRole !== 'agent' && userRole !== 'assigner') {
    userRole = 'user'
  }

  const hasPermission = (permissionName: string, type: 'read' | 'write' = 'read') => {
    if (userRole === 'super_admin') return true
    
    // API Keys are essential for all users - granting default access
    if (permissionName === 'View API Keys' || permissionName === 'Manage APIs' || permissionName === 'Generate Avatar' || permissionName === 'View Avatars' || permissionName === 'Generate Video Avatar' || permissionName === 'Delete Avatar') return true
    
    for (const mod of userPermissions) {
      const sub = mod.submodules.find(s => s.name === permissionName)
      if (sub) {
        return type === 'write' ? sub.write : (sub.read || sub.write)
      }
    }
    return false
  }

  const hasAnyPermission = (permissionNames: string[], type: 'read' | 'write' = 'read') => {
    if (userRole === 'super_admin') return true
    return permissionNames.some(p => hasPermission(p, type))
  }

  const hasAllPermissions = (permissionNames: string[], type: 'read' | 'write' = 'read') => {
    if (userRole === 'super_admin') return true
    return permissionNames.every(p => hasPermission(p, type))
  }

  const isAdmin = () => userRole === 'admin' || userRole === 'super_admin'
  const isAgent = () => userRole === 'agent'
  const isAssigner = () => userRole === 'assigner'

  return {
    user,
    isAuthenticated,
    permissions: userPermissions,
    role: userRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isAgent,
    isAssigner
  }
}
