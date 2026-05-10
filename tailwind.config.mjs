/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        }
      }
    },
  },
  safelist: [
    // Ensure all color variants are included
    'bg-red-50', 'bg-orange-50', 'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-indigo-50', 'bg-purple-50',
    'dark:bg-red-900/20', 'dark:bg-orange-900/20', 'dark:bg-blue-900/20', 'dark:bg-green-900/20', 'dark:bg-yellow-900/20', 'dark:bg-indigo-900/20', 'dark:bg-purple-900/20',
    'border-red-200', 'border-orange-200', 'border-blue-200', 'border-green-200', 'border-yellow-200', 'border-indigo-200', 'border-purple-200',
    'dark:border-red-800', 'dark:border-orange-800', 'dark:border-blue-800', 'dark:border-green-800', 'dark:border-yellow-800', 'dark:border-indigo-800', 'dark:border-purple-800',
    'text-red-700', 'text-orange-700', 'text-blue-700', 'text-green-700', 'text-yellow-700', 'text-indigo-700', 'text-purple-700',
    'dark:text-red-300', 'dark:text-orange-300', 'dark:text-blue-300', 'dark:text-green-300', 'dark:text-yellow-300', 'dark:text-indigo-300', 'dark:text-purple-300',
    'text-red-600', 'text-orange-600', 'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-indigo-600', 'text-purple-600',
    'dark:text-red-400', 'dark:text-orange-400', 'dark:text-blue-400', 'dark:text-green-400', 'dark:text-yellow-400', 'dark:text-indigo-400', 'dark:text-purple-400',
  ],
  plugins: [],
}