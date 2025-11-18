import { privateAPI } from "./AxiosInstance/axiosInstance";

const validateVoucher = async (code, cartTotal, productIds) => {
  try {
    const response = await publicAPI.post("/api/vouchers/validate", {
      code,
      cartTotal,
      productIds,
    });
    return response.data.success ? response.data.data : null;
  } catch (error) {
    throw error;
  }
};

const getVouchers = async (
  active = false,
  page = 1,
  limit = 10,
  keyword = null
) => {
  try {
    const response = await privateAPI.get("/api/vouchers", {
      params: { active, page, limit, keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};

const createVoucher = async (voucherData) => {
  try {
    const response = await privateAPI.post("/api/vouchers", voucherData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateVoucher = async (voucherId, voucherData) => {
  try {
    const response = await privateAPI.put(
      `/api/vouchers/${voucherId}`,
      voucherData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteVoucher = async (voucherId) => {
  try {
    const response = await privateAPI.delete(`/api/vouchers/${voucherId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export {
  validateVoucher,
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};
