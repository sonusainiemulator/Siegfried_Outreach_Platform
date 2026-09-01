import { ROUTES } from '@/constants/routes'
import { useGetChatbotByIdQuery, useUpdateChatbotMutation, useCreateChatbotMutation } from '@/redux/api/chatbotApi'
import { useUpdateTrainingDataMutation } from '@/redux/api/trainingApi'
import {
  ApiError,
  ChatbotFormData,
  defaultChatbotAppearance,
  defaultChatbotConfig,
  QAPair,
  TextContent,
  UseChatbotFormOptions,
} from '@/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const useChatbotForm = ({ chatbotId, isEditing, onBack }: UseChatbotFormOptions) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { data: chatbotData } = useGetChatbotByIdQuery(chatbotId!, { skip: !chatbotId })
  const [createChatbot, { isLoading: isCreating }] = useCreateChatbotMutation()
  const [updateChatbot, { isLoading: isUpdating }] = useUpdateChatbotMutation()
  const [updateTrainingData] = useUpdateTrainingDataMutation()

  const [formData, setFormData] = useState<ChatbotFormData>({
    name: '',
    description: '',
    apiKey: '',
    provider: 'openai',
    model: defaultChatbotConfig.model,
    temperature: defaultChatbotConfig.temperature,
    maxTokens: defaultChatbotConfig.maxTokens,
    interactionType: 'ai_only',
    persona: 'default',
    welcomeMessage: t('default_welcome_message'),
    errorMessage: t('default_error_message'),
    category: 'All',
    primaryColor: defaultChatbotAppearance.primaryColor,
    secondaryColor: defaultChatbotAppearance.secondaryColor,
    textColor: defaultChatbotAppearance.textColor,
    backgroundColor: defaultChatbotAppearance.backgroundColor,
    inputBackgroundColor: defaultChatbotAppearance.inputBackgroundColor,
    buttonColor: defaultChatbotAppearance.buttonColor,
    borderRadius: defaultChatbotAppearance.borderRadius,
    avatar: defaultChatbotAppearance.avatar,
    avatarUrl: '',
  })

  const [qaPairs, setQaPairs] = useState<QAPair[]>([])
  const [textContent, setTextContent] = useState<TextContent[]>([])
  const [createdChatbotId, setCreatedChatbotId] = useState<string | null>(null)

  const [initialData, setInitialData] = useState<{
    formData: ChatbotFormData
    qaPairs: QAPair[]
    textContent: TextContent[]
  }>({
    formData: { ...formData },
    qaPairs: [],
    textContent: [],
  })

  const isDirty =
    JSON.stringify(formData) !== JSON.stringify(initialData.formData) ||
    JSON.stringify(qaPairs) !== JSON.stringify(initialData.qaPairs) ||
    JSON.stringify(textContent) !== JSON.stringify(initialData.textContent) ||
    formData.avatar !== initialData.formData.avatar

  const effectiveChatbotId = chatbotId || createdChatbotId
  const isEditMode = isEditing || !!createdChatbotId
  const isSubmitting = isCreating || isUpdating

  // Populate form when editing
  useEffect(() => {
    if (chatbotData?.agent) {
      const bot = chatbotData.agent
      const loadedFormData: ChatbotFormData = {
        name: bot.name,
        description: bot.description,
        apiKey: bot?.apiKey || '',
        provider: bot.provider,
        model: bot.config?.model || defaultChatbotConfig.model,
        temperature: bot.config?.temperature || defaultChatbotConfig.temperature,
        maxTokens: bot.config?.maxTokens || defaultChatbotConfig.maxTokens,
        interactionType: bot.interactionType,
        persona: bot.persona || 'default',
        welcomeMessage: bot.welcomeMessage,
        errorMessage: bot.errorMessage,
        primaryColor: bot.appearance?.primaryColor || defaultChatbotAppearance.primaryColor,
        secondaryColor: bot.appearance?.secondaryColor || defaultChatbotAppearance.secondaryColor,
        textColor: bot.appearance?.textColor || defaultChatbotAppearance.textColor,
        backgroundColor: bot.appearance?.backgroundColor || defaultChatbotAppearance.backgroundColor,
        inputBackgroundColor: bot.appearance?.inputBackgroundColor || defaultChatbotAppearance.inputBackgroundColor,
        buttonColor: bot.appearance?.buttonColor || defaultChatbotAppearance.buttonColor,
        borderRadius: bot.appearance?.borderRadius || defaultChatbotAppearance.borderRadius,
        avatar: bot.appearance?.avatar || bot.avatar || null,
        avatarUrl: bot.appearance?.avatar || bot.avatar || '',
        messenger: bot.messenger,
        telegram: bot.telegram,
        whatsapp: bot.whatsapp,
        instagram: bot.instagram,
        category: bot.category || 'All',
      }
      const loadedQaPairs = bot.trainingData?.qaPairs || []
      const loadedTextContent = bot.trainingData?.textContent || []

      setTimeout(() => {
        setFormData(loadedFormData)
        setQaPairs(loadedQaPairs)
        setTextContent(loadedTextContent)
        setInitialData({ formData: loadedFormData, qaPairs: loadedQaPairs, textContent: loadedTextContent })
      }, 100)
    }
  }, [chatbotData])

  const updateFormField = <K extends keyof ChatbotFormData>(field: K, value: ChatbotFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  /** Builds the FormData payload (used when an avatar file is attached) */
  const buildFormDataPayload = (id?: string | null) => {
    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('description', formData.description)
    if (formData.apiKey) fd.append('apiKey', formData.apiKey)
    fd.append('provider', formData.provider)
    fd.append('persona', formData.persona)
    fd.append('welcomeMessage', formData.welcomeMessage)
    fd.append('errorMessage', formData.errorMessage)
    fd.append('interactionType', formData.interactionType)
    fd.append('category', formData.category)
    fd.append('config[model]', formData.model)
    fd.append('config[temperature]', String(formData.temperature))
    fd.append('config[maxTokens]', String(formData.maxTokens))
    fd.append('config[topP]', '1')
    fd.append('appearance[primaryColor]', formData.primaryColor)
    fd.append('appearance[secondaryColor]', formData.secondaryColor)
    fd.append('appearance[textColor]', formData.textColor)
    fd.append('appearance[backgroundColor]', formData.backgroundColor)
    fd.append('appearance[inputBackgroundColor]', formData.inputBackgroundColor)
    fd.append('appearance[buttonColor]', formData.buttonColor)
    fd.append('appearance[borderRadius]', formData.borderRadius)
    fd.append('appearance[shadow]', defaultChatbotAppearance.shadow)
    fd.append('appearance[fontFamily]', defaultChatbotAppearance.fontFamily)
    if (formData.avatar instanceof File) fd.append('chatbot_image', formData.avatar)
    if (formData.messenger) fd.append('messenger', JSON.stringify(formData.messenger))
    if (formData.telegram) fd.append('telegram', JSON.stringify(formData.telegram))
    if (formData.whatsapp) fd.append('whatsapp', JSON.stringify(formData.whatsapp))
    if (formData.instagram) fd.append('instagram', JSON.stringify(formData.instagram))
    if (id) fd.append('id', id)
    return fd
  }

  /** Builds the JSON payload (no avatar) */
  const buildJsonPayload = () => ({
    name: formData.name,
    description: formData.description,
    ...(formData.apiKey && { apiKey: formData.apiKey }),
    provider: formData.provider,
    config: {
      model: formData.model,
      temperature: formData.temperature,
      maxTokens: formData.maxTokens,
      topP: 1,
    },
    appearance: {
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      textColor: formData.textColor,
      backgroundColor: formData.backgroundColor,
      inputBackgroundColor: formData.inputBackgroundColor,
      buttonColor: formData.buttonColor,
      borderRadius: formData.borderRadius,
      shadow: defaultChatbotAppearance.shadow,
      fontFamily: defaultChatbotAppearance.fontFamily,
    },
    interactionType: formData.interactionType,
    persona: formData.persona,
    welcomeMessage: formData.welcomeMessage,
    errorMessage: formData.errorMessage,
    category: formData.category,
    messenger: formData.messenger,
    telegram: formData.telegram,
    whatsapp: formData.whatsapp,
    instagram: formData.instagram,
  })

  const handleSave = async (targetTab?: string, setActiveTab?: (tab: string) => void) => {
    try {
      if (!formData.name.trim()) {
        toast.error(t('chatbot_name_required'))
        setActiveTab?.('configure')
        return
      }
      if (!isEditMode && !formData.apiKey.trim()) {
        toast.error(t('api_key_required'))
        setActiveTab?.('configure')
        return
      }

      let savedId = effectiveChatbotId

      if (formData.avatar) {
        const fd = buildFormDataPayload(savedId)
        if (isEditMode && savedId) {
          const res = await updateChatbot({ id: savedId, data: fd as any }).unwrap()
          toast.success(res.message || t('chatbot_updated_successfully', { defaultValue: 'Chatbot updated successfully' }))
        } else {
          const result = await createChatbot(fd as any).unwrap()
          savedId = result.agent.id
          setCreatedChatbotId(savedId)
          toast.success(result.message || t('chatbot_created_successfully', { defaultValue: 'Chatbot created successfully' }))
          const nextStep = targetTab || 'deploy'
          router.replace(`${ROUTES.CHATBOT_BUILDER}/${savedId}?step=${nextStep}`)
        }
      } else {
        const payload = buildJsonPayload()
        if (isEditMode && savedId) {
          const res = await updateChatbot({ id: savedId, data: payload }).unwrap()
          toast.success(res.message || t('chatbot_updated_successfully', { defaultValue: 'Chatbot updated successfully' }))
        } else {
          const result = await createChatbot(payload as any).unwrap()
          savedId = result.agent.id
          setCreatedChatbotId(savedId)
          toast.success(result.message || t('chatbot_created_successfully', { defaultValue: 'Chatbot created successfully' }))
          const nextStep = targetTab || 'deploy'
          router.replace(`${ROUTES.CHATBOT_BUILDER}/${savedId}?step=${nextStep}`)
        }
      }

      if (savedId) {
        await updateTrainingData({
          chatbotId: savedId,
          data: {
            qaPairs: qaPairs.map(({ question, answer }) => ({ question, answer })),
            textContent: textContent.map(({ title, content }) => ({ title, content })),
          },
        }).unwrap()
      }

      setInitialData({
        formData: { ...formData },
        qaPairs: [...qaPairs],
        textContent: [...textContent],
      })

      if (typeof targetTab === 'string') {
        // If we just redirected for a new chatbot (isEditMode was false but we have a savedId), 
        // we don't call setActiveTab to avoid conflicting redirects.
        if (isEditing || createdChatbotId) {
          setActiveTab?.(targetTab)
        }
      } else {
        onBack()
      }
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong', { defaultValue: 'Something went wrong' }))
    }
  }

  return {
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
  }
}
