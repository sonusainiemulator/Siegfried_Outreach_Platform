import {
  Camera,
  ThumbsUp,
  BriefcaseBusiness,
  Bird,
  Video,
  PlaySquare,
  MessageCircle,
  Share2,
  Pin,
  Bot,
  Zap,
  Calendar,
  BarChart3,
  MessageSquare,
  Sparkles,
  Layers,
  FileText,
  Key,
  ShieldCheck,
  Cpu,
  Terminal,
  Code2,
  Workflow,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export const mcpNavLinks = [
  { name: 'Capabilities', href: '#capabilities' },
  { name: 'Platforms', href: '#platforms' },
  { name: '28 Tools', href: '#tools' },
  { name: 'AI Clients', href: '#clients' },
  { name: 'Playground', href: '#playground' },
  { name: 'Workflows', href: '#workflows' },
  { name: 'Comparison', href: '#comparison' },
  { name: 'FAQ', href: '#faq' },
]

export const mcpPlatforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    gradient: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    bgGrad: 'from-[#833ab4]/15 via-[#fd1d1d]/15 to-[#fcb045]/15',
    badgeText: 'Official Graph API',
    description: 'Publish feed posts, carousels, Reels, and stories from your AI prompts. Read post comments and automate direct message replies with ManyChat-style keyword triggers.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: true,
      comments: true,
      dms: true,
    },
    supportedFormats: ['Feed Post (Image/Video)', 'Carousel (up to 10 slides)', 'Reels (9:16 Video)', 'Auto-Reply DMs'],
    examplePrompt: 'Create a 5-slide visual carousel breaking down AI agent workflows, design the cards, and publish to my Instagram profile.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    gradient: 'from-[#0A66C2] to-[#004182]',
    bgGrad: 'from-[#0A66C2]/15 to-[#004182]/15',
    badgeText: 'Official v2 API',
    description: 'Publish rich text posts, carousel document PDF slideshows, thought-leadership articles, and image posts directly to LinkedIn personal profiles or Company Pages.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: true,
      comments: false,
      dms: false,
    },
    supportedFormats: ['Text Post', 'Document / PDF Carousel', 'Single & Multi-Image', 'Company Page Updates'],
    examplePrompt: 'Write a high-retention thought leadership post on autonomous social media marketing and publish to LinkedIn.',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    color: '#1DA1F2',
    gradient: 'from-[#1DA1F2] to-[#0d7abf]',
    bgGrad: 'from-[#1DA1F2]/15 to-[#0d7abf]/15',
    badgeText: 'Official v2 API',
    description: 'Publish single tweets, threaded stories, high-contrast infographics, and quote tweets with full rate limit management and async media processing.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: true,
      comments: true,
      dms: true,
    },
    supportedFormats: ['Single Tweets (280 chars)', 'Multi-Tweet Threads', 'Media Tweets (JPG/PNG/MP4)', 'Quote Tweets'],
    examplePrompt: 'Turn this blog post into a punchy 6-tweet thread with hook, core takeaways, and CTA, then schedule for tomorrow 9 AM.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#00F2FE',
    gradient: 'from-[#00F2FE] to-[#4FACFE]',
    bgGrad: 'from-[#00F2FE]/15 to-[#4FACFE]/15',
    badgeText: 'Official Content Posting API',
    description: 'Upload high-definition short-form vertical videos and photo slideshows to TikTok with tailored hashtags and sound titles directly from AI scripts.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: false,
      comments: false,
      dms: false,
    },
    supportedFormats: ['Vertical Video (9:16 MP4)', 'Photo Carousel Slideshow', 'Caption & Hashtags', 'Privacy Levels'],
    examplePrompt: 'Upload this generated vertical reel to TikTok with trending hashtags for AI creators and schedule for peak engagement.',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    gradient: 'from-[#FF0000] to-[#B20000]',
    bgGrad: 'from-[#FF0000]/15 to-[#B20000]/15',
    badgeText: 'Official YouTube Data v3 API',
    description: 'Publish full-length videos and YouTube Shorts directly to your channel with automated titles, SEO descriptions, tags, and category assignment.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: true,
      comments: true,
      dms: false,
    },
    supportedFormats: ['YouTube Shorts (Vertical)', 'Full-Length Video (16:9)', 'SEO Metadata & Tags', 'Video Comments'],
    examplePrompt: 'Upload this 45-second clip as a YouTube Short with title, description, and tags #AI #TechTrends.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    gradient: 'from-[#1877F2] to-[#0C5FCC]',
    bgGrad: 'from-[#1877F2]/15 to-[#0C5FCC]/15',
    badgeText: 'Official Graph API',
    description: 'Publish Page posts, photos, carousels, and Facebook Reels. Monitor comments and automatically trigger Messenger DMs when fans comment keyword prompts.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: true,
      comments: true,
      dms: true,
    },
    supportedFormats: ['Page Status Posts', 'Photo & Multi-Photo', 'Facebook Reels', 'Messenger DM Automation'],
    examplePrompt: 'Publish an announcement post to my Facebook Page and set an auto-reply DM trigger when people comment INFO.',
  },
  {
    id: 'threads',
    name: 'Threads',
    color: '#999999',
    gradient: 'from-[#666666] to-[#222222]',
    bgGrad: 'from-[#666666]/15 to-[#222222]/15',
    badgeText: 'Official Threads API',
    description: 'Post text updates, conversations, threads, and media to Instagram Threads seamlessly from your AI assistant.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: true,
      comments: false,
      dms: false,
    },
    supportedFormats: ['Text Posts (up to 500 chars)', 'Multi-Thread Sequences', 'Image & Video Attachments'],
    examplePrompt: 'Publish this discussion topic to Threads and cross-post the opening takeaway to X.',
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    color: '#1185FE',
    gradient: 'from-[#1185FE] to-[#0055B3]',
    bgGrad: 'from-[#1185FE]/15 to-[#0055B3]/15',
    badgeText: 'Official AT Protocol',
    description: 'Post updates, threads, and images directly to the decentralized Bluesky network with instant broadcast.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: true,
      comments: false,
      dms: false,
    },
    supportedFormats: ['Skeets (Posts)', 'Bluesky Threads', 'Image Attachments', 'Faceted Links'],
    examplePrompt: 'Broadcast this product release note to Bluesky with relevant tech tags.',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    color: '#BD081C',
    gradient: 'from-[#BD081C] to-[#800512]',
    bgGrad: 'from-[#BD081C]/15 to-[#800512]/15',
    badgeText: 'Official Pinterest API',
    description: 'Publish Pins and Video Pins to specific Pinterest boards with destination links, titles, and rich descriptions.',
    capabilities: {
      publishing: true,
      scheduling: true,
      analytics: false,
      comments: false,
      dms: false,
    },
    supportedFormats: ['Image Pins', 'Video Pins', 'Board Selection', 'Destination URL Attachment'],
    examplePrompt: 'Create a vertical pin graphic for our latest design tutorial and pin it to my "Design Resources" board with link.',
  },
]

export const mcpToolsCatalog = [
  // Accounts
  {
    name: 'siegfried_get_user',
    alias: 'sig_get_user',
    category: 'Accounts',
    title: 'Get User Profile & Limits',
    description: 'Returns authenticated user info, remaining credits, active plan, and connected accounts breakdown across all 9 platforms.',
    params: [],
    sampleResponse: {
      user: {
        id: 'usr_6a427ef002dedd73',
        name: 'Alex Vance',
        email: 'alex@company.com',
        totalCredits: 5000,
        usedCredits: 140,
        remainingCredits: 4860,
        connectedAccountsCount: 9,
        platforms: { instagram: 2, linkedin: 2, twitter: 2, facebook: 2, tiktok: 1 },
        serverEndpoint: 'https://api.siegfriedoutreach.com/mcp',
      },
    },
  },
  {
    name: 'siegfried_list_accounts',
    alias: 'sig_list_accounts',
    category: 'Accounts',
    title: 'List Connected Accounts',
    description: 'Lists all connected social media accounts with handles, platform identifiers, follower counts, and token status.',
    params: [
      { name: 'platform', type: 'string', required: false, desc: 'Filter by platform (e.g., "instagram", "linkedin", "twitter")' },
    ],
    sampleResponse: {
      total: 9,
      accounts: [
        { id: 'acc_01', platform: 'instagram', accountName: '@growth_matrix', followersCount: 14200, isActive: true },
        { id: 'acc_02', platform: 'linkedin', accountName: 'Alex Vance (Company)', followersCount: 8900, isActive: true },
        { id: 'acc_03', platform: 'twitter', accountName: '@alex_builds', followersCount: 22100, isActive: true },
      ],
    },
  },
  {
    name: 'siegfried_list_pinterest_boards',
    alias: 'sig_list_pinterest_boards',
    category: 'Accounts',
    title: 'List Pinterest Boards',
    description: 'Lists all Pinterest boards for specifying the target board when publishing pins.',
    params: [
      { name: 'accountId', type: 'string', required: false, desc: 'Optional Pinterest social account ID' },
    ],
    sampleResponse: {
      boards: [
        { id: 'board_01', name: 'AI Marketing & Automation', pinCount: 42, privacy: 'PUBLIC' },
        { id: 'board_02', name: 'Visual Inspirations', pinCount: 88, privacy: 'PUBLIC' },
      ],
    },
  },

  // Publishing
  {
    name: 'siegfried_create_post',
    alias: 'sig_create_post',
    category: 'Publishing',
    title: 'Publish / Schedule Multi-Platform Post',
    description: 'Creates and publishes or schedules a post across 1 or more platforms. Supports text, single image, multi-image carousels, reels, videos, shorts, pins, and auto-reply DMs.',
    params: [
      { name: 'content', type: 'string', required: true, desc: 'Post text / caption / body copy' },
      { name: 'title', type: 'string', required: false, desc: 'Internal title / headline' },
      { name: 'mediaUrls', type: 'string[]', required: false, desc: 'Array of media URLs to attach' },
      { name: 'platforms', type: 'object[]', required: false, desc: 'List of target platforms and post types' },
      { name: 'scheduledDateTime', type: 'string', required: false, desc: 'ISO 8601 string for future posting' },
      { name: 'autoReplyConfig', type: 'object', required: false, desc: 'Auto-reply keyword and DM message' },
    ],
    sampleResponse: {
      success: true,
      message: 'Post created and published successfully',
      post: {
        id: 'post_84920491',
        title: 'The Agentic Content Revolution',
        content: 'AI agents are now publishing natively across 9 platforms...',
        status: 'published',
        publishedResults: [
          { platform: 'x', status: 'published', publishedPostId: 'tw_18920491', permalink: 'https://x.com/posts/tw_18920491' },
          { platform: 'linkedin', status: 'published', publishedPostId: 'li_94920492', permalink: 'https://linkedin.com/feed/update/li_94920492' },
        ],
      },
    },
  },
  {
    name: 'siegfried_get_post_status',
    alias: 'sig_get_post_status',
    category: 'Publishing',
    title: 'Get Post Delivery Status',
    description: 'Checks real-time delivery status, live post URLs, errors, and initial engagement for a post.',
    params: [
      { name: 'postId', type: 'string', required: true, desc: 'The post ID to inspect' },
    ],
    sampleResponse: {
      id: 'post_84920491',
      status: 'published',
      platforms: [
        { platform: 'instagram', status: 'published', postId: 'ig_9482019', engagement: { likes: 142, comments: 28 } },
        { platform: 'facebook', status: 'published', postId: 'fb_8492011', engagement: { likes: 88, comments: 12 } },
      ],
    },
  },
  {
    name: 'siegfried_list_posts',
    alias: 'sig_list_posts',
    category: 'Publishing',
    title: 'List Recent Posts',
    description: 'Lists posts with filters by status (published, scheduled, draft, failed), platform, and pagination.',
    params: [
      { name: 'platform', type: 'string', required: false, desc: 'Filter by platform' },
      { name: 'status', type: 'string', required: false, desc: 'published, scheduled, draft, or all' },
      { name: 'limit', type: 'number', required: false, desc: 'Posts per page (default: 20)' },
    ],
    sampleResponse: {
      total: 48,
      page: 1,
      posts: [
        { id: 'p_1', title: '5 AI Tools You Need in 2026', status: 'published', mediaCount: 5, platforms: ['instagram', 'linkedin'] },
        { id: 'p_2', title: 'Why MCP Replaces Scraping', status: 'scheduled', platforms: ['x', 'threads'] },
      ],
    },
  },

  // Content Calendar
  {
    name: 'siegfried_list_schedules',
    alias: 'sig_list_schedules',
    category: 'Content Calendar',
    title: 'List Content Calendar Schedules',
    description: 'Lists all upcoming scheduled posts sorted chronologically for calendar views and autonomous rescheduling.',
    params: [
      { name: 'startDate', type: 'string', required: false, desc: 'ISO start date filter' },
      { name: 'endDate', type: 'string', required: false, desc: 'ISO end date filter' },
      { name: 'platform', type: 'string', required: false, desc: 'Filter by platform' },
    ],
    sampleResponse: {
      total: 14,
      schedules: [
        { id: 'sch_01', title: 'Monday Morning Motivation', scheduledDateTime: '2026-08-17T09:00:00Z', platforms: [{ platform: 'linkedin' }, { platform: 'x' }] },
        { id: 'sch_02', title: 'Wednesday Product Teaser', scheduledDateTime: '2026-08-19T14:30:00Z', platforms: [{ platform: 'instagram' }, { platform: 'tiktok' }] },
      ],
    },
  },
  {
    name: 'siegfried_get_schedule',
    alias: 'sig_get_schedule',
    category: 'Content Calendar',
    title: 'Get Schedule Details',
    description: 'Retrieves full details of a specific scheduled post.',
    params: [
      { name: 'scheduleId', type: 'string', required: true, desc: 'The scheduled post ID' },
    ],
    sampleResponse: {
      id: 'sch_01',
      title: 'Monday Morning Motivation',
      content: 'Here are 3 mindset shifts that 10x output...',
      scheduledDateTime: '2026-08-17T09:00:00Z',
      status: 'scheduled',
    },
  },
  {
    name: 'siegfried_update_schedule',
    alias: 'sig_update_schedule',
    category: 'Content Calendar',
    title: 'Update / Reschedule Post',
    description: 'Modifies scheduled time, copy, media attachments, or target platforms for a scheduled post.',
    params: [
      { name: 'scheduleId', type: 'string', required: true, desc: 'The scheduled post ID to update' },
      { name: 'scheduledDateTime', type: 'string', required: false, desc: 'New scheduled date/time' },
      { name: 'content', type: 'string', required: false, desc: 'Updated text content' },
    ],
    sampleResponse: {
      success: true,
      message: 'Schedule updated successfully',
      schedule: { id: 'sch_01', scheduledDateTime: '2026-08-17T11:00:00Z', status: 'scheduled' },
    },
  },
  {
    name: 'siegfried_delete_schedule',
    alias: 'sig_delete_schedule',
    category: 'Content Calendar',
    title: 'Cancel Scheduled Post',
    description: 'Cancels and removes a scheduled post from the calendar.',
    params: [
      { name: 'scheduleId', type: 'string', required: true, desc: 'The scheduled post ID to delete' },
    ],
    sampleResponse: {
      success: true,
      message: 'Schedule sch_01 cancelled and removed.',
    },
  },

  // Analytics
  {
    name: 'siegfried_list_top_posts',
    alias: 'sig_list_top_posts',
    category: 'Analytics',
    title: 'List Top-Performing Posts',
    description: 'Ranks past posts by engagement, views, likes, comments, and shares to inform automated content iteration loops.',
    params: [
      { name: 'platform', type: 'string', required: false, desc: 'Filter by platform' },
      { name: 'sortBy', type: 'string', required: false, desc: 'engagement, likes, views, comments, shares' },
      { name: 'limit', type: 'number', required: false, desc: 'Number of top posts (default: 10)' },
    ],
    sampleResponse: {
      total: 10,
      rankingCriteria: 'engagement',
      topPosts: [
        { id: 'p_99', title: 'Why AI Agents Are the New Growth Engine', platforms: ['x', 'linkedin'], metrics: { views: 42800, likes: 1890, comments: 245, shares: 310, engagementRate: '5.71%' } },
        { id: 'p_88', title: 'Step-by-step MCP Setup Guide', platforms: ['instagram', 'facebook'], metrics: { views: 31200, likes: 1420, comments: 198, shares: 180, engagementRate: '5.76%' } },
      ],
    },
  },
  {
    name: 'siegfried_get_post_analytics',
    alias: 'sig_get_post_analytics',
    category: 'Analytics',
    title: 'Get Deep Post Analytics',
    description: 'Returns impressions, reach, engagement score, saves, clicks, and per-platform audience interaction breakdown.',
    params: [
      { name: 'postId', type: 'string', required: true, desc: 'The post ID to analyze' },
    ],
    sampleResponse: {
      postId: 'p_99',
      metrics: {
        totalImpressions: 42800,
        totalReach: 36200,
        totalEngagement: 2445,
        engagementRate: '5.71%',
        likes: 1890,
        comments: 245,
        shares: 310,
        saves: 420,
        clicks: 890,
      },
    },
  },

  // Comments
  {
    name: 'siegfried_list_comments',
    alias: 'sig_list_comments',
    category: 'Comments',
    title: 'List Comments',
    description: 'Lists comments on a specific post or across social channels (Instagram, Facebook, YouTube, X).',
    params: [
      { name: 'postId', type: 'string', required: false, desc: 'Post ID to get comments for' },
      { name: 'platform', type: 'string', required: false, desc: 'Platform name' },
    ],
    sampleResponse: {
      postId: 'p_99',
      totalComments: 3,
      comments: [
        { id: 'cm_01', author: 'dev_sarah', text: 'How do I add this MCP to Claude Desktop?', likes: 12 },
        { id: 'cm_02', author: 'growth_alex', text: 'Can this auto-reply DMs on Instagram?', likes: 8 },
      ],
    },
  },
  {
    name: 'siegfried_get_comment',
    alias: 'sig_get_comment',
    category: 'Comments',
    title: 'Get Comment Details',
    description: 'Gets details of an individual comment.',
    params: [
      { name: 'commentId', type: 'string', required: true, desc: 'The comment ID' },
    ],
    sampleResponse: {
      id: 'cm_01',
      author: 'dev_sarah',
      text: 'How do I add this MCP to Claude Desktop?',
      likes: 12,
    },
  },
  {
    name: 'siegfried_post_comment',
    alias: 'sig_post_comment',
    category: 'Comments',
    title: 'Post Comment / Reply',
    description: 'Publishes a comment or reply to an existing comment on Instagram, Facebook, X, or YouTube.',
    params: [
      { name: 'postId', type: 'string', required: true, desc: 'Target post ID' },
      { name: 'message', type: 'string', required: true, desc: 'Comment text to publish' },
      { name: 'commentId', type: 'string', required: false, desc: 'Optional parent comment ID for replies' },
    ],
    sampleResponse: {
      success: true,
      message: 'Comment posted successfully',
      comment: { id: 'cm_new_992', postId: 'p_99', text: 'Just paste https://api.siegfriedoutreach.com/mcp into your Connectors!' },
    },
  },

  // Messages & DMs
  {
    name: 'siegfried_list_conversations',
    alias: 'sig_list_conversations',
    category: 'Messages and DMs',
    title: 'List DM Conversations',
    description: 'Lists active direct message threads across Instagram, Facebook, X, and LinkedIn inboxes.',
    params: [
      { name: 'platform', type: 'string', required: false, desc: 'Filter by platform' },
    ],
    sampleResponse: {
      total: 2,
      conversations: [
        { id: 'conv_01', platform: 'instagram', participant: { name: 'Elena Rostova', handle: '@elena_dev' }, lastMessage: { text: 'Send me the template link please!' } },
      ],
    },
  },
  {
    name: 'siegfried_get_conversation',
    alias: 'sig_get_conversation',
    category: 'Messages and DMs',
    title: 'Get Conversation Thread',
    description: 'Gets details of a specific DM conversation and participant profile.',
    params: [
      { name: 'conversationId', type: 'string', required: true, desc: 'The conversation ID' },
    ],
    sampleResponse: {
      id: 'conv_01',
      platform: 'instagram',
      participant: { name: 'Elena Rostova', handle: '@elena_dev', followers: 14200 },
      status: 'open',
    },
  },
  {
    name: 'siegfried_list_messages',
    alias: 'sig_list_messages',
    category: 'Messages and DMs',
    title: 'List Messages in Conversation',
    description: 'Lists all messages exchanged inside a specific conversation thread.',
    params: [
      { name: 'conversationId', type: 'string', required: true, desc: 'The conversation ID' },
    ],
    sampleResponse: {
      conversationId: 'conv_01',
      messages: [
        { id: 'm1', sender: 'Elena Rostova', isOutbound: false, text: 'Hey, I commented DM on your post!' },
        { id: 'm2', sender: 'Siegfried Bot', isOutbound: true, text: 'Here is your link: https://siegfriedoutreach.com/mcp' },
      ],
    },
  },
  {
    name: 'siegfried_get_message',
    alias: 'sig_get_message',
    category: 'Messages and DMs',
    title: 'Get Message Details',
    description: 'Gets details of an individual direct message.',
    params: [
      { name: 'messageId', type: 'string', required: true, desc: 'The message ID' },
    ],
    sampleResponse: {
      id: 'm1',
      sender: 'Elena Rostova',
      text: 'Hey, I commented DM on your post!',
    },
  },
  {
    name: 'siegfried_send_message',
    alias: 'sig_send_message',
    category: 'Messages and DMs',
    title: 'Send Direct Message (DM)',
    description: 'Sends a direct message or reply to a recipient on Instagram, Facebook, X, or LinkedIn.',
    params: [
      { name: 'message', type: 'string', required: true, desc: 'Direct message text' },
      { name: 'recipientId', type: 'string', required: false, desc: 'Recipient user ID / handle' },
      { name: 'conversationId', type: 'string', required: false, desc: 'Conversation ID' },
    ],
    sampleResponse: {
      success: true,
      message: 'Direct message sent successfully',
      delivery: { messageId: 'msg_9842', status: 'delivered' },
    },
  },

  // Videos & Images
  {
    name: 'siegfried_list_visual_templates',
    alias: 'sig_list_visual_templates',
    category: 'Videos and Images',
    title: 'List Visual Templates',
    description: 'Lists visual design templates for carousels, quote cards, stat infographics, and video hook frames.',
    params: [
      { name: 'type', type: 'string', required: false, desc: 'image, carousel, video, quote, slide, all' },
    ],
    sampleResponse: {
      templates: [
        { id: 'tpl_minimal_dark_quote', name: 'Minimal Dark Quote Card', supportedAspectRatios: ['1:1', '4:5', '9:16'] },
        { id: 'tpl_carousel_viral_slides', name: 'Viral 5-Slide Breakdown', supportedAspectRatios: ['1:1', '4:5'] },
      ],
    },
  },
  {
    name: 'siegfried_create_visual',
    alias: 'sig_create_visual',
    category: 'Videos and Images',
    title: 'Generate Visual / Carousel Slides',
    description: 'Generates an AI visual asset, carousel deck, or social graphic ready for publishing.',
    params: [
      { name: 'prompt', type: 'string', required: true, desc: 'Visual description or text content' },
      { name: 'aspectRatio', type: 'string', required: false, desc: '1:1, 9:16, 16:9, 4:5' },
      { name: 'templateId', type: 'string', required: false, desc: 'Template style ID' },
    ],
    sampleResponse: {
      success: true,
      visualId: 'vis_948201',
      mediaUrl: 'https://api.siegfriedoutreach.com/uploads/visuals/vis_948201.png',
      status: 'completed',
    },
  },
  {
    name: 'siegfried_get_visual_status',
    alias: 'sig_get_visual_status',
    category: 'Videos and Images',
    title: 'Get Visual Rendering Status',
    description: 'Checks progress and downloads the rendered visual file.',
    params: [
      { name: 'visualId', type: 'string', required: true, desc: 'The visual generation ID' },
    ],
    sampleResponse: {
      visualId: 'vis_948201',
      status: 'completed',
      mediaUrl: 'https://api.siegfriedoutreach.com/uploads/visuals/vis_948201.png',
    },
  },

  // Content Extraction
  {
    name: 'siegfried_create_source',
    alias: 'sig_create_source',
    category: 'Content Extraction',
    title: 'Repurpose YouTube / Article to 9 Formats',
    description: 'Ingests a YouTube video, article URL, or raw transcript to generate tailored multi-platform post drafts (Threads on X, Thought-Leadership on LinkedIn, Carousels on Instagram).',
    params: [
      { name: 'sourceType', type: 'string', required: true, desc: 'youtube_url, article_url, raw_text, audio_file' },
      { name: 'sourceUrl', type: 'string', required: false, desc: 'URL of YouTube video or blog article' },
      { name: 'targetPlatforms', type: 'string[]', required: false, desc: 'Platforms to generate content for' },
    ],
    sampleResponse: {
      success: true,
      message: 'Source ingested and transformed into platform-tailored post drafts.',
      campaign: {
        sourceId: 'src_9482',
        summary: 'Extracted key insights and viral frameworks.',
        generatedPosts: {
          twitter: { type: 'thread', posts: ['1/ 90% of creators fail because...', '2/ Step 1...'] },
          linkedin: { type: 'post', content: 'The future of social media distribution...' },
        },
      },
    },
  },
  {
    name: 'siegfried_get_source_status',
    alias: 'sig_get_source_status',
    category: 'Content Extraction',
    title: 'Get Ingested Source Status',
    description: 'Retrieves parsed takeaways, transcript quotes, and generated drafts.',
    params: [
      { name: 'sourceId', type: 'string', required: true, desc: 'The source extraction ID' },
    ],
    sampleResponse: {
      sourceId: 'src_9482',
      status: 'completed',
      keyInsights: ['Official APIs prevent shadowbans.', 'Multi-platform distribution requires format adaptation.'],
    },
  },

  // Media & Credits
  {
    name: 'siegfried_create_presigned_upload_url',
    alias: 'sig_create_presigned_upload_url',
    category: 'Media and Credits',
    title: 'Create Presigned Media Upload URL',
    description: 'Generates an upload destination URL for images, videos, audio, or PDFs to attach to social posts.',
    params: [
      { name: 'fileName', type: 'string', required: true, desc: 'File name (e.g., "video.mp4")' },
      { name: 'fileType', type: 'string', required: true, desc: 'MIME type (e.g., "video/mp4")' },
    ],
    sampleResponse: {
      uploadUrl: 'https://api.siegfriedoutreach.com/api/mcp/upload-media',
      publicUrl: 'https://api.siegfriedoutreach.com/uploads/social-posts/upload_9482.mp4',
      expiresInSeconds: 3600,
    },
  },
  {
    name: 'siegfried_get_credits',
    alias: 'sig_get_credits',
    category: 'Media and Credits',
    title: 'Check Credits Balance',
    description: 'Checks remaining AI operations, generative tokens, and unmetered posting quota.',
    params: [],
    sampleResponse: {
      totalCredits: 5000,
      usedCredits: 140,
      remainingCredits: 4860,
      billingCycle: 'Monthly Flat ($29/mo)',
      unmeteredPublishing: true,
    },
  },
  {
    name: 'siegfried_buy_credits',
    alias: 'sig_buy_credits',
    category: 'Media and Credits',
    title: 'Upgrade Plan & Buy Credits',
    description: 'Views available plan bundles and direct checkout links.',
    params: [
      { name: 'packageType', type: 'string', required: false, desc: 'starter, creator, pro, agency, unlimited' },
    ],
    sampleResponse: {
      availablePlans: [
        { id: 'starter', name: 'Starter Monthly', price: '$29/mo', posts: 'Unlimited', accounts: 10 },
        { id: 'pro', name: 'Pro Agency', price: '$79/mo', posts: 'Unlimited', accounts: 30 },
      ],
      checkoutUrl: 'https://siegfriedoutreach.com/plans',
    },
  },
]

export const mcpClientGuides = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    badge: 'OAuth & HTTP CLI',
    command: 'claude mcp add --transport http Siegfried https://api.siegfriedoutreach.com/mcp',
    description: 'Run one command inside your terminal session, then authenticate from the /mcp menu.',
    instructions: [
      'Open your terminal where Claude Code is installed.',
      'Run the single-line command above to register the Siegfried MCP server.',
      'Open Claude Code and run `/mcp` to authenticate your account.',
      'Prompt Claude: "Schedule a week of content across my LinkedIn and X accounts."',
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    badge: 'API Key Header',
    command: JSON.stringify(
      {
        mcpServers: {
          siegfried: {
            url: 'https://api.siegfriedoutreach.com/mcp',
            headers: {
              'siegfried-api-key': 'YOUR_API_KEY',
            },
          },
        },
      },
      null,
      2
    ),
    description: 'Paste the JSON configuration into Cursor\'s MCP settings and restart.',
    instructions: [
      'Open Cursor Settings > Features > MCP.',
      'Click "Add New MCP Server" or edit your `~/.cursor/mcp.json`.',
      'Paste the JSON snippet with your API key from the Siegfried Dashboard.',
      'Ask Composer: "Publish this updated release note as an X thread and LinkedIn post."',
    ],
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop & Cowork',
    badge: 'Custom Connector / OAuth',
    command: 'https://api.siegfriedoutreach.com/mcp',
    description: 'Customize > Connectors > Add custom connector, paste the URL, and approve access.',
    instructions: [
      'Open Claude Desktop Settings > Connectors.',
      'Click "Add Custom Connector".',
      'Paste the server URL: `https://api.siegfriedoutreach.com/mcp`.',
      'Click Connect. Claude will now have direct access to all 28 social tools.',
    ],
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex',
    badge: 'Streamable HTTP',
    command: 'URL: https://api.siegfriedoutreach.com/mcp\nHeader: siegfried-api-key: YOUR_API_KEY',
    description: 'Codex asks for form inputs rather than JSON. Set transport to streamable HTTP and add your API key header.',
    instructions: [
      'In Codex MCP configuration, select "Streamable HTTP".',
      'Set Server URL to `https://api.siegfriedoutreach.com/mcp`.',
      'Leave Bearer Token empty and add header `siegfried-api-key: YOUR_API_KEY`.',
      'Codex is now connected to publish and read social media data.',
    ],
  },
  {
    id: 'antigravity',
    name: 'Google Antigravity',
    badge: 'API Key Header',
    command: JSON.stringify(
      {
        mcpServers: {
          siegfried: {
            url: 'https://api.siegfriedoutreach.com/mcp',
            headers: {
              'siegfried-api-key': 'YOUR_API_KEY',
            },
          },
        },
      },
      null,
      2
    ),
    description: 'Paste into Antigravity IDE\'s MCP configuration dialog and reload.',
    instructions: [
      'Open Antigravity IDE Settings > MCP Servers.',
      'Add a new entry with the JSON configuration above.',
      'Prompt Antigravity in chat: "Check my top 5 posts on Instagram and iterate our hooks for next week."',
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    badge: 'JSON Config',
    command: JSON.stringify(
      {
        mcpServers: {
          siegfried: {
            url: 'https://api.siegfriedoutreach.com/mcp',
            headers: {
              'siegfried-api-key': 'YOUR_API_KEY',
            },
          },
        },
      },
      null,
      2
    ),
    description: 'Add to Cascade / Windsurf MCP server settings.',
    instructions: [
      'Open Windsurf Settings > MCP Servers.',
      'Paste the JSON configuration.',
      'Cascade can now create carousel slides, schedule posts, and reply to comments.',
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Developer Mode',
    badge: 'Web Connector / Custom Action',
    command: 'https://api.siegfriedoutreach.com/mcp',
    description: 'Connect via Custom GPTs or ChatGPT Developer mode web connectors.',
    instructions: [
      'In ChatGPT web interface, go to Custom GPT Builder > Actions.',
      'Import the MCP OpenAPI schema from `https://api.siegfriedoutreach.com/mcp`.',
      'Save and publish your social marketing GPT.',
    ],
  },
]

export const mcpComparisonData = [
  {
    feature: 'Official Platform APIs (Zero Web Scraping)',
    siegfried: { supported: true, note: 'Official Meta, LinkedIn, X, TikTok, Google APIs' },
    ayrshare: { supported: true, note: 'Official APIs' },
    zernio: { supported: true, note: 'Official APIs + Ads focus' },
    outstand: { supported: false, note: 'Browser automation / partial' },
    postiz: { supported: true, note: 'Open source self-host' },
  },
  {
    feature: 'Total MCP Tools',
    siegfried: { supported: true, note: '28 Tools (Accounts, Posts, Analytics, DMs, Visuals)' },
    ayrshare: { supported: true, note: '28 Tools' },
    zernio: { supported: true, note: '18 Tools' },
    outstand: { supported: false, note: '12 Tools' },
    postiz: { supported: true, note: '15 Tools' },
  },
  {
    feature: 'Platforms Supported',
    siegfried: { supported: true, note: '9 Platforms (IG, LI, X, TT, YT, FB, Threads, Bluesky, Pinterest)' },
    ayrshare: { supported: true, note: '9 Platforms' },
    zernio: { supported: false, note: '6 Platforms' },
    outstand: { supported: false, note: '5 Platforms' },
    postiz: { supported: true, note: '8 Platforms' },
  },
  {
    feature: 'Unmetered Post Publishing (Flat Rate)',
    siegfried: { supported: true, note: 'Unlimited posts on flat plan' },
    ayrshare: { supported: true, note: '$29/mo flat' },
    zernio: { supported: false, note: 'Metered per post' },
    outstand: { supported: false, note: 'Pay per batch' },
    postiz: { supported: true, note: 'Self-hosted compute' },
  },
  {
    feature: 'ManyChat-Style Auto-Reply DMs',
    siegfried: { supported: true, note: 'Included on IG & FB' },
    ayrshare: { supported: true, note: 'Included' },
    zernio: { supported: false, note: 'Not supported' },
    outstand: { supported: false, note: 'Not supported' },
    postiz: { supported: false, note: 'Not supported' },
  },
  {
    feature: 'Content Repurposing (YouTube to 9 Formats)',
    siegfried: { supported: true, note: 'Built-in `create_source`' },
    ayrshare: { supported: true, note: 'Built-in' },
    zernio: { supported: false, note: 'Requires separate pipeline' },
    outstand: { supported: false, note: 'Manual' },
    postiz: { supported: false, note: 'Manual' },
  },
  {
    feature: 'Interactive In-Browser MCP Playground',
    siegfried: { supported: true, note: 'Live sandbox & JSON-RPC tester' },
    ayrshare: { supported: false, note: 'Documentation only' },
    zernio: { supported: false, note: 'Documentation only' },
    outstand: { supported: false, note: 'No sandbox' },
    postiz: { supported: false, note: 'No sandbox' },
  },
]

export const mcpFaqs = [
  {
    question: 'What is a Model Context Protocol (MCP) server for social media?',
    answer: 'An MCP server is an open standard created by Anthropic that allows AI agents—like Claude Code, Claude Desktop, Cursor, and OpenAI Codex—to connect securely to external tools and services. Our MCP server exposes 28 structured tools so your AI can directly create posts, inspect analytics, schedule content, and send DMs across 9 platforms without needing individual API keys for each network.',
  },
  {
    question: 'Does this use web scraping or official social media APIs?',
    answer: 'We publish 100% on each platform\'s official API (Meta Graph API for Instagram/Facebook, LinkedIn Community Management API, X API v2, TikTok Content Posting API, and YouTube Data API v3). We never use fragile browser automation or headless scrapers, meaning your accounts remain completely compliant and safe.',
  },
  {
    question: 'Which platforms support analytics, comments, and DMs?',
    answer: 'Publishing and scheduling work seamlessly on all nine platforms (Instagram, LinkedIn, X, TikTok, YouTube, Facebook, Threads, Bluesky, Pinterest). Comments and ManyChat-style auto-reply DMs are available for Instagram and Facebook. In-depth post analytics are available for X, Instagram, Facebook, Threads, and Bluesky.',
  },
  {
    question: 'How do I authenticate my AI client?',
    answer: 'Claude Code and Claude Desktop connect via standard OAuth and HTTP connectors. Developer tools like Cursor, OpenAI Codex, Windsurf, and Antigravity connect using your dedicated Siegfried API Key passed as a `siegfried-api-key` header.',
  },
  {
    question: 'Can I connect custom AI agents or workflow automations?',
    answer: 'Yes! Our server provides complete JSON-RPC 2.0 standard support. Every tool comes with strict parameter schemas and real-time execution logs. Any custom agent, prompt chain, or autonomous workflow will run immediately with zero friction.',
  },
  {
    question: 'Are publishing limits metered per post?',
    answer: 'No. Our plans offer unmetered social media publishing. You can publish as many posts, carousels, threads, and reels as your strategy requires on a predictable flat monthly subscription.',
  },
]
