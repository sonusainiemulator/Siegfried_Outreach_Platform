export interface AutoReplyConfig {
  isEnabled: boolean
  triggerKeyword: string[]
  publicMessage: string
  privateMessage: string
}

export interface AutoReplyOptionsProps {
  config: AutoReplyConfig
  onConfigChange: (config: AutoReplyConfig) => void
  disabled?: boolean
  selectedAccounts?: SocialAccount[]
}

export interface SocialPost {
  id: string
  title: string
  content: string
  status: string
  scheduledDateTime?: string
  createdAt: string
  platforms: Array<{
    id: string
    platform: string
    accountName: string
    status?: string
    postId?: string
    postUrl?: string
    url?: string
    error?: string
    publishedAt?: string
  }>
  mediaUrls?: string[]
  postUrl?: string
  publishedUrl?: string
  autoReplyConfig?: AutoReplyConfig
}

export interface SocialAccount {
  id: string
  platform: string
  accountName: string
  profilePicture?: string
  followersCount?: number
}

export interface SocialDashboardStats {
  posts: {
    scheduled: number
    published: number
  }
  followersByPlatform: {
    [key: string]: number
  }
}

export interface EngagementData {
  label: string
  engagement: number
}

export interface PlatformConfig {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor?: string
  borderColor?: string
  description?: string
  features?: string[]
  isAvailable?: boolean
  followers?: string | number
}

export interface CalendarDayPost {
  id: string
  title: string
  content: string
  status: string
  scheduledDateTime?: string
  createdAt: string
  platforms: Array<{
    id: string
    platform: string
    accountName: string
    status?: string
    postId?: string
    postUrl?: string
    url?: string
    link?: string
    error?: string
    publishedAt?: string
  }>
  mediaUrls?: string[]
  postUrl?: string
  publishedUrl?: string
}

export interface PostFormValues {
  title: string
  content: string
  platforms: string[]
  mediaUrls: string
}

export interface PlatformSelectionProps {
  accounts: SocialAccount[]
  selectedPlatforms: string[]
  onTogglePlatform: (accountId: string) => void
  onSelectAllPlatforms?: (accountIds: string[]) => void
  onDeselectAllPlatforms?: () => void
  postTypes?: Record<string, string>
  onChangePostType?: (accountId: string, type: string) => void
}

export interface PostFormProps {
  initialValues: PostFormValues
  onSubmit: (values: PostFormValues) => void
  isLoading: boolean
}

export interface MediaUploadProps {
  previews: string[]
  existingImages: string[]
  onRemovePreview: (index: number) => void
  onRemoveExisting: (index: number) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDropFiles: (files: File[]) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export interface SchedulingOptionsProps {
  isScheduled: boolean
  onScheduleToggle: (isScheduled: boolean) => void
  scheduledDate?: Date
  onDateChange: (date?: Date) => void
  scheduledTime: string
  onTimeChange: (time: string) => void
}

export interface CalendarGridProps {
  currentMonth: Date
  postsByDate: Record<string, CalendarDayPost[]>
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onPostClick: (post: CalendarDayPost) => void
}

export interface CalendarDayProps {
  day: Date
  dayPosts: CalendarDayPost[]
  isCurrentMonth: boolean
  isSelected: boolean
  isToday: boolean
  onClick: () => void
  onPostClick: (post: CalendarDayPost) => void
}

export interface PostModalProps {
  isOpen: boolean
  onClose: () => void
  post: CalendarDayPost | null
  posts?: CalendarDayPost[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export interface DashboardStatsCardsProps {
  stats: {
    thisMonth: number
    scheduled: number
    published: number
  }
}

export interface PlatformCardsProps {
  platforms: DashboardPlatformCardProps[]
}

export interface RecentPostsGridProps {
  posts: SocialPost[]
  onEdit: (id: string, e: React.MouseEvent) => void
  onDelete: (id: string, e: React.MouseEvent) => void
}

export interface ChartControlsProps {
  chartType: 'candlestick' | 'bar' | 'line'
  onChartTypeChange: (type: 'candlestick' | 'bar' | 'line') => void
}

export interface CandlestickChartProps {
  data: EngagementData[]
}

export interface BarChartProps {
  data: EngagementData[]
}

export interface LineChartProps {
  data: EngagementData[]
}

export interface DashboardData {
  stats: {
    totalAccounts?: number
    activeAccounts?: number
    posts: {
      total?: number
      scheduled: number
      published: number
      failed: number
      wordpress?: {
        total: number
        published: number
        scheduled: number
        failed: number
      }
    }
    followersByPlatform: {
      [key: string]: number
    }
  }
  engagementChart: EngagementData[]
  publishedPostsChart: any[]
  recentPosts: SocialPost[]
}

export interface DashboardPlatformCardProps {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  followers: number
  publishedCount?: number
  draftCount?: number
  borderColor?: string
  description?: string
  features?: string[]
  isAvailable?: boolean
}

export interface RecentPostCardProps {
  post: SocialPost
  onEdit: (id: string, e: React.MouseEvent) => void
  onDelete: (id: string, e: React.MouseEvent) => void
  canManage?: boolean
}

export interface ChartControlsProps {
  chartType: 'candlestick' | 'bar' | 'line'
  onChartTypeChange: (type: 'candlestick' | 'bar' | 'line') => void
}

export interface EngagementChartProps {
  data: EngagementData[]
  chartType?: 'candlestick' | 'bar' | 'line'
}

export interface StatsCardsProps {
  stats: DashboardData['stats']
  totalFollowers: number
}


export interface PlatformSelectionProps {
  accounts: SocialAccount[]
  selectedPlatforms: string[]
  onTogglePlatform: (accountId: string) => void
  postTypes?: Record<string, string>
  onChangePostType?: (accountId: string, type: string) => void
}

export interface PostFormValues {
  title: string
  content: string
  platforms: string[]
  mediaUrls: string
}

export interface MediaUploadProps {
  previews: string[]
  existingImages: string[]
  onRemovePreview: (index: number) => void
  onRemoveExisting: (index: number) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDropFiles: (files: File[]) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export interface SchedulingOptionsProps {
  isScheduled: boolean
  onScheduleToggle: (isScheduled: boolean) => void
  scheduledDate?: Date
  onDateChange: (date?: Date) => void
  scheduledTime: string
  onTimeChange: (time: string) => void
}

export interface PostComposerFormData {
  title: string
  content: string
  platforms: string[]
  mediaUrls: string
  autoReplyConfig?: AutoReplyConfig
}

export interface PostComposerProps {
  editId?: string | null
}

export interface PlatformCardProps {
  platform: PlatformConfig
  isConnected: boolean
  isConnecting: boolean
  connectedAccounts: SocialAccount[]
  onConnect: (platformId: string) => void
  onDisconnect: (accountId: string, accountName: string) => void
  onViewAccounts?: () => void
}

export interface PlatformConnectionHeaderProps {
  onNavigateToDashboard: () => void
}

export interface SecurityInfoCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export interface Post {
  id: string
  title: string
  content: string
  status: string
  scheduledDateTime?: string
  createdAt: string
  platforms: Array<{
    id: string
    platform: string
    accountName: string
    status?: string
    postId?: string
    postUrl?: string
    url?: string
    link?: string
    error?: string
    publishedAt?: string
  }>
  mediaUrls?: string[]
  postUrl?: string
  publishedUrl?: string
  autoReplyConfig?: AutoReplyConfig
}

export type NoteCategory = 'idea' | 'reminder' | 'campaign' | 'task' | 'general'

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface CalendarNote {
  id: string
  targetDate: string
  title: string
  content?: string
  category: NoteCategory
  color: string
  checklist: ChecklistItem[]
  isPinned: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CalendarPageHeaderProps {
  onGoToToday: () => void
  onOpenBatchModal?: () => void
  onOpenNewNote?: () => void
}

export interface CalendarHeaderProps {
  currentMonth: Date
  onNavigatePrevious: () => void
  onNavigateNext: () => void
  notesCount?: number
}

export interface CalendarGridProps {
  currentMonth: Date
  calendarDays: Date[]
  postsByDate: Record<string, CalendarDayPost[]>
  notesByDate?: Record<string, CalendarNote[]>
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onPostClick: (post: CalendarDayPost) => void
  onNoteClick?: (note: CalendarNote) => void
  onAddNoteForDate?: (date: Date) => void
}

export interface CalendarStatsProps {
  stats: {
    scheduled: number
    published: number
    thisMonth: number
    failed: number
  }
  notesCount?: number
  onMetricClick?: (type: 'thisMonth' | 'scheduled' | 'published' | 'failed') => void
}

export interface DayPostsSidebarProps {
  selectedDate: Date | null
  posts: CalendarDayPost[]
  notes?: CalendarNote[]
  onPostClick: (post: CalendarDayPost) => void
  onNoteClick?: (note: CalendarNote) => void
  onAddNote?: (date: Date) => void
  onToggleChecklistItem?: (noteId: string, itemId: string, completed: boolean) => void
  onDeleteNote?: (noteId: string) => void
}

export interface FormikProps {
  formik: any
}

export interface DashboardPlatformCardsProps {
  platforms: DashboardPlatformCardProps[]
}

export interface RecentPostsSectionProps {
  recentPosts: any[]
  platforms: DashboardPlatformCardProps[]
  onEdit: (id: string, e: React.MouseEvent) => void
  onDelete: (id: string, e: React.MouseEvent) => void
  canManage?: boolean
}

export interface SelectPagesType {
  id: string
  name: string
  access_token?: string
  picture?: string
  category?: string
  followers_count?: number
  engagement_rate?: string
  metadata?: Record<string, unknown>
}

export interface PostComposerHeaderProps {
  editId?: string | null
  onNavigateToDashboard: () => void
}

export interface PostQueueSummaryProps {
  postsCount: number
  nextPost: SocialPost | undefined
  timeLeft: { h: string; m: string; s: string }
}

export interface PostTimelineItemProps {
  post: SocialPost
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export interface MetricsPostsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  posts: CalendarDayPost[]
  onPostClick: (post: CalendarDayPost) => void
}

export interface ConnectedAccountsModalProps {
  isOpen: boolean
  onClose: () => void
  platform: PlatformConfig
  accounts: SocialAccount[]
  onDisconnect: (accountId: string, accountName: string) => void
}

export interface CarouselSlideItem {
  id: string
  url?: string
  file?: File
  type: 'image' | 'video'
  isExisting?: boolean
  headline?: string
  subheadline?: string
  bulletPoints?: string[]
  imagePrompt?: string
}

export interface AICarouselSlide {
  slideNumber: number
  type: 'cover' | 'content' | 'cta'
  headline: string
  subheadline: string
  bulletPoints: string[]
  imagePrompt?: string
}

export interface AICarouselResult {
  title: string
  hook: string
  caption: string
  hashtags: string[]
  triggerKeyword: string
  autoReplyMessage: string
  slides: AICarouselSlide[]
}

export interface AICarouselGenerationParams {
  topic: string
  platform?: 'instagram' | 'facebook' | 'both'
  slideCount?: number
  tone?: string
  targetAudience?: string
  ctaType?: string
}
