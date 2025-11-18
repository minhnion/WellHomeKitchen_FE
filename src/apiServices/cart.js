import { privateAPI } from "./AxiosInstance/axiosInstance";
import { toast } from "react-toastify";

// Thêm sản phẩm vào giỏ hàng
export const addItemToCart = async (productId, quantity = 1) => {
  try {
    const response = await privateAPI.post("/api/cart/add-item", {
      productId,
      quantity,
    });

    if (response.data.success) {
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      return response.data;
    } else {
      toast.error(response.data.message || "Thêm sản phẩm thất bại");
      return null;
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);

    if (error.response?.status === 400) {
      toast.error("Dữ liệu không hợp lệ");
    } else if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy sản phẩm");
    } else if (error.response?.status === 409) {
      toast.error("Sản phẩm đã có trong giỏ hàng");
    } else {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }

    throw error;
  }
};

// Lấy chi tiết giỏ hàng
export const getCartDetail = async (selectedProduct = []) => {
  try {
    const response = await privateAPI.post("/api/cart/get-detail", {
      selectedProduct,
    });

    if (response.data.success) {
      const responseData = response.data.data.items.map((item) => ({
        id: item.productId,
        ...item,
      }));
      return responseData || [];
    } else {
      toast.error(response.data.message || "Lấy giỏ hàng thất bại");
      return [];
    }
  } catch (error) {
    console.error("Error getting cart details:", error);

    if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng");
    } else if (error.response?.status === 404) {
      // Giỏ hàng trống - không hiện toast error
      return [];
    } else {
      toast.error("Có lỗi xảy ra khi lấy giỏ hàng");
    }

    return [];
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const response = await privateAPI.put(`/api/cart/${itemId}`, {
      quantity,
    });

    if (response.data.success) {
      response.data.data.id = itemId;
      return response.data;
    } else {
      toast.error(response.data.message || "Cập nhật số lượng thất bại");
      return null;
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);

    if (error.response?.status === 400) {
      toast.error("Số lượng không hợp lệ");
    } else if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập");
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy sản phẩm trong giỏ hàng");
    } else if (error.response?.status === 409) {
      toast.error("Số lượng vượt quá tồn kho");
    } else {
      toast.error("Có lỗi xảy ra khi cập nhật số lượng");
    }

    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const deleteItemsFromCart = async (productIds) => {
  try {
    const response = await privateAPI.delete("/api/cart", {
      data: { productIds },
    });

    if (response.data.success) {
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      return response.data;
    } else {
      toast.error(response.data.message || "Xóa sản phẩm thất bại");
      return null;
    }
  } catch (error) {
    console.error("Error removing items from cart:", error);

    if (error.response?.status === 400) {
      toast.error("Dữ liệu không hợp lệ");
    } else if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập");
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy sản phẩm trong giỏ hàng");
    } else {
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }

    throw error;
  }
};

// Lấy toàn bộ giỏ hàng của user
export const getFullCart = async () => {
  try {
    const response = await privateAPI.get("/api/cart");

    if (response.data.success) {
      return response.data.data;
    } else {
      toast.error(response.data.message || "Lấy giỏ hàng thất bại");
      return null;
    }
  } catch (error) {
    console.error("Error getting full cart:", error);

    if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng");
    } else if (error.response?.status === 404) {
      // Giỏ hàng trống - return empty cart
      return { items: [], totalAmount: 0, totalItems: 0 };
    } else {
      toast.error("Có lỗi xảy ra khi lấy giỏ hàng");
    }

    return null;
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
  try {
    const response = await privateAPI.delete("/api/cart/clear");

    if (response.data.success) {
      toast.success("Đã xóa toàn bộ giỏ hàng");
      return response.data;
    } else {
      toast.error(response.data.message || "Xóa giỏ hàng thất bại");
      return null;
    }
  } catch (error) {
    console.error("Error clearing cart:", error);

    if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập");
    } else if (error.response?.status === 404) {
      toast.info("Giỏ hàng đã trống");
      return { success: true };
    } else {
      toast.error("Có lỗi xảy ra khi xóa giỏ hàng");
    }

    throw error;
  }
};

// Kiểm tra sản phẩm có trong giỏ hàng không
export const checkProductInCart = async (productId) => {
  try {
    const response = await privateAPI.get(`/api/cart/check/${productId}`);

    if (response.data.success) {
      return response.data.data; // { inCart: boolean, quantity?: number }
    } else {
      return { inCart: false };
    }
  } catch (error) {
    console.error("Error checking product in cart:", error);

    if (error.response?.status === 401) {
      // User chưa đăng nhập - không có giỏ hàng
      return { inCart: false };
    } else if (error.response?.status === 404) {
      return { inCart: false };
    }

    return { inCart: false };
  }
};

// Đồng bộ giỏ hàng local với server (nếu có)
export const syncCart = async (localCartItems = []) => {
  try {
    const response = await privateAPI.post("/api/cart/sync", {
      items: localCartItems,
    });

    if (response.data.success) {
      toast.success("Đã đồng bộ giỏ hàng");
      return response.data.data;
    } else {
      toast.error(response.data.message || "Đồng bộ giỏ hàng thất bại");
      return null;
    }
  } catch (error) {
    console.error("Error syncing cart:", error);

    if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập để đồng bộ giỏ hàng");
    } else {
      toast.error("Có lỗi xảy ra khi đồng bộ giỏ hàng");
    }

    throw error;
  }
};

// Lấy số lượng sản phẩm trong giỏ hàng
export const getCartItemCount = async () => {
  try {
    const response = await privateAPI.get("/api/cart/count");

    if (response.data.success) {
      return response.data.data.count || 0;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error getting cart count:", error);

    if (error.response?.status === 401) {
      // User chưa đăng nhập
      return 0;
    }

    return 0;
  }
};

// Áp dụng mã giảm giá cho giỏ hàng
export const applyCoupon = async (couponCode) => {
  try {
    const response = await privateAPI.post("/api/cart/apply-coupon", {
      couponCode,
    });

    if (response.data.success) {
      toast.success("Đã áp dụng mã giảm giá");
      return response.data.data;
    } else {
      toast.error(response.data.message || "Áp dụng mã giảm giá thất bại");
      return null;
    }
  } catch (error) {
    console.error("Error applying coupon:", error);

    if (error.response?.status === 400) {
      toast.error("Mã giảm giá không hợp lệ");
    } else if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập");
    } else if (error.response?.status === 404) {
      toast.error("Mã giảm giá không tồn tại");
    } else if (error.response?.status === 410) {
      toast.error("Mã giảm giá đã hết hạn");
    } else {
      toast.error("Có lỗi xảy ra khi áp dụng mã giảm giá");
    }

    throw error;
  }
};

// Hủy mã giảm giá
export const removeCoupon = async () => {
  try {
    const response = await privateAPI.delete("/api/cart/remove-coupon");

    if (response.data.success) {
      toast.success("Đã hủy mã giảm giá");
      return response.data.data;
    } else {
      toast.error(response.data.message || "Hủy mã giảm giá thất bại");
      return null;
    }
  } catch (error) {
    console.error("Error removing coupon:", error);

    if (error.response?.status === 401) {
      toast.error("Vui lòng đăng nhập");
    } else if (error.response?.status === 404) {
      toast.info("Không có mã giảm giá để hủy");
    } else {
      toast.error("Có lỗi xảy ra khi hủy mã giảm giá");
    }

    throw error;
  }
};
