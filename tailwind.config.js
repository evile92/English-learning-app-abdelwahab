/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // <-- هذا السطر هو الإصلاح الأهم
  theme: {
    extend: {},
  },
  plugins: [
     require('@tailwindcss/typography'), // هذا السطر مهم لتحسين شكل النصوص
  ],
}
