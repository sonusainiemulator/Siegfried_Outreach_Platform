'use client'

import Spinner from '@/components/reusable/Spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Label from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useGetPermissionsQuery, useGetRoleByIdQuery } from '@/redux/api/roleApi'
import { AssignPermissionsModalProps } from '@/types/role'
import { Loader2, ShieldCheck, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const AssignPermissionsModal: React.FC<AssignPermissionsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  role,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const { data: permsData, isLoading: isPermsLoading } = useGetPermissionsQuery({ limit: 100 })
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleByIdQuery(role?.id || '', {
    skip: !role?.id || !isOpen,
  })

  const [selectedModuleId, setSelectedModuleId] = useState<string>('')
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState<string>('')
  const [selectedAccess, setSelectedAccess] = useState<'read' | 'write'>('read')
  const [assignedPermissions, setAssignedPermissions] = useState<Record<string, 'read' | 'write'>>({})
  const [initialPermissions, setInitialPermissions] = useState<Record<string, 'read' | 'write'>>({})

  useEffect(() => {
    const fetchedRole = roleData?.role
    if (fetchedRole && fetchedRole.permissions) {
      const initial: Record<string, 'read' | 'write'> = {}
      fetchedRole.permissions.forEach((mod: any) => {
        mod.submodules?.forEach((sub: any) => {
          initial[sub.id] = sub.access
        })
      })
      setTimeout(() => {
        setAssignedPermissions(initial)
        setInitialPermissions(initial)
      }, 100)
    } else {
      setTimeout(() => {
        setAssignedPermissions({})
        setInitialPermissions({})
      }, 100)
    }
  }, [roleData, isOpen])

  const isChanged = React.useMemo(() => {
    const assignedKeys = Object.keys(assignedPermissions)
    const initialKeys = Object.keys(initialPermissions)

    if (assignedKeys.length !== initialKeys.length) return true

    for (const key of assignedKeys) {
      if (assignedPermissions[key] !== initialPermissions[key]) return true
    }

    return false
  }, [assignedPermissions, initialPermissions])

  const handleAddPermission = () => {
    if (!selectedSubmoduleId) return
    setAssignedPermissions((prev) => ({
      ...prev,
      [selectedSubmoduleId]: selectedAccess,
    }))
    setSelectedSubmoduleId('')
  }

  const handleRemovePermission = (submoduleId: string) => {
    setAssignedPermissions((prev) => {
      const next = { ...prev }
      delete next[submoduleId]
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isChanged) return
    const payload = Object.entries(assignedPermissions).map(([submodule, access]) => ({
      submodule,
      access,
    }))
    onSave(payload)
  }

  const allModules = permsData?.permissions || []
  const selectedModule = allModules.find((m) => m.id === selectedModuleId)
  const allSubmodules = allModules.flatMap((m) => m.submodules || [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-hidden flex flex-col border-none shadow-2xl bg-light-body border! rounded-border-radius!">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-xl font-medium text-title-color dark:text-white">
                {t('edit_permissions')} <span className="text-primary">{role?.name}</span>
              </DialogTitle>
              <p className="text-subtitle-color font-medium text-sm text-left">
                {t('assign_submodules_and_select_access')}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {isPermsLoading || isRoleLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 glass-card glass-dark-card gap-4 p-4 rounded-border-radius bg-card-color border border-glass-border">
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground mb-2!">
                      {t('module')}
                    </Label>
                    <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                      <SelectTrigger className="h-10 rounded-[10px] bg-background border- glass-card glass-dark-card">
                        <SelectValue placeholder={t('select_module')} />
                      </SelectTrigger>
                      <SelectContent className="bg-light-body rounded-border-radius border-input-border-color focus:shadow-none focus:border-primary">
                        {allModules.map((m) => (
                          <SelectItem className="dark:hover:bg-dark-base!" key={m.id} value={m.id}>
                            {m.module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground mb-2!">
                      {t('submodule')}
                    </Label>
                    <Select
                      value={selectedSubmoduleId}
                      onValueChange={setSelectedSubmoduleId}
                      disabled={!selectedModuleId}
                    >
                      <SelectTrigger className="h-10 rounded-[8px] bg-background glass-card glass-dark-card border-glass-border">
                        <SelectValue placeholder={t('select_submodule')} />
                      </SelectTrigger>
                      <SelectContent className="bg-light-body rounded-border-radius! backdrop-blur-xl border-glass-border">
                        {selectedModule?.submodules?.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground mb-2!">
                      {t('access')}
                    </Label>
                    <Select value={selectedAccess} onValueChange={(val: 'read' | 'write') => setSelectedAccess(val)}>
                      <SelectTrigger className="h-10 rounded-[8px] bg-background border-glass-border  glass-card glass-dark-card  font-medium text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-light-body rounded-border-radius! backdrop-blur-xl border-glass-border">
                        <SelectItem value="read" className="dark:hover:bg-dark-base! font-medium text-sm">
                          {t('read')}
                        </SelectItem>
                        <SelectItem value="write" className="dark:hover:bg-dark-base! font-medium text-sm">
                          {t('write')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex mt-5">
                    <Button
                      type="button"
                      onClick={handleAddPermission}
                      disabled={!selectedSubmoduleId}
                      className="w-full h-11 rounded-[8px] bg-primary text-white transition-all font-bold"
                    >
                      {t('add_permission')}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-primary ">{t('assigned_permissions')}</h3>

                  {Object.keys(assignedPermissions).length === 0 ? (
                    <div className="p-8 text-center rounded-border-radius border glass-card glass-dark-card border-dashed border-glass-border bg-card-color">
                      <p className="text-sm text-muted-foreground">{t('no_permissions_assigned')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-55 overflow-y-auto custom-scrollbar">
                      {Object.entries(assignedPermissions).map(([subId, access]) => {
                        const sub = allSubmodules.find((s) => s.id === subId)
                        return (
                          <div
                            key={subId}
                            className="flex items-center justify-between p-3 pl-4 rounded-border-radius glass-dark-card bg-card border border-glass-border group hover:border-primary transition-all"
                          >
                            <div className="flex flex-col">
                              <span className="text-text-lg font-bold">{sub?.name || 'Unknown'}</span>
                              <span className="text-subtitle-color font-regular text-sm ml-1">
                                {allModules.find((m) => m.submodules?.some((s) => s.id === subId))?.module}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className={cn(
                                  'uppercase tracking-widest text-[10px] font-black px-4 py-1 rounded-[6px]',
                                  access === 'write'
                                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    : 'bg-edit-color border border-border-edit text-text-edit',
                                )}
                              >
                                {t(access)}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemovePermission(subId)}
                                className="h-7 w-7 rounded-[6px] bg-destructive/10 text-destructive border border-border-destructive hover:text-trasperant hover:bg-tranperant transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-input-border-color! bg-card-color w-full! h-11! rounded-[8px] hover:bg-primary hover:text-primary-foreground transition-all font-semibold"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isChanged}
              className="w-full! h-11! rounded-[8px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}...
                </>
              ) : (
                t('save_permissions')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AssignPermissionsModal
