/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,xsl}",
  ],
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' }
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
