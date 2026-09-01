import { InteractionMessage, TabSectionHeader } from "@/types"
import { TFunction } from "i18next"
import { BookOpen, Facebook, FileJson, FileText, Globe, Instagram, MessageCircle, MessageSquare, Palette, Send, Settings, Share2 } from "lucide-react"

export const getProviders = () => [
  { value: 'openai', label: 'OpenAI' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'custom', label: 'Custom' },
]

export const getModels = () => ({
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  openrouter: [

    { value: 'deepseek/deepseek-chat', label: 'DeepSeek Chat (V3)' },
    { value: 'deepseek/deepseek-r1', label: 'DeepSeek R1' },
    { value: 'deepseek/deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill Llama 70B' },

    { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
    { value: 'anthropic/claude-3-opus', label: 'Claude 3 Opus' },

    { value: 'openai/gpt-4o', label: 'GPT-4o (via OpenRouter)' },
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (via OpenRouter)' },
    { value: 'openai/o1-mini', label: 'o1 Mini' },

    { value: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
    { value: 'google/gemini-flash-1.5', label: 'Gemini 1.5 Flash' },
    { value: 'google/gemini-pro-1.5', label: 'Gemini 1.5 Pro' },

    { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct' },
    { value: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B Instruct' },
    { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B Instruct' },

    { value: 'mistralai/mistral-small-3.1-24b-instruct', label: 'Mistral Small 3.1 24B' },
    { value: 'mistralai/mistral-7b-instruct', label: 'Mistral 7B Instruct' },
    { value: 'mistralai/mixtral-8x7b-instruct', label: 'Mixtral 8x7B Instruct' },

    { value: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B Instruct' },
    { value: 'qwen/qwen-2.5-7b-instruct', label: 'Qwen 2.5 7B Instruct' },
  ],
  gemini: [
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  ],
  anthropic: [
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  ],
  custom: [{ value: 'custom', label: 'Custom Model' }],
})

export const getInteractionTypes = () => [
  { value: 'ai_only', label: 'AI Only' },
  { value: 'human_only', label: 'Human Only' },
  { value: 'hybrid', label: 'Hybrid (AI + Human)' },
]

export const presetColors = [
  '#2CB7C4',
  '#FFA24C',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#0f172a',
]

export const channelTypes = [
  { id: 'telegram', label: 'Telegram', icon: Send, color: 'text-[#0088cc]', bgColor: 'bg-[#0088cc]/10' },
  { id: 'whatsapp', label: 'Whatsapp', icon: MessageCircle, color: 'text-[#25D366]', bgColor: 'bg-[#25D366]/10' },
  { id: 'messenger', label: 'Messenger', icon: Facebook, color: 'text-[#0084FF]', bgColor: 'bg-[#0084FF]/10' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-[#E4405F]', bgColor: 'bg-[#E4405F]/10' },
]

export const scrollThreshold = 60
export const echoDelay = 1500

export const getInitialMessages = (welcomeMessage: string | undefined, t: TFunction): InteractionMessage[] => [
  {
    id: '1',
    role: 'bot',
    text: welcomeMessage || t('default_welcome_message', { defaultValue: 'Hello! How can I help you today?' }),
    timestamp: '10:24 AM',
  },
  {
    id: '2',
    role: 'user',
    text: t('preview_user_message', { defaultValue: 'I need some assistance.' }),
    timestamp: '10:25 AM',
  },
  {
    id: '3',
    role: 'bot',
    text: t('preview_bot_response', { defaultValue: 'Sure, I am here to help you.' }),
    timestamp: '10:25 AM',
  },
]

export const tabHeaders: Record<string, TabSectionHeader> = {
  configure: { title: 'what_should_bot_do', description: 'pick_goal_desc' },
  train: { title: 'knowledge_base', description: 'train_desc' },
  customize: { title: 'appearance', description: 'customize_desc' },
  deploy: { title: 'deployment', description: 'deploy_desc' },
}

export const tabHeaderDefaults: Record<string, TabSectionHeader> = {
  configure: {
    title: 'What should your bot do?',
    description: 'Pick a goal and we’ll set everything up for you — model, prompt, and defaults.',
  },
  train: { title: 'Knowledge Base', description: 'Train your agent with custom Q&A pairs and documents' },
  customize: { title: 'Appearance', description: 'Fine-tune the visual look and feel of your bot' },
  deploy: { title: 'Deployment', description: 'Integrate your chatbot into your website or connect to messaging apps' },
}

export const radiusOptions = ['4px', '8px', '12px', '16px', '24px']

export const categories = [
  {
    id: 'personal_assistant',
    title: 'Personal Assistant',
    description: 'Manage tasks, reminders, emails, and daily activities',
    icon: '🧑‍💼',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    id: 'learning_education',
    title: 'Learning & Education',
    description: 'Teach concepts, answer questions, and help with studies',
    icon: '📚',
    color: 'bg-green-500/10 text-green-500',
    badge: 'Most used',
  },
  {
    id: 'personal_development',
    title: 'Personal Development',
    description: 'Improve habits, mindset, productivity, and self-growth',
    icon: '🌱',
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    id: 'technical_support',
    title: 'Technical Support',
    description: 'Fix issues, debug code, and provide tech assistance',
    icon: '🛠️',
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    description: 'Games, fun chats, storytelling, and creative content',
    icon: '🎮',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    id: 'custom',
    title: 'Custom',
    description: 'Build your own AI with custom behavior and rules',
    icon: '⚙️',
    color: 'bg-slate-500/10 text-slate-500',
  },
]
export const SOURCES = [
  { id: 'text', title: 'Text Content', description: 'Paste raw text, documents, or articles', icon: FileJson, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { id: 'qa', title: 'Q&A Pairs', description: 'Create specific question and answer sets', icon: MessageSquare, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  { id: 'website', title: 'Website URL', description: 'Crawl your website for knowledge', icon: Globe, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { id: 'pdf', title: 'PDF Files', description: 'Upload PDF documents for training', icon: FileText, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
]

export const getSteps = (t: TFunction) => [
  { id: 'configure', label: t('goal', { defaultValue: 'Goal' }), color: 'bg-blue-500', icon: Settings },
  { id: 'train', label: t('train', { defaultValue: 'Train' }), color: 'bg-orange-500', icon: BookOpen },
  { id: 'customize', label: t('customize', { defaultValue: 'Customize' }), color: 'bg-primary', icon: Palette },
  { id: 'deploy', label: t('deploy', { defaultValue: 'Deploy' }), color: 'bg-purple-500', icon: Share2 },
]