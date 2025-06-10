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
