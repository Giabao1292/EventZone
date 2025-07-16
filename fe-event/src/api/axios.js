import axios from "axios";
import { getToken } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/",
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const navigate = useNavigate(); // Lưu ý: Không hoạt động trực tiếp trong file không phải component
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
