import apiClient from "../api/axios";

export const register = async (formData) => {
  try {
    const response = await apiClient.post("/organizers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // Tăng timeout lên 60 giây
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
  console.log("🔍 getOrganizerDetails called with orgId:", orgId);
  try {
    console.log("🔍 Making API call to:", `/organizers/${orgId}`);
    const response = await apiClient.get(`/organizers/${orgId}`);
    console.log("🔍 API response:", response);
    return response.data;
  } catch (err) {
    console.error("❌ Error fetching organizer details:", err);
    console.error("❌ Error details:", {
      message: err.message,
      response: err.response,
      status: err.response?.status,
      data: err.response?.data,
    });
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

// Get organizer status
export const getOrganizerStatus = async () => {
  try {
    const response = await apiClient.get("/organizers/status");
    return response.data;
  } catch (err) {
    console.error("❌ Error fetching organizer status:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch organizer status"
    );
  }
};

// Test admin authentication
export const testAdminAuth = async () => {
  try {
    console.log("🔍 Testing admin authentication...");
    const response = await apiClient.get("/organizers/test-auth");
    console.log("🔍 Auth test response:", response);
    return response.data;
  } catch (err) {
    console.error("❌ Auth test error:", err);
    throw new Error(
      err.response?.data?.message || "Failed to test admin authentication"
    );
  }
};

// Test database connection
export const testDatabase = async () => {
  try {
    console.log("🔍 Testing database connection...");
    const response = await apiClient.get("/organizers/test-db");
    console.log("🔍 Database test response:", response);
    return response.data;
  } catch (err) {
    console.error("❌ Database test error:", err);
    throw new Error(
      err.response?.data?.message || "Failed to test database connection"
    );
  }
};
