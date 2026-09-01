import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RowsPerPageSelectorProps } from '@/types'
import React from 'react'

export const RowsPerPageSelector: React.FC<RowsPerPageSelectorProps> = ({ rowsPerPage, onRowsPerPageChange }) => {

  return (
    <div className="flex items-center gap-2">
      <Select value={rowsPerPage?.toString() || '10'} onValueChange={(value) => onRowsPerPageChange(parseInt(value))}>
        <SelectTrigger className="h-10 w-[60px] shadow-none inner-card glass-dark-card rounded-[8px] bg-light-body text-sm font-medium focus:ring-0 cursor-pointer">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent className="bg-light-body rounded-[8px] border-glass-border">
          {[10, 25, 50, 100].map((pageSize) => (
            <SelectItem key={pageSize} value={pageSize.toString()} className="text-xs font-medium rounded-[8px] hover:bg-light-primary">
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
