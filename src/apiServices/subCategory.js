import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getSubCategories = async (categoryId) => {
  try {
    const response = await publicAPI.get("/api/subCategory", {
      params: {
        categoryId: categoryId,
      },
    });
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getSubCategoriesWithPagination = async (
  categoryId = null,
  page = 1,
  limit = 10,
  keyword = null
) => {
  try {
    const response = await publicAPI.get("/api/subCategory", {
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

export const createSubCategory = async (formData) => {
  try {
    const response = await privateAPI.post("/api/subCategory", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubCategory = async (id, formData) => {
  try {
    const response = await privateAPI.put(`/api/subCategory/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSubCategory = async (id) => {
  try {
    const response = await privateAPI.delete(`/api/subCategory/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
