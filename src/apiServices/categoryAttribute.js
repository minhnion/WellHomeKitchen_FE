import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getCategoryAttributes = async (categoryId) => {
  try {
    const response = await publicAPI.get("/api/category-attributes", {
      params: {
        categoryId: categoryId,
      },
    });
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const createCategoryAttribute = async (data) => {
  try {
    const response = await privateAPI.post("/api/category-attributes", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategoryAttribute = async (categoryId, data) => {
  try {
    const response = await privateAPI.put(
      `/api/category-attributes/${categoryId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategoryAttribute = async (categoryId) => {
  try {
    const response = await privateAPI.delete(
      `/api/category-attributes/${categoryId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
