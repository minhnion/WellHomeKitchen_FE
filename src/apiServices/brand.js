import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getAllBrands = async (categoryId = null) => {
  try {
    const response = await publicAPI.get("/api/brands", {
      params: {
        categoryId: categoryId,
      },
    });
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getBrands = async (
  categoryId = null,
  page = 1,
  limit = 10,
  keyword = null
) => {
  try {
    const response = await publicAPI.get("/api/brands", {
      params: {
        categoryId: categoryId,
        page: page,
        limit: limit,
        keyword: keyword,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const createBrand = async (formData) => {
  try {
    const response = await privateAPI.post("/api/brands", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBrand = async (id, formData) => {
  try {
    const response = await privateAPI.put(`/api/brands/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await privateAPI.delete(`/api/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
