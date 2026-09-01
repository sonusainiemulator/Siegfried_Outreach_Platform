import { Bot, Code, Video, FileText, Mail, Megaphone, Mic, Palette, Send, ShieldAlert, Sparkles } from 'lucide-react'

export const creditFields = [
  {
    name: 'free_credits',
    label: 'Welcome Free Credits',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-amber-500',
    isCredit: true,
  },
  {
    name: 'article_generate_credit',
    label: 'AI Blog Writer',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-blue-500',
    isCredit: true,
  },
  {
    name: 'code_generate_credit',
    label: 'AI Codex',
    icon: <Code className="w-5 h-5" />,
    color: 'text-purple-500',
    isCredit: true,
  },
  {
    name: 'analyze_content_credit',
    label: 'AI Detect',
    icon: <ShieldAlert className="w-5 h-5" />,
    color: 'text-primary',
    isCredit: true,
  },
  {
    name: 'speech_text_credit',
    label: 'AI Transcription',
    icon: <Mic className="w-5 h-5" />,
    color: 'text-pink-500',
    isCredit: true,
  },
  {
    name: 'generate_email_credit',
    label: 'Email Generation',
    icon: <Mail className="w-5 h-5" />,
    color: 'text-cyan-500',
    isCredit: true,
  },
  {
    name: 'file_chat_credit',
    label: 'AI File Bot',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-emerald-500',
    isCredit: true,
  },
  {
    name: 'chatbot_creation_limit',
    label: 'AI Bot Studio',
    icon: <Bot className="w-5 h-5" />,
    color: 'text-orange-500',
    isLimit: true,
  },
  {
    name: 'publish_post_per_day_limit',
    label: 'Social Studio',
    icon: <Send className="w-5 h-5" />,
    color: 'text-rose-500',
    isLimit: true,
  },
  {
    name: 'campaign_per_day_limit',
    label: 'Campaign Hub',
    icon: <Megaphone className="w-5 h-5" />,
    color: 'text-rose',
    isLimit: true,
  },
  {
    name: 'ai_rewriter_credit',
    label: 'AI Content Rewriter',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-violet-500',
    isCredit: true,
  },
  {
    name: 'smart_writer_credit',
    label: 'AI Writing Assistant',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-amber-500',
    isCredit: true,
  },
  {
    name: 'avatar_image_credit',
    label: 'AI Avatar Generator',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-indigo-500',
    isCredit: true,
  },
  {
    name: 'avatar_video_credit',
    label: 'AI Talking Avatar Video',
    icon: <Video className="w-5 h-5" />,
    color: 'text-fuchsia-500',
    isCredit: true,
  },
  {
    name: 'presentation_generate_credit',
    label: 'AI Slide Maker',
    icon: <Palette className="w-5 h-5" />,
    color: 'text-violet-500',
    isCredit: true,
  },
]

export const generalResourceLimit = [
  { name: 'document_file_limit', label: 'Document Limit (MB)', icon: '📄' },
  { name: 'audio_file_limit', label: 'Audio Limit (MB)', icon: '🎵' },
  { name: 'video_file_limit', label: 'Video Limit (MB)', icon: '🎬' },
  { name: 'image_file_limit', label: 'Image Limit (MB)', icon: '🖼️' },
  { name: 'multiple_file_share_limit', label: 'Share Limit', icon: '🔗' },
  { name: 'maximum_message_length', label: 'Max Message Length', icon: '✍️' },
  { name: 'session_expiration_days', label: 'Session Expiration (Days)', icon: '⏳' },
  { name: 'session_limit', label: 'Device Login Limit', icon: '📱' },
]

export const emailInstruction = [
  "Choose 'sendmail' for the Mail Driver if you run into problems with SMTP.",
  "Use the Mail Host settings provided by your email service's manual.",
  'Set the Mail port to 587.',
  'If there are issues with TLS, set the Mail Encryption to SSL.',
]

export const emailInstructionSSL = [
  "Again, choose 'sendmail' if there are issues with SMTP.",
  "Use the Mail Host settings provided by your email service's manual.",
  'Set the Mail port to 465.',
  'Set the Mail Encryption to SSL.',
]

export const providers = [
  { label: 'Gemini', value: 'gemini' },
  { label: 'Groq', value: 'groq' },
  { label: 'DeepSeek', value: 'deepseek' },
  { label: 'OpenRouter', value: 'openrouter' },
]