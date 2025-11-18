import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

export const getBanners = async (
  page = null,
  limit = null,
  isShow = null,
  type = null,
  keyword = null
) => {
  try {
    const response = await publicAPI.get("/api/banners", {
      params: {
        page: page,
        limit: limit,
        isShow: isShow,
        type: type,
        keyword: keyword,
      },
    });
    return response.data.success ? response.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const createBanner = async (formData) => {
  try {
    const response = await privateAPI.post("/api/banners", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBanner = async (id, formData) => {
  try {
    const response = await privateAPI.put(`api/banners/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await privateAPI.delete(`/api/banners/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
