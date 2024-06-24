/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the path according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        aqua: '#00ffff',
        chartreuse: '#7fff00',
      },
      width: {
        '160': '40rem',
        '180': '45rem',
        '190': '47.5rem',
        '200': '50rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
        '1/4' :"25%",
      },
    },
  },
  plugins: [],
}
