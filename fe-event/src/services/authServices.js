import apiClient from "../api/axios";
import { removeToken, saveToken } from "../utils/storage";

export const login = async (credentials) => {
  const res = await apiClient.post("auth/login", credentials);
  const { accessToken, roles } = res.data.data;

  saveToken(accessToken);

  return { accessToken, roles };
};
export const register = async (userData) => {
  const res = await apiClient.post("auth/register", userData);
  return res.data;
};
export const resendVerificationEmail = async (email) => {
  const res = await apiClient.post("auth/resend-code", { email });
  return res.data;
};

export const verifyRegisterApi = async (verifyToken) => {
  const res = await apiClient.get(
    `/auth/verify-email?verifyToken=${verifyToken}`
  );
  const { accessToken } = res.data.data || {};
  if (accessToken) {
    saveToken(accessToken);
  }
  return res.data.data;
};
export const logout = async () => {
  await apiClient.post("auth/logout");
  removeToken();
};
export const loginWithGoogle = async ({ idToken }) => {
  const res = await apiClient.post("auth/google", { idToken });
  const { accessToken, roles } = res.data.data;

  saveToken(accessToken);

  return { accessToken, roles };
};
