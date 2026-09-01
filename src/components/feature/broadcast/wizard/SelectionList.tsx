import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scrollArea'
import { SelectionListProps } from '@/types'
import { Plus, Search } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const SelectionList: React.FC<SelectionListProps> = ({
  title,
  items,
  selectedIds = [],
  onSelectionChange,
  emptyMessage,
  selectionLabel,
  showSearch = true,
  searchPlaceholder,
  actionLabel,
  onAction,
}) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggle = (id: string | number) => {
    const currentIds = selectedIds || []
    const newIds = currentIds.includes(id) ? currentIds.filter((itemId) => itemId !== id) : [...currentIds, id]
    onSelectionChange(newIds)
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredItems.map((i) => i.id))
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{title}</Label>
      </div>
      <Card className="border-2 glass-dark-card inner-card overflow-hidden">
        <div className="p-3 space-y-3 border-b  inner-card glass-dark-card">
          <div className="flex items-center gap-2">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder || t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            )}
            {onAction && (
              <Button variant="outline" size="sm" onClick={onAction} className="h-9 gap-1 whitespace-nowrap glass-dark-card">
                <Plus className="h-4 w-4" />
                {actionLabel}
              </Button>
            )}
          </div>

          {filteredItems && filteredItems.length > 0 && (
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
              onClick={handleToggleSelectAll}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                  className="pointer-events-none"
                />
                <span className="text-sm font-medium">{t('select_all', { defaultValue: 'Select All' })}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedIds?.length || 0} {selectionLabel}
              </p>
            </div>
          )}
        </div>

        <ScrollArea className="h-64">
          <div className="py-2">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleToggle(item.id)}
                >
                  <Checkbox
                    checked={selectedIds?.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                    className="pointer-events-none"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.description && <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {searchTerm ? t('no_results_found') : emptyMessage}
              </p>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

export default SelectionList
