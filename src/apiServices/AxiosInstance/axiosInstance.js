import axios from "axios";
import { API_BASE_URL } from "../constants";
import { isTokenExpired } from "@/utils/authenticate";

// Instance cho API public (không cần authentication)
const publicAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance cho API private (cần authentication với refresh token logic)
const privateAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag để tránh gọi refresh token nhiều lần đồng thời
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor cho private API - tự động thêm JWT token
privateAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor cho public API - chỉ xử lý lỗi cơ bản
publicAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Public API Error:", error.response?.status);
    return Promise.reject(error);
  }
);

// Response interceptor cho private API - có refresh token logic
privateAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken || isTokenExpired(refreshToken)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return privateAPI(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/refresh-token`,
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      const newAccessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return privateAPI(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/dang-nhap";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { publicAPI, privateAPI };
