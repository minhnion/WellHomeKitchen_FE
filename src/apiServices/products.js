import { privateAPI, publicAPI } from "./AxiosInstance/axiosInstance";

const getProductsById = async (id) => {
  try {
    const response = await publicAPI.get(`/api/products/${id}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getProductBySku = async (sku) => {
  try {
    const response = await publicAPI.get(`/api/products/sku/${sku}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getProductsBySlug = async (slug) => {
  try {
    const response = await publicAPI.get(`/api/products/slug/${slug}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getAllProducts = async (
  page = 1,
  limit = 10,
  categoryId = null,
  subCategoryId = null,
  brandId = null,
  keyword = null,
  isSpecial = null
) => {
  try {
    const response = await publicAPI.get("/api/products", {
      params: {
        page: page,
        limit: limit,
        category: categoryId,
        subCategory: subCategoryId,
        brand: brandId,
        keyword: keyword,
        isSpecial: isSpecial,
      },
    });
    return response.data.success ? response.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getTopSellingProducts = async (page = 1, limit = 10, category = null) => {
  try {
    const response = await publicAPI.get("/api/products/topSelling", {
      params: {
        page: page,
        limit: limit,
        category: category,
      },
    });
    return response.data.success ? response.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getProductWithFilter = async (
  page = 1,
  limit = 10,
  categoryId = null,
  subCategoryId = null,
  brandId = null,
  newest = null,
  bestseller = null,
  discount = null,
  sortPrice = null,
  minPrice = null,
  maxPrice = null,
  filter = {},
  keyword = null
) => {
  try {
    const response = await publicAPI.post("/api/products/extra-filter", {
      page: page,
      limit: limit,
      categoryId: categoryId,
      subCategoryId: subCategoryId,
      brand: brandId,
      newest: newest,
      bestseller: bestseller,
      discount: discount,
      sortPrice: sortPrice,
      minPrice: minPrice,
      maxPrice: maxPrice,
      filter: filter,
      keyword: keyword,
    });

    return response.data.success ? response.data : null;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const createProduct = async (formData) => {
  try {
    const response = await privateAPI.post("/api/products", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (id, formData) => {
  try {
    const response = await privateAPI.put(`/api/products/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await privateAPI.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProductOverviewStats = async () => {
  try {
    const response = await privateAPI.get("/api/products/overview-stats");
    return response.data.success ? response.data.data : null;
  } catch (error) {
    throw error;
  }
};

export {
  getProductsById,
  getProductBySku,
  getProductsBySlug,
  getAllProducts,
  getTopSellingProducts,
  getProductWithFilter,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductOverviewStats,
};
