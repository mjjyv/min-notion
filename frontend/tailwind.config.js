/** @type {import('tailwindcss').Config} */
export default {
  // QUAN TRỌNG: Dòng này cho phép chuyển đổi giao diện bằng cách thêm class 'dark' vào thẻ html
  darkMode: 'class', 
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: require('tailwindcss/colors').neutral,
        brand: {
          DEFAULT: '#4a69ff',
          medium: '#3b55cc',
          dark: '#2c4099',
          light: '#f0f4ff',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.100'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            strong: { color: theme('colors.gray.100') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}