/**
 * Permission constants – single source of truth for all permission names.
 * These names MUST match the submodule `name` values in
 * `pixel-ai/seeders/02-permissionSeeder.js`.
 *
 * Any future rename only needs to happen here (and in the seeder).
 */

// ─── Members ──────────────────────────────────────────────────────────────────
export const PERMISSIONS = {
  // Members
  VIEW_MEMBERS: 'View Members',
  MANAGE_MEMBERS: 'Manage Members',

  // Permissions
  VIEW_ROLES: 'View Roles',
  MANAGE_ROLES: 'Manage Roles',

  // AI Bot Studio
  VIEW_CHATBOTS: 'View Chatbots',
  MANAGE_CHATBOTS: 'Manage Chatbots',
  MANAGE_PROMPTS: 'Manage Prompts',

  // AI Chat Assistant
  VIEW_CHAT_CONVERSATIONS: 'View Chat Conversations',
  MANAGE_CHAT_CONVERSATIONS: 'Manage Chat Conversations',
  MANAGE_ARCHIVED_CHAT_CONVERSATIONS: 'Manage Archived Chat Conversations',

  // Broadcasts
  VIEW_BROADCASTS: 'View Broadcasts',
  MANAGE_BROADCASTS: 'Manage Broadcasts',
  SCHEDULE_BROADCASTS: 'Schedule Broadcasts',
  EMAIL_BROADCAST: 'Email Broadcast',
  WHATSAPP_BROADCAST: 'Whatsapp Broadcast',
  TELEGRAM_BROADCAST: 'Telegram Broadcast',

  // Messages
  REPLY_CONVERSATION: 'Reply Conversation',
  MANAGE_CONVERSATION: 'Manage Conversation',

  // Contacts
  MANAGE_CONTACTS: 'Manage Contacts',
  MANAGE_CONTACT_GROUP: 'Manage Contact Group',
  MANAGE_AUDIENCE: 'Manage Audience',

  // AI Writing Assistant
  GENERATE_CONTENT: 'Generate Content',
  EXPORT_CONTENT: 'Export Content',

  // AI Blog Writer
  GENERATE_ARTICLE: 'Generate Article',
  MANAGE_HISTORY: 'Manage History',

  // AI Content Rewriter
  MANAGE_REWRITING: 'Manage Rewriting',

  // AI Slide Maker
  GENERATE_SLIDE: 'Generate Slide',
  VIEW_SLIDES: 'View Slides',
  DOWNLOAD_SLIDE: 'Download Slide',

  // AI Avatar
  GENERATE_AVATAR: 'Generate Avatar',
  GENERATE_VIDEO_AVATAR: 'Generate Video Avatar',
  VIEW_AVATARS: 'View Avatars',
  DELETE_AVATAR: 'Delete Avatar',

  // Telegram
  VIEW_SUBSCRIBERS: 'View Subscribers',
  MANAGE_SUBSCRIBERS: 'Manage Subscribers',
  VIEW_GROUPS: 'View Groups',
  MANAGE_GROUPS: 'Manage Groups',

  // AI Codex
  GENERATE_CODE: 'Generate Code',
  MANAGE_COMMENTS: 'Manage Comments',
  MANAGE_SETUP_HELP: 'Manage Setup Help',

  // AI Detect
  VERIFY_CONTENT: 'Verify Content',

  // Social Posts
  MANAGE_POSTS: 'Manage Posts',
  SCHEDULED_POSTS: 'Scheduled Posts',

  // AI Transcription
  GENERATE_TEXT_TRANSCRIPTS: 'Generate Text Transcripts',
  DOWNLOAD_RESULTS: 'Download Results',

  // AI File Bot
  VIEW_FILE_CONVERSATIONS: 'View File Conversations',
  MANAGE_FILE_CONVERSATIONS: 'Manage File Conversations',
  MANAGE_ARCHIVED_FILE_CONVERSATIONS: 'Manage Archived File Conversations',

  // App Settings
  VIEW_SETTINGS: 'View Settings',
  MANAGE_SETTINGS: 'Manage Settings',

  // API Keys
  VIEW_API_KEYS: 'View API Keys',
  MANAGE_APIS: 'Manage APIs',

  // Live Agent
  MANAGE_CHANNELS: 'Manage Channels',
  REPLY_QUERIES: 'Reply Queries',
  MANAGE_AGENTS: 'Manage Agents',

  // Plans
  VIEW_PLANS: 'View Plans',
  MANAGE_PLANS: 'Manage Plans',

  // FAQs
  VIEW_FAQS: 'View FAQs',
  MANAGE_FAQS: 'Manage FAQs',

  // Languages
  VIEW_LANGUAGES: 'View Languages',
  MANAGE_LANGUAGES: 'Manage Languages',

  // Inquiries
  VIEW_INQUIRIES: 'View Inquiries',
  MANAGE_INQUIRIES: 'Manage Inquiries',

  // Widget
  VIEW_WIDGET: 'View Widget',
  MANAGE_WIDGET: 'Manage Widget',

  // AI Training
  MANAGE_TRAINING_DATA: 'Manage Training Data',
  VIEW_TRAINING_LOGS: 'View Training Logs',

  // Subscriptions
  VIEW_SUBSCRIPTIONS: 'View Subscriptions',
  MANAGE_SUBSCRIPTIONS: 'Manage Subscriptions',

  // Web Pages
  VIEW_PAGES: 'View Pages',
  MANAGE_PAGES: 'Manage Pages',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
