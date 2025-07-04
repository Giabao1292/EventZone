import apiClient from "../api/axios";

export const getActiveAdsToday = async () => {
  const response = await apiClient.get("event-ads/active-today");
  return response.data.data; // lấy danh sách quảng cáo
};
// Fetch ads with optional filters and pagination
export const getAdsByStatus = async (
  page = 0,
  size = 10,
  sort = "createdAt",
  filters = {}
) => {
  try {
    const params = {
      page,
      size,
      sort: sort ? `${sort},desc` : undefined,
    };

    if (filters.title) params.title = filters.title;
    if (filters.status && filters.status !== "ALL")
      params.status = filters.status;
    if (filters.email) params.email = filters.email;

    const response = await apiClient.get("/event-ads", { params });

    return {
      code: response.status,
      data: response.data,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch advertisements"
    );
  }
};

// Review an ad (approve or reject)
export const reviewAds = async (adsId, status, reason) => {
  try {
    const params = { status };
    if (reason) params.reason = reason;

    const response = await apiClient.put(`/event-ads/review/${adsId}`, null, {
      params,
    });

    return {
      code: response.status,
      data: response.data,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to review advertisement"
    );
  }
};

// Fetch ad details
export const getAdDetails = async (adsId) => {
  try {
    const response = await apiClient.get(`/event-ads/${adsId}`);

    return {
      code: response.status,
      data: response.data,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch ad details"
    );
  }
};
