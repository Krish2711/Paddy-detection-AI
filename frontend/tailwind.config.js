/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paddy: {
          50: '#f2f9f4',
          100: '#e1f2e5',
          200: '#c5e4cd',
          300: '#9bceaa',
          400: '#6bb17f',
          500: '#46945c',
          600: '#347847',
          700: '#2a603a',
          800: '#234d30',
          900: '#1e4029',
          950: '#0e2316',
        },
        earth: {
          50: '#fbf9f5',
          100: '#f5f0e6',
          200: '#ebdcc7',
          300: '#dec39e',
          400: '#cfa272',
          500: '#c38751',
          600: '#b57144',
          700: '#97593b',
          800: '#7a4835',
          900: '#633c2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(14, 35, 22, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(14, 35, 22, 0.15)',
      }
    },
  },
  plugins: [],
}
