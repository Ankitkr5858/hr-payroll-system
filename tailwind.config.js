/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#00A3B1',
          hover: '#018995',
          light: '#F0FDFA',
        },
        secondary: '#FFB800',
        accent: '#8B5CF6',
      },
    },
  },
  plugins: [],
};