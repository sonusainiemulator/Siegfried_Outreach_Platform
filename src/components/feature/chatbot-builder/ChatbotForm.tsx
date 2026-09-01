'use client'

import { getSteps } from '@/data/aiChatbot'
import { usePermission } from '@/hooks/usePermission'
import { ChatbotFormProps } from '@/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChatbotForm } from '../../../utils/useChatbotForm'
import { ChatbotFormHeader } from './ChatbotFormHeader'
import { ChatbotPreviewPanel } from './ChatbotPreviewPanel'
import { ChatbotTabContent } from './ChatbotTabContent'

const ChatbotForm = ({ chatbotId, onBack, isEditing }: ChatbotFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { hasPermission } = usePermission()

  const canManage = hasPermission('Manage Chatbots', 'write')
  const [activeTab, setActiveTab] = useState(searchParams.get('step') || 'configure')

  const steps = getSteps(t)

  useEffect(() => {
    const currentStep = searchParams.get('step')
    if (currentStep && currentStep !== activeTab) {
      setTimeout(() => {
        setActiveTab(currentStep)
      }, 100)
    }
  }, [searchParams])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const params = new URLSearchParams(searchParams.toString())
    params.set('step', tabId)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const {
    formData,
    updateFormField,
    qaPairs,
    setQaPairs,
    textContent,
    setTextContent,
    effectiveChatbotId,
    isEditMode,
    isSubmitting,
    isDirty,
    handleSave,
  } = useChatbotForm({ chatbotId: chatbotId ?? undefined, isEditing, onBack })

  // Only show preview in step 3 (customize) and 4 (deploy)
  const showPreview = activeTab === 'customize' || activeTab === 'deploy'

  return (
    <div className="min-h-full space-y-8 animate-fade-in flex flex-col">
      <ChatbotFormHeader
        name={formData.name}
        isEditMode={isEditMode}
        onBack={onBack}
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        canManage={canManage}
        onSave={() => handleSave(undefined, handleTabChange)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation & Form Section */}
        <div
          className={
            showPreview && activeTab !== 'customize'
              ? 'xl1570:col-span-12 xl:col-span-8 space-y-6'
              : 'lg:col-span-12 space-y-6'
          }
        >
          <ChatbotTabContent
            tabs={steps}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            formData={formData}
            updateFormField={updateFormField}
            qaPairs={qaPairs}
            setQaPairs={setQaPairs}
            textContent={textContent}
            setTextContent={setTextContent}
            effectiveChatbotId={effectiveChatbotId}
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            canManage={canManage}
            onSave={(targetTab?: string) => handleSave(targetTab, handleTabChange)}
            onBack={onBack}
          />
        </div>

        {/* Live Preview Panel - only show in deploy step now, customize will have its own integrated preview */}
        {activeTab === 'deploy' && <ChatbotPreviewPanel formData={formData} />}
      </div>

    </div>
  )
}

export default ChatbotForm
