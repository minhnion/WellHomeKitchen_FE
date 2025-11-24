import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";
import axios from "axios";

export const login = async (email, password, token) => {
  try {
    const response = await publicAPI.post("/api/auth/login", {
      email: email,
      password: password,
      token: token,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (email, userName, password, phoneNumber) => {
  try {
    const response = await publicAPI.post("/api/auth/register", {
      email,
      userName,
      password,
      phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh Token");
  }
  try {
    const response = await publicAPI.get("/api/auth/refresh-token", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (formData) => {
  try {
    const response = await privateAPI.put("/api/auth/profile", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await publicAPI.post("/api/auth/forgot-password", {
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkEmailExists = async (email) => {
  try {
    // Phương án 1: Gọi API check email riêng
    const response = await publicAPI.post("/api/auth/check-email", { email });
    return response.data.exists;
  } catch (error) {
    try {
      // Phương án 2: Thử đăng nhập để kiểm tra
      const loginResponse = await publicAPI.post("/api/auth/check-account", {
        email,
        password: 'dummy_password'
      });
      // Nếu trả về lỗi "Email chưa đăng ký" thì return false
      return loginResponse.data.exists !== false;
    } catch (loginError) {
      // Nếu lỗi là "Email không tồn tại" thì return false
      if (loginError.response?.data?.message?.includes('không tồn tại')) {
        return false;
      }
      throw loginError;
    }
  }
};