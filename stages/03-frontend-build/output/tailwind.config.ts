import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90D9',
          hover:   '#3a7bc8',
          light:   '#6aaee8',
        },
        accent: {
          DEFAULT: '#FF6B35',
          hover:   '#e85c27',
        },
        dark:    '#0F172A',
        surface: '#1E293B',
        muted:   '#64748B',
        border:  '#334155',
        'text-primary':   '#F8FAFC',
        'text-secondary': '#94A3B8',
        success: '#22C55E',
        danger:  '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
