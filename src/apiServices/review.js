import { publicAPI, privateAPI } from "./AxiosInstance/axiosInstance";
import { toast } from "react-toastify";

// Tạo đánh giá mới - cần authentication
const createReview = async (reviewData) => {
  try {
    const response = await privateAPI.post("/api/reviews", reviewData);
    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error(response.data.message || "Tạo đánh giá thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

// Lấy danh sách đánh giá theo sản phẩm - public API
const getReviewsByProduct = async (
  productId,
  page = 1,
  limit = 10,
  rating = null
) => {
  try {
    const response = await publicAPI.get(`/api/reviews/product/${productId}`, {
      params: {
        page: page,
        limit: limit,
        rating: rating,
      },
    });
    if (response.data.success) {
      return response.data;
    } else {
      toast.error(response.data.message || "Lấy đánh giá thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Lấy danh sách đánh giá của người dùng hiện tại - cần authentication
const getReviewsByUser = async (page = 1, limit = 10) => {
  try {
    const response = await privateAPI.get("/api/reviews/user", {
      params: {
        page: page,
        limit: limit,
      },
    });
    if (response.data.success) {
      return response.data;
    } else {
      toast.error(
        response.data.message || "Lấy đánh giá của người dùng thất bại"
      );
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Lấy chi tiết đánh giá theo ID - public API
const getReviewById = async (reviewId) => {
  try {
    const response = await publicAPI.get(`/api/reviews/${reviewId}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error(response.data.message || "Lấy chi tiết đánh giá thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Cập nhật đánh giá - cần authentication
const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await privateAPI.put(
      `/api/reviews/${reviewId}`,
      reviewData
    );
    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error(response.data.message || "Cập nhật đánh giá thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

// Xóa đánh giá - cần authentication
const deleteReview = async (reviewId) => {
  try {
    const response = await privateAPI.delete(`/api/reviews/${reviewId}`);
    if (response.data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Thống kê đánh giá theo sản phẩm - public API
const getReviewStats = async (productId) => {
  try {
    const response = await publicAPI.get(`/api/reviews/stats/${productId}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error(response.data.message || "Lấy thống kê đánh giá thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

export {
  createReview,
  getReviewsByProduct,
  getReviewsByUser,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewStats,
};
