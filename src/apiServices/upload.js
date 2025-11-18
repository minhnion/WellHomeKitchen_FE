import { privateAPI } from "./AxiosInstance/axiosInstance";

export const uploadImage = async (imageFile, name) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("name", name);
  try {
    const response = await privateAPI.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.success ? response.data.data.url : null;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const getListFiles = async (page = 1, limit = 10, keyword = "") => {
  try {
    const response = await privateAPI.get("/api/upload", {
      params: { page, limit, keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting list of files:", error);
    throw error;
  }
};

export const deleteFile = async (fileName) => {
  try {
    const response = await privateAPI.delete(`/api/upload/${fileName}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
    throw error;
  }
};
