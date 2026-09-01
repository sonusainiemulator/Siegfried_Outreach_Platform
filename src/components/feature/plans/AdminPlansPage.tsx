'use client'

import { Column } from '@/components/reusable/DataTable'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { TableLayout } from '@/components/reusable/TableLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import {
  useDeletePlansMutation,
  useGetPlansQuery,
  useSetDefaultPlanMutation
} from '@/redux/api/planApi'
import { ApiError, Plan } from '@/types'
import { CheckCircle2, Package, Pencil, Plus, Star, Trash2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const AdminPlansPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [plansToDelete, setPlansToDelete] = useState<string[]>([])

  const { data: plansResponse, isLoading } = useGetPlansQuery({
    page,
    limit,
    search,
    sort_by: sortColumn,
    sort_order: sortOrder.toUpperCase(),
  })

  const [deletePlans, { isLoading: isDeleting }] = useDeletePlansMutation()
  const [setDefaultPlan] = useSetDefaultPlanMutation()

  const data = plansResponse?.data

  const handleDeleteConfirm = async () => {
    try {
      await deletePlans({ ids: plansToDelete }).unwrap()
      toast.success(t('plans_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setPlansToDelete([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPlan(id).unwrap()
      toast.success(t('default_plan_updated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const columns: Column<Plan>[] = [
    {
      header: t('name'),
      className: 'lg991:min-w-[250px]',
      accessorKey: 'name',
      sortable: true,
      cell: (row: Plan) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-primary/5 text-primary flex items-center justify-center">
            <Package className="w-4 h-4 text-primary  dark:text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-base text-text-color dark:text-white">{row.name}</span>
            <span className="text-sm truncate text-subtitle-color">{row.slug}</span>
          </div>
          {row.is_default && (
            <Badge
              variant="outline"
              className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-[9px] h-4 rounded-md"
            >
              <Star className="w-2.5 h-2.5 mr-1 fill-yellow-600" />
              {t('default')}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: t('price'),
      className: 'lg991:min-w-[135px]',
      accessorKey: 'amount',
      sortable: true,
      cell: (row: Plan) => (
        <div className="flex flex-col">
          {row.plan_type === 'subscription' ? (
            <>
              <span className="font-bold text-sm">
                {row.currency === 'INR' ? '₹' : row.currency === 'EUR' ? '€' : row.currency === 'GBP' ? '£' : '$'}
                {row.amount}
                <span className="text-[10px] text-muted-foreground">/{t('mo')}</span>
              </span>
            </>
          ) : (
            <span className="font-bold text-sm">
              {row.currency === 'INR' ? '₹' : row.currency === 'EUR' ? '€' : row.currency === 'GBP' ? '£' : '$'}
              {row.amount}
              <span className="text-[10px] text-muted-foreground">/{t(row.plan_type)}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      header: t('type'),
      className: 'lg991:min-w-[120px]',
      accessorKey: 'plan_type',
      sortable: true,
      cell: (row: Plan) => (
        <Badge
          variant="outline"
          className="bg-light-gray border-light-border-color text-light-text-color dark:text-white font-medium capitalize"
        >
          {t(row.plan_type || 'subscription')}
        </Badge>
      ),
    },
    {
      header: t('validity'),
      className: 'lg991:min-w-[100px]',
      accessorKey: 'validity_days',
      sortable: true,
      cell: (row: Plan) => (
        <span className="text-sm font-medium">{row.validity_days ? `${row.validity_days} ${t('days')}` : '-'}</span>
      ),
    },
    {
      header: t('status'),
      className: 'lg991:min-w-[150px]',
      accessorKey: 'status',
      sortable: true,
      cell: (row: Plan) => (
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] font-bold rounded-lg px-2 h-6 flex items-center w-max gap-1.5',
            row.status === 'active'
              ? 'bg-green-500/10 text-green-600 border-green-500/20'
              : 'bg-red-500/10 text-red-600 border-red-500/20',
          )}
        >
          {row.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {row.status === 'active' ? t('active') : t('inactive')}
        </Badge>
      ),
    },
    {
      header: t('modules'),
      className: 'lg991:min-w-[115px]',
      accessorKey: 'module_access',
      sortable: true,
      cell: (row: Plan) => (
        <span className="text-xs text-muted-foreground font-medium">
          {row.module_access ? row.module_access.length : 0} {t('modules')}
        </span>
      ),
    },
    {
      header: t('action'),
      className: 'lg991:min-w-[120px]',
      cell: (row: Plan) => (
        <div className="flex items-center gap-2">
          {!row.is_default && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSetDefault(row.id)}
              className="  text-yellow-500 h-8 w-8 bg-yellow-50 hover:bg-yellow-400! dark:bg-[unset] hover:text-white"
              title={t('set_as_default')}
            >
              <Star className="h-4 w-4" />
            </Button>
          )}
           <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`${ROUTES.PLANS}/edit/${row.id}`)}
            className=" h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color"
            title={t('edit')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setPlansToDelete([row.id])
              setIsDeleteModalOpen(true)
            }}
            className="text-destructive h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white"
            title={t('delete')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <TableLayout
        title={t('plans_management')}
        subtitle={t('manage_subscription_plans_and_pricing')}
        primaryAction={{
          label: t('add_plan'),
          onClick: () => router.push(`${ROUTES.PLANS}/create`),
          icon: <Plus className="w-5 h-5" />,
          className: 'hover:bg-primary text-light-text-color dark:text-white',
        }}
        columns={columns}
        data={data?.plans || []}
        currentPage={page}
        totalPages={data?.totalPages || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={(col) => {
          if (sortColumn === col) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
          } else {
            setSortColumn(col)
            setSortOrder('asc')
          }
        }}
        enableSelection={true}
        onBulkDelete={(rows) => {
          const ids = rows.map((r) => r.id)
          deletePlans({ ids })
            .unwrap()
            .then(() => toast.success(t('plans_deleted_successfully')))
            .catch((err) => toast.error(err?.data?.message || t('something_went_wrong')))
        }}
        rowsPerPage={limit}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        showRowsPerPageAtTop={true}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_plans')}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setPlansToDelete([])
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t('delete_plan_title')}
        description={t('delete_plan_description')}
      />
    </>
  )
}

export default AdminPlansPage
