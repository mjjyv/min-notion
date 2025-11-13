/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tạo một bảng màu tùy chỉnh cho thương hiệu
        brand: {
          light: '#f0f4ff', // Nền nhạt
          DEFAULT: '#4a69ff', // Màu chính
          medium: '#3b55cc', // Hover
          dark: '#2c4099', // Active/Focus
        },
      },
      // Thêm hiệu ứng cho form
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
      },
      animation: {
        shake: 'shake 5s ease-in-out',
      },
    },
  },
  plugins: [
    // Thêm plugin form của Tailwind để reset style
    require('@tailwindcss/forms'),
  ],
};