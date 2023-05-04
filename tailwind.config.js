/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,xsl}",
  ],
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' }
      },
      fontFamily: {
        'dosis': ['Dosis']
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['even', 'odd']
    }
  },
  plugins: [],
}
