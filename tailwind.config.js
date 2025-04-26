/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode
        background: '#f9fafb',
        foreground: '#1f2937',
        border: '#e5e7eb',

        // Dark Mode
        'background-dark': '#111827',
        'foreground-dark': '#e5e7eb',
        'border-dark': '#374151',
      },
    },
  },
  plugins: [],
};
