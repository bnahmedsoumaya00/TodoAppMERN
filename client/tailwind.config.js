/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shadow-grey': '#161925',
        'twilight-indigo': '#23395b',
        'rich-cerulean': '#406e8e',
        'powder-blue': '#8ea8c3',
        'frozen-water': '#cbf7ed',
      },
    },
  },
  plugins: [],
}