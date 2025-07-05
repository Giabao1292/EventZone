import apiClient from "../api/axios";

export const createShowingTime = async (showingTimeData) => {
  try {
    const response = await apiClient.post(
      "/events/showing-times/create",
      {
        ...showingTimeData,
        showingTimes: Array.isArray(showingTimeData.showingTimes)
          ? showingTimeData.showingTimes
          : [showingTimeData.showingTimes],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );
    return response; // Return the full Axios response
  } catch (err) {
    const errMsg =
      err.response?.data?.message ||
      err.message ||
      "Failed to create showing time";
    throw new Error(errMsg);
  }
};

export const updateShowingTime = async (showingTimeId, showingTimeData) => {
  try {
    const response = await apiClient.put(
      `/events/showing-times/${showingTimeId}`,
      showingTimeData,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );
    return response;
  } catch (err) {
    const errMsg =
      err.response?.data?.message || "Failed to update showing time";
    throw new Error(errMsg);
  }
};
