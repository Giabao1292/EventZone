import axios from "axios";
import {
  getToken,
  getRefreshToken,
  saveToken,
  removeToken,
} from "../utils/storage";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/",
  timeout: 10000,
});

// Gắn accessToken cho mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tự động refresh nếu gặp lỗi (400, 401, 403)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Tránh loop vô hạn
    if (
      originalRequest._retry ||
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        removeToken();
        return Promise.reject(error);
      }

      // Gọi refresh token
      const response = await axios.post(
        "http://localhost:8080/api/auth/refresh-token",
        null,
        {
          headers: {
            "X-Refresh-Token": refreshToken,
          },
        }
      );

      const newAccessToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken;

      saveToken(newAccessToken, newRefreshToken);

      // Gắn token mới và gửi lại request cũ
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      removeToken();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
