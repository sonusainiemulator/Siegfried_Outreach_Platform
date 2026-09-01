'use client'

import { Column, DataTable } from '@/components/reusable/DataTable'
import { StatusSwitch } from '@/components/reusable/StatusSwitch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Language, LanguageTableProps } from '@/types'
import { formatDate } from '@/utils'
import { Calendar, Download, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'


export const LanguageTable = ({
  data,
  page,
  totalPages,
  onPageChange,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onDownload,
  onSetDefault,
  onBulkDelete,
  canManage,
  limit,
  onLimitChange,
  search,
  onSearchChange,
}: LanguageTableProps) => {
  const { t } = useTranslation()

  const getLanguageIcon = (row: Language) => {
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || ''
    const flagUrl = row.flag?.startsWith('http')
      ? row.flag
      : row.flag
      ? `${storageUrl.replace(/\/$/, '')}/${row.flag.replace(/^\//, '')}`
      : null

    return (
      <div className="relative h-8 w-8 flex items-center justify-center">
        {flagUrl && (
          <Image
            src={flagUrl}
            alt={row.name}
            width={24}
            height={24}
            unoptimized
            className="absolute inset-0 w-full h-full object-cover rounded-sm shadow-sm z-10"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.visibility = 'hidden'
            }}
          />
        )}
        <span className="text-2xl grayscale-[0.2] hover:grayscale-0 transition-all cursor-default overflow-hidden shrink-0">
          {row.emoji || '🌐'}
        </span>
      </div>
    )
  }

  const columns: Column<Language>[] = [
    {
      header: t('lang_label'),
      accessorKey: 'name',
      sortable: true,
      className: 'min-w-[200px]',
      cell: (row: Language) => (
        <div className="flex items-center gap-4">
          <div className="text-2xl grayscale-[0.2] hover:grayscale-0 transition-all cursor-default">
            {getLanguageIcon(row)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">{row.name}</span>
              {row.is_default && (
                <Badge className="h-4 text-[9px] px-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-md font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                  {t('default')}
                </Badge>
              )}
            </div>
            <span className="text-sm text-subtitle-color font-medium">{row.locale}</span>
          </div>
        </div>
      ),
    },
    {
      header: t('status'),
      accessorKey: 'is_active',
      className: 'min-w-[100px]',
      cell: (row: Language) => (
        <StatusSwitch
          isActive={row.is_active}
          canManage={canManage}
          disabled={row.is_default}
          onToggle={() => onStatusChange(row)}
        />
      ),
    },
    {
      header: t('created_at'),
      accessorKey: 'created_at',
      sortable: true,
      className: 'min-w-[150px]',
      cell: (row: Language) => (
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="whitespace-nowrap">{formatDate(row.created_at)}</span>
        </div>
      ),
    },
    {
      header: t('actions'),
      className: 'text-right min-w-[200px]',
      cell: (row: Language) => (
        <div className="flex items-center gap-2">
          {canManage && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-7 w-7 rounded-[6px] text-black transition-all',
              )}
              onClick={() => onSetDefault(row)}
              disabled={row.is_default}
              title={t('set_as_default')}
            >
              <ShieldCheck className="h-4 w-4" />
            </Button>
          )}

          {row.translation_json && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-[6px] text-black transition-all"
              onClick={() => onDownload(row)}
              title={t('download_translation')}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}

          {canManage ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-[6px] text-black transition-all "
                onClick={() => onEdit(row)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7  text-destructive "
                disabled={row.is_default}
                onClick={() => onDelete(row.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground italic px-2">{t('view_only')}</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        emptyMessage={t('no_languages_found')}
        enableSelection={canManage}
        onBulkDelete={onBulkDelete}
        rowsPerPage={limit}
        onRowsPerPageChange={onLimitChange}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('search_languages')}
      />
    </div>
  )
}
