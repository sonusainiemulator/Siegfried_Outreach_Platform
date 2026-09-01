'use client'

import { TableLayoutProps } from '@/types'
import { DataTable } from './DataTable'
import { PageHeader } from './PageHeader'
/**
 * A standardized layout component for pages featuring a header and a data table.
 */
export function TableLayout<T>({
  title,
  subtitle,
  headerIcon,
  primaryAction,
  endContent,
  ...dataTableProps
}: TableLayoutProps<T>) {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="sticky top-0 z-[40]  bg-(--light-body) mb-6">
        <PageHeader
          title={title}
          subtitle={subtitle}
          icon={headerIcon}
          primaryAction={primaryAction}
          endContent={endContent}
        />
      </div>
      <div className="space-y-6 px-0">
        <DataTable {...dataTableProps} />
      </div>
    </div>
  )
}
