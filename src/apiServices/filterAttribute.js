import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getFilterAttriButes = async (categoryId) => {
  try {
    const response = await publicAPI.get("/api/filter-attributes", {
      params: {
        categoryId: categoryId,
      },
    });
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const createFilterAttriBute = async (data) => {
  try {
    const response = await privateAPI.post("/api/filter-attributes", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFilterAttriBute = async (categoryId, data) => {
  try {
    const response = await privateAPI.put(
      `/api/filter-attributes/${categoryId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFilterAttriBute = async (categoryId) => {
  try {
    const response = await privateAPI.delete(
      `/api/filter-attributes/${categoryId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
