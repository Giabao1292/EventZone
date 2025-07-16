import apiClient from "../api/axios";

export const getUserDetail = async () => {
  const res = await apiClient.get("/profile");
  return res.data.data;
};
export const updateUserDetail = async (userData) => {
  const res = await apiClient.put("/profile", userData);
  return res.data.data;
};
