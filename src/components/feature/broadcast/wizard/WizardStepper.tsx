import { cn } from '@/lib/utils'
import { WizardStepperProps } from '@/types'
import { Check } from 'lucide-react'
import React from 'react'

const WizardStepper: React.FC<WizardStepperProps> = ({ steps, activeStep }) => {

  return (
      <div className="flex items-center justify-center m-auto max-w-4xl py-10">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep
          const isActive = index === activeStep
          const isFuture = index > activeStep

          return (
            <React.Fragment key={step}>
              <div
                className={cn(
                  'w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm z-10 shrink-0 transition-all duration-300',
                  isCompleted && 'bg-primary text-white',
                  isActive && 'bg-transparent text-primary border-2 border-primary ',
                  isFuture && 'bg-transparent text-gray-300 border-2 border-gray-200 dark:border-modal-bg-color',
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-current" /> : index + 1}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-[2px] flex-1 mx-2 sm:mx-4 transition-all duration-300',
                    isCompleted ? 'bg-primary ' : 'bg-gray-200 dark:bg-modal-bg-color ',
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
  )
}

export default WizardStepper
