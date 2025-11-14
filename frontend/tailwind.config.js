const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  // 1. Ép Dark Mode (như Notion)
  darkMode: 'class', 
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 2. Định nghĩa màu (như đã dùng ở GĐ 3)
        neutral: colors.neutral,
        brand: {
          DEFAULT: '#4a69ff',
          medium: '#3b55cc',
          dark: '#2c4099',
          light: '#f0f4ff',
        },
      },
      // 3. Thêm plugin typography cho Draft.js
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.100'), // Chữ prose màu sáng
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            strong: { color: theme('colors.gray.100') },
            // ... (thêm các style khác nếu cần)
          },
        },
      }),
    },
  },
  // 4. Thêm plugins
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}