/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Màu nền chính của body
        darkBg: "#1D1D1D",

        // Màu nền của container bao quanh form
        darkContainer: "#2D2D3A",

        // Màu nền của từng section trong form (ví dụ: "Địa chỉ sự kiện")
        darkSection: "#23252B",

        // Màu nền của các input/select/textarea
        inputWhite: "#FFFFFF",

        // Màu viền của các input/select/textarea
        inputBorder: "#444455",

        // Màu khi input được focus (màu tím)
        focusPurple: "#8A2BE2",

        // Màu xanh lá cây cho radio button khi được chọn và nút submit
        checkedGreen: "#00BF63",

        // Màu xám cho các nhãn (label) và placeholder
        grayText: "#B0B0B0", // Tên gợi ý, bạn có thể đặt là 'gray-400' nếu không muốn tạo mới
        grayLight: "#E0E0E0", // Màu chữ trắng nhạt
        grayMedium: "#999999", // Màu placeholder
        grayDark: "#333333", // Màu chữ trong input trắng

        // Màu cho viền radio button chưa chọn và nền của vòng tròn radio
        grayRadioBorder: "#555566",
        grayRadioBg: "#3C3C4F",

        // Màu đỏ cho dấu * required
        requiredRed: "#FF6B6B",
      },
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
