/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // --- ✅ بداية التعديل المطلوب ---
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'textarea, input': {
              all: 'unset',
            },
          },
        },
      }),
      // --- 🛑 نهاية التعديل المطلوب ---
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
