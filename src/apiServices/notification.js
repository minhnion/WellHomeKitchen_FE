import { privateAPI } from "./AxiosInstance/axiosInstance";

export const getNotifications = async (page = 1, limit = 10) => {
  try {
    const response = await privateAPI.get("/api/notifications", {
      params: {
        page: page,
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markNotificationIsRead = async (id) => {
  try {
    const response = await privateAPI.put(`/api/notifications/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationIsRead = async () => {
  try {
    const response = await privateAPI.put("/api/notifications/mark-all-read");
    return response.data;
  } catch (error) {
    throw error;
  }
};
