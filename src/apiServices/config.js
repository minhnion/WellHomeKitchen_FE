import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getAllConfig = async () => {
  try {
    const response = await publicAPI.get("/api/config");
    return response.data.success ? response.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getConfigByKey = async (key) => {
  try {
    const res = await publicAPI.get(`/api/config/${key}`);
    return res.data.success ? res.data.data.value : "";
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const getConfigByKeyFull = async (key) => {
  try {
    const res = await publicAPI.get(`/api/config/${key}`);
    return res.data.success ? res.data.data : "";
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateConfigByKey = async (key, formData) => {
  try {
    const response = await privateAPI.put(`/api/config/${key}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBankConfig = async () => {
  try {
    const response = await publicAPI.get("/api/config/bank");
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateBankConfig = async (formData) => {
  try {
    const response = await privateAPI.put("/api/config/bank", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
