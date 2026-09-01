'use client'

import AdminPayments from '@/components/feature/payments/AdminPayments'
import { useAppSelector } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'

const PaymentsPage = () => {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  return (
    <div className="space-y-6">
      {isAdmin ? <AdminPayments /> : <div className="p-8 text-center text-zinc-500">{t('access_restricted')}</div>}
    </div>
  )
}

export default PaymentsPage
