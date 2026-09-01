'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { tabHeaderDefaults, tabHeaders } from '@/data/aiChatbot'
import { useAppDirection } from '@/hooks/useAppDirection'
import { ChatbotTabContentProps } from '@/types'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ChannelTab, ConfigureTab, CustomizeTab, EmbedTab, TrainTab } from './tabs'

/**
 * The main card containing all tab content panels + previous/next navigation footer.
 */
export const ChatbotTabContent = ({
  tabs,
  activeTab,
  setActiveTab,
  formData,
  updateFormField,
  qaPairs,
  setQaPairs,
  textContent,
  setTextContent,
  effectiveChatbotId,
  isEditMode,
  isSubmitting,
  canManage,
  onSave,
  onBack,
}: ChatbotTabContentProps) => {
  const { t } = useTranslation()
  const direction = useAppDirection()

  const [activeSource, setActiveSource] = useState<string | null>(null)

  const handleNext = () => {
    if (activeTab === 'configure') {
      if (!formData.category || !formData.provider || !formData.apiKey || !formData.model) {
        toast.error(
          t('fill_required_fields', {
            defaultValue: 'Please fill all required fields (Category, Provider, API Key, Model) before continuing',
          }),
        )
        return
      }
    }

    if (activeTab === 'customize') {
      if (!formData.name) {
        toast.error(
          t('fill_required_fields', { defaultValue: 'Please provide a name for your agent before continuing' }),
        )
        return
      }
    }

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    const nextTabId = tabs[currentIndex + 1]?.id

    if (nextTabId === 'deploy') {
      onSave('deploy')
    } else if (nextTabId) {
      setActiveTab(nextTabId)
    } else {
      onSave()
    }
  }

  const handlePrevious = () => {
    if (activeTab === 'train' && activeSource) {
      setActiveSource(null)
      return
    }

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  const isLastStep = activeTab === tabs[tabs.length - 1].id

  return (
    <Card className={`rounded-border-radius glass-dark-card border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden relative ${activeTab === 'customize' ? 'p-0 bg-transparent border-none! shadow-none!' : 'sm:p-6 p-4'}`}>
      <div className="relative z-10 text-[0.93rem]" dir={direction}>
        {/* Goal Selection */}
        {activeTab === 'configure' && (
          <div className="animate-scale-in">
            <ConfigureTab formData={formData} updateFormField={updateFormField} />
          </div>
        )}

        {/* Train */}
        {activeTab === 'train' && (
          <div className="animate-scale-in">
            <TrainTab
              qaPairs={qaPairs}
              setQaPairs={setQaPairs}
              textContent={textContent}
              setTextContent={setTextContent}
              activeSource={activeSource}
              setActiveSource={setActiveSource}
            />
          </div>
        )}

        {/* Customize */}
        {activeTab === 'customize' && (
          <div className="animate-scale-in">
            {/* Specialized layout handled within CustomizeTab */}
            <CustomizeTab formData={formData} updateFormField={updateFormField} />
          </div>
        )}

        {/* Deploy (Combined Embed & Channel) */}
        {activeTab === 'deploy' && (
          <div className="animate-scale-in space-y-6">
            <Tabs defaultValue="embed" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-xl grid-cols-2 bg-muted/20 p-2 rounded-[12px] h-12">
                  <TabsTrigger
                    value="embed"
                    className="rounded-[10px] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    {t('website_embed', { defaultValue: 'Website embed' })}
                  </TabsTrigger>
                  <TabsTrigger
                    value="channels"
                    className="rounded-[10px] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    {t('channels', { defaultValue: 'Channels' })}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="embed" className="animate-scale-in">
                <div className="bg-card/40 sm:p-6 p-0 rounded-border-radius border border-border/20">
                  <EmbedTab chatbotId={effectiveChatbotId || null} />
                </div>
              </TabsContent>

              <TabsContent value="channels" className="animate-scale-in">
                <div className="bg-card/40 sm:p-6 p-0 rounded-border-radius border border-border/20">
                  <ChannelTab
                    formData={formData}
                    updateFormField={updateFormField}
                    chatbotId={effectiveChatbotId || null}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="sm:p-6 p-4 pb-0! flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-border/20 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="rounded-[8px] bg-light-gray hover:bg-primary hover:text-white dark:text-white text-light-text-color font-medium sm:h-12 h-10 px-6 w-full sm:w-auto"
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </Button>

          {activeTab !== 'configure' && (
            <Button
              variant="ghost"
              className="rounded-[8px] font-medium btn-color text-white hover:text-white gap-2 px-6 sm:h-12 h-10 text-sm w-full sm:w-auto"
              onClick={handlePrevious}
            >
              <ArrowLeft className="h-4 w-4" />
              {t('previous', { defaultValue: 'Previous' })}
            </Button>
          )}
        </div>

        <div className="w-full sm:w-auto">
          <Button
            variant="secondary"
            className="btn-color text-white rounded-[8px] px-8 font-medium gap-2 sm:h-12 h-10 transition-all w-full sm:w-auto"
            onClick={handleNext}
            disabled={isSubmitting || (activeTab === 'deploy' && !canManage)}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('saving', { defaultValue: 'Saving...' })}
              </>
            ) : isLastStep ? (
              isEditMode ? (
                t('finish_editing', { defaultValue: 'Finish Changes' })
              ) : (
                t('create_agent_final', { defaultValue: 'Create Agent' })
              )
            ) : (
              <>
                {t('continue', { defaultValue: 'Continue' })}
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

/** Small section headings rendered inside each tab panel */
const TabHeader = ({ tabId }: { tabId: string }) => {
  const { t } = useTranslation()
  const keys = tabHeaders[tabId]
  const defaults = tabHeaderDefaults[tabId]
  if (!keys) return null
  return (
    <div className="mb-8">
      <h3 className="text-xl text-title-color dark:text-white font-medium mb-1">
        {t(keys.title, { defaultValue: defaults.title })}
      </h3>
      <p className="text-subtitle-color text-sm">{t(keys.description, { defaultValue: defaults.description })}</p>
    </div>
  )
}
