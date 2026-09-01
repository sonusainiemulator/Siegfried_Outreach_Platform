'use client'

import PlanForm from '@/components/feature/plans/PlanForm'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useGetPlansQuery, useUpdatePlanMutation } from '@/redux/api/planApi'
import { ApiError, Plan } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const EditPlanPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = useParams()
  
  const { data: plansResponse, isLoading: isFetching } = useGetPlansQuery({
    page: 1,
    limit: 1000,
  })
  
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation()

  const plan = plansResponse?.data?.plans?.find((p: Plan) => p.id === id)

  const handleUpdatePlan = async (planData: Partial<Plan>) => {
    try {
      if (!id) return
      await updatePlan({ id: id as string, data: planData }).unwrap()
      toast.success(t('plan_updated_successfully'))
      router.push(ROUTES.PLANS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  if (isFetching) {
    return <Spinner size="md" />
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h2 className="text-2xl font-bold">{t('plan_not_found')}</h2>
        <Button onClick={() => router.push(ROUTES.PLANS)} className="text-primary hover:underline font-bold">
          {t('back_to_plans')}
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <PlanForm plan={plan} onSave={handleUpdatePlan} isLoading={isUpdating} />
    </div>
  )
}

export default EditPlanPage
