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
