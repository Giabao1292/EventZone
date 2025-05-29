import apiClient from "../api/axios";

export const getUserDetail = async () => {
  const res = await apiClient.get("/profile");
  return res.data.data;
};
