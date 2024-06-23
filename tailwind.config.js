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
    },
  },
  plugins: [],
}
