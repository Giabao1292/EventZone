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
export const verifyRegisterApi = async (data) => {
  const { code, ...rest } = data;

  const res = await apiClient.post("auth/verify-email", rest, {
    headers: {
      "X-Verify-Token": code,
    },
  });
  const { accessToken } = res.data.data;

  saveToken(accessToken);
  return res.data;
};
export const resendVerificationCode = async (email) => {
  const res = await apiClient.post("auth/resend-code", { email });
  return res.data;
};

export const logout = async () => {
  await apiClient.post("auth/logout");
  removeToken();
};
export const loginWithGoogle = async ({ idToken }) => {
  const res = await apiClient.post("auth/google", { idToken });
  const { accessToken, user } = res.data.data;

  saveToken(accessToken);

  return { accessToken, user };
};
