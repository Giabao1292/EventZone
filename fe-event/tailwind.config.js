/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Tên class Tailwind bạn muốn sử dụng : ['Tên font trên Google Fonts', 'font dự phòng']
        montserrat: ["Montserrat", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        // Bạn có thể thêm các font khác ở đây
        // Ví dụ nếu muốn dùng cho tiêu đề: 'heading': ['YourHeadingFont', 'sans-serif'],
        // Ví dụ nếu muốn dùng cho nội dung: 'body': ['YourBodyFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
