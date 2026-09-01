import { SectionItem } from "@/types/app";
import { CheckCircle2, CircleDashed, Globe, Info, ShieldCheck, Target, Zap } from "lucide-react";

export const features = [
  {
    icon: ShieldCheck,
    color: 'text-emerald-500 bg-emerald-500/10',
    title: 'AES-256 Encryption',
    desc: 'Your keys never touch our logs. They are encrypted before storage and only decrypted at the edge for API calls.',
  },
  {
    icon: Zap,
    color: 'text-orange-500 bg-orange-500/10',
    title: 'Instant Validation',
    desc: 'We perform a silent handshake with providers when you save to ensure your tokens are active and ready.',
  },
  {
    icon: Globe,
    color: 'text-blue-500 bg-blue-500/10',
    title: 'Global Uptime',
    desc: 'Our proxy system automatically handles provider rate limits and connectivity retries for you.',
  },
]


export const sectionItems: SectionItem[] = [
  { label: 'AI Blog Writer', settingKey: 'article_generate_credit', icon: Target, isCredit: true },
  { label: 'AI Bot Studio', settingKey: 'chatbot_builder_limit', icon: CircleDashed, isLimit: true },
  { label: 'AI Codex', settingKey: 'code_generate_credit', icon: Zap, isCredit: true },
  { label: 'AI File Bot', settingKey: 'file_chat_credit', icon: Info, isCredit: true },
  { label: 'Speech to Text', settingKey: 'speech_text_credit', icon: Target, isCredit: true },
  { label: 'Broadcast Limit', settingKey: 'broadcast_limit', icon: CheckCircle2, isLimit: true },
  { label: 'Social Post', settingKey: 'publish_post_per_day_limit', icon: Globe, isLimit: true },
  { label: 'AI Content Rewriter', settingKey: 'ai_rewriter_credit', icon: Zap, isCredit: true },
  { label: 'AI Slide Maker', settingKey: 'presentation_generate_credit', icon: Zap, isCredit: true },
  { label: 'Generate Email', settingKey: 'generate_email_credit', icon: Zap, isCredit: true },
  { label: 'AI Transcription', settingKey: 'analyze_content_credit', icon: Info, isCredit: true },
  { label: 'AI Writting Assistant', settingKey: 'smart_writer_credit', icon: Target, isCredit: true },
]