/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(251, 191, 36, 0.15), 0 24px 80px rgba(0, 0, 0, 0.45)',
      },
      fontFamily: {
        display: ['"Trebuchet MS"', '"Gill Sans"', 'sans-serif'],
        body: ['"Trebuchet MS"', '"Gill Sans"', 'sans-serif'],
      },
      colors: {
        casino: {
          950: '#030712',
          900: '#0a1222',
          800: '#121d35',
          700: '#1d2d52',
          500: '#f59e0b',
          400: '#fbbf24',
        },
      },
    },
  },
  plugins: [],
}
