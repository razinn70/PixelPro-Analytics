import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:        '#4A90D9',
        'primary-hover':'#3A7BC8',
        accent:         '#FF6B35',
        dark:           '#0F172A',
        surface:        '#1E293B',
        border:         '#334155',
        muted:          '#64748B',
        success:        '#22C55E',
        danger:         '#EF4444',
        warning:        '#F59E0B',
        'text-primary': '#F8FAFC',
        'text-secondary':'#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
