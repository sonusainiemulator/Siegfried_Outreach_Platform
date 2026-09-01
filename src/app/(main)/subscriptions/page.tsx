'use client'

import AdminSubscriptions from '@/components/feature/active-plans/AdminSubscriptions'
import UserSubscription from '@/components/feature/active-plans/UserSubscription'
import { useAppSelector } from '@/redux/hooks'

const SubscriptionsPage = () => {
  const user = useAppSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  return (
    <div className="space-y-6">
      {isAdmin ? <AdminSubscriptions /> : <UserSubscription />}
    </div>
  )
}

export default SubscriptionsPage
