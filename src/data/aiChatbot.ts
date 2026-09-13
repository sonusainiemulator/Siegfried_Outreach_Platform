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
    // --- 100% Free Models (OpenRouter $0.00 Verified) ---
    { value: 'google/gemma-4-31b-it:free', label: 'Google: Gemma 4 31B [FREE]', isFree: true },
    { value: 'google/gemma-4-26b-a4b-it:free', label: 'Google: Gemma 4 26B A4B [FREE]', isFree: true },
    { value: 'inclusionai/ling-3.0-flash-vl:free', label: 'inclusionAI: Ling 3.0 Flash VL [FREE]', isFree: true },
    { value: 'inclusionai/ling-3.0-flash-fin:free', label: 'inclusionAI: Ling 3.0 Flash Fin [FREE]', isFree: true },
    { value: 'inclusionai/ling-3.0-flash-sante:free', label: 'inclusionAI: Ling 3.0 Flash Sante [FREE]', isFree: true },
    { value: 'nex-agi/nex-n2.5-mini:free', label: 'Nex AGI: Nex-N2.5-Mini [FREE]', isFree: true },
    { value: 'nex-agi/nex-n2.5-pro:free', label: 'Nex AGI: Nex-N2.5-Pro [FREE]', isFree: true },
    { value: 'dots-studio/dots-3-note-preview:free', label: 'Dots Studio: Dots3-Note Preview [FREE]', isFree: true },
    { value: 'liquid/lfm-2.5-2.6b:free', label: 'LiquidAI: LFM2.5-2.6B [FREE]', isFree: true },
    { value: 'nvidia/nemotron-3.5-lightning:free', label: 'NVIDIA: Nemotron 3.5 Lightning [FREE]', isFree: true },
    { value: 'nvidia/nemotron-3.5-content-safety:free', label: 'NVIDIA: Nemotron 3.5 Content Safety [FREE]', isFree: true },
    { value: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', label: 'NVIDIA: Nemotron 3 Nano Omni [FREE]', isFree: true },
    { value: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'NVIDIA: Nemotron 3 Super [FREE]', isFree: true },
    { value: 'nvidia/nemotron-3-ultra-550b-a55b:free', label: 'NVIDIA: Nemotron 3 Ultra [FREE]', isFree: true },
    { value: 'poolside/laguna-s-2.1:free', label: 'Poolside: Laguna S 2.1 [FREE]', isFree: true },
    { value: 'poolside/laguna-xs-2.1:free', label: 'Poolside: Laguna XS 2.1 [FREE]', isFree: true },
    { value: 'thinkingmachines/inkling-small:free', label: 'Thinking Machines: Inkling Small [FREE]', isFree: true },
    { value: 'thinkingmachines/inkling:free', label: 'Thinking Machines: Inkling [FREE]', isFree: true },
    { value: 'cohere/north-mini-code:free', label: 'Cohere: North Mini Code [FREE]', isFree: true },

    // --- DeepSeek (Latest Live Verified) ---
    { value: 'deepseek/deepseek-v4.1-flash', label: 'DeepSeek V4.1 Flash' },
    { value: 'deepseek/deepseek-v4-pro-0813', label: 'DeepSeek V4 Pro 0813' },
    { value: 'deepseek/deepseek-v4-pro', label: 'DeepSeek V4 Pro 0423' },
    { value: 'deepseek/deepseek-v4-flash', label: 'DeepSeek V4 Flash 0423' },
    { value: 'deepseek/deepseek-v4-flash-0731', label: 'DeepSeek V4 Flash 0731' },
    { value: 'deepseek/deepseek-v4-flash-vision-exp', label: 'DeepSeek V4 Flash Vision Exp' },
    { value: 'deepseek/deepseek-v3.2', label: 'DeepSeek V3.2' },
    { value: 'deepseek/deepseek-chat-v3.1', label: 'DeepSeek V3.1' },
    { value: 'deepseek/deepseek-r1-0528', label: 'DeepSeek R1 0528' },
    { value: 'deepseek/deepseek-r1', label: 'DeepSeek R1' },
    { value: 'deepseek/deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill Llama 70B' },
    { value: 'deepseek/deepseek-chat', label: 'DeepSeek V3' },

    // --- Anthropic Claude ---
    { value: 'anthropic/claude-3.7-sonnet', label: 'Claude 3.7 Sonnet' },
    { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { value: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
    { value: 'anthropic/claude-opus-5', label: 'Claude Opus 5' },
    { value: 'anthropic/claude-opus-4.8', label: 'Claude Opus 4.8' },
    { value: 'anthropic/claude-sonnet-4.6', label: 'Claude Sonnet 4.6' },
    { value: 'anthropic/claude-haiku-4.5', label: 'Claude Haiku 4.5' },
    { value: 'anthropic/claude-fable-5.1', label: 'Claude Fable 5.1' },

    // --- OpenAI ---
    { value: 'openai/gpt-4o', label: 'GPT-4o' },
    { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'openai/gpt-4.5-preview', label: 'GPT-4.5 Preview' },
    { value: 'openai/o3-mini', label: 'o3 Mini' },
    { value: 'openai/o1', label: 'o1' },
    { value: 'openai/o1-mini', label: 'o1 Mini' },
    { value: 'openai/gpt-4.1', label: 'GPT-4.1' },

    // --- Google Gemini ---
    { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
    { value: 'google/gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite' },
    { value: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },

    // --- xAI Grok ---
    { value: 'x-ai/grok-4.6', label: 'Grok 4.6' },
    { value: 'x-ai/grok-4.5', label: 'Grok 4.5' },
    { value: 'x-ai/grok-4.3', label: 'Grok 4.3' },
    { value: 'x-ai/grok-2-1212', label: 'Grok 2' },

    // --- Meta Llama ---
    { value: 'meta-llama/llama-4-maverick', label: 'Llama 4 Maverick' },
    { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B Instruct' },
    { value: 'meta-llama/llama-3.1-405b-instruct', label: 'Llama 3.1 405B Instruct' },
    { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B Instruct' },
    { value: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B Instruct' },

    // --- Mistral & Qwen ---
    { value: 'mistralai/mistral-large-2512', label: 'Mistral Large 3 2512' },
    { value: 'mistralai/mistral-medium-3-5', label: 'Mistral Medium 3.5' },
    { value: 'mistralai/ministral-8b-2512', label: 'Ministral 3 8B 2512' },
    { value: 'qwen/qwen3-235b-a22b-2507', label: 'Qwen3 235B A22B Instruct' },
    { value: 'qwen/qwen3-32b', label: 'Qwen3 32B' },
    { value: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B Instruct' },
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

export interface OpenRouterModelOption {
  value: string
  label: string
  isFree?: boolean
  provider?: string
  contextLength?: number
  description?: string
}

export async function fetchLiveOpenRouterModels(apiKey?: string): Promise<{
  freeModels: OpenRouterModelOption[]
  latestModels: OpenRouterModelOption[]
  allModels: OpenRouterModelOption[]
  totalCount: number
  freeCount: number
}> {
  try {
    const headers: Record<string, string> = {}
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    const res = await fetch('/api/ai/openrouter-models', { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.success && data.allModels?.length) {
      return {
        freeModels: data.freeModels || [],
        latestModels: data.latestModels || [],
        allModels: data.allModels || [],
        totalCount: data.totalCount || 0,
        freeCount: data.freeCount || 0,
      }
    }
    throw new Error(data.message || 'Failed')
  } catch (err) {
    const staticModels = (getModels().openrouter || []) as OpenRouterModelOption[]
    const free = staticModels.filter((m) => m.isFree)
    const nonFree = staticModels.filter((m) => !m.isFree)
    return {
      freeModels: free,
      latestModels: nonFree,
      allModels: staticModels,
      totalCount: staticModels.length,
      freeCount: free.length,
    }
  }
}