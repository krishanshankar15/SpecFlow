/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        canvas: '#090d16',
        panel: '#0f1623',
        surface: '#131c2e',
        border: '#1a2540',
        'border-bright': '#263354',
        muted: '#64748b',
        dim: '#94a3b8',
        bright: '#e2e8f0',
        emerald: { DEFAULT: '#10b981', dim: '#065f46', glow: 'rgba(16,185,129,0.15)' },
        cyan: { DEFAULT: '#06b6d4', dim: '#164e63', glow: 'rgba(6,182,212,0.15)' },
        amber: { DEFAULT: '#f59e0b', dim: '#78350f', glow: 'rgba(245,158,11,0.15)' },
        rose: { DEFAULT: '#f43f5e', dim: '#881337', glow: 'rgba(244,63,94,0.15)' },
      },
      boxShadow: {
        'glow-emerald': '0 0 0 1px #10b981, 0 0 16px rgba(16,185,129,0.2)',
        'glow-cyan': '0 0 0 1px #06b6d4, 0 0 16px rgba(6,182,212,0.2)',
        'glow-amber': '0 0 0 1px #f59e0b, 0 0 12px rgba(245,158,11,0.15)',
        'glow-rose': '0 0 0 1px #f43f5e, 0 0 12px rgba(244,63,94,0.15)',
        'panel': '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(26,37,64,0.8)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
