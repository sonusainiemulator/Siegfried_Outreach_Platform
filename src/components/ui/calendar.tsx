'use client'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { buttonVariants } from './button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'p-4 bg-white dark:bg-(--card-color) rounded-lg shadow-xl border dark:border-(--card-border-color)',
        className,
      )}
      classNames={{
        months: 'flex flex-col sm:flex-row',
        month: 'space-y-4',
        month_caption: 'flex justify-center pt-1 relative items-center h-10 mb-2',
        caption_label: 'text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 absolute left-3 top-3 z-10 rounded-lg border-slate-200 dark:border-slate-700',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 absolute right-3 top-3 z-10 rounded-lg border-slate-200 dark:border-slate-700',
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex justify-between mb-4 px-1',
        weekday:
          'text-slate-400 dark:text-slate-500 rounded-md w-9 font-black text-[10px] uppercase text-center shrink-0 tracking-tighter',
        week: 'flex w-full mt-1.5 justify-between px-0.5',
        day: 'h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center rounded-lg transition-all focus-within:relative focus-within:z-20 cursor-pointer',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-bold aria-selected:opacity-100 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-300 w-full h-full flex items-center justify-center rounded-[8px] transition-all',
        ),
        range_start: 'bg-primary! text-white! hover:bg-primary hover:text-white [&_button]:text-white!',
        range_end: 'bg-primary! text-white! hover:bg-primary hover:text-white [&_button]:text-white!',
        selected: 'bg-primary/20 text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white rounded-[8px]! [&_button]:text-primary',
        today:
          'bg-slate-100/50 text-primary dark:bg-primary/10 dark:text-primary-light font-black ring-1 ring-primary/20',
        outside: 'text-slate-300 dark:text-slate-700 opacity-40',
        disabled: 'text-slate-300 dark:text-slate-700 opacity-40',
        range_middle: 'bg-primary/10 text-primary font-bold [&_button]:text-primary',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4 text-primary" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
