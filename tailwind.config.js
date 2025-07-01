/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        maya: {
          primary: '#8B4513',
          secondary: '#D2691E',
          accent: '#CD853F',
          dark: '#654321',
          light: '#F5DEB3'
        }
      },
      fontFamily: {
        'maya': ['serif']
      }
    },
  },
  plugins: [],
}