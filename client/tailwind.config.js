/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563Eb',
        secondary: '#FBBF24',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        playfair: ['Playfair', 'serif'],
      },
    },
  },
  plugins: [],
}
