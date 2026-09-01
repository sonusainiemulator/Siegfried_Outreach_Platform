'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { ViewBroadcastModal } from '@/components/reusable/ViewBroadcastModal'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useDeleteCampaignMutation, useGetCampaignsQuery } from '@/redux/api/campaignApi'
import { ApiError, Campaign } from '@/types'
import { format } from 'date-fns'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const CampaignsPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const canManage = hasPermission(PERMISSIONS.EMAIL_BROADCAST, 'write') || hasPermission(PERMISSIONS.MANAGE_BROADCASTS, 'write')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  const { data, isLoading } = useGetCampaignsQuery(
    {
      page,
      limit,
      search: debouncedSearch,
      channel: 'email',
      sort_by: sortColumn,
      sort_order: sortOrder,
    },
    {
      pollingInterval: 5000,
    },
  )

  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation()

  const handleEdit = (campaign: Campaign) => {
    router.push(`${ROUTES.CAMPAIGN_HUB.BROADCASTS.EMAIL}/${campaign.id}`)
  }

  const handleView = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsViewModalOpen(true)
  }

  const handleDelete = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedCampaign) return

    try {
      const res = await deleteCampaign(selectedCampaign.id).unwrap()
      toast.success(res.message || t('campaign_deleted_successfully'), { richColors: true })
      setIsDeleteModalOpen(false)
      setSelectedCampaign(null)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_campaign'), { richColors: true })
    }
  }

  const handleBulkDelete = async (selectedCampaigns: Campaign[]) => {
    const ids = selectedCampaigns.map((c) => c.id)
    try {
      const res = await deleteCampaign(ids).unwrap()
      toast.success(res.message || t('campaigns_deleted_successfully'), { richColors: true })
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_campaigns'), { richColors: true })
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const columns: Column<Campaign>[] = [
    {
      header: t('campaign_name'),
      accessorKey: 'name',
      sortable: true,
      className: 'font-medium xl1199:min-w-[200px] min-w-[150px]',
    },
    {
      header: t('campaign_subject'),
      accessorKey: 'subject',
      sortable: true,
      cell: (campaign) => (
        <span className="line-clamp-1" title={campaign.subject}>
          {campaign.subject}
        </span>
      ),
      className: 'xl1199:min-w-[250px] min-w-[200px]',
    },
    {
      header: t('status'),
      accessorKey: 'status',
      sortable: true,
      cell: (campaign) => {
        const status = campaign?.status || 'draft'

        const getStatusStyles = () => {
          switch (status) {
            case 'completed':
            case 'published':
              return 'bg-primary/10 text-primary border border-primary/20'
            case 'sending':
              return 'bg-primary/10 text-primary border border-primary/20'
            case 'failed':
              return 'bg-destructive/10 text-destructive border border-destructive/20'
            case 'scheduled':
              return 'bg-primary/10 text-primary border border-primary/20'
            case 'draft':
            default:
              return 'bg-muted text-muted-foreground border border-border'
          }
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusStyles()}`}
          >
            {t(status)}
          </span>
        )
      },
      className: 'xl1199:min-w-[130px] min-w-[100px]',
    },
    {
      header: t('scheduled_at'),
      accessorKey: 'scheduledAt',
      sortable: true,
      sortKey: 'scheduledAt',
      cell: (campaign) => {
        const date = campaign.scheduledAt ? new Date(campaign.scheduledAt) : null
        const isValidDate = date && !isNaN(date.getTime())
        return (
          <span className="text-sm text-muted-foreground">
            {isValidDate ? format(date, 'dd-MM-yyyy hh:mm a') : t('instantly', { defaultValue: 'Instantly' })}
          </span>
        )
      },
      className: 'xl1199:min-w-[180px] min-w-[150px]',
    },
    {
      header: t('actions'),
      cell: (campaign) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-primary/10 hover:text-white text-primary hover:bg-primary"
            onClick={() => handleView(campaign)}
            title={t('view')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {canManage ? (
            <>
              {(campaign.status === 'scheduled' || campaign.status === 'draft') && (
                <Button
                  variant="ghost"
                  size="icon"
                  className=" h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color"
                  onClick={() => handleEdit(campaign)}
                  title={t('edit')}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8  bg-destructive/10  hover:bg-destructive hover:text-white"
                onClick={() => handleDelete(campaign)}
                title={t('delete')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic px-2">{t('view_only')}</span>
          )}
        </div>
      ),
      className: 'xl1199:min-w-[150px] min-w-[120px]',
    },
  ]

  return (
    <>
      <TableLayout
        title={t('email_campaigns')}
        subtitle={t('manage_email_campaigns_desc')}
        primaryAction={
          canManage
            ? {
                label: t('create_campaign'),
                onClick: () => router.push(`${ROUTES.CAMPAIGN_HUB.BROADCASTS.EMAIL}/create`),
                icon: <Plus className="h-4 w-4" strokeWidth={3} />,
              }
            : undefined
        }
        columns={columns}
        data={data?.broadcasts || []}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage={t('no_campaigns_found')}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        enableSelection={canManage}
        onBulkDelete={handleBulkDelete}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_campaigns')}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_campaign_title') || t('delete_confirmation')}
        description={t('delete_campaign_description') || t('delete_confirmation_message')}
        isLoading={isDeleting}
      />

      <ViewBroadcastModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        broadcast={selectedCampaign}
      />
    </>
  )
}

export default CampaignsPage
