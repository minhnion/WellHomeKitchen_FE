import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getAllCategories = async () => {
  try {
    const response = await publicAPI.get("/api/categories");
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getCategories = async (page = 1, limit = 10, keyword = null) => {
  try {
    const response = await publicAPI.get("/api/categories", {
      params: { page, limit, keyword },
    });
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const response = await publicAPI.get(`/api/categories/slug/${slug}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error);
    console.log("Error: ", error);
  }
};

export const createCategory = async (formData) => {
  try {
    const response = await privateAPI.post("/api/categories", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id, formData) => {
  try {
    const response = await privateAPI.put(`/api/categories/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await privateAPI.delete(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
