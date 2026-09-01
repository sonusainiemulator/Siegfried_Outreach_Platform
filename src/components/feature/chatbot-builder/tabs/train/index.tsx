import { Button } from '@/components/ui/button'
import { SOURCES } from '@/data/aiChatbot'
import { TrainTabProps } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PDFTraining from './PDFTraining'
import QATraining from './QATraining'
import TextTraining from './TextTraining'
import WebsiteTraining from './WebsiteTraining'

const TrainTab = ({ qaPairs, setQaPairs, textContent, setTextContent, activeSource, setActiveSource }: TrainTabProps) => {
  const { t } = useTranslation()

  if (!activeSource) {
    return (
      <div className="space-y-8 animate-scale-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOURCES.map((source) => {
            const Icon = source.icon
            return (
              <div
                key={source.id}
                onClick={() => setActiveSource(source.id)}
                className="cursor-pointer group sm:p-6 p-4 flex gap-2 rounded-border-radius glass-card glass-dark-card transition-all hover:scale-[1.02]"
              >
                <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center mb-4 ${source.bgColor} ${source.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-lg mb-0 text-title-color dark:text-white group-hover:text-primary transition-colors">
                    {t(source.id, { defaultValue: source.title })}
                  </h4>
                  <p className="text-sm text-subtitle-color leading-relaxed line-clamp-2">
                    {source.description}
                  </p>

                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-primary/5 p-6 rounded-border-radius border border-primary/10 text-center">
          <p className="text-sm font-medium text-primary">
            {t('train_hint', { defaultValue: 'Select a data source to build your agent knowledge' })}
          </p>
        </div>
      </div>
    )
  }

  const activeSourceInfo = SOURCES.find(s => s.id === activeSource)!
  const ActiveIcon = activeSourceInfo.icon

  return (
    <div className="space-y-6 animate-fade-in flex flex-col">
      <div className="flex items-center justify-between bg-card/60 p-5 rounded-2xl border border-border/30 mb-2 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeSourceInfo.bgColor} ${activeSourceInfo.color}`}>
            <ActiveIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('training_source', { defaultValue: 'Data Source' })}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
            </div>
            <h4 className="font-bold text-xl text-title-color dark:text-white leading-tight">
              {t(activeSource, { defaultValue: activeSourceInfo.title })}
            </h4>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => setActiveSource(null)}
          className="text-xs font-bold text-primary hover:bg-primary/5 rounded-[8px] h-10 px-4 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('change_source', { defaultValue: 'Change Source' })}
        </Button>
      </div>

      <div className="flex-1 bg-card/20 p-6 rounded-2xl border border-border/10">
        {activeSource === 'text' && <TextTraining textContent={textContent} setTextContent={setTextContent} />}
        {activeSource === 'qa' && <QATraining qaPairs={qaPairs} setQaPairs={setQaPairs} />}
        {activeSource === 'website' && <WebsiteTraining />}
        {activeSource === 'pdf' && <PDFTraining />}
      </div>
    </div>
  )
}

export default TrainTab
