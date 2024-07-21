/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "cta": "#9b0ced",
        "hovercta": "#7123b0",
      },
      backgroundImage: {
        "wave": "url('src/assets/wave.png')"
      }
    },
  },
  plugins: [],
}