import { publicAPI, privateAPI } from "./AxiosInstance/axiosInstance";


const getSaleCategories = async (time) => {
    try {
        const response = await publicAPI.get("/api/sales/categories", {
            params: { time },
        });
        return response.data.success ? response.data.data : [];
    } catch (error) {
        console.log("Error getSaleCategories:", error);
        throw error;
    }
};


const getSaleProducts = async ({
    time,
    category,
    page = 1,
    limit = 10,
} = {}) => {
    try {
        if (!time) return null;

        const params = { time, page, limit };

        if (category) {
            params.category = category;
        }

        const response = await publicAPI.get("/api/sales/products", { params });

        return response.data.success ? response.data : null;
    } catch (error) {
        console.log("Error getSaleProducts:", error);
        throw error;
    }
};

const getAllSaleProducts = async ({
    time,
    category,
    page = 1,
    limit = 10,
} = {}) => {
    try {
        if (!time) return null;

        const params = { time, page, limit };

        const response = await publicAPI.get(
            "/api/sales/products/all",
            { params }
        );

        return response.data.success ? response.data : null;
    } catch (error) {
        console.log("Error getAllSaleProducts:", error);
        throw error;
    }
};



const getAllSaleOccasions = async ({
    page = 1,
    limit = 10,
    search = "",
} = {}) => {
    try {
        const response = await privateAPI.get("/api/sales", {
            params: { page, limit, search },
        });

        if (!response.data?.success) {
            return {
                sales: [],
                totalRecords: 0,
                totalPages: 0,
                currentPage: 1,
            };
        }

        return response.data.data;

    } catch (error) {
        console.log("Error getAllSaleOccasions:", error);
        throw error;
    }
};



const createSaleOccasion = async (payload) => {
    try {
        const response = await privateAPI.post("/api/sales", payload);
        return response.data;
    } catch (error) {
        console.log("Error createSaleOccasion:", error);
        throw error;
    }
};



const updateSaleOccasion = async (id, payload) => {
    try {
        const response = await privateAPI.put(`/api/sales/${id}`, payload);
        return response.data;
    } catch (error) {
        console.log("Error updateSaleOccasion:", error);
        throw error;
    }
};



const deleteSaleOccasion = async (id) => {
    try {
        const response = await privateAPI.delete(`/api/sales/${id}`);
        return response.data;
    } catch (error) {
        console.log("Error deleteSaleOccasion:", error);
        throw error;
    }
};

export {
    getAllSaleProducts,
    getSaleCategories,
    getSaleProducts,
    getAllSaleOccasions,
    createSaleOccasion,
    updateSaleOccasion,
    deleteSaleOccasion,
};
