import apiClient from "../api/axios";

export const saveShowingLayout = async (layoutData) => {
  try {
    const response = await apiClient.post(
        "/events/save-layout",
        layoutData,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 15000,
        }
    );
    return response.data;
  } catch (err) {
    const errMsg = err.message || "Không thể lưu bố cục";
    throw new Error(errMsg);
  }
};
