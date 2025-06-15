import apiClient from "../api/axios";

export const createShowingTime = async (showingTimeData) => {
  try {
    const response = await apiClient.post(
      "/events/showing-times/create",
      showingTimeData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );
    return response.data;
  } catch (err) {
    const errMsg =
      err.response?.data?.message || "Failed to create showing time";
    throw new Error(errMsg);
  }
};
