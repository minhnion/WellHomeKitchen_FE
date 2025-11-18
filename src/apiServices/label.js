import { publicAPI, privateAPI } from "./AxiosInstance/axiosInstance";
import { toast } from "react-toastify";

// Lấy danh sách tất cả labels - cần authentication và admin role
const getAllLabels = async () => {
  try {
    const response = await privateAPI.get("/api/labels");
    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error(response.data.message || "Lấy danh sách nhãn thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response?.status === 403) {
      toast.error("Bạn không có quyền truy cập");
    } else {
      toast.error("Có lỗi xảy ra khi lấy danh sách nhãn");
    }
    return null;
  }
};

// Tạo label mới - cần authentication và admin role
const createLabel = async (labelData) => {
  try {
    const response = await privateAPI.post("/api/labels", labelData);
    if (response.data.success) {
      toast.success("Tạo nhãn thành công");
      return response.data.data;
    } else {
      toast.error(response.data.message || "Tạo nhãn thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response?.status === 400) {
      toast.error("Dữ liệu nhãn không hợp lệ");
    } else if (error.response?.status === 403) {
      toast.error("Bạn không có quyền tạo nhãn");
    } else {
      toast.error("Có lỗi xảy ra khi tạo nhãn");
    }
    throw error;
  }
};

// Cập nhật label - cần authentication và admin role
const updateLabel = async (labelId, labelData) => {
  try {
    const response = await privateAPI.put(`/api/labels/${labelId}`, labelData);
    if (response.data.success) {
      toast.success("Cập nhật nhãn thành công");
      return response.data.data;
    } else {
      toast.error(response.data.message || "Cập nhật nhãn thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response?.status === 400) {
      toast.error("Dữ liệu nhãn không hợp lệ");
    } else if (error.response?.status === 403) {
      toast.error("Bạn không có quyền cập nhật nhãn");
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy nhãn");
    } else {
      toast.error("Có lỗi xảy ra khi cập nhật nhãn");
    }
    throw error;
  }
};

// Xóa label - cần authentication và admin role
const deleteLabel = async (labelId) => {
  try {
    const response = await privateAPI.delete(`/api/labels/${labelId}`);
    if (response.data.success) {
      toast.success("Xóa nhãn thành công");
      return true;
    } else {
      toast.error(response.data.message || "Xóa nhãn thất bại");
      return false;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response?.status === 403) {
      toast.error("Bạn không có quyền xóa nhãn");
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy nhãn");
    } else {
      toast.error("Có lỗi xảy ra khi xóa nhãn");
    }
    return false;
  }
};

// Lấy label theo ID - cần authentication và admin role
const getLabelById = async (labelId) => {
  try {
    const response = await privateAPI.get(`/api/labels/${labelId}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error(response.data.message || "Lấy chi tiết nhãn thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response?.status === 403) {
      toast.error("Bạn không có quyền truy cập");
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy nhãn");
    } else {
      toast.error("Có lỗi xảy ra khi lấy chi tiết nhãn");
    }
    return null;
  }
};

// ======================== 3 APIs MỚI ========================

// Lấy danh sách sản phẩm theo label - PUBLIC API
const getProductsByLabel = async (labelId, page = 1, limit = 10) => {
  try {
    const response = await publicAPI.get(`/api/labels/${labelId}/products`, {
      params: {
        page: page,
        limit: limit,
      },
    });
    if (response.data.success) {
      return response.data;
    } else {
      toast.error(response.data.message || "Lấy danh sách sản phẩm thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response?.status === 404) {
      toast.error("Không tìm thấy nhãn");
    } else if (error.response?.status === 400) {
      toast.error("Nhãn này đã bị xóa");
    } else {
      toast.error("Có lỗi xảy ra khi lấy danh sách sản phẩm");
    }
    return null;
  }
};

// Thêm nhãn cho sản phẩm - cần authentication và admin role
const addLabelToProduct = async (productId, labelId) => {
  try {
    const response = await privateAPI.post("/api/labels/add-to-product", {
      productId: productId,
      labelId: labelId,
    });
    if (response.data.success) {
      toast.success(
        response.data.data.message || "Thêm nhãn cho sản phẩm thành công"
      );
      return response.data.data;
    } else {
      toast.error(response.data.message || "Thêm nhãn cho sản phẩm thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response?.status === 400) {
      toast.error("Dữ liệu không hợp lệ");
    } else if (error.response?.status === 403) {
      toast.error("Bạn không có quyền thực hiện thao tác này");
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy sản phẩm hoặc nhãn");
    } else if (error.response?.status === 409) {
      toast.error("Sản phẩm đã có nhãn này rồi");
    } else {
      toast.error("Có lỗi xảy ra khi thêm nhãn cho sản phẩm");
    }
    throw error;
  }
};

// Xóa nhãn khỏi sản phẩm - cần authentication và admin role
const removeLabelFromProduct = async (productId) => {
  try {
    const response = await privateAPI.post("/api/labels/remove-from-product", {
      productId: productId,
    });
    if (response.data.success) {
      toast.success(
        response.data.data.message || "Xóa nhãn khỏi sản phẩm thành công"
      );
      return response.data.data;
    } else {
      toast.error(response.data.message || "Xóa nhãn khỏi sản phẩm thất bại");
      return null;
    }
  } catch (error) {
    console.log("Error: ", error);
    if (error.response?.status === 400) {
      if (error.response.data.message?.includes("chưa có nhãn")) {
        toast.error("Sản phẩm này chưa có nhãn");
      } else {
        toast.error("Dữ liệu không hợp lệ");
      }
    } else if (error.response?.status === 403) {
      toast.error("Bạn không có quyền thực hiện thao tác này");
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy sản phẩm");
    } else {
      toast.error("Có lỗi xảy ra khi xóa nhãn khỏi sản phẩm");
    }
    throw error;
  }
};

export {
  getAllLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  getLabelById,
  getProductsByLabel,
  addLabelToProduct,
  removeLabelFromProduct,
};
