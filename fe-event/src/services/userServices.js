import apiClient from "../api/axios";

export const getUserDetail = async () => {
  const res = await apiClient.post("/users/details");
  return res.data.user;
};
