import apiClient from "../api/axios";

/**
 * Lưu layout cho suất chiếu
 * @param {Object} layoutData
 */
export const saveShowingLayout = async (layoutData) => {
  try {
    const response = await apiClient.post("/events/save-layout", layoutData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });
    return response.data;
  } catch (err) {
    const errMsg =
      err?.response?.data?.message || err.message || "Không thể lưu bố cục";
    throw new Error(errMsg);
  }
};

/**
 * Lấy lại layout đã lưu của 1 suất chiếu (showingTimeId)
 * @param {number|string} showingTimeId
 */
export const getLayoutByShowingTime = async (showingTimeId) => {
  try {
    const response = await apiClient.get(
      `/events/showing-times/${showingTimeId}/layout`
    );
    return response.data.data; // Thường là { seats: [], zones: [], ... }
  } catch (err) {
    // Có thể trả về null hoặc throw để xử lý giao diện
    return null;
  }
};

export const generateAILayout = async (prompt) => {
  try {
    const response = await apiClient.post("/ai/generate-layout", prompt, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000,
    });
    return response.data.data;
  } catch (err) {
    const errMsg =
      err?.response?.data?.message ||
      err.message ||
      "Không thể tạo layout từ AI";
    throw new Error(errMsg);
  }
};
