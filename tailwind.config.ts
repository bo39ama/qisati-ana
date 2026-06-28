import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          DEFAULT: '#4FACF7',
          light: '#EBF6FF',
          mid: '#BAE0FF',
        },
        mint: {
          DEFAULT: '#34D399',
          light: '#ECFDF5',
        },
        warm: {
          yellow: '#FCD34D',
          orange: '#FB923C',
          'orange-light': '#FFF4ED',
        },
        candy: {
          pink: '#F472B6',
          'pink-light': '#FDF2F8',
        },
        purple: {
          accent: '#A78BFA',
          light: '#F5F3FF',
        },
        brand: {
          dark: '#1A1A2E',
          dark2: '#16213E',
          cream: '#FFFBF5',
        },
      },
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'Arial', 'sans-serif'],
        display: ['IBM Plex Sans Arabic', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        brand: '0 4px 24px rgba(79,172,247,0.12)',
        'brand-lg': '0 12px 48px rgba(79,172,247,0.18)',
        'brand-xl': '0 20px 60px rgba(79,172,247,0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'fade-up': 'fadeUp 0.6s ease both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'scroll-track': 'scrollTrack 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(3deg)' },
          '66%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.4', transform: 'scale(0.6) rotate(20deg)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.3)' },
        },
        scrollTrack: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(160deg, #FFFBF5 0%, #EBF6FF 40%, #F5F3FF 100%)',
        'sky-gradient': 'linear-gradient(135deg, #4FACF7, #3B82F6)',
        'dark-gradient': 'linear-gradient(160deg, #1A1A2E, #16213E)',
      },
    },
  },
  plugins: [],
}

export default config
