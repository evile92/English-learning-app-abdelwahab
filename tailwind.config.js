/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // هذا السطر مهم لتفعيل الوضع الليلي
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // هذا السطر مهم لتنسيق النصوص
  ],
}
