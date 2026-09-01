import {
  Bell,
  Bot,
  Heart,
  Instagram,
  Linkedin,
  LinkIcon,
  Mail,
  MessageSquare,
  Send,
  Twitter,
  Users,
  Zap,
} from 'lucide-react'

export const logos = [
  { name: 'WhatsApp', icon: MessageSquare, color: 'green' },
  { name: 'Telegram', icon: Send, color: 'blue' },
  { name: 'Email', icon: Mail, color: 'gray' },
  { name: 'Automations', icon: Zap, color: 'purple' },
  { name: 'CRM Sync', icon: Users, color: 'green' },
  { name: 'Push Alerts', icon: Bell, color: 'orange' },
  { name: 'AI Bot', icon: Bot, color: 'blue' },
]

export const footerLinks = [
  {
    title: 'Integrations',
    links: [
      { name: 'Linkedin', href: '#' },
      { name: 'Instagram', href: '#' },
      { name: 'Whatsapp', href: '#' },
      { name: 'Telegram', href: '#' },
      { name: 'Facebook', href: '#' },
    ],
  },
  {
    title: 'Use Cases',
    links: [
      { name: 'Product Launches', href: '#' },
      { name: 'Promotions', href: '#' },
      { name: 'Limited Offers', href: '#' },
      { name: 'Event Reminders', href: '#' },
      { name: 'Bulk Messages', href: '#' },
      { name: 'Collect Feedback', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '#' },
      { name: 'Support', href: '#' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Status', href: '#' },
    ],
  },
]

export const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Telegram', icon: Send, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
]

export const testimonialStats = [
  { val: '500+', label: 'Happy Creators' },
  { val: '4.9/5', label: 'Store Rating' },
  { val: '12+', label: 'Posts Published' },
  { val: '24/7', label: 'AI Support' },
]

export const pricingTabs = ['subscription', 'prepaid', 'lifetime']

export const socialMediaIcons = [Heart, MessageSquare, LinkIcon]

export const campaignhubPrompts = ['Business Ideas', 'Blog Post', 'Coding Help']
