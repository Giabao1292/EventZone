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
export const getOrganizers = async (
  page = 0,
  size = 10,
  sortBy,
  searchParams = {}
) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sort", sortBy.toString());

    // Add search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.append("search", `${key}:${value}`);
      }
    });

    const response = await apiClient.get(`/organizers?${params.toString()}`);
    return response.data;
  } catch (err) {
    console.error("❌ Error fetching organizers:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch organizers"
    );
  }
};

// Get detailed organizer information
export const getOrganizerDetails = async (orgId) => {
  try {
    const response = await apiClient.get(`/organizers/${orgId}`);
    return response.data;
  } catch (err) {
    console.error("❌ Error fetching organizer details:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch organizer details"
    );
  }
};

// Get organization types
export const getOrganizerTypes = async () => {
  try {
    const response = await apiClient.get("/organizers/types");
    return response.data;
  } catch (err) {
    console.error("❌ Error fetching organizer types:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch organizer types"
    );
  }
};

// Update organizer status (approve/reject)
export const updateOrganizerStatus = async (orgId, status) => {
  try {
    const response = await apiClient.put(
      `/organizers/${orgId}`,
      {}, // empty body
      { params: { status } } // <- status dưới dạng query param
    );
    return response.data;
  } catch (err) {
    console.error("❌ Error updating organizer status:", err);
    throw new Error(
      err.response?.data?.message || "Failed to update organizer status"
    );
  }
};
