/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-blue-50', 'bg-blue-600', 'text-blue-600', 'border-blue-200', 'border-blue-600',
    'bg-emerald-50', 'bg-emerald-600', 'text-emerald-600', 'border-emerald-200', 'border-emerald-600',
    'bg-violet-50', 'bg-violet-600', 'text-violet-600', 'border-violet-200', 'border-violet-600',
    'bg-rose-50', 'bg-rose-600', 'text-rose-600', 'border-rose-200', 'border-rose-600',
    'bg-amber-50', 'bg-amber-600', 'text-amber-600', 'border-amber-200', 'border-amber-600',
    'bg-cyan-50', 'bg-cyan-600', 'text-cyan-600', 'border-cyan-200', 'border-cyan-600',
    'bg-indigo-50', 'bg-indigo-600', 'text-indigo-600', 'border-indigo-200', 'border-indigo-600',
    'bg-orange-50', 'bg-orange-600', 'text-orange-600', 'border-orange-200', 'border-orange-600',
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500',
    'bg-cyan-500', 'bg-indigo-500', 'bg-orange-500',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1e1e1e',
          600: '#2d2d2d',
        },
        brand: {
          500: '#6366f1',
          400: '#818cf8',
          gradientStart: '#8b5cf6',
          gradientEnd: '#3b82f6',
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      }
    },
  },
  plugins: [],
}
