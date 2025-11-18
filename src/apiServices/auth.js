import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

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
