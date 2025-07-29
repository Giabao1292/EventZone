import apiClient from "../api/axios";

export const getUserDetail = async () => {
  const res = await apiClient.get("/users/profile");
  return res.data.data;
};
export const updateUserDetail = async (userData) => {
  const res = await apiClient.put("/users/update", userData);
  return res.data.data;
};
export const updateUserAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Có lỗi xảy ra khi upload avatar!");
  }
};
export const changePassword = async (data) => {
  const res = await apiClient.put("/users/change-password", data);
  return res.data;
};
export const getUserList = async (params) => {
  const searchParams = new URLSearchParams();

  // Add pagination params
  searchParams.append("page", params.page.toString());
  searchParams.append("size", params.size.toString());

  if (params.sort) {
    searchParams.append("sort", params.sort);
  }

  // Add search params in the required format: search=key[:<>]value
  if (params.search && params.search.length > 0) {
    params.search.forEach((searchTerm) => {
      searchParams.append("search", searchTerm);
    });
  }

  const res = await apiClient.get(`/users?${searchParams.toString()}`);
  return res.data;
};

export const createUser = async (userData) => {
  const res = await apiClient.post("/users", userData);
  return res.data;
};

export const updateUser = async (id, userData) => {
  // Remove password if empty for update
  const updateData = { ...userData };
  if (!updateData.password) {
    delete updateData.password;
  }

  const res = await apiClient.put(`/users/${id}`, updateData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await apiClient.delete(`/users/${id}`);
  return res.data;
};
export const getRoles = async () => {
  const res = await apiClient.get("/users/roles");
  return res.data;
};
export const createRole = async (roleName) => {
  const res = await apiClient.post("/users/roles", {
    role: roleName,
  });
  return res.data;
};
export const getTopClients = async (params = {}) => {
  try {
    const response = await apiClient.get("/users/top", { params });
    // Trả về phần 'data' của response, nơi chứa danh sách top clients
    // Dựa trên cấu trúc ResponseData của bạn: { code, message, data }
    if (response.data && response.data.code === 200) {
      return response.data.data;
    } else {
      // Xử lý trường hợp API trả về code khác 200 hoặc cấu trúc không mong muốn
      throw new Error(
        response.data.message ||
          "Failed to fetch top clients: Invalid response."
      );
    }
  } catch (error) {
    console.error("Error fetching top clients:", error);
    // Ném lỗi để component gọi có thể bắt và xử lý
    throw error;
  }
};
export const getBankList = async () => {
  try {
    const res = await apiClient.get("/users/banks");
    if (res.data && res.data.code === 200) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || "Failed to fetch bank list");
    }
  } catch (error) {
    console.error("Error fetching bank list:", error);
    throw error;
  }
};

export const addBankAccount = async (bankData) => {
  try {
    const res = await apiClient.post("/users/banks", {
      bankName: bankData.bankName,
      accountNumber: bankData.accountNumber,
      holderName: bankData.holderName,
    });
    if (res.data && res.data.code === 200) {
      return res.data.data;
    } else {
      throw new Error(res.data.message || "Failed to add bank account");
    }
  } catch (error) {
    console.error("Error adding bank account:", error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Có lỗi xảy ra khi thêm tài khoản ngân hàng!");
  }
};

// Alias for backward compatibility
export const addBank = addBankAccount;
export const deleteBank = async (bankId) => {
  try {
    const res = await apiClient.delete(`/users/banks/${bankId}`);
    if (res.data && res.data.code === 200) {
      return res.data;
    } else {
      throw new Error(res.data.message || "Failed to delete bank");
    }
  } catch (error) {
    console.error("Error deleting bank:", error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Có lỗi xảy ra khi xóa tài khoản ngân hàng!");
  }
};

// Future API for setting default bank (if needed)
export const setDefaultBank = async (bankId) => {
  try {
    const res = await apiClient.patch(`/users/banks/${bankId}/default`);
    if (res.data && res.data.code === 200) {
      return res.data;
    } else {
      throw new Error(res.data.message || "Failed to set default bank");
    }
  } catch (error) {
    console.error("Error setting default bank:", error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Có lỗi xảy ra khi thiết lập tài khoản mặc định!");
  }
};
