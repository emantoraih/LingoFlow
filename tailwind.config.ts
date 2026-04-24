import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brunswick: {
          DEFAULT: '#004225',
          light: '#005a35',
          dark: '#002d19',
          muted: '#1a5c3a',
          pale: '#e8f0eb',
        },
        beige: {
          DEFAULT: '#F5F5DC',
          dark: '#E8E8C8',
          darker: '#D8D8A8',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'pulse-ring': 'pulseRing 1.2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,66,37,0.35)' },
          '50%': { boxShadow: '0 0 0 8px rgba(0,66,37,0)' },
        },
        shimmer: {
          '0%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0.4' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
