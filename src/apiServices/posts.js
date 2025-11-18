import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

const getAllPosts = async (
  page = null,
  limit = null,
  status = null,
  postCategory = null,
  keyword = null
) => {
  try {
    const response = await publicAPI.get("/api/posts", {
      params: {
        page: page,
        limit: limit,
        status: status,
        postCategory: postCategory,
        keyword: keyword,
      },
    });
    return response.data.success ? response.data : null;
  } catch (error) {
    console.log("Error: ", error)
  }
};

const getPostBySlug = async (slug) => {
  try {
    const response = await publicAPI.get(`/api/posts/${slug}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error)
  }
};

const createPost = async (formData) => {
  try {
    const response = await privateAPI.post("/api/posts", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (slug, formData) => {
  try {
    const response = await privateAPI.put(`/api/posts/${slug}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deletePost = async (slug) => {
  try {
    const response = await privateAPI.delete(`/api/posts/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPostOverviewStats = async () => {
  try {
    const response = await privateAPI.get("/api/posts/overview-stats");
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getPostOverviewStats,
};
