'use client'

import AdminPlansPage from '@/components/feature/plans/AdminPlansPage'
import UserPlans from '@/components/feature/plans/UserPlans'
import { useAppSelector } from '@/redux/hooks'
import { Loader2 } from 'lucide-react'

const PlansRouter = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  return isAdmin ? <AdminPlansPage /> : <UserPlans />
}

export default PlansRouter
