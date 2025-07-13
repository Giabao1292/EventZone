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
    return response;
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

export const getShowingTimesByEvent = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/showing-times`);
    return response.data.data;
  } catch (err) {
    const errMsg =
        err.response?.data?.message || "Failed to get showing times";
    throw new Error(errMsg);
  }
};

export const getShowingTimeById = async (showingTimeId) => {
  try {
    const response = await apiClient.get(`/events/showing-times/${showingTimeId}`);
    return response.data.data;
  } catch (err) {
    const errMsg =
        err.response?.data?.message || "Failed to get showing time detail";
    throw new Error(errMsg);
  }
};

export const deleteShowingTime = async (showingTimeId) => {
  try {
    const response = await apiClient.delete(`/events/showing-times/${showingTimeId}`);
    return response.data;
  } catch (err) {
    const errMsg =
        err.response?.data?.message || "Failed to delete showing time";
    throw new Error(errMsg);
  }
};
