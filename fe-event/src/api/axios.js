import axios from "axios";
import { getToken } from "../utils/storage";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/",
  timeout: 10000,
});

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Defer 401 handling to components
    return Promise.reject(error);
  }
);

export default apiClient;
