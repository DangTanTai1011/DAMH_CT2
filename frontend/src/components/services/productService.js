import axios from "axios";

const API_URL = "http://localhost:5000/api/products";
const REVIEW_API_URL = "http://localhost:5000/api/reviews";

export const getProducts = async (filters) => {
    try {
        const res = await axios.get(API_URL, { params: filters }); 
        return res.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    } catch (error) {
        console.error(`Lỗi khi lấy sản phẩm ID ${id}:`, error.response?.data || error.message);
        return null;
    }
};

export const createProduct = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("⚠ Không tìm thấy token trong localStorage!");

    try {
        const res = await axios.post(API_URL, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("API Response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error.response?.data || error.message);
        throw error;
    }
};

export const updateProduct = async (id, formData) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("⚠ Không tìm thấy token trong localStorage!");

    return await axios.put(`${API_URL}/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
};

export const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("⚠ Không tìm thấy token trong localStorage!");

    return await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const reviewProduct = async (productId, reviewData) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("⚠ Không tìm thấy token!");

    try {
        const res = await axios.post(`${REVIEW_API_URL}/${productId}`, reviewData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi khi gửi đánh giá:", error.response?.data || error.message);
        throw error;
    }
};

export const getProductsByBrand = async (brandId) => {
    try {
        const res = await axios.get(`${API_URL}/by-brand/${brandId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching products by brand:", error);
        throw error;
    }
};

export const getBrands = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/brands");
        return res.data;
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
};

export const getCategories = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/categories");
        return res.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
