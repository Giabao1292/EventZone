import apiClient from "../api/axios";
import { removeToken, saveToken } from "../utils/storage";

export const fetchUserProfile = async (accessToken) => {
  const res = await apiClient.get("/users/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data.data; // Dữ liệu user
};

export const login = async (credentials) => {
  const res = await apiClient.post("auth/login", credentials);
  const { accessToken, refreshToken, roles } = res.data.data;

  saveToken(accessToken, refreshToken);

  // Lấy profile user
  const user = await fetchUserProfile(accessToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { accessToken, roles, user };
};

export const loginWithGoogle = async ({ idToken }) => {
  const res = await apiClient.post("auth/google", { idToken });
  const { accessToken, refreshToken, roles } = res.data.data;

  saveToken(accessToken, refreshToken);

  // Lấy profile user
  const user = await fetchUserProfile(accessToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { accessToken, roles, user };
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
  const { accessToken, refreshToken } = res.data.data || {};
  if (accessToken) {
    saveToken(accessToken, refreshToken);

    // Lấy profile user sau verify
    const user = await fetchUserProfile(accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  }
  return res.data.data;
};

export const logout = async () => {
  await apiClient.post("auth/logout");
  removeToken();
  localStorage.removeItem("user");
};
