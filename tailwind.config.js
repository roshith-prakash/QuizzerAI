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
        "wave": "url('https://res.cloudinary.com/do8rpl9l4/image/upload/v1721567185/wave_y0fpoc.png')"
      }
    },
  },
  plugins: [],
}