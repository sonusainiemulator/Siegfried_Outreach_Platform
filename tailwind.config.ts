/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      screens: {
        lg991: { max: "991px" },
        xl1199: { max: "1199px" },
        xl1095: { max: "1095px" },
        md575: { max: "575px" },
        md767: { max: "767px" },
        md720: { max: "720px" },
        xl1570: { max: "1570px" },
        xl1280: { max: "1280px" },
      },
      spacing: {
        "button-padding": "var(--button-padding)",

      },

      boxShadow: {
        "card-box-shadow": "var(--card-box-shadow)",
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        "card-color": "var(--card-color)",
        "input-border-color": "var(--input-border-color)",
        "light-primary": "var(--light-primary)",
        "title-color": "var(--title-color)",
        "sidebar-color": "var(--sidebar-color)",
        "edit-color": "var(--edit-color)",
        "border-edit": "var(--border-edit)",
        "text-edit": "var(--text-edit)",
        "border-destructive": "var(--border-destructive)",
        "border-primary": "var(--border-primary)",
        "card-border": "var(--card-border)",
        "sidebar-active-color": "var(--sidebar-active-color)",
        "sidebar-text-color": "var(--sidebar-text-color)",
        "sec-card-color": "var(--sec-card-color)",
        "input-color": "var(--input-color)",
        "info": "var(--info)",
        "light-info": "var(--light-info)",
        "subtitle-color": "var(--subtitle-color)",
        "light-body": "var(--light-body)",
        "border-gradient": "var(--border-gradient)",
        "glass-primary": "var(--glass-primary)",
        "glass-border": "var(--glass-border)",
        "bg-card": "var(--bg-card)",
        "modal-bg-color": "var(--modal-bg-color)",
        "light-gray": "var(--light-gray)",
        "light-text-color": "var(--light-text-color)",
        "light-border-color": "var(--light-border-color)",
        "light-button": "var(--light-button)",
        white: "var(--white)",
        black: "var(--black)",
        "dark-deep": "var(--dark-deep)",
        "dark-muted": "var(--dark-muted)",
        "dark-base": "var(--dark-base)",
        "dark-border-alt": "var(--dark-border-alt)",
        "gray-muted": "var(--gray-muted)",
        "gray-light": "var(--gray-light)",
        "blue-highlight": "var(--blue-highlight)",
        "input-background": "var(--input-background)",

        /* Brand & Social */
        "facebook": "var(--facebook)",
        "twitter": "var(--twitter)",
        "social-blue": "var(--social-blue)",
        "linkedin": "var(--linkedin)",
        "instagram": "var(--instagram)",
        "telegram": "var(--telegram)",
        "whatsapp": "var(--whatsapp)",
        "whatsapp-light": "var(--whatsapp-light)",
        "whatsapp-dark": "var(--whatsapp-dark)",
        "whatsapp-teal": "var(--whatsapp-teal)",
        "paypal": "var(--paypal)",
        "stripe": "var(--stripe)",
        "messenger": "var(--messenger)",
        "telegram-alt": "var(--telegram-alt)",
        "secondary1": "var(--secondary1)",

        /* UI Accents & Presets */
        "warning-orange": "var(--warning-orange)",
        "cyan-accent": "var(--cyan-accent)",
        "dark-gray-accent": "var(--dark-gray-accent)",
        "dark-void": "var(--dark-void)",
        "landing-animate": "var(--landing-animate)",
        "black-jet": "var(--black-jet)",
        "ably": "var(--ably)",
        "dark-ink": "var(--dark-ink)",
        "amber-accent": "var(--amber-accent)",
        "cyan-deep": "var(--cyan-deep)",
        "role-color-1": "var(--role-color-1)",
        "role-color-2": "var(--role-color-2)",
        "rich-text-placeholder": "var(--rich-text-placeholder)",
        "stats-progress-bg": "var(--stats-progress-bg)",
        "calendar-header-bg": "var(--calendar-header-bg)",
        "dark-bg": "var(--dark-bg)",

        /* Landing Page Colors */
        "landing-bg-dark": "var(--landing-bg-dark)",
        "landing-bg-deep": "var(--landing-bg-deep)",

        /* Alpha Colors */
        "white-a10": "var(--white-a10)",
        "white-a05": "var(--white-a05)",
        "white-a00": "var(--white-a00)",

        /* Chart Colors */
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",

        /* Gradient Component Colors */
        "indigo-light": "var(--indigo-light)",
        "blue-gray": "var(--blue-gray)",

        /* Core UI & Other */
        "dark-midnight": "var(--dark-midnight)",
        "indigo-main": "var(--indigo-main)",
        "green-success": "var(--green-success)",


        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
          "dark-border-color": "var(--dark-border-color)",
          "primary-color": "var(--primary)",
          "secondary": "var(--secondary)",

          "sidebar-color": "var(--sidebar-color)",
          "title-color": "var(--title-color)",
          "button-padding": "var(--button-padding)",

        },
      },
      backgroundImage: {
        'mix-primary': 'var(--mix-primary)',
        'mix-primary-hover': 'var(--mix-primary)',
      },
      fontSize: {
        '4xs': ['var(--text-4xs)', { lineHeight: 'var(--leading-tight)' }],
        '3xs': ['var(--text-3xs)', { lineHeight: 'var(--leading-tight)' }],
        '2xs': ['var(--text-2xs)', { lineHeight: 'var(--leading-tight)' }],

        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        base: [
          'var(--text-base)',
          {
            letterSpacing: 'var(--tracking-xl)',

          }
        ],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-relaxed)' }],
        xl: [
          'var(--text-xl)',
          {
            letterSpacing: 'var(--tracking-xl)',

          }
        ],


        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-snug)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-none)' }],

        // Responsive / fluid
        'responsive-sm': ['var(--text-responsive-sm)', { lineHeight: '1.2' }],
        'responsive-3xl': ['var(--text-responsive-3xl)', { lineHeight: '1.2' }],

        'fluid-xl': ['var(--text-fluid-xl)', { lineHeight: '1.1' }],
        'landing-title': ['var(--text-landing-title)', { lineHeight: '1.1' }],

      },

      borderRadius: {
        DEFAULT: "var(--border-radius)",
        "border-radius": "var(--border-radius)",
        "button-radius": "var(--button-radius)",

      }
    },
  },
  plugins: [
    typography,
  ],
};

export default config;