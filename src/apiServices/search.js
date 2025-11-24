import { toast } from "react-toastify";
import { publicAPI } from "./AxiosInstance/axiosInstance";

const searchProducts = async (
  searchTerm,
  page = 1,
  limit = 10,
  sortPrice,
  sortNew
) => {
  try {
    if (sortPrice === "price-asc") {
      sortPrice = 1;
    } else if (sortPrice === "price-desc") {
      sortPrice = -1;
    } else {
      sortPrice = null;
    }
    if (sortNew === "newest") {
      sortNew = -1;
    } else if (sortNew === "oldest") {
      sortNew = 1;
    } else {
      sortNew = null;
    }
    const response = await publicAPI.get("/api/search", {
      params: {
        searchTerm,
        page,
        limit,
        ...(sortPrice && { sortPrice }),
        ...(sortNew && { sortNew }),
      },
    });
    return response.data.success ? response.data : null;
  } catch (error) {
    throw error;
  }
};

// const autoSearchProducts = async (searchTerm, limit = 5) => {
//   try {
//     const response = await publicAPI.get("/api/search/auto", {
//       params: { searchTerm, limit },
//     });
//     return response.data.success ? response.data.data : null;
//   } catch (error) {
//     throw error;
//   }
// };
const autoSearchProducts = async (searchTerm, limit = 5) => {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      // Trả default result mà không gọi API
      return { products: [], categories: [] };
    }

    const response = await publicAPI.get("/api/search/auto", {
      params: { searchTerm, limit }
    });

    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Search API error:", error.response?.data || error.message);
    return null;
  }
};


export { searchProducts, autoSearchProducts };
