import apiClient from "../api/axios";

/**
 * Lấy danh sách categories
 */
export const getCategories = async () => {
  try {
    const res = await apiClient.get("/categories");
    return res.data.data || [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh mục:", error);
    return [
      { id: 1, name: "Âm nhạc" },
      { id: 2, name: "Thể thao" },
      { id: 3, name: "Công nghệ" },
      { id: 4, name: "Giáo dục" },
      { id: 5, name: "Nghệ thuật" },
    ];
  }
};

export const getEventsByCategory = async (categoryId) => {
  try {
    const res = await apiClient.get(`/categories/${categoryId}/poster-images`);
    return res.data.data || [];
  } catch (error) {
    console.error(`❌ Lỗi lấy sự kiện cho category ${categoryId}:`, error);
    return [];
  }
};
