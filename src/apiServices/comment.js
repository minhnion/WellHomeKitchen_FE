import axios from "axios";
import { API_BASE_URL } from "./constants";
import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

const createComment = async (commentData) => {
  try {
    commentData = Object.fromEntries(
      Object.entries(commentData).filter(
        ([, value]) => value !== undefined && value !== null
      )
    );
    const response = await publicAPI.post(`/api/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

const getCommentsByProduct = async (productId, page = null, limit = null) => {
  try {
    const response = await publicAPI.get(`/api/comments/product/${productId}`, {
      params: {
        page,
        limit,
      },
    });
    return response.data.success ? response.data : null;
  } catch (error) {
    console.error("Error fetching product comments:", error);
    return [];
  }
};

const getCommentById = async (commentId) => {
  try {
    const response = await publicAPI.get(`/api/comments/${commentId}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Error fetching comment:", error);
    return null;
  }
};

const updateCommentByAnonymous = async (commentId, updateData, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/comments/anonymous/${commentId}`,
      { ...updateData, token }
    );
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Error updating anonymous comment:", error);
    throw error;
  }
};

const updateCommentByAuthor = async (commentId, updateData, authToken) => {
  try {
    const response = await privateAPI.put(
      `/api/comments/author/${commentId}`,
      updateData
    );
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Error updating author comment:", error);
    throw error;
  }
};

const deleteComment = async (commentId) => {
  try {
    const response = await privateAPI.delete(`/api/comments/${commentId}`);
    return response.data.success;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
};

export {
  createComment,
  getCommentsByProduct,
  getCommentById,
  updateCommentByAnonymous,
  updateCommentByAuthor,
  deleteComment,
};
