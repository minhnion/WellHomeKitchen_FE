import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getUsers = async (
  page = 1,
  limit = 10,
  role = null,
  keyword = null
) => {
  try {
    const response = await privateAPI.get("/api/users", {
      params: {
        page: page,
        limit: limit,
        role: role,
        keyword: keyword,
      },
    });
    return response.data.success ? response.data : null;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (formData) => {
  try {
    const response = await privateAPI.post("/api/users", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, formData) => {
  try {
    const response = await privateAPI.put(`/api/users/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await privateAPI.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
