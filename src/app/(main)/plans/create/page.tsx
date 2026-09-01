'use client'

import PlanForm from '@/components/feature/plans/PlanForm'
import { ROUTES } from '@/constants/routes'
import { useCreatePlanMutation } from '@/redux/api/planApi'
import { ApiError, Plan } from '@/types'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const CreatePlanPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [createPlan, { isLoading }] = useCreatePlanMutation()

  const handleCreatePlan = async (planData: Partial<Plan>) => {
    try {
      await createPlan(planData).unwrap()
      toast.success(t('plan_created_successfully'))
      router.push(ROUTES.PLANS)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  return (
    <div >
      <PlanForm onSave={handleCreatePlan} isLoading={isLoading} />
    </div>
  )
}

export default CreatePlanPage
