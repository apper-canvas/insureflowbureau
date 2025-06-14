/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#00D4AA',
        accent: '#FF6B35',
        surface: '#F8FAFB',
        success: '#00C853',
        warning: '#FFA726',
        error: '#EF5350',
        info: '#29B6F6',
        'surface-50': '#f8fafc',
        'surface-100': '#f1f5f9',
        'surface-200': '#e2e8f0',
        'surface-300': '#cbd5e1',
        'surface-400': '#94a3b8',
        'surface-500': '#64748b',
        'surface-600': '#475569',
        'surface-700': '#334155',
        'surface-800': '#1e293b',
        'surface-900': '#0f172a'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        'lg': '8px'
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
}