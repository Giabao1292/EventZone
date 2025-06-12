import apiClient from "../api/axios";

export const getCategories = async () => {
  try {
    const res = await apiClient.get("category/categories");
    return res.data.data; // giả sử API trả về { code, message, data }
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh mục:", error);
    // fallback mock data
    return [
      { id: 1, name: "Âm nhạc" },
      { id: 2, name: "Thể thao" },
      { id: 3, name: "Công nghệ" },
      { id: 4, name: "Giáo dục" },
      { id: 5, name: "Nghệ thuật" },
    ];
  }
};
