'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdownMenu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { SidebarHeaderProps } from '@/types'
import { Archive, History, MoreVertical, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SidebarHeader = ({
  activeTab,
  setActiveTab,
  isSelectionMode,
  toggleSelectionMode,
  selectedCount,
  totalItems,
  onSelectAll,
  onBulkDelete,
  canManageChat,
  canManageArchived,
  hasItems,
  onClose,
}: SidebarHeaderProps) => {
  const { t } = useTranslation()
  const direction = useAppDirection()

  if (isSelectionMode) {
    return (
      <div className="flex items-center gap-2 w-full bg-primary/5 p-2 rounded-[8px] border border-primary/20 h-10 shrink-0 mb-4">
        <Checkbox
          checked={selectedCount === totalItems && totalItems > 0}
          onChange={(checked) => onSelectAll(checked)}
          className="rounded-lg border-primary/20"
        />
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
          {selectedCount} {t('selected', { defaultValue: 'Selected' })}
        </span>

        <div className="ms-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all active:scale-95"
            onClick={onBulkDelete}
            disabled={selectedCount === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-accent/50 transition-all active:scale-95"
            onClick={toggleSelectionMode}
          >
            <X className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg lg991:flex hidden hover:bg-accent/50 transition-all active:scale-95"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between h-10 shrink-0">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-sm text-title-color dark:text-white tracking-tight">
          {activeTab === 'history'
            ? t('recent_history', { defaultValue: 'Recent History' })
            : t('archived_history', { defaultValue: 'Archived History' })}
        </h3>
      </div>
      <div className="flex items-center gap-1">
        {(canManageChat || canManageArchived) && (
          <DropdownMenu dir={direction}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-[10px] hover:bg-accent/50 transition-all active:scale-95"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-[10px] p-1.5 backdrop-blur-xl border-glass-border">
              <DropdownMenuItem
                onClick={() => setActiveTab(activeTab === 'history' ? 'archive' : 'history')}
                className="rounded-[10px] flex items-center gap-2.5 px-2 py-2 cursor-pointer hover:bg-primary/10! hover:text-primary! transition-all text-xs font-medium"
              >
                <div className="p-1.5 rounded-[10px] bg-primary/5 text-primary">
                  {activeTab === 'history' ? <Archive className="w-3.5 h-3.5" /> : <History className="w-3.5 h-3.5" />}
                </div>
                <span className="flex-1 text-start">
                  {activeTab === 'history'
                    ? t('archived_history', { defaultValue: 'Archived History' })
                    : t('recent_history', { defaultValue: 'Recent History' })}
                </span>
              </DropdownMenuItem>

              {hasItems && canManageChat && activeTab === 'history' && (
                <DropdownMenuItem
                  onClick={toggleSelectionMode}
                  className="rounded-[10px] flex items-center gap-2.5 px-2 py-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-all text-xs font-medium"
                >
                  <div className="p-1.5 rounded-[10px] bg-destructive/5 text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1 text-start">{t('bulk_delete', { defaultValue: 'Bulk Delete' })}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-[10px] lg991:flex hidden hover:bg-accent/50 transition-all active:scale-95"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default SidebarHeader
