const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (envUrl) {
      return envUrl.replace(/\/api\/?$/, '')
    }
  }
  return 'https://api.siegfriedoutreach.com'
}

const apiBase = getApiBaseUrl()

export type SetupGuideItem = {
  title: string
  steps: string[]
  links: Array<{ label: string; url: string }>
  redirectUri: string
}

export const platformSetupGuides: Record<string, SetupGuideItem> = {
  facebook: {
    title: 'Facebook Pages Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/facebook/callback`,
    steps: [
      'Open your Business App in Meta for Developers (developers.facebook.com).',
      'Under "Facebook Login" ➔ "Settings", paste the OAuth Redirect URL into "Valid OAuth Redirect URIs".',
      'Ensure "Client OAuth Login" and "Web OAuth Login" are toggled ON (Yes).',
      'Copy your App ID and App Secret into Social Settings.',
      'Return here and click "Connect Account" to authorize and select your Facebook Pages.',
    ],
    links: [
      { label: 'Meta Developer Portal', url: 'https://developers.facebook.com/apps/' },
      { label: 'Facebook Login Docs', url: 'https://developers.facebook.com/docs/facebook-login/' },
      { label: 'Pages API Docs', url: 'https://developers.facebook.com/docs/pages/' },
    ],
  },
  instagram: {
    title: 'Instagram Business Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/instagram/callback`,
    steps: [
      'Open your App in Meta for Developers (developers.facebook.com).',
      'Under "Facebook Login" ➔ "Settings", paste the OAuth Redirect URL into "Valid OAuth Redirect URIs".',
      'Under "App Settings" ➔ "Basic", ensure App Domains include "siegfriedoutreach.com" & "api.siegfriedoutreach.com".',
      'Connect your Instagram Professional/Business account to your Facebook Page.',
      'Save your Meta App ID & Secret in Social Settings, then click "Connect Account".',
    ],
    links: [
      { label: 'Meta Apps Dashboard', url: 'https://developers.facebook.com/apps/' },
      { label: 'Instagram Platform Docs', url: 'https://developers.facebook.com/docs/instagram-platform/' },
      { label: 'Connect IG to FB Page Guide', url: 'https://www.facebook.com/business/help/connect-instagram-to-page' },
    ],
  },
  linkedin: {
    title: 'LinkedIn Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/linkedin/callback`,
    steps: [
      'Create an app in LinkedIn Developer Portal (linkedin.com/developers).',
      'Associate your company page and complete app verification.',
      'Under "Auth" tab, add the OAuth Redirect URL into "Authorized redirect URLs for your app".',
      'Enable "Sign In with LinkedIn" and "Share on LinkedIn" products.',
      'Paste Client ID and Client Secret in Social Settings, then connect account.',
    ],
    links: [
      { label: 'LinkedIn Developer Portal', url: 'https://www.linkedin.com/developers/apps' },
      {
        label: 'LinkedIn Auth Docs',
        url: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication',
      },
      {
        label: 'Share API Guide',
        url: 'https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api',
      },
    ],
  },
  twitter: {
    title: 'Twitter (X) Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/twitter/callback`,
    steps: [
      'Create a Project and App in the X Developer Portal (developer.x.com).',
      'In "User authentication settings", set Type of App to "Web App" and add the Callback URL below.',
      'Enable OAuth 2.0 and OAuth 1.0a permissions (Read and Write).',
      'Generate API Key, API Key Secret, OAuth Token & Secret.',
      'Save credentials in Social Settings, then return and connect account.',
    ],
    links: [
      { label: 'X Developer Portal', url: 'https://developer.x.com/en/portal/dashboard' },
      { label: 'Auth Overview', url: 'https://docs.x.com/fundamentals/authentication/overview' },
      { label: 'OAuth 1.0a Guide', url: 'https://developer.x.com/en/docs/authentication/oauth-1-0a' },
    ],
  },
  google: {
    title: 'Google Business Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/google/callback`,
    steps: [
      'Open Google Cloud Console (console.cloud.google.com) and create a project.',
      'Configure OAuth consent screen and add test users or publish app.',
      'In Credentials ➔ Create "OAuth Client ID" (Web application).',
      'Add the Authorized Redirect URI into "Authorized redirect URIs".',
      'Save Client ID & Secret in Social Settings and connect account.',
    ],
    links: [
      { label: 'Google Cloud Console', url: 'https://console.cloud.google.com/' },
      {
        label: 'Business Profile API',
        url: 'https://developers.google.com/my-business/content/basic-setup',
      },
      {
        label: 'OAuth 2.0 Guide',
        url: 'https://developers.google.com/identity/protocols/oauth2',
      },
    ],
  },
  youtube: {
    title: 'YouTube Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/youtube/callback`,
    steps: [
      'In Google Cloud Console, enable "YouTube Data API v3".',
      'Under Credentials ➔ Create OAuth 2.0 Client ID for Web application.',
      'Add the Authorized Redirect URI into "Authorized redirect URIs".',
      'Copy Client ID & Secret into Social Settings.',
      'Return here and connect your YouTube Channel.',
    ],
    links: [
      { label: 'Google Cloud Console', url: 'https://console.cloud.google.com/' },
      { label: 'YouTube Data API', url: 'https://developers.google.com/youtube/v3' },
      {
        label: 'OAuth Scopes',
        url: 'https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps',
      },
    ],
  },
  tiktok: {
    title: 'TikTok Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/tiktok/callback`,
    steps: [
      'Register as a developer on TikTok for Developers (developers.tiktok.com).',
      'Create an app and enable "Login Kit" and "Share Kit".',
      'In App details, add the Redirect Domain and Callback URL below.',
      'Copy Client Key and Client Secret into Social Settings.',
      'Click "Connect Account" to authorize your TikTok profile.',
    ],
    links: [
      { label: 'TikTok for Developers', url: 'https://developers.tiktok.com/' },
      { label: 'TikTok Login Kit', url: 'https://developers.tiktok.com/doc/login-kit-web' },
      { label: 'Content Posting API', url: 'https://developers.tiktok.com/doc/content-posting-api-get-started' },
    ],
  },
  reddit: {
    title: 'Reddit Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/reddit/callback`,
    steps: [
      'Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) and scroll to the bottom. Click **"create another app…"**.',
      'Select **"web app"** as the app type. Give it any name (e.g. "Siegfried Outreach").',
      'In the **"redirect uri"** field, paste the OAuth Redirect URL shown below, then click **"create app"**.',
      'Copy the **Client ID** (the short string shown under your app name) and the **Client Secret** into Social Settings.',
      'Return here and click **"Connect Account"** to authorize your Reddit account.',
    ],
    links: [
      { label: 'Reddit App Preferences (create app here)', url: 'https://www.reddit.com/prefs/apps' },
      { label: 'Reddit OAuth2 Docs', url: 'https://github.com/reddit-archive/reddit/wiki/OAuth2' },
    ],
  },
  threads: {
    title: 'Threads Setup Guide',
    redirectUri: `${apiBase}/api/social-auth/threads/callback`,
    steps: [
      'Open your app in Meta for Developers (developers.facebook.com) and add the "Threads" product.',
      'Under Threads ➔ Settings, paste the OAuth Redirect URL below into "Valid OAuth Redirect URIs".',
      'Copy the Threads App ID and App Secret into Social Settings (separate from your Facebook App ID/Secret).',
      'Submit for Threads API access if required, then return here and connect your account.',
    ],
    links: [
      { label: 'Meta Developer Portal', url: 'https://developers.facebook.com/apps/' },
      { label: 'Threads API Docs', url: 'https://developers.facebook.com/docs/threads' },
    ],
  },
  whatsapp: {
    title: 'WhatsApp Setup Guide',
    redirectUri: '',
    steps: [
      'Official API: In Meta Business Manager, create a System User and generate a permanent Access Token with whatsapp_business_messaging permission.',
      'Copy the Phone Number ID from WhatsApp Manager > API Setup.',
      'Paste the Access Token and Phone Number ID into the "Official API" tab here and click "Verify & Connect".',
      'Scan QR Code: open the "Scan QR Code" tab, then scan the code from WhatsApp on your phone (Linked Devices > Link a Device) — no app credentials needed.',
    ],
    links: [
      { label: 'Meta Business Manager', url: 'https://business.facebook.com/' },
      { label: 'WhatsApp Cloud API Docs', url: 'https://developers.facebook.com/docs/whatsapp/cloud-api' },
    ],
  },
  wordpress: {
    title: 'WordPress Setup Guide',
    redirectUri: '',
    steps: [
      'In your WordPress dashboard, go to **Users → Profile** (or **Users → All Users → Edit** for another user).',
      'Scroll to the **Application Passwords** section. Type a name (e.g. "Siegfried Outreach") and click **Add New Application Password**.',
      'Copy the generated password (shown only once) — it looks like `xxxx xxxx xxxx xxxx xxxx xxxx`.',
      'Enter your **WordPress Site URL** (e.g. `https://myblog.com`), **Username**, and the **Application Password** in Social Settings and save.',
      'Return here and click **Connect Account** — credentials are verified instantly. No redirect needed.',
    ],
    links: [
      { label: 'WordPress Application Passwords Docs', url: 'https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/' },
      { label: 'WP REST API Reference', url: 'https://developer.wordpress.org/rest-api/' },
    ],
  },
}
