'use client'

import Spinner from '@/components/reusable/Spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useGetPermissionsQuery, useGetRoleByIdQuery } from '@/redux/api/roleApi'
import { RolePermissionsFormProps } from '@/types/components/roles'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Info, Loader2, Save, Search, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const RolePermissionsForm = ({ roleId, onSave, isLoading = false }: RolePermissionsFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: permsData, isLoading: isPermsLoading } = useGetPermissionsQuery({ limit: 100 })
  const { data: roleData, isLoading: isRoleLoading } = useGetRoleByIdQuery(roleId, {
    skip: !roleId,
  })

  const [assignedPermissions, setAssignedPermissions] = useState<Record<string, 'read' | 'write'>>({})
  const [initialPermissions, setInitialPermissions] = useState<Record<string, 'read' | 'write'>>({})
  const [searchTerm, setSearchTerm] = useState('')

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
    }
  }, [roleData])

  const allModules = permsData?.permissions || []

  const filteredModules = useMemo(() => {
    return allModules.filter(
      (m) =>
        m.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.submodules?.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [allModules, searchTerm])

  const totalPossiblePermissions = useMemo(() => {
    return allModules.reduce((acc, m) => acc + (m.submodules?.length || 0), 0)
  }, [allModules])

  const totalAssignedPermissions = useMemo(() => {
    return Object.keys(assignedPermissions).length
  }, [assignedPermissions])

  const overallProgress = totalPossiblePermissions > 0 ? (totalAssignedPermissions / totalPossiblePermissions) * 100 : 0

  const isChanged = useMemo(() => {
    const assignedKeys = Object.keys(assignedPermissions)
    const initialKeys = Object.keys(initialPermissions)
    if (assignedKeys.length !== initialKeys.length) return true
    for (const key of assignedKeys) {
      if (assignedPermissions[key] !== initialPermissions[key]) return true
    }
    return false
  }, [assignedPermissions, initialPermissions])

  const handleSetAccess = (module: any, submoduleId: string) => {
    const selectedSub = module.submodules?.find((s: any) => s.id === submoduleId)
    if (!selectedSub) return

    const subName = selectedSub.name.toLowerCase()
    const isView = subName.startsWith('view')

    setAssignedPermissions((prev) => {
      const next = { ...prev }
      const isCurrentlyAssigned = !!prev[submoduleId]
      const allViews = module.submodules?.filter((s: any) => s.name.toLowerCase().startsWith('view')) || []

      if (isCurrentlyAssigned) {
        // Attempting to remove access
        if (isView) {
          // Check if any other submodule in the same module depends on this View
          const context = subName.replace('view', '').trim()
          const hasDependentSubmodule = module.submodules?.some((s: any) => {
            const sName = s.name.toLowerCase()
            if (sName.startsWith('view') || !prev[s.id]) return false
            if (allViews.length === 1) return true
            // Match context for multiple views
            const otherContext = sName.replace('manage', '').replace('edit', '').replace('delete', '').trim()
            return otherContext.includes(context) || context.includes(otherContext)
          })

          if (hasDependentSubmodule) return prev
        }
        delete next[submoduleId]
      } else {
        // Attempting to grant access
        next[submoduleId] = 'write'

        if (!isView) {
          // If we granted something other than a View, auto-select corresponding View
          let viewToSelect = null
          if (allViews.length === 1) {
            viewToSelect = allViews[0]
          } else if (allViews.length > 1) {
            const context = subName.replace('manage', '').replace('edit', '').replace('delete', '').trim()
            viewToSelect = allViews.find((v: any) => {
              const vContext = v.name.toLowerCase().replace('view', '').trim()
              return context.includes(vContext) || vContext.includes(context)
            })
          }

          if (viewToSelect) {
            next[viewToSelect.id] = 'write'
          }
        }
      }
      return next
    })
  }

  const isSubmoduleLocked = (module: any, sub: any) => {
    const subName = sub.name.toLowerCase()
    if (!subName.startsWith('view') || !assignedPermissions[sub.id]) return false

    const allViews = module?.submodules?.filter((s: any) => s.name.toLowerCase().startsWith('view')) || []

    return module?.submodules?.some((s: any) => {
      const sName = s.name.toLowerCase()
      if (sName.startsWith('view') || !assignedPermissions[s.id]) return false
      if (allViews.length === 1) return true

      const vContext = subName.replace('view', '').trim()
      const otherContext = sName.replace('manage', '').replace('edit', '').replace('delete', '').trim()
      return otherContext.includes(vContext) || vContext.includes(otherContext)
    })
  }

  const handleSelectAllSubmodulesInModule = (module: any, isSelect: boolean) => {
    setAssignedPermissions((prev) => {
      const next = { ...prev }
      module.submodules?.forEach((s: any) => {
        if (isSelect) {
          next[s.id] = 'write'
        } else {
          // Careful: removing ALL might be blocked if we do it one by one,
          // but here we are wiping the whole module's assigned permissions.
          delete next[s.id]
        }
      })
      return next
    })
  }

  const handleGlobalSelectAll = (isSelect: boolean) => {
    if (isSelect) {
      const next: Record<string, 'read' | 'write'> = {}
      allModules.forEach((m: any) => {
        m.submodules?.forEach((s: any) => {
          next[s.id] = 'write'
        })
      })
      setAssignedPermissions(next)
    } else {
      setAssignedPermissions({})
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = Object.entries(assignedPermissions).map(([submodule, access]) => ({
      submodule,
      access,
    }))
    await onSave(payload)
  }

  if (isPermsLoading || isRoleLoading) {
    return <Spinner className="h-screen" size="md" />
  }

  return (
    <div className=" space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 inner-card glass-dark-card sm:p-6 p-4 rounded-border-radius border border-glass-border backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-[8px] bg-primary flex items-center justify-center text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-title-color dark:text-white">
              {t('edit_permissions')}
            </h1>
            <Badge
              variant="outline"
              className="mt-1 border-primary/30 text-primary bg-primary/5 font-semibold text-sm px-3"
            >
              {roleData?.role?.name || t('role')}
            </Badge>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex-1 sm:flex-none rounded-[8px] sm:h-12 h-10 bg-light-gray text-light-text-color dark:text-white px-6 font-medium hover:bg-primary hover:text-white transition-all gap-2"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            {t('back')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isChanged}
            className="flex-1 sm:flex-none rounded-[8px] sm:h-12 h-10 px-8 font-medium transition-all hover:scale-105 active:scale-95 gap-2 text-white bg-primary!"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isLoading ? t('saving') : t('save_changes')}
          </Button>
        </div>
      </div>

      {/* Stats and Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 glass-card glass-dark-card sm:p-6 p-4 rounded-border-radius border border-glass-border backdrop-blur-md flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Info className="w-4 h-4" />
              </div>
              <h3 className="text-base font-medium">{t('overall_progress')}</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-primary">{Math.round(overallProgress)}%</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">{t('complete')}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex justify-between text-[12px] font-medium text-muted-foreground mb-1.5">
                <span>
                  {totalAssignedPermissions} {t('active')}
                </span>
                <span>
                  {totalPossiblePermissions - totalAssignedPermissions} {t('remaining')}
                </span>
              </div>
              <div className="h-2.5 bg-muted/20 rounded-full overflow-hidden border border-glass-border">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary-foreground/30"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: 'backOut' }}
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-center justify-center min-w-[60px] p-2 rounded-border-radius bg-primary/5 border border-primary/10">
              <div className="text-xl font-bold leading-none">{totalAssignedPermissions}</div>
              <div className="text-[8px] font-black uppercase text-primary/60 mt-1">{t('permits')}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass-card sm:p-6 p-4 rounded-border-radius glass-dark-card flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('filter_by_module_or_action')}
              className="pl-12 h-12 rounded-[8px] border-none bg-secondary/5 focus:bg-secondary/10 transition-all text-sm ring-0 focus-visible:ring-2 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between p-2.5 px-4 rounded-[8px] bg-secondary/5 border border-glass-border">
            <div className="flex items-center gap-3">
              <Checkbox
                id="global-select-all"
                className="w-4 h-4 border-1"
                checked={
                  allModules.length > 0 &&
                  allModules.every((m: any) => m.submodules?.every((s: any) => assignedPermissions[s.id] === 'write'))
                }
                indeterminate={
                  Object.keys(assignedPermissions).length > 0 &&
                  Object.keys(assignedPermissions).length < totalPossiblePermissions
                }
                onChange={(checked) => handleGlobalSelectAll(checked)}
              />
              <Label
                htmlFor="global-select-all"
                className="text-xs font-bold text-light-text-color cursor-pointer select-none"
              >
                {t('select_all_modules')}
              </Label>
            </div>
            <Badge variant="secondary" className="rounded-lg text-[10px] h-6 text-white">
              {allModules.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid md575:grid-cols-1! xl1570:grid-cols-3 [@media(max-width:980px)_and_(min-width:575px)]:grid-cols-2! lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredModules.map((m, idx) => {
            const total = m.submodules?.length || 0
            const assigned = m.submodules?.filter((s: any) => assignedPermissions[s.id]).length || 0
            const percent = total > 0 ? (assigned / total) * 100 : 0
            const isAllSelected = total > 0 && assigned === total

            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative group"
              >
                <div className="glass-card rounded-border-radius border border-glass-border transition-all duration-500 flex flex-col h-full overflow-hidden bg-white/40 dark:bg-black/20 backdrop-blur-xl">
                  {/* Card Module Progress Top Bar */}
                  <div className="h-1 w-full bg-muted/10 overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full transition-colors duration-500',
                        percent === 100 ? 'bg-emerald-500' : percent > 0 ? 'bg-primary' : 'bg-transparent',
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="sm:p-6 p-4 flex flex-col h-full">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-[8px] flex items-center justify-center transition-all duration-500',
                            percent === 100
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : percent > 0
                                ? 'bg-primary/10 text-primary'
                                : 'bg-light-gray text-light-text-color dark:text-white',
                          )}
                        >
                          <ShieldCheck className={cn('w-6 h-6', percent === 100 && 'animate-pulse')} />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{m.module}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={cn(
                                'text-xs font-medium',
                                percent === 100 ? 'text-emerald-500' : 'text-muted-foreground/60',
                              )}
                            >
                              {assigned} OF {total} {t('enabled')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={assigned > 0 && assigned < total}
                        className="w-5 h-5"
                        onChange={(checked) => handleSelectAllSubmodulesInModule(m, checked)}
                      />
                    </div>

                    {/* Permissions List */}
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 flex-1 content-start">
                      {m.submodules?.map((s: any) => {
                        const isAssigned = !!assignedPermissions[s.id]
                        const isLocked = isSubmoduleLocked(m, s)

                        // Action label cleaning logic:
                        // Extract action by removing module name (handling plural/singular)
                        const baseModule = m.module.toLowerCase().replace(/s$/, '').replace(/ies$/, 'y')
                        let actionLabel = s.name
                          .toLowerCase()
                          .replace(m.module.toLowerCase(), '')
                          .trim()

                        // Fallback if cleaning leaves nothing
                        if (!actionLabel) actionLabel = s.name

                        return (
                          <Button
                            key={s.id}
                            onClick={() => handleSetAccess(m, s.id)}
                            disabled={isLocked}
                            className={cn(
                              'flex items-center justify-start gap-2 px-3 py-3 rounded-border-radius inner-card glass-dark-card transition-all duration-300 text-left relative overflow-hidden group/btn border',
                              isAssigned
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm'
                                : 'bg-secondary/5 border-transparent text-muted-foreground hover:bg-secondary/10 hover:border-glass-border hover:text-foreground',
                              isLocked && 'opacity-50 cursor-not-allowed',
                            )}
                          >
                            <div
                              className={cn(
                                'w-5 h-5 border rounded-[4px] flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm',
                                isAssigned
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-muted-foreground/30 bg-white/50 dark:bg-black/20 group-hover/btn:border-primary group-hover/btn:scale-105',
                              )}
                            >
                              {isAssigned && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[4]" />
                                </motion.div>
                              )}
                            </div>
                            <span className="text-sm text-wrap font-medium opacity-90">
                              {actionLabel}
                            </span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredModules.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 bg-secondary/5 rounded-[2rem] border-2 border-dashed border-glass-border flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{t('no_modules_found')}</h3>
            <p className="text-muted-foreground max-w-xs">
              {t('try_adjusting_your_search_to_find_what_you_are_looking_for')}
            </p>
            <Button variant="link" onClick={() => setSearchTerm('')} className="mt-4 text-primary font-bold">
              {t('clear_search')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RolePermissionsForm
