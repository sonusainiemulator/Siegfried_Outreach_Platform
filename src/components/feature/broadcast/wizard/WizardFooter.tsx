import { Button } from '@/components/ui/button'
import { CampaignInput, WizardFooterProps } from '@/types'
import { useFormikContext } from 'formik'
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const WizardFooter: React.FC<WizardFooterProps> = ({
  activeStep,
  totalSteps,
  onNext,
  onBack,
  onSaveDraft,
  isNextDisabled,
  isSubmitting,
}) => {
  const { t } = useTranslation()
  const { values, submitForm } = useFormikContext<CampaignInput>()

  return (
    <div className="flex justify-between p-3 flex-wrap gap-3">
      {activeStep > 0 ? (
        <Button
          size="lg"
          type="button"
          variant="outline"
          className="btn-color sm:h-12 h-10 text-white"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('previous')}
        </Button>
      ) : (
        <div />
      )}

      <div className="flex gap-3">
        {onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="sm:h-12 h-10 border-primary/20 text-black dark:text-white glass-button hover:bg-primary/5"
            onClick={onSaveDraft}
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4" />
            {t('save_draft')}
          </Button>
        )}

        {activeStep === totalSteps - 1 ? (
          <Button
            key="submit-btn"
            type="button"
            disabled={isSubmitting}
            size="lg"
            className="btn-color sm:h-12 h-10 text-white"
            onClick={() => {
              console.log('Send Now button clicked')
              submitForm()
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('creating')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {values.scheduledAt ? t('schedule') : t('send_now')}
              </>
            )}
          </Button>
        ) : (
          <Button
            key="next-btn"
            type="button"
            className="btn-color sm:h-12 h-10 p-button-padding! text-white"
            onClick={(e) => {
              e.preventDefault()
              onNext()
            }}
            disabled={isNextDisabled}
            size="lg"
          >
            {t('next')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default WizardFooter
