import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getPostCategories = async (
  page = null,
  limit = null,
  isRoot = null,
  keyword = null
) => {
  try {
    const response = await publicAPI.get("/api/post-categories", {
      params: {
        page: page,
        limit: limit,
        isRoot: isRoot,
        keyword: keyword,
      },
    });
    return response.data.success ? response.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getPostCategoryBySlug = async (slug) => {
  try {
    const response = await publicAPI.get(`/api/post-categories/${slug}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const createPostCategory = async (formData) => {
  try {
    const response = await privateAPI.post("/api/post-categories", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePostCategory = async (slug, formData) => {
  try {
    const response = await privateAPI.put(
      `/api/post-categories/${slug}`,
      formData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePostCategory = async (slug) => {
  try {
    const response = await privateAPI.delete(`/api/post-categories/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
