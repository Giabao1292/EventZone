import apiClient from "../api/axios";
import { removeToken, saveToken } from "../utils/storage";

export const login = async (credentials) => {
  const res = await apiClient.post("auth/login", credentials);
  const { accessToken, user } = res.data.data;

  saveToken(accessToken);

  return { accessToken, user };
};
export const register = async (userData) => {
  const res = await apiClient.post("auth/register", userData);
  return res.data;
};
export const logout = async () => {
  await apiClient.post("auth/logout");
  removeToken();
};
