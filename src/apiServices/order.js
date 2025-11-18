import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

const getOrderCode = async () => {
  try {
    const response = await publicAPI.get("/api/orders/order-code");
    return response.data.success ? response.data.data.orderCode : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const createOrder = async (orderData) => {
  try {
    const response = await publicAPI.post("/api/orders", orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllOrders = async (page = 1, limit = 10, status, keyword = null) => {
  try {
    const response = await privateAPI.get("/api/orders", {
      params: {
        page: page,
        limit: limit,
        status: status,
        keyword: keyword,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await privateAPI.put(`/api/orders/${orderId}/status`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const response = await privateAPI.put(`/api/orders/${orderId}/payment`, {
      paymentStatus: paymentStatus,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cancelOrder = async (orderId) => {
  try {
    const response = await publicAPI.post(`/api/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

const deleteOrder = async (orderId) => {
  try {
    const response = await privateAPI.delete(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getOrderOverviewStats = async () => {
  try {
    const response = await privateAPI.get("/api/orders/overview-stats");
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getRevenueOverviewStats = async () => {
  try {
    const response = await privateAPI.get("/api/orders/revenue-stats");
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getOrderByUserId = async (
  userId,
  currentPage = 1,
  limit = 10,
  status = null,
  keyword = null
) => {
  try {
    const response = await privateAPI.get(`/api/orders/user/${userId}`, {
      params: {
        page: currentPage,
        limit: limit,
        status: status,
        keyword: keyword,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getOrderByAnonymousId = async (
  anonymousId,
  currentPage = 1,
  limit = 10,
  status = null,
  keyword = null
) => {
  try {
    const response = await publicAPI.get(
      `/api/orders/anonymous/${anonymousId}`,
      {
        params: {
          page: currentPage,
          limit: limit,
          status: status,
          keyword: keyword,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePaymentStatusByUser = async (orderId, paymentStatus, userId) => {
  try {
    const response = await privateAPI.put(
      `/api/orders/${orderId}/payment/${userId}`,
      {
        paymentStatus: paymentStatus,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updatePaymentStatusByAnonymous = async (orderId, paymentStatus, anonymousId, paymentMethod = null, transactionId = null) => {
  try {
    const response = await publicAPI.put(
      `/api/orders/${orderId}/payment/anonymous/${anonymousId}`,
      {
        paymentStatus: paymentStatus,
        paymentMethod: paymentMethod,
        transactionId: transactionId,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};



export {
  getOrderCode,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
  getOrderOverviewStats,
  getRevenueOverviewStats,
  getOrderByUserId,
  getOrderByAnonymousId,
  updatePaymentStatusByUser,
  updatePaymentStatusByAnonymous,
};
