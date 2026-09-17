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
  { label: 'Gemini (Google DeepMind)', value: 'gemini' },
  { label: 'Gemini Omni Flash (Multimodal & Voice)', value: 'gemini-omni' },
  { label: 'Groq (Ultra-Fast Llama 3.3)', value: 'groq' },
  { label: 'DeepSeek (V3 & R1 Reasoning)', value: 'deepseek' },
  { label: 'OpenRouter (Multi-Model Hub)', value: 'openrouter' },
]

export const videoProviders = [
  { label: 'Seedance 2.0 (Realistic Physics & Fight Choreography)', value: 'seedance' },
  { label: 'Kling Video 3.0 Pro (Multi-Shot Sequencing & 6 Cuts)', value: 'kling' },
  { label: 'Google Veo 3.1 (Photorealistic People & Native Audio)', value: 'veo' },
  { label: 'MiniMax Hailuo 2.3 (Product Shots & Expressive Motion)', value: 'hailuo' },
  { label: 'Higgsfield AI (Cinematic Camera & DoP Controls)', value: 'higgsfield' },
  { label: 'HeyGen Video SDK (Talking Avatars & Lip-Sync)', value: 'heygen' },
  { label: 'Remotion Engine (Kinetic Reels & Typography)', value: 'remotion' },
]

export const voiceProviders = [
  { label: 'ElevenLabs (Ultra-Realistic Voices & Cloning)', value: 'elevenlabs' },
  { label: 'HeyGen Neural Voice Engine', value: 'heygen' },
]

export const imageProviders = [
  { label: 'DALL-E 3 & GPT-4o Image (OpenAI)', value: 'dall-e-3' },
  { label: 'Google Imagen 3.0 Ultra', value: 'imagen' },
  { label: 'Stable Diffusion 3.5 & SDXL', value: 'stable-diffusion' },
]

export const elevenlabsModelOptions = [
  { label: 'Eleven Multilingual v2 (Best Quality & Accents)', value: 'eleven_multilingual_v2' },
  { label: 'Eleven Turbo v2.5 (Ultra Low Latency)', value: 'eleven_turbo_v2_5' },
  { label: 'Eleven Flash v2.5 (Fastest & Cost-Efficient)', value: 'eleven_flash_v2_5' },
]

export const seedanceModelOptions = [
  { label: 'Seedance 2.0 Pro (Photorealistic Physics & Choreography)', value: 'seedance-2.0-pro' },
  { label: 'Seedance 2.0 Ultra (4K Master & Ref Handling)', value: 'seedance-2.0-ultra' },
]

export const klingModelOptions = [
  { label: 'Kling Video 3.0 Pro (Multi-Shot 6 Camera Cuts)', value: 'kling-v3.0-pro' },
  { label: 'Kling Video 2.1 Master (Cinematic Physics)', value: 'kling-v2.1-master' },
]

export const veoModelOptions = [
  { label: 'Google Veo 3.1 Cinema (Native Audio & Photorealism)', value: 'veo-3.1-cinema' },
  { label: 'Google Veo 3.1 Fast (High Speed Iteration)', value: 'veo-3.1-fast' },
]

export const geminiOmniModelOptions = [
  { label: 'Gemini 2.0 Flash Omni (Ultra Fast Multimodal & Audio)', value: 'gemini-2.0-flash' },
  { label: 'Gemini 2.0 Flash Realtime (Live Low-Latency Stream)', value: 'gemini-2.0-flash-realtime' },
  { label: 'Gemini 1.5 Flash 8B (Highest Economy & Throughput)', value: 'gemini-1.5-flash-8b' },
]

export const hailuoModelOptions = [
  { label: 'MiniMax Hailuo 2.3 Turbo (Expressive Character Motion)', value: 'hailuo-2.3-turbo' },
  { label: 'MiniMax Hailuo 01 Director (Product Shots & High Fidelity)', value: 'hailuo-01-director' },
]

export const higgsfieldModelOptions = [
  { label: 'Higgsfield Cinematic-1 (Dynamic Camera Controls)', value: 'higgsfield-cinematic-1' },
  { label: 'Higgsfield DoP Studio (Camera Motion & Orbit/Pan)', value: 'higgsfield-dop-studio' },
]