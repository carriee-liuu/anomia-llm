/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-primary': '#667eea',
        'game-secondary': '#764ba2',
        'game-accent': '#f093fb',
        'game-warning': '#f5576c',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      fontFamily: {
        'game': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'game': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'game-glow': '0 0 30px rgba(255, 215, 0, 0.5)',
      }
    },
  },
  plugins: [],
} 