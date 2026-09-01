'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { SchedulingOptionsProps } from '@/types/components/socialMedia'
import { format, parse } from 'date-fns'
import { CalendarIcon, Clock, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SchedulingOptions = ({
  isScheduled,
  onScheduleToggle,
  scheduledDate,
  onDateChange,
  scheduledTime,
  onTimeChange,
}: SchedulingOptionsProps) => {
  const { t } = useTranslation()
  return (
    <>
      <div className="space-y-3 flex flex-col">
        <Label className="text-sm font-medium  text-title-color dark:text-white">{t('social_post_scheduler')}</Label>
        <div className="flex gap-2 p-1.5 rounded-[8px] border border-border/20 h-12 md:h-14 glass-dark-card">
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'flex-1 h-full rounded-border-radius text-[12px] md:text-sm font-medium gap-2 transition-all',
              !isScheduled ? 'bg-light-gray text-light-text-color hover:bg-light-gray hover:text-light-text-color' : 'text-muted-foreground ',
            )}
            onClick={() => onScheduleToggle(false)}
          >
            <Zap className={cn('w-3.5 h-3.5 md:w-4 md:h-4', !isScheduled ? 'fill-white' : '')} />
            {t('social_instant')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'flex-1 h-full rounded-border-radius text-[12px] md:text-sm font-medium gap-2 transition-all',
              isScheduled ? 'bg-light-gray text-light-text-color hover:bg-light-gray hover:text-light-text-color' : 'text-muted-foreground ',
            )}
            onClick={() => onScheduleToggle(true)}
          >
            <Clock className={cn('w-3.5 h-3.5 md:w-4 md:h-4', isScheduled ? '' : '')} />
            {t('social_schedule_caps')}
          </Button>
        </div>
      </div>

      {isScheduled && (
        <div className="p-6 rounded-border-radius! glass-dark-card inner-card border border-primary/10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-2 flex flex-col">
            <Label className="text-sm font-medium text-title-color dark:text-white">{t('social_schedule_date_time')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full h-11 md:h-12 justify-start text-left font-normal rounded-[8px] hover:bg-[unset] hover:text-muted-foreground bg-light-gray border-border/30 transition-all px-4',
                    !scheduledDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 md:h-5 md:w-5 text-primary opacity-70" />
                  {scheduledDate ? (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">{format(scheduledDate, 'PPP')}</span>
                      {scheduledTime && <span className="text-sm text-muted-foreground">{format(parse(scheduledTime, 'HH:mm', new Date()), 'hh:mm a')}</span>}
                    </div>
                  ) : (
                    <span className="text-[11px] md:text-xs font-bold">{t('social_select_date_time')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-border/40 bg-light-body dark:bg-modal-bg-color rounded-border-radius overflow-hidden shadow-2xl"
                align="start"
              >
                <div className="p-4 space-y-4">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={onDateChange}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border-0 inner-card glass-dark-card shadow-none!"
                  />
                  <div className="border-t pt-4 space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">{t('social_operational_time')}</Label>
                    <Input
                      type="time"
                      className="h-10 rounded-[8px] bg-white dark:bg-black text-xs font-bold border-border/30 w-full"
                      value={scheduledTime}
                      onChange={(e) => onTimeChange(e.target.value)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </>
  )
}

export default SchedulingOptions
