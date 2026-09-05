'use client'

import { AdminDashboard, UserDashboard } from '@/components/feature/dashboard'
import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePermission } from '@/hooks/usePermission'
import { useGetDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'

const DashboardPage = () => {
  const { t } = useTranslation()
  const { role, isAuthenticated } = usePermission()
  const [timeFilter, setTimeFilter] = useState('this_year')
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })

  const { data: stats, isLoading, isError } = useGetDashboardStatsQuery(
    {
      timeFilter,
      startDate: timeFilter === 'custom' ? date?.from?.toISOString() : undefined,
      endDate: timeFilter === 'custom' ? date?.to?.toISOString() : undefined,
    },
    {
      skip: !isAuthenticated,
    },
  )

  const isPrivileged = role === 'super_admin' || role === 'admin'

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden mb-6">
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl mb-0 font-bold text-title-color dark:text-white title-color">{t('dashboard')}</h1>
        </div>

        <div className="flex items-center gap-3 relative z-20">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[160px] sm:h-12 h-10 glass-card rounded-[8px] focus:ring-0! focus:shadow-[unset]! focus-visible:shadow-[unset]!">
              <SelectValue placeholder={t('select_period')} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-modal-bg-color rounded-[8px] backdrop-blur-3xl">
              <SelectItem value="today">{t('today')}</SelectItem>
              <SelectItem value="this_week">{t('this_week')}</SelectItem>
              <SelectItem value="this_month">{t('this_month')}</SelectItem>
              <SelectItem value="this_year">{t('this_year')}</SelectItem>
              <SelectItem value="custom">{t('custom')}</SelectItem>
            </SelectContent>
          </Select>

          {timeFilter === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={
                    'w-[260px] justify-start text-left font-normal bg-card/10 backdrop-blur-3xl border-white/10 rounded-xl'
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>{t('pick_a_date')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card/90 backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden rounded-2xl" align="end">
                <div>
                  <Calendar
                    autoFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                    className="rounded-md border-0 bg-white dark:bg-black"
                  />
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-card/20 border border-white/5 p-6 space-y-3">
                <div className="h-4 w-20 bg-muted/40 rounded" />
                <div className="h-8 w-16 bg-muted/60 rounded" />
              </div>
            ))}
          </div>
          <div className="h-72 rounded-2xl bg-card/20 border border-white/5 p-6" />
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-destructive font-bold bg-destructive/10 rounded-3xl border border-destructive/20 animate-in fade-in duration-500">
          {t('failed_to_load_dashboard')}
        </div>
      ) : (
        stats && (isPrivileged ? <AdminDashboard stats={stats} /> : <UserDashboard stats={stats} />)
      )}
    </div>
  )
}

export default DashboardPage
