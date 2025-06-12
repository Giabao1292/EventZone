import apiClient from "../api/axios";

export const register = async (formData) => {
  try {
    const response = await apiClient.post("/organizers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 25000,
    });
    return response.data;
  } catch (err) {
    const errMsg =
      err.response?.data?.message || "Failed to register organizer";
    throw new Error(errMsg);
  }
};

export const getOrganizerByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/organizer/${userId}`);
    return response.data.data;
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin tổ chức:", err);
    throw new Error(err.response?.data?.message || "Failed to fetch organizer");
  }
};
