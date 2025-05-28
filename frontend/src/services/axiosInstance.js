import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Luôn tự động gắn token mới nhất vào mỗi request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
