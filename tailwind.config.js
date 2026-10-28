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
        canvas: '#080808',
        panel: '#0e0e0e',
        surface: '#141414',
        border: '#1f1f1f',
        'border-bright': '#2a2a2a',
        muted: '#555555',
        dim: '#888888',
        bright: '#f0f0f0',
        lime: { DEFAULT: '#AAFF00', dim: '#1a2600', glow: 'rgba(170,255,0,0.1)' },
        green: { DEFAULT: '#66FF44', dim: '#0f2200', glow: 'rgba(102,255,68,0.1)' },
        amber: { DEFAULT: '#f59e0b', dim: '#291c00', glow: 'rgba(245,158,11,0.12)' },
        rose: { DEFAULT: '#f43f5e', dim: '#250610', glow: 'rgba(244,63,94,0.12)' },
      },
      boxShadow: {
        'glow-lime': '0 0 0 1px rgba(170,255,0,0.6), 0 0 20px rgba(170,255,0,0.15)',
        'glow-lime-sm': '0 0 0 1px rgba(170,255,0,0.4), 0 0 10px rgba(170,255,0,0.1)',
        'glow-green': '0 0 0 1px rgba(102,255,68,0.5), 0 0 16px rgba(102,255,68,0.12)',
        'glow-amber': '0 0 0 1px #f59e0b, 0 0 12px rgba(245,158,11,0.12)',
        'glow-rose': '0 0 0 1px #f43f5e, 0 0 12px rgba(244,63,94,0.12)',
        'panel': '0 1px 3px rgba(0,0,0,0.8), 0 0 0 1px rgba(31,31,31,0.9)',
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
