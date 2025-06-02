import apiClient from "../api/axios";

export const getUserDetail = async () => {
  const res = await apiClient.get("/users");
  return res.data.data;
};
export const updateUserDetail = async (userData) => {
  const res = await apiClient.put("/users", userData);
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
