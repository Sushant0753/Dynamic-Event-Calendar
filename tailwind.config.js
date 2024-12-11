/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'calendar-bg': '#f4f4f5',
        'calendar-border': '#e4e4e7',
        'event-blue': '#3b82f6',
        'event-green': '#10b981',
        'event-red': '#ef4444'
      },
      gridTemplateColumns: {
        'calendar': 'repeat(7, minmax(0, 1fr))'
      }
    },
  },
  plugins: [],
}