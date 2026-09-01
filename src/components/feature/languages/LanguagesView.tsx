'use client'

import { Column } from '@/components/reusable/DataTable'
import { StatusSwitch } from '@/components/reusable/StatusSwitch'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePermission } from '@/hooks/usePermission'
import { cn } from '@/lib/utils'
import { useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import {
  useCreateLanguageMutation,
  useDeleteLanguagesMutation,
  useGetLanguagesQuery,
  useLazyGetTranslationFileQuery,
  useUpdateLanguageMutation,
  useUpdateLanguageStatusMutation,
} from '@/redux/api/languageApi'
import { ApiError } from '@/types/api'
import { Language } from '@/types/language'
import { formatDate } from '@/utils'
import { downloadFile } from '@/utils/download'
import { Calendar, Download, Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LanguageModals } from './ModalContainer'

export const LanguagesView = () => {
  const { t, i18n } = useTranslation()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('Manage Languages', 'write')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [languagesToDelete, setLanguagesToDelete] = useState<string[]>([])

  const { data, isLoading, refetch } = useGetLanguagesQuery({ page, limit, search })

  const [createLanguage, { isLoading: isCreating }] = useCreateLanguageMutation()
  const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation()
  const [updateLanguageStatus] = useUpdateLanguageStatusMutation()
  const [deleteLanguages, { isLoading: isDeleting }] = useDeleteLanguagesMutation()
  const [updateAdminSettings] = useUpdateAdminSettingsMutation()

  const [triggerDownload] = useLazyGetTranslationFileQuery()

  const handleSave = async (formData: FormData) => {
    try {
      if (selectedLanguage) {
        const res = await updateLanguage({ id: selectedLanguage.id, data: formData }).unwrap()
        toast.success(res.message || t('language_updated_successfully'))
      } else {
        const res = await createLanguage(formData).unwrap()
        toast.success(res.message || t('language_created_successfully'))
      }
      await refetch()
      setIsModalOpen(false)
      setSelectedLanguage(null)
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleStatusChange = useCallback(async (lang: Language) => {
    try {
      const res = await updateLanguageStatus({ id: lang.id, status: !lang.is_active }).unwrap()
      toast.success(res.message || t(!lang.is_active ? 'language_activated' : 'language_deactivated'))
      await refetch()
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_status'))
      throw error
    }
  }, [updateLanguageStatus, t, refetch])

  const handleSetDefault = async (lang: Language) => {
    try {
      const res = await updateAdminSettings({ default_language: lang.locale }).unwrap()
      i18n.changeLanguage(lang.locale)
      toast.success(t('default_language_updated') || res.message)
      await refetch()
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_default_language'))
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      const res = await deleteLanguages({ ids: languagesToDelete }).unwrap()
      toast.success(res.message || t('language_deleted_successfully'))
      await refetch()
      setIsDeleteModalOpen(false)
      setLanguagesToDelete([])
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleDownload = async (row: Language) => {
    try {
      const result = await triggerDownload({ locale: row.locale }).unwrap()
      if (result?.translation?.translation_json) {
        const jsonContent = JSON.stringify(result.translation.translation_json, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        downloadFile(url, row.metadata?.fileName || `${row.locale}_translation.json`)
      } else {
        toast.error(t('no_translation_file'))
      }
    } catch (error) {
       const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_download_file'))
    }
  }

  const getLanguageIcon = (row: Language) => {
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || ''
    const flagUrl = row.flag?.startsWith('http')
      ? row.flag
      : row.flag
      ? `${storageUrl.replace(/\/$/, '')}/${row.flag.replace(/^\//, '')}`
      : null

    return (
      <div className="relative h-8 w-8 flex items-center justify-center">
        {flagUrl ? (
          <Image
            src={flagUrl}
            alt={row.name}
            width={30}
            height={30}
            unoptimized
            className="absolute inset-0 w-30 h-5 object-cover shadow-sm z-10 rounded-[2px]!"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.visibility = 'hidden'
            }}
          />
        ):
          <span className="text-2xl grayscale-[0.2] hover:grayscale-0 transition-all cursor-default overflow-hidden shrink-0 rounded-[8px]!">
          {row.emoji || '🌐'}
        </span>
        }
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
          <div className="grayscale-[0.2] hover:grayscale-0 transition-all cursor-default shrink-0">
            {getLanguageIcon(row)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">{row.name}</span>
              {row.is_default && (
                <Badge className="gap-1.5 px-3 rounded-full border shadow-none bg-amber-50 text-amber-600 border-amber-200 text-[10px] font-bold uppercase tracking-wider">
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
          onToggle={() => handleStatusChange(row)}
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
                'text-primary h-8 w-8 bg-primary/10 hover:text-white hover:bg-primary',
              )}
              onClick={() => handleSetDefault(row)}
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
              className="text-primary h-8 w-8 bg-primary/10 hover:text-white hover:bg-primary"
              onClick={() => handleDownload(row)}
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
                className="text-text-edit h-8 w-8 bg-edit-color/10 hover:text-white hover:bg-edit-color"
                onClick={() => {
                  setSelectedLanguage(row)
                  setIsModalOpen(true)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white "
                disabled={row.is_default}
                onClick={() => {
                  setLanguagesToDelete([row.id])
                  setIsDeleteModalOpen(true)
                }}
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
    <>
      <TableLayout
        title={t('languages_management')}
        subtitle={t('manage_languages_desc')}
        primaryAction={
          canManage
            ? {
              label: t('add_language'),
              onClick: () => {
                setSelectedLanguage(null)
                setIsModalOpen(true)
              },
              icon: <Plus className="w-5 h-5" />,
            }
            : undefined
        }
        columns={columns}
        data={data?.data?.pages || []}
        currentPage={page}
        totalPages={data?.data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t('no_languages_found')}
        enableSelection={canManage}
        onBulkDelete={async (rows) => {
          const ids = rows.filter((r) => !r.is_default).map((r) => r.id)
          if (ids.length === 0) {
            toast.error(t('cannot_delete_default_language'))
            return
          }
          try {
            const res = await deleteLanguages({ ids }).unwrap()
            toast.success(res.message || t('languages_deleted_successfully'))
            await refetch()
          } catch (error) {
             const apiError = error as ApiError
            toast.error(apiError?.data?.message || t('something_went_wrong'))
          }
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val)
          setPage(1)
        }}
        searchPlaceholder={t('search_languages')}
      />

      <LanguageModals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onSave={handleSave}
        onDeleteConfirm={handleDeleteConfirm}
        isSaving={isCreating || isUpdating}
        isDeleting={isDeleting}
      />
    </>
  )
}
